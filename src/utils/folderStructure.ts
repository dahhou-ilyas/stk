export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    children: Folder[];
  }
  
export const initialFolderStructure: Folder[] = [
  {
    id: 'root',
    name: 'Racine',
    parentId: null,
    children: [
    ],
  },
];

// Functions for folder operations
export const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
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

export const deleteFolder = (folders: Folder[], folderId: string): Folder[] => {
  return folders.filter((folder) => {
    if (folder.id === folderId) {
      return false; // Supprimer ce dossier
    }
    folder.children = deleteFolder([...folder.children], folderId); // Supprimer de façon récursive
    return true; // Conserver les autres dossiers
  });
};
