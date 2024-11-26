import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";

import { MainText } from "@/components/atoms/common/text/main-text";
import { BLACK, WHITE } from "@/common/styles/color";

import Delete from "../../../../public/svg/cancel.svg";
import DefaultImage from "../../../../public/png/default-member-image.png";
import { useI18n } from "../../../../locales/client";
import { BLANK } from "@/common/default/default-value";

const MemberImageInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 10px;
  transition: all 0.3s ease;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const MemberImage = styled(Image)`
  border-radius: 10px;
  cursor: pointer; /* Makes the image clickable */
`;

const DeleteButton = styled(Delete)<{ opacity: number }>`
  stroke: ${WHITE};
  stroke-width: 2px;
  background-color: ${BLACK};
  border-radius: 30px;
  transition: all 0.3s ease;
  opacity: ${({ opacity }) => opacity};
  cursor: pointer;
`;

const ImageInput = styled.input`
  display: none; /* Hide the file input element */
`;

type MemberImageInputProps = {
  value: string;
  onChange: (image: string) => void;
};

/* 이미지 기본값 110*110px */
const MemberImageInput = ({ value, onChange }: MemberImageInputProps) => {
  const [image, setImage] = useState<string>(value);
  const t = useI18n();

  // 이미지 변경 시 이벤트
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    // 파일을 성공적으로 불러온 경우
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지를 url 형식으로 변환
        const newImage = reader.result as string;

        setImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  // 새신자 이미지 선택 시, file input 불러오기
  const onClickMemberImage = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput?.click();
  };

  // 이미지 삭제
  const handleDelete = () => {
    setImage(BLANK);
  };

  // 이미지 변경 시, 외부 onChange 에 전달
  useEffect(() => {
    onChange(image);
  }, [image]);

  return (
    <MemberImageInputContainer>
      <MainText>{t("image")}</MainText>
      <ImageContainer>
        <MemberImage
          src={image || DefaultImage}
          alt="member profile image"
          width={100}
          height={100}
          onClick={onClickMemberImage}
        />
        <DeleteButton opacity={image ? 1 : 0} onClick={handleDelete} />
        <ImageInput
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={onChangeImage}
        />
      </ImageContainer>
    </MemberImageInputContainer>
  );
};

export default MemberImageInput;
