'use client';

import React, { ChangeEventHandler } from 'react';
import styled from 'styled-components';
import Cropper, { Area, Point } from 'react-easy-crop';
import {
  Button,
  ProfileImage,
  TransparentBackground,
} from '@mokjang/components';

import { BLACK, GRAY, MAIN, WHITE } from '@mokjang/constants';

import { Svg } from '@mokjang/assets';
import { useScopedI18n } from '../../../../../locales/client';

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
  position: relative;
  cursor: pointer;
`;

const DeleteBtn = styled(Svg.Cancel)<{ $visible: boolean }>`
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

const CameraButton = styled.div`
  position: absolute;
  display: flex;
  width: 40px;
  height: 40px;
  background-color: ${MAIN.DEFAULT};
  justify-content: center;
  align-items: center;
  border-radius: 1000px;
  right: 30px;
  bottom: 5px;
`;

const CameraIcon = styled(Svg.Camera)`
  width: 18px;
  height: 18px;
  stroke-width: 2px;
  stroke: ${WHITE};
`;

type ProfileImageInputProps = {
  value: string;
  crop: Point;
  zoom: number;
  croppedPreviewUrl: string;
  onClickImage: () => void;
  croppedFile: File | null;
  onClickDelete: () => void;
  onChangeFile: ChangeEventHandler<HTMLInputElement>;
  isOpened: boolean;
  originalFile: File | null;
  previewUrl: string;
  width: number;
  height: number;
  onClickClose: () => void;
  onCropChange: (location: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onChangeSlider: ChangeEventHandler<HTMLInputElement>;
  onClickSave: () => void;
};

const ProfileImageInputView = ({
  value,
  crop,
  zoom,
  isOpened,
  previewUrl,
  croppedPreviewUrl,
  onChangeFile,
  originalFile,
  onClickImage,
  croppedFile,
  onClickDelete,
  onClickClose,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onChangeSlider,
  onClickSave,
  width,
  height,
}: ProfileImageInputProps) => {
  const t_button = useScopedI18n('button');
  return (
    <Wrapper>
      <ThumbBox onClick={onClickImage}>
        <ProfileImage
          value={croppedPreviewUrl || value}
          width={width}
          height={height}
          onClick={onClickImage}
          quality={100}
        />
        <DeleteBtn
          $visible={!!(croppedFile || value)}
          onClick={onClickDelete}
        />
        <FileSelector
          id="member-img-input"
          type="file"
          accept="image/*"
          onChange={onChangeFile}
        />

        <CameraButton>
          <CameraIcon />
        </CameraButton>
      </ThumbBox>

      {/* 크롭 모달 */}
      {isOpened && originalFile && (
        <>
          <TransparentBackground
            isOpened={isOpened}
            onClick={onClickClose}
            blur={true}
          />
          <CropBox onClick={(e) => e.stopPropagation()}>
            <CropArea>
              <Cropper
                image={previewUrl} // Object URL 사용
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid={false}
                cropSize={{ width: 200, height: 200 }}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropComplete}
              />
            </CropArea>

            <SliderBox value={zoom} onChange={onChangeSlider} />

            <ButtonContainer>
              <Button
                text={t_button('cancel')}
                onClick={onClickClose}
                height={30}
                width={120}
                backgroundColor={WHITE}
                color={GRAY.DEFAULT}
                borderColor={GRAY.SEMI_LIGHT}
              />
              <Button
                text={t_button('save')}
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
};

export default ProfileImageInputView;
