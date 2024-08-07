import Link from "next/link";
import ProfileCard from "./ProfileCard";
import Image from "next/image";
import Ads from "../Ads";

export default function LeftMenu({type}:{type:"home" | "profile"}) {
  return (
    <div className=" flex flex-col gap-6 ">
        {type === "home" && <div><ProfileCard/></div>}
        <div className="p-4 bg-slate-800 rounded-lg shadow-md text-sm text-gray-300 flex flex-col gap-2" >
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/posts.png' width={20} height={20} alt='' ></Image>
          <span>Posts</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/activity.png' width={20} height={20} alt='' ></Image>
          <span>Activity</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/market.png' width={20} height={20} alt='' ></Image>
          <span>Market Place</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/events.png' width={20} height={20} alt='' ></Image>
          <span>Events</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/albums.png' width={20} height={20} alt='' ></Image>
          <span>Albums</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/videos.png' width={20} height={20} alt='' ></Image>
          <span>Videos</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/news.png' width={20} height={20} alt='' ></Image>
          <span>News</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/courses.png' width={20} height={20} alt='' ></Image>
          <span>Courses</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/lists.png' width={20} height={20} alt='' ></Image>
          <span>Lists</span>
          </Link>
          <hr  className="border-t-1 border-gray-50 w-36 self-center"/>
          <Link href='/' className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-600">
          <Image src='/settings.png' width={20} height={20} alt='' ></Image>
          <span>Settings</span>
          </Link>
          
        </div>
        <Ads size="sm"/>
    </div>
  )
}