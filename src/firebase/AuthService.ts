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
        const placeholderRef = ref(userFolderRef, 'placeholder.txt');
        await uploadString(placeholderRef, '');

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

export const updateImageUrl=async (user:User,urlImage:string)=>{
    if (!user) {
        throw new Error("Utilisateur non trouvé.");
    }
    try {
      await updateProfile(user, {
        photoURL: urlImage,
      });
      console.log("Image de profil mise à jour avec succès.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'image de profil :", error);
      throw error;
    }
}


