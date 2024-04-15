import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from "@/firebase/firebase";
import { createContext } from 'react';

import { User, onAuthStateChanged } from 'firebase/auth'; //type User import
import { SignUp,SignOut,SignIn } from '@/firebase/AuthService';
import { toast } from 'react-hot-toast';

//IAuth context
export  interface  IAuth {
    user:  User  |  null;  //type User comes from firebase
    loading:  boolean;
    signIn: (email:string, password:string,onSuccess: () =>  void) =>  void;
    signUp: (email:string, password:string,username:string) =>  void;
    signOut: () =>  void;
}

export const AuthContext = createContext<IAuth>({
    user: auth.currentUser,
    loading: false,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {}
});

export  const  useAuth  = () =>  useContext(AuthContext);


function AuthProvider({ children }:  {children: React.ReactNode}) {
    const router = useRouter()
    const [currentUser,  setCurrentUser] =  useState<User  |  null>(null);
    const [isLoading,  setIsLoading] =  useState<boolean>(false);
    const [isAuthLoading,  setIsAuthLoading] =  useState<boolean>(true);

    const signUp = (email:string, password:string,username: string) => {
        setIsLoading(true);
        SignUp(email,password,username).then(userCredential=>{
            const { user } = userCredential;
            if (user) {
                toast.success('your signup is successfully done');
                setIsLoading(false)
            }else{
                setIsLoading(false);
            }
        }).catch(error=>{
            //check for error
            if (error.code  ===  'auth/email-already-in-use') {
                toast.error('email already in use');
            } else if (error.code  ===  'auth/too-many-requests') {
                toast.error('too many requests');
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
             toast.error("wrong password")
            } else  if  (error.code  ===  'auth/too-many-requests') {
                toast.error("too many requests")
            }
            setIsLoading(false);
        });
    }
    const signOut = async () => {
        setIsLoading(true);
        try {
            await SignOut();
            setCurrentUser(null);
            setIsLoading(false);
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
        signOut
    }

    useEffect(() => {
        //onAuthStateChanged check if the user is still logged in or not
        const  unsubscribe  =  onAuthStateChanged(auth,  user  => {
            setCurrentUser(user)
            setIsAuthLoading(false);
        });
        return  unsubscribe;
    },  []);

  return (
    <AuthContext.Provider  value={authValues}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider