import Image from 'next/image';
import Link from 'next/link';
import { db } from '../../../utils/dbConfig';
import { posts } from '../../../utils/schema';
import { and, desc, eq, isNotNull } from 'drizzle-orm';

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

export default async function UserMediaCard({ user }: { user?: UserType[] }) {
    if (!user || user.length === 0) return null;

    const postWithMedia = await db.query.posts.findMany({
        where: and(
            isNotNull(posts.img),
            eq(posts.userId, user[0]?.id)
        ),
        orderBy: [desc(posts.createdAt)],
        limit: 8,
    });

    if (postWithMedia.length === 0) return null;
    

    return (
        <div className='p-4 bg-slate-800 rounded-lg shadow-md text-sm flex flex-col gap-4'>
            {/* toppart */}
            <div className='flex justify-between items-center font-medium'>
                <span className='text-gray-300'>User Media</span>
                <Link href='/' className='text-red-500 text-xs'>See all</Link>
            </div>
            {/* bottom */}
            <div className='flex gap-4 justify-between flex-wrap'>
                {postWithMedia.map((post) => (
                    post.img && post.img.trim() !== "" && !/mp4|video/i.test(post.img) ? (
                        <div className='relative w-1/5 h-24' key={post.id}>
                            <Image src={post.img} alt="" fill className="object-cover rounded-md" />
                        </div>
                    ) : null
                ))}
            </div>

        </div>
    );
}
