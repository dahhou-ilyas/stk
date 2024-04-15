"use client"
import { useAuth } from '@/store/auth-context';
import Image from 'next/image'
import React, { useState } from 'react'
import Spiner from './spinner';


type Props = {
    setIsLogin:React.Dispatch<React.SetStateAction<boolean>>
}

function Registre({setIsLogin}: Props) {
    const [email,setEmail]=useState<string>("");
    const [password,setPassword]=useState<string>("");
    const [passwordConf,setPasswordConf]=useState<string>("");
    const {signUp,loading}=useAuth();

    function signUpHandle(e:React.SyntheticEvent){
        e.preventDefault();
        if(password===passwordConf){
            signUp(email,password);
            setEmail("");
            setPassword('');
            setPasswordConf('');
        }else{
            alert("passwords not same !!!")
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(prevState => !prevState);
    };
    
  return (
    <> {
        loading ? (
            <Spiner/>
        ):(
            <div className='bg-secondary-content w-[60%] max-w-[70%] h-[70%] flex m-auto mt-10 rounded-lg max-md:bg-black max-lg:w-[80%] overflow-hidden'>
            <div className='w-[60%] flex flex-col max-md:w-[100%]'>
                <h1 className='text-3xl text-center mt-3 text-secondary font-bold'>Sign Up</h1>
                <form onSubmit={signUpHandle} className='h-[90%] flex flex-col w-[90%] m-auto justify-center gap-y-4'>
                    <label htmlFor='email' className='font-bold text-secondary'>Email</label>
                    <input type="text" id='email' className='h-10 rounded-sm' value={email} onChange={e=>setEmail(e.target.value)}/>
                    <label htmlFor='password' className='font-bold text-secondary'>Password</label>
                    <input type="password" id='password' className='h-10 rounded-sm' value={password} onChange={e=>setPassword(e.target.value)}/>
                    <label htmlFor='passwordConf' className='font-bold text-secondary'>Password Confirmation</label>
                    <input type="password" id='passwordConf' className='h-10 rounded-sm' value={passwordConf} onChange={e=>setPasswordConf(e.target.value)}/>
                    <button className='text-secondary border border-secondary py-2 w-[50%] mx-auto mt-5'>Create</button>
                </form>
            </div>
            <div className='bg-secondary w-[40%] max-md:hidden raidus1 flex flex-col gap-y-5 justify-center items-center text-secondary-content'>
                <Image alt='' className='text-' src="/fichiers4u.svg" height={60} width={60} />
                <h1 className='text-4xl text-center'>welcome back!</h1>
                <p className='text-xl text-center px-1'>Enter your personal details to use all of site features</p>
                <button onClick={toggleAuthMode} className='border border-neutral-content px-7 py-2 rounded-md hover:bg-neutral-content transition-all ease-linear delay-50'>Sign In</button>
            </div>
        </div>
        )
    }
    </>
  )
}

export default Registre