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
};

type PostType = {
    id: number;
    userId: string;
    img: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    user: UserType;
    comments: CommentType[];
    likes: LikeType[];
};

type CommentType = {
    id: number;
    postId: number;
    userId: string;
    description: string;
    createdAt: Date;
};

type LikeType = {
    id: number;
    postId: number;
    userId: string;
    createdAt: Date;
};

export default function Posts({ post }: { post: PostType | null }) {
    const { user } = useUser(); // Moved outside of conditional
    const [avatar, setAvatar] = useState<string | null>(null);
    const [img, setImg] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (post) {
            setAvatar(post.user?.avatar);
            setImg(post.img);
            setUsername(post.user?.username);
            setDescription(post.description);
            setCreatedAt(post.createdAt);
        }
    }, [post]);

    if (!post) return null;
    if (!user) return null;

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
            <div className='flex flex-col gap-4'>
                {img && (
                    <div className='w-full min-h-96 relative'>
                        <CustomImage
                            src={img || ""}
                            alt="Lighthouse on cliff at seashore on sunset"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 600px"
                            isPortrait={false}
                        />
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
