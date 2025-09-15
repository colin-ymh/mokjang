import Image from 'next/image';
import EmptyListImage from '../../../../../public/png/empty-list.png';
import styled from 'styled-components';

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

type EmptyListProps = {
  width?: number;
  height?: number;
};

const EmptyList = ({ width = 150, height = 150 }: EmptyListProps) => {
  return (
    <ImageContainer>
      <Image
        src={EmptyListImage}
        alt={'emptyList'}
        width={width}
        height={height}
      />
    </ImageContainer>
  );
};

export default EmptyList;
