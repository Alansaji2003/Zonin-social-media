import React from 'react';
import { followers, users } from '../../../utils/schema';
import { eq } from 'drizzle-orm';
import { db } from '../../../utils/dbConfig';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = auth();

  if (!userId) return null;

  // Fetch followers
  const followerData = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      f_name: users.f_name,
      l_name: users.l_name,
    })
    .from(users)
    .innerJoin(followers, eq(users.id, followers.followerId))
    .where(eq(followers.followingId, userId));

  // Fetch following
  const followingData = await db
    .select({
      id: users.id,
      username: users.username,
      avatar: users.avatar,
      f_name: users.f_name,
      l_name: users.l_name,
    })
    .from(users)
    .innerJoin(followers, eq(users.id, followers.followingId))
    .where(eq(followers.followerId, userId));

  return (
    <div className='bg-slate-800 h-screen text-white'>
      <div className='flex items-center justify-between'>
        <div className='h-screen rounded-md bg-slate-700 w-[40%] flex flex-col items-center'>
          <h1 className='text-red-500 text-2xl font-bold mt-5'>Followers</h1>
          <div className='mt-5'>
            {followerData.length > 0 ? (
              followerData.map(follower => (
                <div key={follower.id} className='flex items-center gap-4 p-2'>
                  <img src={follower.avatar || "/noAvatar.png"} alt='' width={40} height={40} className='w-10 h-10 rounded-full' />
                  <span>{follower.f_name && follower.l_name ? `${follower.f_name} ${follower.l_name}` : follower.username}</span>
                </div>
              ))
            ) : (
              <p className='text-center mt-5'>No followers yet.</p>
            )}
          </div>
        </div>
        <div className='h-screen rounded-md bg-slate-700 w-[40%] flex flex-col items-center'>
          <h1 className='text-red-500 text-2xl font-bold mt-5'> Following</h1>
          <div className='mt-5'>
            {followingData.length > 0 ? (
              followingData.map(following => (
                <div key={following.id} className='flex items-center gap-4 p-2'>
                  <img src={following.avatar || "/noAvatar.png"} alt='' width={40} height={40} className='w-10 h-10 rounded-full' />
                  <span>{following.f_name && following.l_name ? `${following.f_name} ${following.l_name}` : following.username}</span>
                </div>
              ))
            ) : (
              <p className='text-center mt-5'>Not following anyone yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
