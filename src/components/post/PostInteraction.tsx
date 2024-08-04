import { useAuth } from '@clerk/nextjs';
import React, { useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import axios from 'axios'; // Import axios for making HTTP requests

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

function PostInteraction({ postId, initialLikes, initialComments }: { postId: number, initialLikes: LikeType[], initialComments: CommentType[] }) {
    const { isLoaded, userId } = useAuth();

    const [likeState, setLikeState] = useState({
        likesCount: initialLikes.length,
        isLiked: userId ? initialLikes.some(like => like.userId === userId) : false
    });
    const [isProcessing, setIsProcessing] = useState(false);

    const [comments, setComments] = useState(initialComments);

    const handleLike = async () => {
        if (!userId || isProcessing) return;

        setIsProcessing(true);

        // Optimistically update the UI
        setLikeState(prevState => ({
            likesCount: prevState.isLiked ? prevState.likesCount - 1 : prevState.likesCount + 1,
            isLiked: !prevState.isLiked
        }));

        try {
            if (likeState.isLiked) {
                // If already liked, dislike the post
                await axios.post('/api/dislike', { postId });
            } else {
                // If not liked, like the post
                await axios.post('/api/like', { postId });
            }
        } catch (error) {
            // Revert the UI update if the operation fails
            setLikeState(prevState => ({
                likesCount: prevState.isLiked ? prevState.likesCount + 1 : prevState.likesCount - 1,
                isLiked: !prevState.isLiked
            }));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddComment = (newComment: CommentType) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    return (
        <div>
            <div className='flex items-center justify-between text-sm my-4'>
                <div className='flex gap-3'>
                    <div className='flex items-center gap-3 bg-slate-700 p-2 rounded-xl' onClick={handleLike}>
                        {likeState.isLiked ? (<AiFillLike className='text-red-600 text-md' />) : (<AiOutlineLike className='text-red-600 text-md' />)}

                        <span className='text-gray-400'>|</span>
                        <span className='text-gray-400'>{likeState.likesCount} <span className='hidden md:inline'>Likes</span></span>
                    </div>
                    <div className='flex items-center gap-3 bg-slate-700 p-2 rounded-xl'>
                        <FaRegComment className='text-red-600 text-md' />
                        <span className='text-gray-400'>|</span>
                        <span className='text-gray-400'>{comments.length} <span className='hidden md:inline'>Comments</span></span>
                    </div>
                </div>
                <div className=''>
                    <div className='flex items-center gap-3 bg-slate-700 p-2 rounded-xl'>
                        <FaShare className='text-red-600 text-md' />
                        <span className='text-gray-400'>|</span>
                        <span className='text-gray-400'><span className='hidden md:inline'>Share</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostInteraction;
