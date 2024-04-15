import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, User, updateProfile } from 'firebase/auth';
import { auth } from './firebase';


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
        console.log('Username updated successfully');
    } catch (error) {
        console.error('Error updating username:', error);
    }
};