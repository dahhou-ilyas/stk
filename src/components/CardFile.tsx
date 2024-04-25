import { deleteFromFirebase } from '@/firebase/uploadsSevice'
import { customFile, useQuota } from '@/store/uploadsContext'
import { getIconForFileType } from '@/utils/geticons'
import Image from 'next/image'
import React from 'react'
import { toast } from 'react-hot-toast';

type Props = {
    data:customFile
}

function CardFile({data}: Props) {
  const {setIsCardClicked,setSpecificCardData,setFileData,setQuotaUsed}=useQuota();
  
  function handleDelete(e:any){
    e.stopPropagation();
    deleteFromFirebase(data.ref.fullPath).then(res=>{
      setQuotaUsed(prevQuoata=>prevQuoata-(data.size/(1024*1024)))
      setFileData(prev=>{
        return prev.filter(datainfo=>datainfo.name!=data.name);
      })
    }).catch((err)=>{
      console.log(err);
      toast.error("file not delted");
    });
  }

  function handleClick() {
    setIsCardClicked(true);
    setSpecificCardData(data)
  }

  return (
    <div className='w-full border border-accent/30 rounded-md bg-ac flex flex-row items-center justify-between px-1 cursor-pointer' onClick={handleClick}>
        <p className='font-sans overflow-hidden'>{getIconForFileType(data.name)}  {data.name.split('.')[0]}</p>
        <Image onClick={handleDelete} className='cursor-pointer' alt='X' src={'/delet.svg'} width={18} height={18}/>
    </div>
  )
}

export default CardFile