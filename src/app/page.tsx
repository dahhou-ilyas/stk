"use client"

import app from "@/firebase/firebase";
import { useAuth } from "@/store/auth-context";
import { traverseStorage } from "@/utils/folderStructure";
import { getStorage, ref } from "firebase/storage";
import { useEffect } from "react";

export default function Home() {
  const {user}=useAuth();
  useEffect(()=>{
    
    async function name() {
      const storage = getStorage(app);
      const rootRef = ref(storage, `users/${user?.uid}/`);
      const result = await traverseStorage(rootRef);
      console.log(result);
    }
    if(user){
      name();
    }
    
  },[user])
  return (
    <div className="flex flex-row items-center">
      <div className="p-10 mt-7 w-[50%]">
        <h1 className="text-7xl font-bold mb-4 leading-[5rem]">
          <span className="shadofile bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">Fichiers4U</span><br /> Your go-to <br/> cloud storage solution.
        </h1>
        <p className="text-xl text-[#8a8787]">Secure, seamless, and accessible from anywhere.</p>
      </div>
      <div className="w-[50%] overflow-hidden">
        image
      </div>
    </div>
  );
}
