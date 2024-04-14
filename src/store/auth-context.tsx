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
}

export const AuthContext = createContext<IAuth>({
    user: auth.currentUser,
    loading: false,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {},
});

export  const  useAuth  = () =>  useContext(AuthContext);


function AuthProvider({ children }:  {children: React.ReactNode}) {
    const router = useRouter()
    const [currentUser,  setCurrentUser] =  useState<User  |  null>(null);
    const [isLoading,  setIsLoading] =  useState<boolean>(false);
    const [isAuthLoading,  setIsAuthLoading] =  useState<boolean>(true);

    const signUp = (email:string, password:string) => {
        setIsLoading(true);
        SignUp(email,password).then(userCredential=>{
            const { user } = userCredential;
            if (user) {
                setCurrentUser(user);
                router.push('/')
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
        //implement sign in here - which is implemented below
    }
    const signOut = async () => {
        //implement sign out here - which is implemented below
    }

    const authValues: IAuth = {
        user: currentUser,
        loading: isLoading,
        signIn,
        signUp,
        signOut,
    }

    useEffect(() => {
        //onAuthStateChanged check if the user is still logged in or not
        const  unsubscribe  =  onAuthStateChanged(auth,  user  => {
         setCurrentUser(user);
         setIsAuthLoading(false);
        });
        return  unsubscribe;
    },  []);

  return (
    <AuthContext.Provider  value={authValues}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider