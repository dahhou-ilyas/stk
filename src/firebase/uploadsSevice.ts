import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

import app,{Firestore} from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const uploadFileToUserFolder = async (userId: string, file: File) => {
    // Obtenez une référence au dossier de l'utilisateur dans Firebase Storage
    const storage = getStorage(app);
    const userFolderRef = ref(storage, `users/${userId}`);

    // Obtenez une référence au fichier que vous souhaitez télécharger
    const fileRef = ref(userFolderRef, file.name);

    try {
        const fileData=await file.arrayBuffer();
        await uploadBytes(fileRef, file);
        console.log('Fichier téléchargé avec succès dans le dossier de l\'utilisateur.');
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier dans le dossier de l\'utilisateur:', error);
    }
};

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