"use client"
import { StorageReference } from 'firebase/storage';
import React, { useContext, useState, createContext, Dispatch, SetStateAction, ReactNode } from 'react'


interface QuotaProviderProps {
    children: ReactNode;
}

interface customFile{
  name: string;
  url: string;
  ref: StorageReference;
  size: number;
}


interface QuotaContextType {
    quotaUsed: number;
    setQuotaUsed: Dispatch<SetStateAction<number>>;
    fileData:customFile[],
    setFileData:Dispatch<SetStateAction<customFile[]>>;
}

const QuotaContext = createContext<QuotaContextType | null>(null);

export function UploadsProvider({children}: QuotaProviderProps) {
    const [quotaUsed, setQuotaUsed] = useState(0);
    const [fileData, setFileData] = useState<customFile[]>([]);
    return (
      <QuotaContext.Provider value={{ quotaUsed, setQuotaUsed,setFileData,fileData}}>
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