import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from "@/firebase/firebase";
import { createContext } from 'react';

import { User, onAuthStateChanged } from 'firebase/auth'; //type User import
import { SignUp,SignOut,SignIn } from '@/firebase/AuthService';
import Image from 'next/image';
import Spiner from '@/components/spinner';

//IAuth context
export  interface  IAuth {
    user:  User  |  null;  //type User comes from firebase
    loading:  boolean;
    signIn: (email:string, password:string,onSuccess: () =>  void) =>  void;
    signUp: (email:string, password:string) =>  void;
    signOut: () =>  void;
    isSignUp:  boolean;
}

export const AuthContext = createContext<IAuth>({
    user: auth.currentUser,
    loading: false,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {},
    isSignUp:false
});

export  const  useAuth  = () =>  useContext(AuthContext);


function AuthProvider({ children }:  {children: React.ReactNode}) {
    const router = useRouter()
    const [currentUser,  setCurrentUser] =  useState<User  |  null>(null);
    const [isLoading,  setIsLoading] =  useState<boolean>(false);
    const [isAuthLoading,  setIsAuthLoading] =  useState<boolean>(true);
    const [isSignUp,  setIsSignUp] =  useState<boolean>(false);

    const signUp = (email:string, password:string) => {
        setIsLoading(true);
        SignUp(email,password).then(userCredential=>{
            const { user } = userCredential;
            if (user) {
                setIsLoading(false)
                setIsSignUp(true);
            }else{
                setIsLoading(false);
            }
        }).catch(error=>{
            //check for error
            if (error.code  ===  'auth/email-already-in-use') {
             //show an alert or console
            } else if (error.code  ===  'auth/too-many-requests') {
             //do something like an alert
            }
            // you can check for more error like email not valid or something
            setIsLoading(false);
           })
    }
    const signIn = async (email:string, password:string,  onSuccess: () =>  void) => {
        setIsLoading(true);
        SignIn(email,password).then(userCredential  =>{
            const { user } =  userCredential;
            if(user){
                setCurrentUser(user);
                router.push("/uploads")
            }else{
                setIsLoading(false);
            }
        }).catch(error  => {
            if  (error.code  ===  'auth/wrong-password') {
             //show error
            } else  if  (error.code  ===  'auth/too-many-requests') {
             //show error
            }
            setIsLoading(false);
        });
    }
    const signOut = async () => {
        setIsLoading(true);
        try {
            await SignOut();
            setCurrentUser(null);
            router.push('/signup')
        } catch  (error) {
            setIsLoading(false);
        }
    }

    const authValues: IAuth = {
        user: currentUser,
        loading: isLoading,
        signIn,
        signUp,
        signOut,
        isSignUp:isSignUp
    }

    useEffect(() => {
        //onAuthStateChanged check if the user is still logged in or not
        const  unsubscribe  =  onAuthStateChanged(auth,  user  => {
         setIsAuthLoading(false);
        });
        return  unsubscribe;
    },  []);

  return (
    <AuthContext.Provider  value={authValues}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider