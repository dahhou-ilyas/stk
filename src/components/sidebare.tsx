"use client"
import {getFileListForUser} from '@/firebase/uploadsSevice'
import { useAuth } from '@/store/auth-context'
import { useQuota } from '@/store/uploadsContext'
import { StorageReference } from 'firebase/storage'
import React, { useEffect, useState } from 'react'

interface customFile{
    name: string;
    url: string;
    ref: StorageReference;
    size: number;
}

function SideBare() {
  const {quotaUsed,setQuotaUsed}=useQuota();
  const [fileData, setFileData] = useState<customFile[]>([]);
  const [loading, setLoading] = useState(true);
  const {user}=useAuth();
  useEffect(()=>{
    const fetchData=async ()=>{
      try{
        const {fileList,totalSizeInMB}=await getFileListForUser(user?.uid as string);
        setFileData(fileList);
        setQuotaUsed(totalSizeInMB)
        setLoading(false);
      }catch (error) {
        console.error("Erreur lors de la récupération des fichiers :", error);
      }
    }
    if (user?.uid) { // Vérifier que userId est défini
      fetchData(); // Appeler la fonction asynchrone
    } 
  },[user])

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className='max-md:w-[40%] min-w-[20%] bg-white/10'>sss</div>
  )
}

export default SideBare