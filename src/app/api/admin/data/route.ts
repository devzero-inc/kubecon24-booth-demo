import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('kubecon-booth');
    const submissions = await db.collection('demo-submissions').find({}).toArray();

    const submissionsWithImages = await Promise.all(
      submissions.map(async (submission) => {
        if (submission.imageKey) {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: submission.imageKey,
          });
          const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
          return { ...submission, imageUrl: signedUrl };
        }
        return submission;
      })
    );

    return NextResponse.json(submissionsWithImages);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}