import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Cropper, { Area, Point } from 'react-easy-crop';

import { BLACK, WHITE } from '@/constants/styles/color';
import Button from '@/components/atoms/common/button/button';
import { BLANK } from '@/constants/constant';
import {
  getCroppedImage,
  getFileFromBase64,
  getResizedImage,
} from '@/utils/image';

import Delete from '../../../../public/svg/cancel.svg';
import DefaultImage from '../../../../public/png/default-member-image.png';
import { useScopedI18n } from '../../../../locales/client';

const MemberImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: all 0.3s ease;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const MemberImage = styled(Image)<{ $width: number; $height: number }>`
  border-radius: 20%;
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
`;

const DeleteButton = styled(Delete)<{ opacity: number }>`
  margin-left: 10px;
  stroke: ${WHITE};
  stroke-width: 2px;
  background-color: ${BLACK};
  border-radius: 30px;
  transition: all 0.3s ease;
  opacity: ${({ opacity }) => opacity};
  cursor: pointer;
`;

const ImageInput = styled.input`
  display: none;
`;

const CropperContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ButtonContainer = styled.div`
  display: flex;
  z-index: 20;
  position: absolute;
  bottom: 20%;
  width: 60%;
  height: 50px;
`;

type MemberImageInputProps = {
  value: string;
  onChange: (image: string) => void;
  width?: number;
  height?: number;
};

/* 이미지 기본값 110*110px */
const MemberImageInput = ({
  value,
  onChange,
  width = 90,
  height = 90,
}: MemberImageInputProps) => {
  const t_button = useScopedI18n('button');

  // 크롭하기 전 이미지
  const [image, setImage] = useState<string>(value);

  // 크롭된 최종 이미지
  const [croppedImage, setCroppedImage] = useState<string>(BLANK);

  // 크롭 모달 on/off
  const [isCropOpen, setIsCropOpen] = useState<boolean>(false);

  // 크롭에 사용되는 state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  // 최종 크롭값
  const [croppedArea, setCroppedArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // 새신자 이미지 선택 시, file input 불러오기
  const onClickMemberImage = () => {
    // 드라이브, 갤러리에서 이미지를 불러오기
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  // 이미지 파일을 불러오는 함수
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 드라이브, 갤러리에서 불러온 이미지
    const file = event.target.files ? event.target.files[0] : null;

    // 파일을 성공적으로 불러온 경우
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        // 해당 이미지의 url (base64 string)
        const dataURL = reader.result;

        if (typeof dataURL === 'string') {
          // url 을 파일 형식으로 변경
          const imageFile = getFileFromBase64(dataURL, 'test');
          // 이미지 품질 낮추기
          const resizedImageFile = await getResizedImage(imageFile, 300, 300);

          // 품질을 낮춘 이미지를 저장 => crop 모달로 전달
          setImage(resizedImageFile);
          // 크롭 모달 열기
          setIsCropOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 크롭 상태가 변할 때마다 실행되는 함수
  // 마지막으로 설정한 크롭값을 저장
  const onCropComplete = (
    croppedAreaPercentages: Area,
    croppedAreaPixels: Area
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  // 크롭값 저장하기 버튼 (크롭을 그만하겠다, 최종 저장하겠다)
  // 크롭 모달을 닫고, 해당 크롭값을 저장
  const onClickCropButton = async () => {
    const newImage = await getCroppedImage(image, croppedArea);
    setCroppedImage(newImage);

    setIsCropOpen(false);
  };

  // 이미지 삭제
  const onClickDeleteButton = () => {
    setImage(BLANK);
    setCroppedImage(BLANK);
  };

  // 이미지를 성공적으로 크롭한 경우, 외부 onChange 에 전달
  useEffect(() => {
    onChange(croppedImage);
  }, [croppedImage]);

  return (
    <MemberImageInputContainer>
      <ImageContainer>
        {/* 실제 이미지가 들어가고, 사용자에게 보여지는 부분*/}
        <MemberImage
          src={croppedImage || DefaultImage}
          alt="member profile image"
          $width={width}
          $height={height}
          onClick={onClickMemberImage}
        />
        {/* 이미지 삭제 버튼 */}
        <DeleteButton
          opacity={croppedImage ? 1 : 0}
          onClick={onClickDeleteButton}
        />
        {/* 이미지 파일을 불러오는 모달 */}
        <ImageInput
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onChangeImage}
        />
      </ImageContainer>

      {/* 이미지 크롭 모달 */}
      {isCropOpen && (
        <CropperContainer>
          {/* 크롭하는 부분*/}
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          {/* 크롭 상태를 저장하는 버튼 */}
          <ButtonContainer>
            <Button text={t_button('save')} onClick={onClickCropButton} />
          </ButtonContainer>
        </CropperContainer>
      )}
    </MemberImageInputContainer>
  );
};

export default MemberImageInput;
