"use client";
import { switchBlock, switchFollow } from '@/lib/actions';
import React, { useState } from 'react'
import { ImSpinner3 } from "react-icons/im";

export default function UserInfoCardInteraction({
    userId,
    isUserBlocked,
    isFollowing,
    isFollowingSent,
}: {
    userId: string;
    isUserBlocked: boolean;
    isFollowing: boolean;
    isFollowingSent: boolean;
}) {
    const [userState, setUserState] = useState({
        following: isFollowing,
        followingSent: isFollowingSent,
        blocked: isUserBlocked,
    });
    const [loading, setLoading] = useState(false);

    const follow = async () => {
        setLoading(true);
        try {
            await switchFollow(userId);
            setUserState(prev => ({
                ...prev,
                following: prev.following && false,
                followingSent: !prev.following && !prev.followingSent ? true : false,
            }));
        } catch (e) {
            console.error("Error switching follow status", e);
        } finally {
            setLoading(false);
        }
    };

    const block = async () => {
        setLoading(true);
        try {
            await switchBlock(userId);
            setUserState(prev => ({
                ...prev,
                blocked: !prev.blocked,
            }));
        } catch (e) {
            console.error("Error switching block status", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); follow(); }}>
                {loading ? <div className='flex items-center justify-center'><ImSpinner3 className='text-xl text-slate-950 animate-spin'/></div> : (
                    <button className="w-full bg-red-600 text-white text-sm rounded-md p-1">
                    {userState.following ? "Following" : userState.followingSent ? "Requested" : "Follow"}
                </button>
                )}
            </form>
            <form className='self-end' onSubmit={(e) => {e.preventDefault(); block();}}>
                {loading ? <div className='flex items-center justify-end'><ImSpinner3 className='text-xl text-slate-950 animate-spin'/></div> : (
                    <button className=" text-red-500 cursor-pointer text-xs">
                        {userState.blocked ? "Unblock" : "Block"}
                    </button>
                )}
                
            </form>
        </>
    );
}
