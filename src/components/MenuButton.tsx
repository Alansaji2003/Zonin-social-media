"use client"
import Link from "next/link"
import { useState } from "react"

const  MenuButton = () => {

    const [isOpen, setIsOpen] = useState(false)



  return (
    <div className="md:hidden">
        <div className="gap-[4.5px] cursor-pointer flex flex-col" onClick={() => setIsOpen((prev) => !prev)}>
            <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "rotate-45":""} origin-left ease-in-out duration-500`}/>
            <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "opacity-0":""} ease-in-out duration-500 `}/>
            <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "-rotate-45":""} origin-left ease-in-out duration-500`}/>
        </div>

        {isOpen && (
            <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-slate-800 text-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
                <Link href='/'>Home</Link>
                <Link href='/'>Search</Link>
                <Link href='/'>Friends</Link>
                <Link href='/'>Groups</Link>
                <Link href='/'>Profile</Link>
                
            </div>
        )}
    </div>
  )
}

export default MenuButton