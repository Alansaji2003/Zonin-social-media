import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { insertLike } from '@/lib/actions';


interface RequestBody {
  postId: number;
}

export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    const { postId } = (await req.json()) as RequestBody;
    
    if (!userId || !postId) {
        return NextResponse.json({ error: 'Missing userId or postId' }, { status: 400 });
    }

    try {
        await insertLike({ postId, userId });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
    }
}
