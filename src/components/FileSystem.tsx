import { createFOlderInFirebaseStorage, deleteFromFirebase, getFileListForUser } from '@/firebase/uploadsSevice';
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
      console.log(result);
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

    // const targetFolder = findFolderById(hearchiqueSysFile, parentId);

    // const folderName = prompt("Nom du nouveau dossier") || "Nouveau dossier";
    // const newFolder: Folder = {
    //   id: uuidv4(),
    //   name: folderName,
    //   parentId,
    //   children: [],
    // };
  
    // if (user?.uid) {
    //   try {
    //     const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
    //     await createFOlderInFirebaseStorage(user.uid, folderPath); // Créez le dossier dans Firebase Storage
  
    //     setFolders((prev) => {
    //       if (!prev) return newFolder; // Si `prev` est null, retournez le nouveau dossier
    //       return addFolder(prev, parentId, newFolder); // Utilisez `addFolder` pour ajouter le nouveau dossier
    //     });
    //   } catch (error) {
    //     console.error("Erreur lors de la création du dossier:", error);
    //   }
    // }
  };

  const deleteFolderById = async (folderId: string) => {
    // if (user?.uid) {
    //   try {
    //     const folderPath = ""; // Définissez le chemin complet du dossier à supprimer
    //     await deleteFromFirebase(folderPath); // Suppression dans Firebase Storage
  
    //     setFolders((prev) => {
    //       if (!prev) return null; // Si `prev` est null, retournez `null`
    //       return deleteFolder(prev, folderId); // Utilisez `deleteFolder` pour supprimer le dossier
    //     });
    //   } catch (error) {
    //     console.error("Erreur lors de la suppression du dossier:", error);
    //   }
    // }
  };
  const renderFolders = (folders: Folder, depth: number = 0, parentPath = "") => {
    return (
      <ul>
        {folders.children.map((item,index) => {
          // Détermine le type de l'élément
          const isFolder = (item as Folder).children !== undefined;
  
          const newParentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
  
          return (
            <li key={(item as Folder).id} style={{ marginLeft: `${depth}px` }}>
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
                  <CardFile key={index} data={item as customFile}/>
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
          onClick={() => addFolderToFolder(null, "")} // Créer un dossier à la racine
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