import { customFile, useQuota } from '@/store/uploadsContext'
import { getIconForFileType } from '@/utils/geticons'
import Image from 'next/image'
import React from 'react'

type Props = {
    data:customFile
}

function CardFile({data}: Props) {
  const {setIsCardClicked,setSpecificCardData}=useQuota();
  function handleClick() {
    setIsCardClicked(true);
    setSpecificCardData(data)
  }

  return (
    <div className='w-full border border-accent/30 rounded-md bg-ac flex flex-row items-center justify-between px-1 cursor-pointer' onClick={handleClick}>
        <p className='font-sans overflow-hidden'>{getIconForFileType(data.name)}  {data.name.split('.')[0]}</p>
        <Image className='cursor-pointer' alt='X' src={'/delet.svg'} width={18} height={18}/>
    </div>
  )
}

export default CardFile