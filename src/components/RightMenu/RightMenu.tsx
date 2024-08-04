import FriendRequest from './FriendRequest';
import Birthdays from './Birthdays';
import Ads from '../Ads';
import UserInfoCard from './UserInfoCard';
import UserMediaCard from './UserMediaCard';
import { Suspense } from 'react';

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
  followerCount: number;
  followingCount: number;
  postsCount: number;
};

export default function RightMenu({ user }: { user?: UserType[] }) {
  return (
    <div className='flex flex-col gap-6'>
      {user ? (
        <>
          <Suspense fallback="loading..">
            <UserInfoCard user={user} />
          </Suspense>
          <Suspense fallback="loading..">
            <UserMediaCard user={user} />
          </Suspense>
        </>
      ) : null}
      <FriendRequest />
      <Birthdays />
      <Ads size="md" />
    </div>
  );
}
