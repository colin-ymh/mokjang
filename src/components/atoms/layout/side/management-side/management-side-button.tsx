import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import { usePageRouter } from '@/utils/router';

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

const ManagementSideButton = ({ id, title }: SideBarButtonProps) => {
  const slug = useParams().slug as string[] | undefined;
  const headerId = slug?.[1] ?? null;

  const router = usePageRouter();

  const onClick = (id: string) => {
    switch (id) {
      case MANAGEMENT_HEADER_ID.CHURCH:
        router.push(`/management/church/group`);
        return;
      case MANAGEMENT_HEADER_ID.ADMINISTRATOR:
        router.push(`/management/administrator/setting`);
        return;
      default:
        router.push(`/management/${id}`);
    }
  };

  return (
    <ButtonContainer onClick={() => onClick(id)}>
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

export default ManagementSideButton;
