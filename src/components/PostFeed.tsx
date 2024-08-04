import { auth } from '@clerk/nextjs/server';
import Posts from './post/Posts';
import { db } from '../../utils/dbConfig';
import { comments, followers, likes, posts, users } from '../../utils/schema';
import { desc, eq, inArray } from 'drizzle-orm';

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

type PostsFeedProps = {
  username: string;
};

const fetchPosts = async (condition: any) => {
  const rawPostsFeed = await db
    .select()
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(likes, eq(posts.id, likes.postId))
    .leftJoin(comments, eq(posts.id, comments.postId))
    .where(condition)
    .orderBy(desc(posts.createdAt));

  return rawPostsFeed.reduce((groupedPosts: { [key: number]: PostType }, rawPost: any) => {
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

  let postsFeed: PostType[] = [];

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
    <div className='flex flex-col gap-12'>
      {postsFeed.reverse().length > 0 ? (
        postsFeed.map((post) => (
          <Posts key={String(post.id)} post={post} />
        ))
      ) : (
        <h1 className='text-xs text-slate-500 self-center'>Follow some users to see their posts</h1>
      )}
    </div>
  );
}
