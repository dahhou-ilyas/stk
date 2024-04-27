"use client"

import Login from '@/components/Login'
import Registre from '@/components/registre'
import { useAuth } from '@/store/auth-context'
import React, { useState } from 'react'

type Props = {}

const LoginPage = (props: Props) => {

  const {isLogin,setIsLogin}=useAuth();
  
  return (
    <>
        {
          isLogin ? <Registre setIsLogin={setIsLogin}/>:<Login setIsLogin={setIsLogin} />
        }
    </>
  )
}

export default LoginPage