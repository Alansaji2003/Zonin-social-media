
export type User = {
  id: string;
  username: string;
  avatar?: string | null;
  cover?: string | null;
  description?: string | null;
  f_name: string | null;
  l_name: string | null;
  city?: string | null;
  work?: string | null;
  school?: string | null;
  website?: string | null;
  createdAt: Date | null;
};

export type Post = {
  id: number;
  userId: string;
  img: string | null;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  user: User;
  comments: Comment[];
  likes: Like[];
};

export type Comment = {
  id: number;
  postId: number;
  userId: string;
  description: string;
  createdAt: Date;
  user?: User;
  likes?: Like[];
};

export type Like = {
  id: number;
  postId?: number | null;
  commentId?: number | null;
  userId: string;
  createdAt: Date;
};

export type StoryWithUser = {
  id: number;
  img: string | null;
  createdAt: Date | null;
  expiresAt: Date | null;
  userId: string;
  user: User;
};

export type FollowRequest = {
  id: number;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  sender: User;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type FormState = {
  success: boolean;
  error: boolean;
  message?: string;
};