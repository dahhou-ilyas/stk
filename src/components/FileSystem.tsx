import { Folder } from '@/utils/folderStructure';
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
            <div className='flex flex-row gap-x-2'>
              <FaFolder /> {folder.name}
              <button onClick={() => addFolderToFolder(folder.id)}>
                <FaPlus />
              </button>
              <button onClick={() => deleteFolderById(folder.id)}>
                <FaTrash />
              </button>
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
        className='flex justify-center items-center gap-x-2 my-2' 
        onClick={() => addFolderToFolder(null)}
      >
        <FaPlus className='ml-2' />
        <p>Créer un dossier</p>
      </button>
      {renderFolders(folders)}
    </div>
  );
};

export default FileSystem;

// Functions for folder operations
const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
  if (parentId === null) {
    return [...folders, newFolder]; // Ajout à la racine
  }

  return folders.map((folder) => {
    let newChildren = folder.children.slice(); // Copie du tableau des enfants
    if (folder.id === parentId) {
      newChildren.push(newFolder); // Ajout au bon endroit
    } else {
      newChildren = addFolder(newChildren, parentId, newFolder); // Appel récursif
    }
    return { ...folder, children: newChildren }; // Retourner un nouveau dossier
  });
};

const deleteFolder = (folders: Folder[], folderId: string): Folder[] => {
  return folders.filter((folder) => {
    if (folder.id === folderId) {
      return false; // Supprimer ce dossier
    }
    folder.children = deleteFolder([...folder.children], folderId); // Supprimer de façon récursive
    return true; // Conserver les autres dossiers
  });
};
