'use client';

import React, { ChangeEvent, forwardRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Cropper, { Area, Point } from 'react-easy-crop';
import Button from '@/components/atoms/common/button/button';

import { BLACK, GRAY, WHITE } from '@/constants/styles/color';
import {
  getCroppedImage,
  getFileFromBase64,
  getRandomImage,
  getResizedImage,
} from '@/utils/image';
import { BLANK } from '@/constants/constant';

import DeleteSvg from '../../../../../public/svg/cancel.svg';
import { useScopedI18n } from '../../../../../locales/client';
import TransparentBackground from '@/components/atoms/common/etc/transparent-background';

/* --------------------------- styled --------------------------- */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ThumbBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Thumb = styled(Image)`
  border-radius: 12px;
  object-fit: cover;
  cursor: pointer;
  background: ${GRAY.LIGHT};
`;

const DeleteBtn = styled(DeleteSvg)<{ $visible: boolean }>`
  width: 20px;
  height: 20px;
  stroke: ${WHITE};
  stroke-width: 2px;
  background: ${BLACK};
  border-radius: 50%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  cursor: pointer;
`;

const FileSelector = styled.input`
  display: none;
`;

const CropBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column;
  background-color: ${WHITE};
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  gap: 10px;
`;

const CropArea = styled.div`
  position: relative;
  display: flex;
  width: 250px;
  height: 250px;
`;

const SliderBox = styled.input.attrs({
  type: 'range',
  min: 1,
  max: 3,
  step: 0.1,
})`
  display: flex;
  width: 100%;
`;

const ButtonContainer = styled.div`
  bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

/* --------------------------- component --------------------------- */
type Props = {
  memberId: string;
  value: string;
  onChange: (img: string) => void;
  width?: number;
  height?: number;
};

const ProfileImageInput = forwardRef<HTMLDivElement, Props>(
  ({ memberId, value, onChange, width = 90, height = 90 }, _ref) => {
    const t = useScopedI18n('button');
    // 사용자가 업로드한 이미지
    const [baseImg, setBaseImg] = useState<string>(value);

    // 크롭된 이미지
    const [cropped, setCropped] = useState<string>(BLANK);

    /* 이미지 크롭을 위한 상태값들 */
    // 모달 활성화 여부
    const [isOpened, setIsOpened] = useState(false);
    // 크롭 위치
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    // 확대 정도
    const [zoom, setZoom] = useState(1);
    // 크롭 예상 정보
    const [area, setArea] = useState<Area>({
      x: 0,
      y: 0,
      width: 350,
      height: 350,
    });

    // 사진 파일 불러오기
    const onClickThumb = () =>
      document.getElementById('member-img-input')?.click();

    // 파일 선택 후 이벤트
    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        // 사진을 base64로 변경
        const imgFile = getFileFromBase64(dataUrl, 'img');
        // 크기 줄이기
        const resized = await getResizedImage(imgFile, 400, 400);

        // 사용자가 업로드한 이미지 변경
        setBaseImg(resized);
        // 크롭 모달 열기
        setIsOpened(true);

        e.target.value = ''; // ★ 같은 파일도 다시 선택 가능하게 초기화
      };
      reader.readAsDataURL(file);
    };

    // 크롭 완료
    const onClickSave = async () => {
      const result = await getCroppedImage(baseImg, area);

      setCropped(result);
      setIsOpened(false);
    };

    // 이미지 삭제
    const onClickDelete = () => {
      setBaseImg(BLANK);
      setCropped(BLANK);
      onChange(BLANK);
    };

    useEffect(() => {
      if (cropped) onChange(cropped);
    }, [cropped]);

    return (
      <Wrapper>
        {/* 사용자에게 표시되는 부분 (썸네일) */}
        <ThumbBox>
          <Thumb
            src={cropped || getRandomImage(memberId)}
            alt="profile"
            width={width}
            height={height}
            onClick={onClickThumb}
          />
          <DeleteBtn $visible={!!cropped} onClick={onClickDelete} />
          <FileSelector
            id="member-img-input"
            type="file"
            accept="image/*"
            onChange={onChangeFile}
          />
        </ThumbBox>

        {/* 크롭 모달 */}
        {isOpened && (
          <>
            <TransparentBackground
              isOpened={isOpened}
              onClick={() => setIsOpened(false)}
              blur={true}
            />
            <CropBox onClick={(e) => e.stopPropagation()}>
              <CropArea>
                <Cropper
                  image={baseImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  showGrid={false}
                  cropSize={{ width: 200, height: 200 }}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => setArea(pixels)}
                />
              </CropArea>

              <SliderBox
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
              />

              <ButtonContainer>
                <Button
                  text={t('cancel')}
                  onClick={() => setIsOpened(false)}
                  height={30}
                  width={120}
                  backgroundColor={WHITE}
                  color={GRAY.DEFAULT}
                  borderColor={GRAY.LIGHT}
                />
                <Button
                  text={t('save')}
                  onClick={onClickSave}
                  height={30}
                  width={120}
                />
              </ButtonContainer>
            </CropBox>
          </>
        )}
      </Wrapper>
    );
  }
);

ProfileImageInput.displayName = 'ProfileImageInput';
export default ProfileImageInput;
