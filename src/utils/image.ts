import Resizer from 'react-image-file-resizer';
import { Area } from 'react-easy-crop';

import profile1 from '../../public/png/profile1.png';
import profile2 from '../../public/png/profile2.png';
import profile3 from '../../public/png/profile3.png';
import profile4 from '../../public/png/profile4.png';
import profile5 from '../../public/png/profile5.png';

/**
 * 이미지 크기를 조정하고 Base64 문자열로 반환
 * @param imageFile 조정하고자 하는 이미지 파일
 * @param width 목표 width
 * @param height 목표 height
 */
export const getResizedImage = async (
  imageFile: File,
  width: number,
  height: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      imageFile,
      width,
      height,
      'WEBP',
      100,
      0,
      (uri) => {
        if (typeof uri === 'string') {
          resolve(uri);
        } else {
          reject(new Error('Failed to resize image.'));
        }
      },
      'base64'
    );
  });
};

/**
 * base64 형식의 이미지를 이미지 파일로 변환
 * @param base64
 * @param fileName 반환될 이미지 파일명
 */
export const getFileFromBase64 = (base64: string, fileName: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'; // 기본값: "image/png"
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};

/**
 * image file 을 base64 string 으로 변경
 * @param file 이미지 파일
 * @return base64 string
 */
export const getBase64FromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 파일 읽기 완료 시 호출
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error('Failed to convert File to Base64'));
      }
    };

    // 파일 읽기 시작
    reader.readAsDataURL(file);
  });
};

/**
 * crop 정보를 토대로 크롭된 image 를 반환
 * @param targetImage 크롭할 이미지
 * @param croppedAreaPixels react easy crop 으로 크롭한 정보
 */
export const getCroppedImage = async (
  targetImage: string,
  croppedAreaPixels: Area
): Promise<string> => {
  const image = new Image();
  image.src = targetImage;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // croppedAreaPixels 에 canvas 맞춤 세팅
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // 크롭 정보를 통해 이미지 조절
      ctx.drawImage(
        image,
        croppedAreaPixels.x, // 기존 소스의 x
        croppedAreaPixels.y, // 기존 소스의 y
        croppedAreaPixels.width, // 기존 소스의 width
        croppedAreaPixels.height, // 기존 소스의 height
        0, // 크롭 목적 x
        0, // 크롭 목적 y
        croppedAreaPixels.width, // 크롭 목적 width
        croppedAreaPixels.height // 크롭 목적 height
      );

      // base64 string으로 변경
      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
};

const images = [profile1, profile2, profile3, profile4, profile5];
/**
 * FGT 를 위한 랜덤 기본 이미지 제공
 */
export const getRandomImage = (id: string) => {
  const random = parseInt(id) % 5;

  return images[random];
};
