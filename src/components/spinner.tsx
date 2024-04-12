import Image from 'next/image'
import React from 'react'

type Props = {}

function Spiner({}: Props) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        <Image alt='' src="/fichiers4u.svg" height={40} width={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  )
}

export default Spiner