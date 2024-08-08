
import LeftMenu from "@/components/LeftMenu/LeftMenu"
import PostFeed from "@/components/PostFeed"
import RightMenu from "@/components/RightMenu/RightMenu"
import Image from 'next/image'
import { db } from '../../../../utils/dbConfig'
import { and, eq, sql } from 'drizzle-orm'
import { followers, posts, users, blocks } from '../../../../utils/schema'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import ProfilePageInteraction from "@/components/ProfilePageInteraction"
import UserInfoCard from "@/components/RightMenu/UserInfoCard"



const ProfilePage = async({params}:{params:{username:string }}) => {



  const username = params.username;
  const {userId} = auth();
  let isFollowing = false;

  const followerSubquery = db
  .select({
    userId: followers.followingId,
    followerCount: sql<number>`COUNT(${followers.followerId})`.as('followerCount')
  })
  .from(followers)
  .groupBy(followers.followingId)
  .as('followerSubquery');

const followingSubquery = db
  .select({
    userId: followers.followerId,
    followingCount: sql<number>`COUNT(${followers.followingId})`.as('followingCount')
  })
  .from(followers)
  .groupBy(followers.followerId)
  .as('followingSubquery');

const user = await db
  .select({
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
    followerCount: followerSubquery.followerCount,
    followingCount: followingSubquery.followingCount,
    postsCount: sql<number>`COUNT(${posts.id})`.as('postsCount')
  })
  .from(users)
  .leftJoin(followerSubquery, eq(followerSubquery.userId, users.id))
  .leftJoin(followingSubquery, eq(followingSubquery.userId, users.id))
  .leftJoin(posts, eq(posts.userId, users.id))
  .where(eq(users.username, username))
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
    users.createdAt,
    followerSubquery.followerCount,
    followingSubquery.followingCount
  );
  // console.log(user);
  
  if(user?.length == 0 ) return notFound();
  const {userId: currUserId} = auth();
  
  let isBlocked:boolean = false;
  
  if (currUserId) {
    const res = await db.query.blocks.findFirst({
      where: and(
        eq(blocks.blockerId, user[0]?.id),
        eq(blocks.blockedId, currUserId)
      )
    });

    const res2 = await db.query.blocks.findFirst({
      where: and(
        eq(blocks.blockedId, user[0]?.id),
        eq(blocks.blockerId, currUserId)
      )
      
    });
    if(!userId) return notFound();
    const followerRes = await db.query.followers.findFirst({
      where: and(
          eq(followers.followingId, user[0]?.id),
          eq(followers.followerId, userId)
      )
  });
    
    
    isFollowing = !!followerRes;
    
    
    if(res || res2) isBlocked = true;
  }
  if(isBlocked ) return <div>User Blocked</div>;
  
  return (
    isBlocked ? "User Blocked" : (
      <div className='flex gap-6 pt-6 text-white'>
        <div className="hidden xl:block w-[20%]">
          <LeftMenu type="profile"/>
        </div>
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6"> 
            <div className='flex flex-col items-center justify-center'>
              <div className='w-full h-64 relative'>
                <Image src={user[0]?.cover || "https://images.pexels.com/photos/1260727/pexels-photo-1260727.jpeg?auto=compress&cs=tinysrgb&w=600"} alt='' fill className='object-cover rounded-md'/>
                <Image src={user[0]?.avatar || "/noAvatar.png"} alt='' width={128} height={128} className='w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover'/>
              </div>
              <h1 className='mt-20 mb-4 text-2xl font-medium'>{(user[0]?.f_name && user[0]?.l_name) ? user[0].f_name + " " + user[0].l_name : user[0]?.username}</h1>
              <p className='mb-2 text-sx font-small text-slate-500'>@{user[0]?.username}</p>
             <ProfilePageInteraction user={user}/>
            </div>
            <div className="md:hidden">
            <UserInfoCard user={user}/>
            </div>
            
            {username == user[0]?.username || isFollowing? (<PostFeed username={user[0]?.username} />):(<></>) }
            
          </div>
        </div>
        <div className="hidden lg:block w-[30%]">
          <RightMenu user={user}/>
        </div>
      </div>
    )
  );
}

export default ProfilePage