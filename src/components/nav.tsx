'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/store/auth-context';

function NavBar() {
  const [isMobile, setIsMobile] = useState(false);
  const { user, signOut,isLogin,setIsLogin } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768); // 768px est le point de rupture "md"
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogout = () => {
    signOut();
  };

  const router = useRouter();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Appeler la fonction pour la première fois
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="navbar bg-base-300 pb-2">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">
          <Image alt="" src="/fichiers4u.svg" height={30} width={30} />
          Fichiers4U
        </a>
      </div>
      {isMobile ? (
        <div className="flex-none">
          <button className="btn btn-square" >
              <label className="btn btn-circle swap swap-rotate">
              <input type="checkbox" onClick={toggleMenu}/>
              <svg className="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/></svg>
              <svg className="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"/></svg>
            </label>
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 right-0 w-48 bg-secondary text-secondary-content shadow-lg rounded-md z-10">
              <ul className="menu menu-vertical">
                <li className="text-lg cursor-pointer text-center hover:bg-white/20 hover:rounded-lg hover:p-2 transition-all delay-200" onClick={() => router.push('/')}>
                  Home
                </li>
                {user ? (
                  <div className='flex flex-col gap-y-2 justify-center items-center'>
                    <li className="text-lg flex justify-center items-center">
                      <div className="relative">
                        <div className="rounded-full">
                          <Image
                            className="rounded-full"
                            width={33}
                            height={33}
                            src={user.photoURL || '/default.jpg'}
                            alt="user"
                          />
                        </div>
                      </div>
                    </li>
                    <li className="font-bold">
                      {user.displayName}
                    </li>
                    <li className="text-lg cursor-pointer hover:bg-white/20 hover:rounded-lg hover:p-2 transition-all delay-200" onClick={() => router.push('/uploads')}>
                      My Uploads
                    </li>
                    <li className="text-lg cursor-pointer hover:bg-white/20 hover:rounded-lg hover:p-2 transition-all delay-200" onClick={() => router.push('/userInfo')}>
                      Settings
                    </li>
                    <div className="flex justify-center items-center cursor-pointer" onClick={onLogout}>
                      <Image width={20} height={20} src="/logout.svg" alt="logout" />
                    </div>
                  </div>
                ) : (
                  <li className="text-lg cursor-pointer" onClick={() => {
                        setIsLogin(prev=>!prev)
                        router.push('/signup')
                      }
                    }>
                    {
                      isLogin ? "Sign in" : "Sign up"
                    }
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row justify-center items-center">
          <ul className="menu menu-horizontal px-1 flex flex-row justify-center items-center gap-x-3">
            <li className="text-lg cursor-pointer hover:bg-white/20 hover:rounded-lg hover:p-1 transition-all delay-75" onClick={() => router.push('/')}>
              Home
            </li>
            {user ? (
              <>
                <li className="text-lg cursor-pointer hover:bg-white/20 hover:rounded-lg hover:p-1 transition-all delay-75" onClick={() => router.push('/uploads')}>
                  My Uploads
                </li>
                <li className="text-lg flex justify-center items-center">
                  <div className="relative">
                    <div onClick={toggleDropdown} className="rounded-full">
                      <Image
                        className="rounded-full"
                        width={33}
                        height={33}
                        src={user.photoURL || '/default.jpg'}
                        alt="user"
                      />
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-12 mt-2 w-48 bg-secondary text-secondary-content shadow-lg rounded-md z-10 transition-all duration-150 ease-out">
                        <ul className="menu menu-vertical">
                          <li className="font-bold">
                            {user.displayName}
                          </li>
                          <li onClick={() => router.push('/userInfo')}>
                            Settings
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
                <div className="flex justify-center items-center cursor-pointer" onClick={onLogout}>
                  <Image width={20} height={20} src="/logout.svg" alt="logout" />
                </div>
              </>
            ) : (
              <li className="text-lg" onClick={() => router.push('/signup')}>
                Sign up
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NavBar;
