import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../../../utils/dbConfig';
import { blocks, followers, followRequests } from '../../../utils/schema';
import { and, eq } from 'drizzle-orm';
import UserInfoCardInteraction from './UserInfoCardInteraction';
import UpdateUser from './UpdateUser';

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

export default async function UserInfoCard({ user }: { user?: UserType[] }) {
    if (!user || user.length === 0) return null;

    const { userId: currUserId } = auth();
    let isUserBlocked = false;
    let isFollowing = false;
    let isFollowingSent = false;

    if (currUserId) {
        const userId = user[0].id;

        const [Blockres, FollowerRes, sentReqRes] = await Promise.all([
            db.query.blocks.findFirst({
                where: and(
                    eq(blocks.blockedId, userId),
                    eq(blocks.blockerId, currUserId)
                )
            }),
            db.query.followers.findFirst({
                where: and(
                    eq(followers.followingId, userId),
                    eq(followers.followerId, currUserId)
                )
            }),
            db.query.followRequests.findFirst({
                where: and(
                    eq(followRequests.senderId, currUserId),
                    eq(followRequests.recieverId, userId)
                )
            })
        ]);

        isUserBlocked = !!Blockres;
        isFollowing = !!FollowerRes;
        isFollowingSent = !!sentReqRes;
    }

    const userInfo = user[0];

    return (
        <div className="p-4 bg-slate-800 text-white rounded-lg shadow-md text-sm flex flex-col gap-4">
            {/* Top part */}
            <div className="flex justify-between items-center font-medium">
                <span className="text-gray-300">User Information</span>
                {currUserId === userInfo.id? (<UpdateUser user={user}/>) : (<Link href="/" className="text-red-500 text-xs">See all</Link>)}
                
            </div>
            {/* Bottom part */}
            <div className="flex flex-col gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                    <span className="text-xl text-white">
                    {userInfo.f_name && userInfo.l_name ? `${userInfo.f_name} ${userInfo.l_name}` : userInfo.username}

                    </span>
                </div>
                <p>{userInfo.description || ""}</p>
                <div className="flex items-center gap-2">
                    <Image src="/map.png" alt="Map" width={16} height={16} />
                    <span>
                        Living in <b>{userInfo.city || "-"}</b>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/school.png" alt="School" width={16} height={16} />
                    <span>
                        Went to <b>{userInfo.school || "-"}</b>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Image src="/work.png" alt="Work" width={16} height={16} />
                    <span>
                        Works at <b>{userInfo.work || "-"}</b>
                    </span>
                </div>
                <div className="flex items-center justify-between gap-5">
                    <div className="flex gap-1 items-center">
                        <Image src="/link.png" alt="Link" width={16} height={16} />
                        <Link target="_blank" href={userInfo.website || "#"} className="text-red-600 font-small">
                            {userInfo.website ? "User Website" : "-"}
                        </Link>
                    </div>
                    <div className="flex gap-1 items-center">
                        <Image src="/date.png" alt="Date" width={16} height={16} />
                        <span>
                            Joined {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : "-"}
                        </span>
                    </div>
                </div>
                {(currUserId && currUserId !== userInfo.id) && 
                <UserInfoCardInteraction userId={userInfo.id} isUserBlocked={isUserBlocked}
                isFollowing={isFollowing}
                isFollowingSent={isFollowingSent} />
                    }
                
            </div>
        </div>
    );
}