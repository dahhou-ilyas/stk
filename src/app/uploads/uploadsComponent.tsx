"use client"
import React from 'react'
import { uploadFileToUserFolder } from '@/firebase/uploadsSevice'
import { useAuth } from '@/store/auth-context'
import { useQuota } from '@/store/uploadsContext';
import { useState } from 'react'
import { toast } from 'react-hot-toast';
import Spiner from '@/components/spinner';
import { Folder, findFolderById } from '@/utils/folderStructure';

type Props = {}

function UploadsComponent({}: Props) {
    const { user } = useAuth();
    const { pathFolder,quotaUsed, setQuotaUsed,setHearchiqueSysFile,hearchiqueSysFile } = useQuota();
    const [isupload,setIsupload]=useState<boolean>(false);
    const [quotaLimit, setQuotaLimit] = useState(150);
    const [file,setFile]=useState<FileList | null>()
    const remainingQuota = quotaLimit - quotaUsed;
    const progressBarWidth = Math.round(((remainingQuota / quotaLimit) * 100));

    const handleFileUpload = () => {
        if(file){
            setIsupload(true);
            uploadFileToUserFolder(user?.uid as string,file[0],pathFolder).then(data=>{
                toast.success("your file is succefily uploaded");
                setIsupload(false);
                setFile(null);
                if(data!=undefined){
                    const targetFolder = findFolderById(hearchiqueSysFile as Folder, `users/${user?.uid}/${pathFolder}`);
                    console.log(targetFolder);
                    targetFolder?.children.push({name:data.name
                        ,url:data.url,
                        ref:data.ref,
                        size:data.size,
                        isFile:true
                    })
                    setHearchiqueSysFile({ ...(hearchiqueSysFile as Folder) });
                }
                const size=(file[0].size)/ (1024 * 1024)
                setQuotaUsed(prev=>prev+size); 
                
            }).catch(err=>{
                toast.error("your file not uploads")
                console.log(err);
            })
        }else{
            toast("you should have something to upload")
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setFile(files);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        console.log(files);
        if (files != null) {
            setFile(files);
        }
    };
  return (
    user ? (
        <>
        <h1 className='text-3xl text-center mt-7'>Upload Anything</h1>

        <div className='flex justify-center my-9 items-center flex-col w-full'>
            <div className="radial-progress bg-primary text-primary-content border-4 border-primary" style={{"--value":100-progressBarWidth}} role="progressbar">{100-progressBarWidth}%</div>
            <span className="mt-3">{remainingQuota.toFixed(2)} MB / {quotaLimit} MB</span>
        </div>

        <div className='ml-5'>
            /{pathFolder}
        </div>

        <div 
            className="flex items-center justify-center max-w-[700px] p-4 m-auto" 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()}
        >
            <label 
                htmlFor="dropzone-file" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-neutral-content dark:hover:bg-base-content dark:bg-neutral-content hover:bg-base-content dark:border-neutral-content dark:hover:border-gray-500"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg 
                        className="w-8 h-8 mb-4 text-neutral dark:text-neutral" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 20 16"
                    >
                        <path 
                            stroke="currentColor" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-neutral dark:text-neutral">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    {file ? (<p className='pt-3 text-x text-center text-neutral dark:text-neutral'>{file[0].name}</p>):(<p className="text-xs text-neutral text-center dark:text-neutral">
                        Anything to uploads
                    </p>)}
                </div>
                <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileInput} 
                />
                {file && <button disabled={isupload} className='text-neutral hover:bg-neutral-content p-2 rounded-md' onClick={handleFileUpload}>Upload</button>}
            </label>
        </div>
    </>
    ):(
        <Spiner/>
    )
  )
}

export default UploadsComponent