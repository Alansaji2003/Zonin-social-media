"use client";
import React, { useState, useEffect } from 'react';

type UserType = {
  id: string;
  username: string;
  avatar: string | null;
  cover: string | null;
  f_name: string | null;
  l_name: string | null;
  description: string | null;
  city: string | null;
  school: string | null;
  work: string | null;
  website: string | null;
  createdAt: Date | null;
  followerCount: number | null;
  followingCount: number | null;
  postsCount: number;
};

function ProfilePageInteraction({ user }: { user?: UserType[] }) {

  
  const [postsCount, setPostsCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (user) {
      setPostsCount(user[0].postsCount);
      setFollowerCount(user[0].followerCount ?? 0);
      setFollowingCount(user[0].followingCount ?? 0);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className='flex items-center justify-center gap-12 mb-4'>
      <div className='flex flex-col items-center'>
        <span className='font-medium'>{postsCount}</span>
        <span className='text-sm'>Posts</span>
      </div>
      <div className='flex flex-col items-center'>
        <span className='font-medium'>{followerCount}</span>
        <span className='text-sm'>Followers</span>
      </div>
      <div className='flex flex-col items-center'>
        <span className='font-medium'>{followingCount}</span>
        <span className='text-sm'>Following</span>
      </div>
    </div>
  );
}

export default ProfilePageInteraction;
