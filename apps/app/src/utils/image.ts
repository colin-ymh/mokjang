import { Area } from 'react-easy-crop';

/**
 * 이미지 파일 유형 검사
 * @param file
 */
export const getIsAllowedImageType = (file: File) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  return ALLOWED_TYPES.includes(file.type);
};

/**
 * 이미지 파일 크기 검사
 * @param file
 */
export const getIsAllowedImageSize = (file: File) => {
  const MAX_SIZE_MB = 5; // 최대 5MB

  return file.size < MAX_SIZE_MB * 1024 * 1024;
};

/**
 * crop 정보를 토대로 크롭된 File 객체를 반환
 * @param imageFile 크롭할 이미지 파일
 * @param croppedAreaPixels react easy crop 으로 크롭한 정보
 */
export const getCroppedImageFile = async (
  imageFile: File,
  croppedAreaPixels: Area
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    image.onload = () => {
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Canvas를 Blob으로 변환 후 File 객체 생성
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], imageFile.name, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          } else {
            reject(new Error('Failed to create cropped image'));
          }
        },
        'image/webp',
        0.9
      );
    };

    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = URL.createObjectURL(imageFile); // base64 대신 Object URL 사용
  });
};

/**
 * File 객체를 미리보기용 Object URL로 변환
 * @param file 이미지 파일
 */
export const getPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Object URL 메모리 해제
 * @param url Object URL
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/** File/Blob → data URL(base64) */
export const fileToDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result)); // "data:image/...;base64,...."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
