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

  const addFolderToFolder = (parentId: string | null) => {
    const folderName = prompt("Nom du nouveau dossier") || 'Nouveau dossier';
    const newFolder: Folder = {
      id: uuidv4(),
      name: folderName,
      parentId,
      children: [],
    };

    setFolders((prev) => {
      return addFolder([...prev], parentId, newFolder); // Passer une copie du tableau
    });
  };

  const deleteFolderById = (folderId: string) => {
    setFolders((prev) => {
      return deleteFolder([...prev], folderId); // Passer une copie du tableau
    });
  };

  const renderFolders = (folders: Folder[], depth: number = 0) => {
    return (
      <ul>
        {folders.map((folder) => (
          <li key={folder.id} style={{ marginLeft: `${depth * 20}px` }}>
            <div className='flex flex-row gap-x-2 justify-between'>
                <div className='flex gap-x-2 justify-center items-center'>
                    <FaFolder /> {folder.name}
                </div>
                <div className='flex gap-x-2 justify-center items-center'>
                  <button onClick={() => addFolderToFolder(folder.id)}>
                    <FaPlus />
                  </button>
                  <button onClick={() => deleteFolderById(folder.id)}>
                    <FaTrash />
                  </button>
                </div>
            </div>
            {folder.children.length > 0 && renderFolders(folder.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <button 
        className='flex justify-end items-end gap-x-2 my-2' 
        onClick={() => addFolderToFolder(null)}
      >
        <Image src={"/addFolder.png"} width={25} height={25} alt='addF'/>
      </button>
      {renderFolders(folders)}
    </div>
  );
};

export default FileSystem;

