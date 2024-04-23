'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/store/auth-context'
type Props = {}

function NavBar({}: Props) {
  const [nav,setNav]=useState(false);
  const {user,signOut}=useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function onLogout(){
    signOut();
  }
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
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
              <li className='text-lg' onClick={() => router.push('/uploads')}><div>My Uploads</div></li>
              <li className='text-lg flex justify-center items-center'>
                <div className="relative">
                  <div onClick={toggleDropdown} className='rounded-full'>
                    <Image className='rounded-full ' width={33} height={33} src={user.photoURL as string || '/default.jpg'} alt={'im'}/>
                  </div>
                  <div className={`absolute text- right-0 top-12 mt-2 w-48 bg-secondary text-secondary-content shadow-lg rounded-md z-10 transition-all duration-150 ease-out ${isDropdownOpen ? "translate-y-0 opacity-[1]" : "-translate-y-40 opacity-[0]"}`}>
                      <ul className="menu menu-vertical">
                          <li className='font-bold'>
                              <div>{user.displayName}</div>
                          </li>
                          <li onClick={() => router.push('/userInfo')}>
                              <div>Settings</div>
                          </li>
                      </ul>
                  </div>
                </div>
              </li>
              <li className='flex justify-center items-center' onClick={onLogout}><div><Image width={20} height={20} src={"/logout.svg"} alt={'im'}/></div></li>
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