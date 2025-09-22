import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import styled from 'styled-components';
import { GRAY, MAIN, WHITE } from '../../../../../../../packages/constants/src';
import React from 'react';
import {
  MainText,
  SvgIcon,
} from '../../../../../../../packages/components/src';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${WHITE};
  border-radius: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 600px;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  width: 100%;
  flex: 1;
  background-color: ${WHITE};
`;

const IconContainer = styled.div`
  display: flex;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  background-color: ${MAIN.LIGHT};
  border-radius: 10px;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export type FunctionItemType = {
  id: string;
  title: string;
  descriptions: string[];
  image: StaticImageData | string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

type FunctionItemProps = {
  item: FunctionItemType;
};

const FunctionItem = ({ item }: FunctionItemProps) => {
  const { image, title, descriptions, icon } = item;
  return (
    <ItemContainer>
      <ImageContainer>
        <Image
          src={image}
          alt={title}
          fill
          sizes="400px"
          style={{ objectFit: 'cover' }}
          priority={false}
        />
      </ImageContainer>
      <Content>
        <IconContainer>
          <SvgIcon svg={icon} color={MAIN.DEFAULT} width={2} size={25} />
        </IconContainer>
        <MainText fontSize={24} fontWeight={700}>
          {title}
        </MainText>
        <DescriptionContainer>
          {descriptions.map((description) => (
            <MainText
              key={description}
              fontSize={16}
              color={GRAY.DARK}
              whiteSpace={'normal'}
              maxWidth={340}
              lineHeight={25}
            >
              {description}
            </MainText>
          ))}
        </DescriptionContainer>
      </Content>
    </ItemContainer>
  );
};

export default FunctionItem;
