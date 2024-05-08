import { customFile } from "@/store/uploadsContext";
import { FullMetadata, StorageReference, getDownloadURL, getMetadata, listAll } from "firebase/storage";

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
// export const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
//   if (parentId === null) {
//     return [...folders, newFolder]; // Ajout à la racine
//   }
//   return folders.map((folder) => {
//     let newChildren = folder.children.slice() as Folder[];
    
//     if (folder.id === parentId) {
//       newChildren.push(newFolder); // Ajout au bon endroit
//     } else {
//       newChildren = addFolder(newChildren, parentId, newFolder); // Appel récursif
//     } 
//     return { ...folder, children: newChildren }; // Retourner un nouveau dossier
//   });
// };

// export const deleteFolder = (folders: Folder[], folderId: string): Folder[] => {
//   return folders.filter((folder) => {
//     if (folder.id === folderId) {
//       return false; // Supprimer ce dossier
//     }
//     folder.children = deleteFolder([...folder.children as Folder[]], folderId); // Supprimer de façon récursive
//     return true; // Conserver les autres dossiers
//   });
// };

export const addFolder = (
  tree: Folder,
  parentId: string | null,
  newFolder: Folder
): Folder => {
  if (parentId === null) {
    // Ajoutez le nouveau dossier à la racine si le parentId est nul
    return {
      ...tree,
      children: [...tree.children, newFolder],
    };
  }

  const addRecursively = (folder: Folder): Folder => {
    if (folder.id === parentId) {
      return {
        ...folder,
        children: [...folder.children, newFolder], // Ajoutez le dossier au parent approprié
      };
    } else {
      return {
        ...folder,
        children: folder.children.map((child) => {
          if ('children' in child) {
            return addRecursively(child as Folder); // Appel récursif pour parcourir la structure
          }
          return child; // C'est un fichier, donc retournez-le
        }),
      };
    }
  };

  return addRecursively(tree); // Lancez la modification récursive de l'arborescence
};

export const deleteFolder = (
  tree: Folder,
  folderId: string
): Folder => {
  const deleteRecursively = (folder: Folder): Folder => {
    const newChildren = folder.children.filter((child) => {
      if ('children' in child) {
        return (child as Folder).id !== folderId; // Filtre les dossiers à supprimer
      }
      return true; // Garder les fichiers
    });

    return {
      ...folder,
      children: newChildren.map((child) => {
        if ('children' in child) {
          return deleteRecursively(child as Folder); // Appel récursif pour supprimer dans les sous-dossiers
        }
        return child; // C'est un fichier, donc retournez-le
      }),
    };
  };

  return deleteRecursively(tree); // Lancez la modification récursive de l'arborescence
};



export interface FolderTraversalResult extends Folder {
  totalSizeInMB?: number;
}

export const traverseStorage = async (
  folderRef: StorageReference, // Définition du type de référence
  parentId: string | null = null // Paramètre parentId avec valeur par défaut
): Promise<FolderTraversalResult> => { // Le type de retour est une promesse de FolderTraversalResult
  const listResult = await listAll(folderRef);

  // Collecte des fichiers avec des promesses pour obtenir les détails
  const filesPromises = listResult.items.map(async (fileRef) => {
    const url = await getDownloadURL(fileRef); // URL du fichier
    const metadata: FullMetadata = await getMetadata(fileRef); // Métadonnées pour des informations supplémentaires

    return {
      name: fileRef.name,
      url,
      ref:fileRef,
      size: metadata.size || 0,
      isFile: true, // Indique qu'il s'agit d'un fichier
    } as customFile; // Typage explicite
  });

  const files = await Promise.all(filesPromises);

  // Somme des tailles des fichiers en octets
  const totalSizeInBytes = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeInMB = totalSizeInBytes / (1024 * 1024); // Conversion en mégaoctets

  // Collecte des dossiers
  const foldersPromises = listResult.prefixes.map(async (subFolderRef) => {
    const folderContent = await traverseStorage(subFolderRef, folderRef.fullPath); // Appel récursif

    return {
      id: subFolderRef.fullPath,
      name: subFolderRef.name,
      parentId,
      fullPath: subFolderRef.fullPath,
      children: folderContent.children, // Structure hiérarchique
      totalSizeInMB: folderContent.totalSizeInMB, // Taille totale dans le dossier
    } as Folder;
  });

  const folders:FolderTraversalResult[] = await Promise.all(foldersPromises);

  // Calculez la taille totale pour ce dossier
  const combinedTotalSizeInMB = totalSizeInMB + folders.reduce((sum, folder) => sum + (folder.totalSizeInMB || 0), 0);

  // Retourne une structure hiérarchique de dossiers et fichiers avec la taille totale
  return {
    id: folderRef.fullPath,
    name: folderRef.name || folderRef.fullPath.split("/").pop(),
    parentId,
    fullPath: folderRef.fullPath,
    children: [...folders, ...files], // Combine les dossiers et les fichiers
    totalSizeInMB: combinedTotalSizeInMB, // Taille totale des fichiers
  } as FolderTraversalResult; // Typage explicite
};