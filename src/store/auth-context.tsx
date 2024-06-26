import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from "@/firebase/firebase";
import { createContext } from 'react';

import { User, onAuthStateChanged } from 'firebase/auth'; //type User import
import { SignUp,SignOut,SignIn,SignInWithGoogle, SignInWithFacbook } from '@/firebase/AuthService';
import { toast } from 'react-hot-toast';

//IAuth context
export  interface  IAuth {
    user:  User  |  null;  //type User comes from firebase
    loading:  boolean;
    signIn: (email:string, password:string,onSuccess: () =>  void) =>  void;
    signUp: (email:string, password:string,username:string) =>  void;
    signOut: () =>  void;
    signInWithGoogle:()=>void;
    signWithFacbook:()=>void;
    isLogin:boolean,
    setIsLogin:Dispatch<SetStateAction<boolean>>;
    
}

export const AuthContext = createContext<IAuth>({
    user: auth.currentUser,
    loading: false,
    isLogin:true,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {},
    setIsLogin:()=>{},
    signInWithGoogle:()=>{},
    signWithFacbook:()=>{}
});

export  const  useAuth  = () =>  useContext(AuthContext);


function AuthProvider({ children }:  {children: React.ReactNode}) {
    const router = useRouter()
    const [currentUser,  setCurrentUser] =  useState<User  |  null>(null);
    const [isLoading,  setIsLoading] =  useState<boolean>(false);
    const [isAuthLoading,  setIsAuthLoading] =  useState<boolean>(true);

    const [isLogin,setIsLogin]=useState(true);

    const signUp = (email:string, password:string,username: string) => {
        setIsLoading(true);
        console.log("jsaisjssssaij");
        SignUp(email,password,username).then(userCredential=>{
            const { user } = userCredential;
            if (user) {
                toast.success('your signup is successfully done');
                setIsLoading(false)
                router.push('/')
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
    const signInWithGoogle = async () =>{
        setIsLoading(true)
        try {
            await SignInWithGoogle();
            setIsLoading(false);
            router.push("/uploads")
            toast("signup wxith google are succes");
            
        } catch (error) {
            setIsLoading(false);
            toast("error when authenticating with google")
        }
    }

    const signWithFacbook=async ()=>{
        setIsLoading(true)
        try {
            await SignInWithFacbook();
            setIsLoading(false);
            router.push("/uploads")
            toast("signup wxith facbook are succes");
        } catch (error) {
            setIsLoading(false);
            toast("error when authenticating with google")
        }
    }


    

    const authValues: IAuth = {
        user: currentUser,
        loading: isLoading,
        isLogin,
        signIn,
        signUp,
        signOut,
        setIsLogin,
        signInWithGoogle,
        signWithFacbook
        
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