"use client"
import { useAuth } from "@/store/auth-context";
import Image from "next/image";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row items-center p-6 md:p-10 mt-5 md:mt-7 bg-gradient-to-br ">
      <div className="w-full lg:w-[80%] mb-8 lg:mb-0 lg:pr-10 animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight lg:leading-[5rem] bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text hover:text-white transition duration-500 ease-in-out transform hover:scale-105">
          Fichiers4U
          <br />
          Your go-to
          <br />
          cloud storage solution.
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 animate-slideInLeft">
          Secure, seamless, and accessible from anywhere.
        </p>
      </div>
      <div className="w-full lg:w-[20%] overflow-hidden flex justify-center items-center animate-bounce">
        <Image src="/fichiers4u.svg" alt="img" width={150} height={150} className="rounded-full shadow-lg" />
      </div>
    </div>
  );
}
