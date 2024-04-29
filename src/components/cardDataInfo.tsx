import { useQuota } from '@/store/uploadsContext'
import React from 'react'
import getFileTypeComponent from './getFileTypeComponent';

type Props = {}

const CardDataInfo = (props: Props) => {
    const {setIsCardClicked,specificCardData}=useQuota();
    function handlClick(){
        setIsCardClicked(false);
    }

  return (
    <div className='flex flex-col gap-y-8 h-full'>
        <div className='flex justify-end mr-3 mt-3 items-center'>
            <button onClick={handlClick} className='bg-secondary text-secondary-content py-2 px-3 border-0 rounded-lg left-9'>Uploads</button>
        </div>
        <div className='h-full p-1'>
            <div className='h-full p-1'>{getFileTypeComponent(specificCardData!)}</div>
        </div>
    
    </div>
  )
}

export default CardDataInfo