import axios from 'axios';

interface FileInfo {
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  finalUrl: string;
}

/**
 * Presigned URL을 사용하여 S3에 파일들을 직접 업로드
 * @param files 업로드할 파일 배열
 */
export const uploadFiles = async (files: File[]): Promise<string[]> => {
  try {
    // 1단계: 파일 정보 준비
    const fileInfos: FileInfo[] = files.map((file) => ({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }));

    // 2단계: Presigned URL 요청
    const response = await axios.post('/api/upload', {
      files: fileInfos,
    });

    const { presignedUrls }: { presignedUrls: PresignedUrlResponse[] } =
      response.data;

    // 3단계: 각 파일을 presigned URL로 직접 업로드
    const uploadPromises = files.map(async (file, index) => {
      const { presignedUrl, finalUrl } = presignedUrls[index];

      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      return finalUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    console.error('파일 업로드 에러:', error);
    throw error;
  }
};
