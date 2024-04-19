import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, User, updateProfile } from 'firebase/auth';
import { auth } from './firebase';
import { getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';
import app from './firebase';

setPersistence(auth, browserLocalPersistence);
//Sign in functionality
export const SignIn = async (email:string, password:string) => {
 const result = await signInWithEmailAndPassword(auth, email, password);
 return result;
};

//Sign up functionality
export const SignUp = async (email:string, password:string,username: string) => {
    const  result = await createUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
        await updateUsername(result.user, username);
        const storage = getStorage(app);
        const userFolderRef = ref(storage, `users/${result.user.uid}`);
    }
    return result;
};

//Sign out functionality
export const  SignOut  =  async () => {
 await  signOut(auth);
};



const updateUsername = async (user: User, username: string) => {
    try {
        await updateProfile(user, {
            displayName: username
        });
    } catch (error) {
        console.error('Error updating username:', error);
    }
};


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