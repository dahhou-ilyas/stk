"use client"
import React, { useContext, useState, createContext, Dispatch, SetStateAction, ReactNode } from 'react'


interface QuotaProviderProps {
    children: ReactNode;
}

interface QuotaContextType {
    quotaUsed: number;
    setQuotaUsed: Dispatch<SetStateAction<number>>;
}

const QuotaContext = createContext<QuotaContextType | null>(null);

export function UploadsProvider({children}: QuotaProviderProps) {
    const [quotaUsed, setQuotaUsed] = useState(0);
    return (
      <QuotaContext.Provider value={{ quotaUsed, setQuotaUsed }}>
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