import { deleteObject, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

import app from "./firebase";
import { traverseStorage } from "@/utils/folderStructure";

export const uploadFileToUserFolder = async (userId: string, file: File,pathFolder:string) => {
    // Obtenez une référence au dossier de l'utilisateur dans Firebase Storage
    const storage = getStorage(app);
    const userFolderRef = ref(storage, `users/${userId}/${pathFolder}`);

    // Obtenez une référence au fichier que vous souhaitez télécharger
    const fileRef = ref(userFolderRef, file.name);

    try {
        await uploadBytes(fileRef, file);
        const metadata = await getMetadata(fileRef);
        const url = await getDownloadURL(fileRef);
        console.log('Fichier téléchargé avec succès dans le dossier de l\'utilisateur.');
        return {
            name: fileRef.name,
            url,
            ref: fileRef,
            size: metadata.size,
        };
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier dans le dossier de l\'utilisateur:', error);
    }
};

export const getFileListForUser = async (userId:string) =>{
    try {
        const storage = getStorage(); // Obtenir l'instance Firebase Storage
        const userFolderRef = ref(storage, `users/${userId}/`); // Dossier de l'utilisateur

        const result=await traverseStorage(userFolderRef)

        return result;


      } catch (error) {
        console.error('Erreur lors de la récupération des fichiers:', error);
        throw error; // Relancer l'erreur pour que l'appelant puisse la traiter
      }
}


export async function uploadImageToFirebaseStorage(file:File,userId:string){
    try {
        const storage=getStorage(app);
        const storageRef=ref(storage,`users/${userId}/picture_profile`);
        const uploadImageTask=uploadBytesResumable(storageRef,file);

        uploadImageTask.on('state_changed',(snapshot)=>{
            const progress=(snapshot.bytesTransferred/snapshot.totalBytes)
            console.log('Upload is ' + progress + '% done');;
        },(error) => {
            // Gestion des erreurs pendant le téléchargement
            console.error('Error uploading file:', error);
            throw error; // Renvoie l'erreur pour que le gestionnaire de l'erreur puisse la gérer
        },() => {
            // Le téléchargement est terminé avec succès
            console.log('Upload successful');
        })
        await uploadImageTask;
        const downloadURL = await getDownloadURL(ref(storage, `users/${userId}/picture_profile`));
        return downloadURL;

    } catch (error) {
        console.error('Error uploading image to Firebase Storage:', error);
        throw error; 
    }
}

export function deleteFromFirebase(filePath:string){
    const storage=getStorage(app);

    const fileRef=ref(storage,filePath);
    return deleteObject(fileRef).then(()=>{
        console.log("Fichier supprimé avec succès");
        return fileRef
    }).catch((error)=>{
        console.error("Erreur lors de la suppression du fichier :", error);
        throw error;
    })
}

export async function deleteFolderFromFirebase(folderPath: string) {
    const storage = getStorage();
    const folderRef = ref(storage, folderPath);

    try {
        const result = await listAll(folderRef);

        const deletePromises: Promise<void>[] = result.items.map(async (item) => {
            const metadata = await getMetadata(item);

            if (metadata.contentType === "application/x-directory") {
                return deleteFolderFromFirebase(item.fullPath);
            } else {
                return deleteObject(item);
            }
        });

        await Promise.all(deletePromises);

        await deleteObject(folderRef);

        console.log("Dossier supprimé avec succès :", folderPath);
    } catch (error) {
        console.error("Erreur lors de la suppression du dossier :", error);
        throw error; // Relancer l'erreur pour un traitement ultérieur
    }
}

export const createFOlderInFirebaseStorage=async (folderPath:string)=>{
    try {
        const storage=getStorage(app);
        const folderRef=ref(storage, `${folderPath}/.folderIndicator`);
        const emptyFile=new Blob(['']);
        await uploadBytes(folderRef,emptyFile);
        console.log("folder crée avec succes");
    } catch (error) {
        console.error('erruer lors de la création de folder dans firebase storage');
        throw error;
    }
}

export const generateShareLink = async (filePath:string) => {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, filePath);
      const downloadURL = await getDownloadURL(fileRef);
  
      return downloadURL; // URL de partage du fichier
    } catch (error) {
      console.error('Erreur lors de la génération du lien de partage :', error);
      throw error;
    }
};
