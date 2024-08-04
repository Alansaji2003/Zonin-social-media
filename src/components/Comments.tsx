"use client";

import { useEffect, useState } from 'react';
import CommentInteraction from './CommentInteraction';
import { getComments } from '@/lib/actions';

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

export default function Comments({ postId }: { postId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        async function fetchComments() {
            try {
                const comRes = await getComments(postId);
                
                setComments(comRes);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        }

        fetchComments();
    }, [postId]);
    
    
    return (
        <>
            <CommentInteraction Comments={comments} postId={postId} />
        </>
    );
}
