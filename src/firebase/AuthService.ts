import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './firebase';



//Sign in functionality
export const SignIn = async (email:string, password:string) => {
 const result = await signInWithEmailAndPassword(auth, email, password);
 return result;
};

//Sign up functionality
export const SignUp = async (email:string, password:string) => {
 const  result = await createUserWithEmailAndPassword(auth, email, password);
 return result;
};

//Sign out functionality
export const  SignOut  =  async () => {
 await  signOut(auth);
};