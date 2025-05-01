import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { BLACK, GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { usePageRouter } from '@/utils/router';
import { MAIN_HEADER_ID } from '@/constants/layout/header';

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px 10px;
  height: 30px;
  border-radius: 5px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

type SideBarButtonProps = {
  id: string;
  title: string;
};

const MainSideButton = ({ id, title }: SideBarButtonProps) => {
  const slug = useParams().slug as string[] | undefined;
  const headerId = slug?.[1] ?? null;

  const router = usePageRouter();

  const onClick = (id: string) => {
    switch (id) {
      case MAIN_HEADER_ID.HOME:
        router.push(`admin/main/home`);
        return;
      case MAIN_HEADER_ID.MEMBER:
        router.push(`admin/main/member/all`);
        return;
      case MAIN_HEADER_ID.VISITATION:
        router.push(`admin/main/visitation/all`);
        return;
      case MAIN_HEADER_ID.EDUCATION:
        router.push(`admin/main/education/all`);
        return;
      default:
        router.push(`admin/main/${id}`);
    }
  };

  return (
    <ButtonContainer onClick={() => onClick(id)}>
      <MainText
        size={SIZE.LARGE}
        fontWeight={600}
        color={id === headerId ? BLACK : GRAY.DARK}
      >
        {title}
      </MainText>
    </ButtonContainer>
  );
};

export default MainSideButton;
