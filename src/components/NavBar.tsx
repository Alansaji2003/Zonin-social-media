"use client"
import Link from "next/link";
import MenuButton from "./MenuButton";
import { CiHome } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { LuCircleDashed, LuLogIn } from "react-icons/lu";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";

const NavBar = () => {
  return (
    <div className="h-24 flex justify-between items-center px-4 md:px-8 lg:px-12">
      <div className="flex w-auto">
        <Link className="font-bold text-2xl text-red-600" href="/">
          Zonin!
        </Link>
      </div>

      <div className="hidden md:flex flex-grow text-sm items-center justify-center gap-4">
        <div className="flex gap-6 text-gray-100">
          <Link className="flex gap-2 items-center" href="/"><CiHome className="text-red-600" />Home</Link>
          <Link className="flex gap-2 items-center" href="/friends"><FaUserFriends className="text-red-600" />Friends</Link>
          <Link className="flex gap-2 items-center" href="/groups"><MdGroups className="text-red-600" />Groups</Link>

        </div>
        <div className="hidden xl:flex p-2 bg-slate-800 items-center text-white rounded-md ">
          <input type="text" placeholder="Search.." className="bg-transparent outline-none" />
          <Image src="/search.png" alt="Search Icon" width={14} height={14} />
        </div>
      </div>

      <div className="flex items-center gap-4 xl:gap-4 justify-end">
        <ClerkLoading>
          <CgSpinner className="animate-spin text-red-600" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer flex items-center gap-4">
              <Image className="hidden md:block" src="/people.png" alt="People Icon" width={20} height={20} />
              <Image className="hidden md:block" src="/messages.png" alt="Messages Icon" width={20} height={20} />
              <Image className="hidden md:block" src="/notifications.png" alt="Notifications Icon" width={20} height={20} />
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-1 text-sm bg-slate-200 rounded-md p-2">
              <LuLogIn />
              <Link href={'/sign-in'}>Login / Signup</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MenuButton />
      </div>
    </div>
  )
}

export default NavBar;
