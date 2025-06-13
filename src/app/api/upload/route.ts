import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const Bucket = process.env.AMPLIFY_BUCKET;
const CLOUDFRONT_URL = 'https://d3rowf2cf035m4.cloudfront.net';

// S3 클라이언트 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

interface FileInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 검증
    if (
      !process.env.AWS_REGION ||
      !process.env.AMPLIFY_BUCKET ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ) {
      return NextResponse.json(
        { error: '필수 환경 변수가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const { files }: { files: FileInfo[] } = await request.json();

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일 정보가 없습니다.' },
        { status: 400 }
      );
    }

    // 각 파일에 대한 presigned URL 생성
    const presignedUrls = await Promise.all(
      files.map(async (fileInfo) => {
        // 파일명에 타임스탬프 추가하여 중복 방지
        const timestamp = Date.now();
        const Key = `${timestamp}-${fileInfo.fileName}`;

        const command = new PutObjectCommand({
          Bucket,
          Key,
          ContentType: fileInfo.fileType,
        });

        // 60s 동안 유효한 presigned URL 생성
        const presignedUrl = await getSignedUrl(s3, command, {
          expiresIn: 60,
        });

        return {
          presignedUrl,
          key: Key,
          finalUrl: `${CLOUDFRONT_URL}/${Key}`,
        };
      })
    );

    return NextResponse.json({
      success: true,
      presignedUrls,
    });
  } catch (error) {
    console.error('Presigned URL 생성 에러:', error);
    return NextResponse.json(
      {
        error: 'Presigned URL 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
