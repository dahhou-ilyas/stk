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

// export const addFolder = (folders: Folder[], parentId: string | null, newFolder: Folder): Folder[] => {
//   if (parentId === null) {
//     return [...folders, newFolder]; // Ajout à la racine
//   }

//   return folders.map((folder) => {
//     if (folder.id === parentId) {
//       folder.children.push(newFolder); // Ajout au dossier correspondant
//     } else {
//       folder.children = addFolder(folder.children, parentId, newFolder); // Appel récursif pour ajouter aux enfants
//     }
//     return folder;
//   });
// };

// export const deleteFolder = (folders: Folder[], folderId: string): Folder[] => {
//   return folders.filter((folder) => {
//     if (folder.id === folderId) {
//       return false; // supprimer ce dossier
//     }
//     folder.children = deleteFolder(folder.children, folderId); // suppression récursive
//     return true; // conserver les autres dossiers
//   });
// };
  