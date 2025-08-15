"use client";
import Image from 'next/image';
import Comments from '../Comments';
import { CustomImage } from '../CostomImage'; 
import { useState, useEffect, Suspense } from 'react';
import PostInteraction from './PostInteraction';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PostInfo from './PostInfo';
import { useUser } from '@clerk/nextjs';
import { CustomVideo } from '../CustomVideo';
import { Post } from '@/lib/types';

export default function Posts({ post }: { post: Post | null }) {
    const { user } = useUser(); 
    const [avatar, setAvatar] = useState<string | null>(null);
    const [img, setImg] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (post) {
            setAvatar(post.user?.avatar || null);
            setImg(post.img);
            setUsername(post.user?.username);
            setDescription(post.description);
            setCreatedAt(post.createdAt);
        }
    }, [post]);

    if (!post) return null;
    if (!user) return null;
    
    const isVideo = img ? img.endsWith(".mp4") || img.endsWith(".webm") || img.endsWith(".ogg") : false;
    
    return (
        <div className='p-4 bg-slate-800 text-white flex flex-col gap-4 shadow-md rounded-lg'>
            {/* user */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <Link href={pathname.includes("profile") ? "" : `profile/${username}`} className='flex items-center gap-2'>
                        <Image src={avatar || "/noAvatar.png"} alt='' width={40} height={40} className='w-10 h-10 object-cover rounded-full' />
                        <span className='font-medium text-red-600 hover:text-red-400'>{post.user.f_name && post.user.l_name ? `${post.user.f_name} ${post.user.l_name}` : username}</span>
                    </Link>
                </div>
                {user.id === post.userId && <PostInfo postId={post.id} />}
            </div>
            {/* desc */}
            <div className='flex flex-col gap-2'>
                {img && (
                    <div className='w-full min-h-96 relative'>
                        {isVideo ? (
                            <CustomVideo
                                src={img || ""}
                                alt="post video"
                                
                            />
                        ) : (
                            <CustomImage
                                src={img || ""}
                                alt="post image"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 600px"
                                isPortrait={false}
                            />
                        )}
                    </div>
                )}
                <p className='font-bold'>{description}</p>
            </div>
            {/* interaction */}
            <Suspense fallback="loading">
                <PostInteraction initialLikes={post.likes} initialComments={post.comments} postId={post.id} />
                <Comments postId={post.id} />
            </Suspense>
        </div>
    );
}
