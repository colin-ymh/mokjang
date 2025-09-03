'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { Area, Point } from 'react-easy-crop';
import {
  getCroppedImageFile,
  getIsAllowedImageSize,
  getIsAllowedImageType,
  getPreviewUrl,
  getResizedImageFile,
  revokePreviewUrl,
} from '@/utils/image';
import { BLANK } from '@mokjang/constants';
import ProfileImageInputView from './profile-image-input.view';

type ProfileImageInputProps = {
  value: string; // 업로드된 CloudFront URL
  onChange: (image: File | null) => void; // CloudFront URL 전달
  width?: number;
  height?: number;
};

const ProfileImageInput = ({
  value,
  onChange,
  width = 90,
  height = 90,
}: ProfileImageInputProps) => {
  // 원본 파일 (크롭 전)
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  // 크롭된 파일
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  // 미리보기 URL 들
  const [previewUrl, setPreviewUrl] = useState<string>(BLANK);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string>(BLANK);

  // 크롭 관련 상태들
  const [isOpened, setIsOpened] = useState(false);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 350,
    height: 350,
  });

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 파일 선택 후 이벤트
  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!getIsAllowedImageType(file)) {
      setThrownError(new Error('지원하지 않는 파일 형식입니다.'));
    }
    if (!getIsAllowedImageSize(file)) {
      setThrownError(new Error('파일 용량은 5MB까지 허용됩니다.'));
    }

    try {
      // 이미지 크기 조정 (File 객체로 직접 처리)
      const resizedFile = await getResizedImageFile(file, 400, 400);

      // 기존 미리보기 URL 해제
      if (previewUrl) revokePreviewUrl(previewUrl);

      // 새 미리보기 URL 생성
      const newPreviewUrl = getPreviewUrl(resizedFile);

      setOriginalFile(resizedFile);
      setPreviewUrl(newPreviewUrl);
      setIsOpened(true);

      e.target.value = BLANK;
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 크롭 완료 및 업로드
  const onClickSave = async () => {
    if (!originalFile) return;

    try {
      // 크롭된 파일 생성 (File 객체)
      const croppedFile = await getCroppedImageFile(originalFile, area);

      // 기존 크롭 미리보기 URL 해제
      if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);

      // 새 크롭 미리보기 URL 생성
      const newCroppedPreviewUrl = getPreviewUrl(croppedFile);

      setCroppedFile(croppedFile);
      setCroppedPreviewUrl(newCroppedPreviewUrl);

      onChange(croppedFile);
      setIsOpened(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 이미지 삭제
  const onClickDelete = () => {
    // 메모리 해제
    if (previewUrl) revokePreviewUrl(previewUrl);
    if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);

    setOriginalFile(null);
    setCroppedFile(null);
    setPreviewUrl(BLANK);
    setCroppedPreviewUrl(BLANK);
    onChange(null);
  };

  // 컴포넌트 언마운트 시 메모리 해제
  useEffect(() => {
    return () => {
      if (previewUrl) revokePreviewUrl(previewUrl);
      if (croppedPreviewUrl) revokePreviewUrl(croppedPreviewUrl);
    };
  }, [previewUrl, croppedPreviewUrl]);

  const onClickImage = () =>
    document.getElementById('member-img-input')?.click();

  const onClickClose = () => {
    setIsOpened(false);
  };

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (area: number) => {
    setZoom(area);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setArea(croppedAreaPixels);
  };

  const onChangeSlider = (event: ChangeEvent<HTMLInputElement>) => {
    setZoom(+event.target.value);
  };

  const props = {
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
  };

  return <ProfileImageInputView {...props} />;
};

export default ProfileImageInput;
