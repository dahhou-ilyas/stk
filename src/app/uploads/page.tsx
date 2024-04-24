"use client"
import React, { use } from 'react'
import UploadsComponent from './uploadsComponent'
import { useQuota } from '@/store/uploadsContext'
import CardDataInfo from '@/components/cardDataInfo'


type Props = {}

const UploadsPage = (props: Props) => {
    const {isCardClicked,setSpecificCardData}=useQuota();
    return (
        <div className='w-[100%]'>
            {
                isCardClicked ? <CardDataInfo/> :<UploadsComponent/>
            }
            
        </div>
    )
}

export default UploadsPage
