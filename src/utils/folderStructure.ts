import { customFile } from "@/store/uploadsContext";
import { StorageReference, getDownloadURL, getMetadata } from "firebase/storage";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  fullPath ?: string;
  children: (Folder | customFile)[];
}


interface HierarchyResponse {
  folderHierarchy: Folder[];
  totalSizeInMB: number;
}
  
export const initialFolderStructure: Folder[] = [];

// Functions for folder operations
export const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
  if (parentId === null) {
    return [...folders, newFolder]; // Ajout à la racine
  }
  return folders.map((folder) => {
    let newChildren = folder.children.slice() as Folder[];
    
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
    folder.children = deleteFolder([...folder.children as Folder[]], folderId); // Supprimer de façon récursive
    return true; // Conserver les autres dossiers
  });
};






const buildFolderHierarchy = async (folders: StorageReference[],files: StorageReference[]): Promise<Folder[]> => {
  const folderMap: Record<string, Folder> = {};

  // Construire la structure hiérarchique des dossiers
  folders.forEach((folderRef) => {
    const parts = folderRef.fullPath.split('/');
    let currentFolder: Folder = folderMap[parts[0]] || {
      id: parts[0],
      name: parts[0],
      parentId: null,
      children: [],
    };

    folderMap[parts[0]] = currentFolder;

    let currentPath = parts[0];

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      currentPath += '/' + part;

      const existingFolder = currentFolder.children.find(
        (child) => 'children' in child && child.name === part
      ) as Folder | undefined;

      if (!existingFolder) {
        const parentId = i > 0 ? parts.slice(0, i).join('/') : null;

        const newFolder: Folder = {
          id: currentPath,
          name: part,
          parentId,
          children: [],
        };

        currentFolder.children.push(newFolder);
        currentFolder = newFolder;
      } else {
        currentFolder = existingFolder;
      }
    }
  });

  // Ajouter les fichiers à la hiérarchie des dossiers appropriés
  for (const fileRef of files) {
    const parts = fileRef.fullPath.split('/');
    const fileName = parts.pop()!;
    const parentFolderPath = parts.join('/');

    const url = await getDownloadURL(fileRef);
    const metadata = await getMetadata(fileRef);

    const customFile: customFile = {
      name: fileName,
      url,
      ref: fileRef,
      size: metadata.size,
      isFile: true,
    };

    let currentFolder = folderMap[parts[0]];

    for (const part of parts.slice(1)) {
      currentFolder = currentFolder.children.find(
        (child) => 'children' in child && child.name === part
      ) as Folder;
    }

    currentFolder.children.push(customFile);
  }

  return Object.values(folderMap);
};