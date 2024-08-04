import Image from "next/image"
import { db } from "../../../utils/dbConfig"
import { followers, users } from "../../../utils/schema"
import { auth } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"
import Button from "../botton/Button"



async function ProfileCard() {
  
  const {userId} = auth();
  
  
  if (userId == null) return null;
    const user = await db.select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      cover: users.cover,
      f_name: users.f_name,
      l_name: users.l_name,
      description: users.description,
      city: users.city,
      school: users.school,
      work: users.work,
      website: users.website,
      createdAt: users.createdAt,
      followerCount: sql`COUNT(${followers.followerId})`.mapWith(Number)
    })
    .from(users)
    .leftJoin(followers, eq(followers.followingId, users.id))
    .where(eq(users.id, userId))
    .groupBy(
      users.id,
      users.username,
      users.avatar,
      users.cover,
      users.f_name,
      users.l_name,
      users.description,
      users.city,
      users.school,
      users.work,
      users.website,
      users.createdAt
    );
  
    // console.log(user);
    
  
  if(!user) return null;
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-md text-sm flex flex-col gap-6">
      <div className="h-20 relative">
        <Image src={user[0]?.cover || "https://images.pexels.com/photos/1260727/pexels-photo-1260727.jpeg?auto=compress&cs=tinysrgb&w=600"} alt='' fill className="rounded-md object-cover"/>
        <Image src={user[0]?.avatar || "/noAvatar.png"} alt='' width={48} height={48} className="rounded-full w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10 object-cover"/>
      </div>
      <div className="h-20 flex flex-col gap-2 items-center">
        <span className="font-semibold text-white">{(user[0]?.f_name && user[0]?.l_name )?user[0].f_name+" "+user[0].l_name:user[0]?.username}</span>
        <div className="flex items-center gap-4">
          <div className="flex ">
          <Image src='https://images.pexels.com/photos/27383322/pexels-photo-27383322/free-photo-of-a-woman-sitting-on-a-skateboard-in-a-park.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' width={12} height={12} className="rounded-full w-3 h-3 "/>
          <Image src='https://images.pexels.com/photos/27383322/pexels-photo-27383322/free-photo-of-a-woman-sitting-on-a-skateboard-in-a-park.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' width={12} height={12} className="rounded-full w-3 h-3 "/>
          <Image src='https://images.pexels.com/photos/27383322/pexels-photo-27383322/free-photo-of-a-woman-sitting-on-a-skateboard-in-a-park.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' alt='' width={12} height={12} className="rounded-full w-3 h-3 "/>
          </div>
          <span className="text-xs text-gray-100"> {user[0]?.followerCount} followers</span>
        </div>
        
        <Button user = {user[0]}/>
      </div>
    </div>
  )
}

export default ProfileCard