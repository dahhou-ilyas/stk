import { useQuota } from '@/store/uploadsContext'
import React from 'react'

type Props = {}

const CardDataInfo = (props: Props) => {
    const {setIsCardClicked}=useQuota();
    function handlClick(){
        setIsCardClicked(false);
    }

  return (
    <div className='flex flex-col gap-y-8'>
        <div className='flex justify-end mr-3 mt-3 items-center'>
            <button onClick={handlClick} className='bg-secondary text-secondary-content py-2 px-3 border-0 rounded-lg left-9'>Uploads</button>
        </div>
        <div className=''>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium beatae porro nostrum, quod veritatis natus ad ullam voluptatem eos enim ex illo, laudantium, cupiditate error ut ipsam expedita? In, nulla.
        </div>
    </div>
  )
}

export default CardDataInfo