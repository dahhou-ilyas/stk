import Image from 'next/image'
import React from 'react'

type Props = {
    name:string
}

function CardFile({name}: Props) {
  return (
    <div className='w-full border border-accent/30 rounded-md bg-ac flex flex-row items-center justify-between px-1'>
        <p className='font-sans'>{name}</p>
        <Image alt='X' src={'/delet.svg'} width={18} height={18}/>
    </div>
  )
}

export default CardFile