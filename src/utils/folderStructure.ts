export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    children: Folder[];
  }
  
export const initialFolderStructure: Folder[] = [];

// Functions for folder operations
export const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
  if (parentId === null) {
    return [...folders, newFolder]; // Ajout à la racine
  }
  let i=0;
  let b=0
  return folders.map((folder) => {
    let newChildren = folder.children.slice();
    
    if (folder.id === parentId) {
      b=b+1
      console.log("b="+b);
      newChildren.push(newFolder); // Ajout au bon endroit
    } else {
      i=i+1
      newChildren = addFolder(newChildren, parentId, newFolder);
      console.log(newChildren,"i="+i); // Appel récursif
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
