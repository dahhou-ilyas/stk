import { deleteObject, getDownloadURL, getMetadata, getStorage, listAll, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

import app,{Firestore} from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const uploadFileToUserFolder = async (userId: string, file: File) => {
    // Obtenez une référence au dossier de l'utilisateur dans Firebase Storage
    const storage = getStorage(app);
    const userFolderRef = ref(storage, `users/${userId}`);

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
    
        // Liste tous les fichiers dans le dossier
        const listResult = await listAll(userFolderRef);
    
        const filePromises = listResult.items.map((itemRef) =>
            getMetadata(itemRef).then((metadata) =>
              getDownloadURL(itemRef).then((url) => ({
                name: itemRef.name,
                url,
                ref: itemRef,
                size: metadata.size, // Taille du fichier en bytes
              }))
            )
        );
    
        const fileList = await Promise.all(filePromises);
        
        // Calculer la taille totale en bytes
        const totalSizeInBytes = fileList.reduce((total, file) => total + file.size, 0);

        // Convertir la taille totale en mégaoctets
        const totalSizeInMB = totalSizeInBytes / (1024 * 1024);

        return {
            fileList,
            totalSizeInMB, // Retourne également la taille totale en mégaoctets
        };


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
        return true
    }).catch((error)=>{
        console.error("Erreur lors de la suppression du fichier :", error);
        throw error;
    })
}