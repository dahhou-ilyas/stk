import { createFOlderInFirebaseStorage, deleteFolderFromFirebase, deleteFromFirebase, getFileListForUser } from '@/firebase/uploadsSevice';
import { useAuth } from '@/store/auth-context';
import { customFile, useQuota } from '@/store/uploadsContext';
import { Folder, addFolder, deleteFolder, findFolderById } from '@/utils/folderStructure';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaFileAlt, FaFolder, FaPlus, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import CardFile from './CardFile';

interface FileSystemProps {
  initialFolders: Folder[];
}

const FileSystem: React.FC<FileSystemProps> = ({ initialFolders }) => {
  
  const { user } = useAuth();
  const {pathFolder,setPathFolder,hearchiqueSysFile,setHearchiqueSysFile} = useQuota();

  useEffect(()=>{
    const setHearchique= async()=>{
      const result=await getFileListForUser(user?.uid as string)
      setHearchiqueSysFile(result)
    }
    if(user){
      setHearchique()
    }
  },[user])

  const addFolderToFolder = async (
    parentId: string | null,
    parentPath: string
  ) => {


    if (!hearchiqueSysFile) {
      console.error("Le système de fichiers hiérarchique n'est pas défini.");
      return;
    }

    const targetFolder = findFolderById(hearchiqueSysFile, parentId as string);
    
    
    if (targetFolder) {
      console.log(targetFolder);
      const folderName = prompt("Nom du nouveau dossier") || "Nouveau dossier";
      const newFolder: Folder = {
        id: uuidv4(),
        name: folderName,
        parentId,
        children: [],
      };
      await createFOlderInFirebaseStorage(parentId+'/'+folderName);
      targetFolder.children.push(newFolder);
      console.log(targetFolder);
      setHearchiqueSysFile({ ...hearchiqueSysFile });
    }else {
      console.error(`Le dossier avec ID ${targetFolder} n'a pas été trouvé.`);
    }
    
  };

  const deleteFolderById = async (folderId: string) => {
    if (user?.uid && hearchiqueSysFile) {
      const segments = folderId.split('/');
      segments.pop();
      const targetFolder = findFolderById(hearchiqueSysFile, segments.join('/'));
      if (targetFolder) {
        deleteFolderFromFirebase(folderId).then((res)=>{
          const newChildren = targetFolder.children.filter(item => (item as Folder).id !== folderId);
          targetFolder.children = newChildren;
          setHearchiqueSysFile({...hearchiqueSysFile})
        }).catch((e)=>{
          console.log("erreur lors de la suppression de folder");
        })
      }
    }
  };
  const renderFolders = (folders: Folder, depth: number = 0, parentPath = "") => {
    return (
      <ul>
        {folders.children.map((item,index) => {
          // Détermine le type de l'élément
          const isFolder = (item as Folder).children !== undefined;
  
          const newParentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
  
          return (
            <li key={((item as Folder).id || "ee")+index} style={{ marginLeft: `${depth}px` }}>
              <div className='flex px-2 flex-row gap-x-2 justify-between items-center'>
                {isFolder ? (
                  <>
                    <div onClick={() => setPathFolder(newParentPath)} className='cursor-pointer flex gap-x-2 justify-center items-center'>
                      <Image alt='folder' width={15} height={15} src={"/folder.png"} />
                      {item.name}
                    </div>
                    <div className='flex gap-x-2 justify-center items-center'>
                      <button onClick={() => addFolderToFolder((item as Folder).id, newParentPath)}>
                        <FaPlus />
                      </button>
                      <button onClick={() => deleteFolderById((item as Folder).id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </>
                ) : (
                  <CardFile key={item.name+index} data={item as customFile}/>
                )}
              </div>
  
              {/* Si c'est un dossier, récursion pour ses enfants */}
              {isFolder && renderFolders(item as Folder, depth + 10, newParentPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div>
      <div className='flex flex-row justify-between items-center px-2'>
        <button 
          className='flex justify-end items-end gap-x-2 my-2' 
          onClick={() => addFolderToFolder(`users/${user?.uid}`, "")} // Créer un dossier à la racine
        >
          <Image src={"/addFolder.png"} width={25} height={25} alt='addF'/>
        </button>
        <div onClick={e=>setPathFolder('')} className='font-extrabold cursor-pointer'>
          <p>/Root</p>
        </div>
      </div>
      {
        (hearchiqueSysFile) && 
        renderFolders(hearchiqueSysFile as Folder)
      }
    </div>
  );
};

export default FileSystem;