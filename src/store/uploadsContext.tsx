"use client"
import { Folder } from '@/utils/folderStructure';
import { StorageReference } from 'firebase/storage';
import React, { useContext, useState, createContext, Dispatch, SetStateAction, ReactNode } from 'react'


interface QuotaProviderProps {
    children: ReactNode;
}

export interface customFile{
  name: string;
  url: string;
  ref: StorageReference;
  size: number;
  isFile ?: boolean;
}


interface QuotaContextType {
    quotaUsed: number;
    setQuotaUsed: Dispatch<SetStateAction<number>>;
    isCardClicked:boolean;
    setIsCardClicked:Dispatch<SetStateAction<boolean>>;
    specificCardData:customFile | undefined;
    setSpecificCardData:Dispatch<SetStateAction<customFile | undefined>>;
    pathFolder:string;
    setPathFolder:Dispatch<SetStateAction<string>>;
    hearchiqueSysFile:Folder | undefined
    setHearchiqueSysFile:Dispatch<SetStateAction<Folder | undefined>>;
}

const QuotaContext = createContext<QuotaContextType | null>(null);

export function UploadsProvider({children}: QuotaProviderProps) {
    const [quotaUsed, setQuotaUsed] = useState(0);
    const [hearchiqueSysFile, setHearchiqueSysFile]=useState<Folder | undefined>()
    const [isCardClicked,setIsCardClicked]=useState(false);
    const [specificCardData,setSpecificCardData]=useState<customFile | undefined>();
    const [pathFolder,setPathFolder]=useState<string>('');
    return (
      <QuotaContext.Provider value={{setPathFolder,pathFolder,quotaUsed, setQuotaUsed,isCardClicked,setIsCardClicked,specificCardData,setSpecificCardData,hearchiqueSysFile,setHearchiqueSysFile}}>
        {children}
      </QuotaContext.Provider>
    );
}


export const useQuota = (): QuotaContextType => {
    const context = useContext(QuotaContext);
    if (!context) {
      throw new Error('useQuota doit être utilisé dans QuotaProvider');
    }
    return context;
};