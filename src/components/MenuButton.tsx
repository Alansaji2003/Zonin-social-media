"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "./botton/Button";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { FaSpinner } from 'react-icons/fa';

const MenuButton = () => {
  const path = usePathname();
  const currentPath = path.split("/")[1];
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setUsername(user.username);
    }
    setIsOpen(false);
    setLoading(false);
  }, [isLoaded, user, path]);

  const clicked = (targetPath: string) => {
    if (targetPath !== path) {
      setLoading(true);
    }
  };

  return (
    <div className="md:hidden">
      <div className="gap-[4.5px] cursor-pointer flex flex-col" onClick={() => setIsOpen((prev) => !prev)}>
        <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "rotate-45" : ""} origin-left ease-in-out duration-500`} />
        <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "opacity-0" : ""} ease-in-out duration-500`} />
        <div className={`w-6 h-1  rounded-sm bg-red-600 ${isOpen ? "-rotate-45" : ""} origin-left ease-in-out duration-500`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-slate-800 text-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10">
          <Button username={username} />

          <Link onClick={() => clicked('/')} href='/'>Home</Link>
          <Link onClick={() => clicked('/friends')} href='/friends'>Friends</Link>
          <Link onClick={() => clicked('/groups')} href='/groups'>Groups</Link>
          {loading && <FaSpinner className="animate-spin text-white" />}
        </div>
      )}
    </div>
  );
};

export default MenuButton;
