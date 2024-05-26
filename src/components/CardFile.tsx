import { deleteFromFirebase, generateShareLink } from '@/firebase/uploadsSevice'
import { customFile, useQuota } from '@/store/uploadsContext'
import { copyToClipboard } from '@/utils/clickCopy'
import { Folder, findFolderById } from '@/utils/folderStructure'
import { getIconForFileType } from '@/utils/geticons'
import Image from 'next/image'
import React from 'react'
import { toast } from 'react-hot-toast';

type Props = {
    data:customFile
}

function CardFile({data}: Props) {
  const {setIsCardClicked,setSpecificCardData,setQuotaUsed,setHearchiqueSysFile,hearchiqueSysFile}=useQuota();
  
  function handleDelete(e:any){
    e.stopPropagation();
    deleteFromFirebase(data.ref.fullPath).then(res=>{
      const segments = res.fullPath.split('/');
      segments.pop();
      const targetFolder = findFolderById(hearchiqueSysFile as Folder, segments.join('/'));
      if(targetFolder){
        const newShildrent=targetFolder.children.filter(item=>(item as customFile).name!==res.name);
        targetFolder.children=newShildrent;
      }
      setHearchiqueSysFile({...hearchiqueSysFile as Folder})
      setQuotaUsed(prevQuoata=>prevQuoata-(data.size/(1024*1024)))
      toast.success("file is deleted")
    }).catch((err)=>{
      console.log(err);
      toast.error("file not delted");
    });
  }

  function handleClick() {
    setIsCardClicked(true);
    setSpecificCardData(data)
  }

  async function handleShare(){
    const shareLink=await generateShareLink(data.ref.fullPath);
    const succes=await copyToClipboard(shareLink);

    if(succes){
      toast.success('link for share has copied')
    }else{
      toast.error("Unable to copy link.");
    }
  }

  return (
    <div className='w-full border border-accent/30 rounded-md bg-ac flex flex-row items-center justify-between px-1'>
        <p onClick={handleClick} className='cursor-pointer font-sans overflow-hidden'>{getIconForFileType(data.name)}  {data.name.split('.')[0]}</p>
        <div className='flex flex-row gap-x-3'>
          <Image onClick={handleShare} className='cursor-pointer' alt='X' src={'/share.png'} width={20} height={20}/>
          <Image onClick={handleDelete} className='cursor-pointer' alt='X' src={'/delet.svg'} width={20} height={20}/>
        </div>
    </div>
  )
}

export default CardFile