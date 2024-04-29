import { createFOlderInFirebaseStorage } from '@/firebase/uploadsSevice';
import { useAuth } from '@/store/auth-context';
import { useQuota } from '@/store/uploadsContext';
import { Folder, addFolder, deleteFolder } from '@/utils/folderStructure';
import Image from 'next/image';
import { useState } from 'react';
import { FaFolder, FaPlus, FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

interface FileSystemProps {
  initialFolders: Folder[];
}

const FileSystem: React.FC<FileSystemProps> = ({ initialFolders }) => {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const { user } = useAuth();
  const {pathFolder,setPathFolder} = useQuota();

  const addFolderToFolder = async (parentId: string | null, parentPath: string) => {
    const folderName = prompt("Nom du nouveau dossier") || 'Nouveau dossier';
    const newFolder: Folder = {
      id: uuidv4(),
      name: folderName,
      parentId,
      children: [],
    };

    if (user?.uid) {
      try {
        const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
        await createFOlderInFirebaseStorage(user.uid, folderPath); // Créez le dossier dans Firebase Storage
        console.log('Folder created successfully in Firebase Storage.');

        setFolders((prev) => addFolder([...prev], parentId, newFolder)); // Ajoutez le nouveau dossier au state local
      } catch (error) {
        console.error('Erreur lors de la création du dossier:', error);
      }
    }
  };

  const deleteFolderById = (folderId: string) => {
    setFolders((prev) => deleteFolder([...prev], folderId)); // Supprimer le dossier du state local
  };

  const renderFolders = (folders: Folder[], depth: number = 0, parentPath = "") => {
    return (
      <ul>
        {folders.map((folder) => {
          const newParentPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;

          return (
            <li key={folder.id} style={{ marginLeft: `${depth}px` }}>
              <div className='flex px-2 flex-row gap-x-2 justify-between items-center'>
                <div onClick={()=>setPathFolder(newParentPath)} className='flex gap-x-2 justify-center items-center'>
                  <Image className='' alt='fld' width={15} height={15} src={"/folder.png"} /> 
                  {folder.name}
                </div>
                <div className='flex gap-x-2 justify-center items-center'>
                  <button onClick={() => addFolderToFolder(folder.id, newParentPath)}>
                    <FaPlus />
                  </button>
                  <button onClick={() => deleteFolderById(folder.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              {folder.children.length > 0 && renderFolders(folder.children, depth + 10, newParentPath)}
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
      {renderFolders(folders)}
    </div>
  );
};

export default FileSystem;