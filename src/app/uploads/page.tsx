"use client"
import React, { use, useEffect } from 'react'
import UploadsComponent from './uploadsComponent'
import { useQuota } from '@/store/uploadsContext'
import CardDataInfo from '@/components/cardDataInfo'
import { useAuth } from '@/store/auth-context'
import { useRouter } from 'next/navigation'

type Props = {}

const UploadsPage = (props: Props) => {
    const router=useRouter()
    const {isCardClicked,setSpecificCardData}=useQuota();
    const {user}=useAuth();
    useEffect(()=>{
        if(!user){
            router.push("/signup")
        }
    },[user])
    return (
        <div className='w-[100%]'>
            {
                isCardClicked ? <CardDataInfo/> :<UploadsComponent/>
            }
            
        </div>
    )
}

export default UploadsPage
