'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

type Props = {}

function NavBar({}: Props) {
  const router = useRouter()
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li onClick={() => router.push('/')}><div>Home</div></li>
          <li onClick={() => router.push('/login')}><div>Login</div></li>
        </ul>
      </div>
    </div>
  )
}

export default NavBar