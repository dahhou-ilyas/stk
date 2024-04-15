'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import filcloud from "fichiers4u.svg"
import Image from 'next/image'
import { useAuth } from '@/store/auth-context'

type Props = {}

function NavBar({}: Props) {
  const [nav,setNav]=useState(false);
  const {user}=useAuth();

  function onLogout(){
    
  }
  const handleResize = () => {
    if (window.innerWidth >= 768) { // Assuming 768px is your md breakpoint
        setNav(false);
    }else{
      setNav(true);
    }
  };
  const router = useRouter()
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
  return (
    <div className="navbar bg-base-300 pb-2">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl"> <Image alt='' src="/fichiers4u.svg" height={30} width={30} /> Fichiers4U</a>
      </div>
      <div hidden={nav} className="flex-none">
      <ul className="menu menu-horizontal px-1">
          <li className='text-lg' onClick={() => router.push('/')}><div>Home</div></li>
          {user ? (
            <>
              <li className='text-lg' onClick={() => router.push('/profile')}><div>{"username"}</div></li>
              <li className='text-lg' onClick={onLogout}><div>Logout</div></li>
            </>
          ) : (
            <li className='text-lg' onClick={() => router.push('/signup')}><div>Sign up</div></li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NavBar