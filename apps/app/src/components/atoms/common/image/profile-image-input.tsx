'use client';

import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Area, Point } from 'react-easy-crop';
import {
  getCroppedImageFile,
  getIsAllowedImageSize,
  getPreviewUrl,
  revokePreviewUrl,
} from '@/utils/image';
import { BLANK, DESTRUCTIVE } from '@mokjang/constants';
import ProfileImageInputView from './profile-image-input.view';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';

type ProfileImageInputProps = {
  value: string; // 업로드된 CloudFront URL
  onChange: (image: File | null | undefined, thumb?: string) => void; // CloudFront URL 전달
  width?: number;
  height?: number;
};

const ProfileImageInput = ({
  value,
  onChange,
  width = 90,
  height = 90,
}: ProfileImageInputProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const t_popup = useScopedI18n('popup');

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(BLANK);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string>(BLANK);

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 350,
    height: 350,
  });

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) throw thrownError;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClickImage = () => {
    fileInputRef.current?.click();
  };

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 용량 제한 체크 (초과 시 업로드 중단)
    if (!getIsAllowedImageSize(file)) {
      // 같은 파일 다시 선택 가능하도록 초기화
      e.target.value = BLANK;
      // // 사용자 안내 (토스트/알림으로 대체 가능)
      dispatch(setToastText(t_popup('imageSize')));
      dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      dispatch(setIsToastShown(true));
      return;
    }

    // 기존 미리보기 URL 정리
    if (previewUrl) revokePreviewUrl(previewUrl);

    // 새 미리보기 준비 후 모달 오픈 (이미지 없는 상태에서 모달 열면 Cropper가 에러낼 수 있어요)
    const newUrl = getPreviewUrl(file);
    setOriginalFile(file);
    setPreviewUrl(newUrl);
    setIsOpened(true);

    // 같은 파일 다시 선택 가능하도록 초기화
    e.target.value = BLANK;
  };

  const onClickSave = async () => {
    if (!originalFile) return;
    try {
      const file = await getCroppedImageFile(originalFile, area);
      if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);
      const newUrl = getPreviewUrl(file);
      setCroppedFile(file);
      setCroppedPreviewUrl(newUrl);
      onChange(file, newUrl);
      setIsOpened(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickDelete = () => {
    if (previewUrl) revokePreviewUrl(previewUrl);
    if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);
    setOriginalFile(null);
    setCroppedFile(null);
    setPreviewUrl(BLANK);
    setCroppedPreviewUrl(BLANK);

    onChange(undefined);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) revokePreviewUrl(previewUrl);
      if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);
    };
  }, [previewUrl, croppedPreviewUrl]);

  const onCropChange = (p: Point) => setCrop(p);
  const onZoomChange = (z: number) => setZoom(z);
  const onCropComplete = (_: Area, pixels: Area) => setArea(pixels);
  const onChangeSlider = (e: ChangeEvent<HTMLInputElement>) =>
    setZoom(+e.target.value);

  const props = {
    value,
    crop,
    zoom,
    isOpened,
    setIsOpened,
    previewUrl,
    croppedPreviewUrl,
    onChangeFile,
    originalFile,
    onClickImage,
    croppedFile,
    onClickDelete,
    onClickClose: () => setIsOpened(false),
    onCropChange,
    onZoomChange,
    onCropComplete,
    onChangeSlider,
    onClickSave,
    width,
    height,
    inputRef: fileInputRef,
  };

  return <ProfileImageInputView {...props} />;
};

export default ProfileImageInput;
