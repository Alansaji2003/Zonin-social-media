"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { FaUserCheck } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { acceptFollowRequest, declineFollowRequest } from '@/lib/actions';

function FriendRequestList({ requests }: { requests: any }) {
  const [requestState, setRequestState] = useState(requests);

  if (requestState.length === 0) return null;

  const handleAccept = async (userId: string) => {
    try {
      await acceptFollowRequest(userId);
      setRequestState((prevRequests: any) => prevRequests.filter((request: any) => request.sender.id !== userId));
    } catch (e) {
      console.log("Failed to accept follow request", e);
    }
  };

  const handleDecline = async (userId: string) => {
    try {
      await declineFollowRequest(userId);
      setRequestState((prevRequests: any) => prevRequests.filter((request: any) => request.sender.id !== userId));
    } catch (e) {
      console.log("Failed to decline follow request", e);
    }
  };

  return (
    <div>
      {requestState.map((request: any) => (
        <div key={request.id} className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <Image src={request.sender.avatar} alt='' width={40} height={40} className='w-10 h-10 rounded-full object-cover' />
            <span className='font-semibold'>{request.sender.username}</span>
          </div>
          <div className='flex gap-3 justify-end'>
            <FaUserCheck className='text-lg text-green-600 cursor-pointer' onClick={() => handleAccept(request.sender.id)} />
            <IoClose className='text-lg text-red-600 cursor-pointer' onClick={() => handleDecline(request.sender.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriendRequestList;
