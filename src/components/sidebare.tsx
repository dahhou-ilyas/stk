"use client"
import {getFileListForUser} from '@/firebase/uploadsSevice'
import { useAuth } from '@/store/auth-context'
import { useQuota } from '@/store/uploadsContext'
import React, { useEffect, useState } from 'react'
import FileSystem from './FileSystem'
import { initialFolderStructure } from '@/utils/folderStructure'

function SideBare() {
  const {quotaUsed,setPathFolder,setQuotaUsed}=useQuota();
  const [loading, setLoading] = useState(false);
  const {user}=useAuth();
  
  useEffect(()=>{
    setLoading(true)
    const fetchData=async ()=>{
      try{
        const {totalSizeInMB}=await getFileListForUser(user?.uid as string);
        setQuotaUsed(totalSizeInMB as number)
        setLoading(false);
      }catch (error) {
        console.error("Erreur lors de la récupération des fichiers :", error);
      }
    }
    if (user?.uid) { // Vérifier que userId est défini
      fetchData(); // Appeler la fonction asynchrone
    } 
  },[user])


  return (
    <div className='max-md:w-[40%] min-w-[20%] h-screen bg-white/10'>
      <FileSystem initialFolders={initialFolderStructure} />
    </div>
  )
}

export default SideBare