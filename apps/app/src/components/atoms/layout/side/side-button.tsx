import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN, MEDIA_MIN_WIDTH } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';
import React from 'react';
import { SvgIcon } from '@mokjang/components';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  height: 30px;
  gap: 10px;
  border-radius: 5px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${MAIN.EXTRA_LIGHT};
  }
`;

type SideButtonProps = {
  id: string;
  title: string;
  onClick: () => void;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const SideButton = ({ id, title, onClick, icon }: SideButtonProps) => {
  const slug = useParams().slug as string[] | undefined;
  const headerId = slug?.[1] ?? null;

  return (
    <ButtonContainer
      onClick={() => {
        onClick();

        setTimeout(() => {
          // 모바일에서 사이드 접기
          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
            localStorage.setItem('isSideShown', 'false');
            // 같은 탭에서는 storage 이벤트가 발생하지 않으므로 직접 dispatch 이벤트를 트리거
            window.dispatchEvent(new Event('storage'));
          }
        }, 300);
      }}
    >
      <SvgIcon
        svg={icon}
        color={id === headerId ? GRAY.DARK : GRAY.DEFAULT}
        size={18}
        width={2}
      />
      <MainText
        size={SIZE.LARGE}
        fontWeight={600}
        color={id === headerId ? GRAY.DARK : GRAY.DEFAULT}
      >
        {title}
      </MainText>
    </ButtonContainer>
  );
};

export default SideButton;
