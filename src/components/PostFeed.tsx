import { auth } from '@clerk/nextjs/server';
import Posts from './post/Posts';
import { db } from '../../utils/dbConfig';
import { comments, followers, likes, posts, users } from '../../utils/schema';
import { desc, eq, inArray } from 'drizzle-orm';

import { Post } from '@/lib/types';

type PostsFeedProps = {
  username: string;
};

const fetchPosts = async (condition: any): Promise<{ [key: number]: Post }> => {
  const rawPostsFeed = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .where(condition)
    .orderBy(desc(posts.createdAt));

  return rawPostsFeed.reduce((groupedPosts: { [key: number]: Post }, rawPost: any) => {
    const postId = rawPost.Post.id;

    if (!groupedPosts[postId]) {
      groupedPosts[postId] = {
        id: rawPost.Post.id,
        userId: rawPost.Post.userId,
        img: rawPost.Post.img,
        description: rawPost.Post.description,
        createdAt: rawPost.Post.createdAt,
        updatedAt: rawPost.Post.updatedAt,
        user: {
          id: rawPost.User.id,
          username: rawPost.User.username,
          avatar: rawPost.User.avatar,
          cover: rawPost.User.cover,
          f_name: rawPost.User.f_name,
          l_name: rawPost.User.l_name,
          description: rawPost.User.description,
          city: rawPost.User.city,
          school: rawPost.User.school,
          work: rawPost.User.work,
          website: rawPost.User.website,
          createdAt: rawPost.User.createdAt,
        },
        comments: [],
        likes: [],
      };
    }

    const commentIdSet = new Set(groupedPosts[postId].comments.map(comment => comment.id));
    const likeIdSet = new Set(groupedPosts[postId].likes.map(like => like.id));

    if (rawPost.Comment && !commentIdSet.has(rawPost.Comment.id)) {
      groupedPosts[postId].comments.push({
        id: rawPost.Comment.id,
        postId: rawPost.Comment.postId,
        userId: rawPost.Comment.userId,
        description: rawPost.Comment.description,
        createdAt: rawPost.Comment.createdAt,
      });
    }

    if (rawPost.Like && !likeIdSet.has(rawPost.Like.id)) {
      groupedPosts[postId].likes.push({
        id: rawPost.Like.id,
        postId: rawPost.Like.postId,
        userId: rawPost.Like.userId,
        createdAt: rawPost.Like.createdAt,
      });
    }
    
    return groupedPosts;
  }, {});
};

export default async function PostFeed({ username }: PostsFeedProps) {
  const { userId } = auth();
  if (!userId) return null;

  let postsFeed: Post[] = [];

  try {
    if (username != 'false') {
      postsFeed = Object.values(await fetchPosts(eq(users.username, username)));
    } else {
      const people = await db.query.followers.findMany({
        where: eq(followers.followerId, userId),
      });

      const peopleIds = people.map(person => person.followingId).filter(id => id !== null);

      // Add the current user's ID to the array
      peopleIds.push(userId);

      postsFeed = Object.values(await fetchPosts(inArray(posts.userId, peopleIds)));
    }
  } catch (e) {
    console.error("Error fetching posts:", e);
  }

  return (
    <div className=' flex flex-col gap-12'>
      {postsFeed.reverse().length > 0 ? (
        postsFeed.map((post) => (
          <Posts key={String(post.id)} post={post} />
        ))
      ) : (
        <h1 className='text-xs text-slate-500 self-center h-screen'>No posts available</h1>
      )}
    </div>
  );
}
