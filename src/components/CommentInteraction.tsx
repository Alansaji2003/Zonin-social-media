"use client";
import { addComment } from '@/lib/actions';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { FormEvent, useState, useEffect } from 'react';
import { AiFillLike } from 'react-icons/ai';

export type Comment = {
    postId: number;
    id: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    likes: {
        postId: number | null;
        id: number;
        createdAt: Date;
        userId: string;
        commentId: number | null;
    }[];
    user: {
        id: string;
        username: string;
        avatar: string | null,
        f_name: string | null,
        l_name: string | null,
    };
};

function CommentInteraction({ Comments, postId }: { Comments: Comment[], postId: number }) {
    const { user } = useUser();
    const [commentState, setCommentState] = useState<Comment[]>([]);

    useEffect(() => {
    
        setCommentState(Comments);
    }, [Comments]);

    const [description, setDescription] = useState<{ [key: number]: string }>({});

    const handleSubmit = async (e: FormEvent, postId: number) => {
        e.preventDefault();
        if (!description[postId]?.trim()) return;

        try {
            await addComment(postId, description[postId]);

            const newComment: Comment = {
                postId,
                id: Date.now(),  // Temporary id for the new comment
                description: description[postId],
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: user!.id,
                likes: [],
                user: {
                    id: user!.id,
                    username: user!.username || 'Unknown User',
                    avatar: user!.imageUrl,
                    f_name: user!.firstName || null,
                    l_name: user!.lastName || null,
                },
            };

            setCommentState(prevState => [...prevState, newComment]);
            setDescription({ ...description, [postId]: "" });
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };



    return (
        <>
            <div>
                {user && (
                    <div className='flex items-center gap-4 ' >
                        <Image alt='' src={user?.imageUrl || "/noAvatar.png"} width={32} height={32} className='w-8 h-8 rounded-full' />
                        <form onSubmit={(e) => handleSubmit(e, postId)} className='flex-1 flex items-center justify-between bg-slate-700 rounded-xl text-sm px-6 py-2 w-full'>
                            <input
                                type='text'
                                placeholder='Write a comment'
                                className='bg-transparent outline-none flex-1'
                                value={description[postId] || ""}
                                onChange={e => setDescription({ ...description, [postId]: e.target.value })}
                            />
                            <button type="submit" className='cursor-pointer bg-red-500 rounded-lg text-slate-200 p-2'>
                                send
                            </button>
                        </form>
                    </div>
                )}

                <div className=''>
                    {commentState.map((comment) => (
                        <div key={comment.id} className='flex gap-4 justify-between mt-6'>
                            <Image alt='' src={comment.user.avatar || "/noAvatar.png"} width={40} height={40} className='w-10 h-10 rounded-full' />
                            <div className='flex flex-col gap-2 flex-1'>
                                <span className='font-medium'>
                                    {comment.user.f_name && comment.user.l_name ? `${comment.user.f_name} ${comment.user.l_name}` : comment.user.username}
                                </span>
                                <p>{comment.description}</p>
                                <div className='flex items-center gap-8 text-xs text-gray-500'>
                                    <div className='flex items-center gap-4'>
                                        <AiFillLike />
                                    </div>
                                    <span className='text-gray-300'>|</span>
                                    <span className='text-gray-500'>{comment.likes.length} likes</span>
                                </div>
                            </div>
                            <Image src='/more.png' alt='' width={16} height={16} className='cursor-pointer w-4 h-4' />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CommentInteraction;
