import styled from 'styled-components';
import { useI18n } from '../../../../../locales/client';
import { GRAY } from '@/constants/styles/color';
import MemberProfile from '@/components/atoms/member/member-profile';
import { Member } from '@/models/member/member';

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};

  &:last-child {
    border-bottom: none;
  }
`;

type PermissionManagerItemProps = {
  manager: Member;
};

const PermissionManagerItem = ({ manager }: PermissionManagerItemProps) => {
  const t = useI18n();

  return (
    <ItemContainer>
      <MemberProfile member={manager} />
    </ItemContainer>
  );
};

export default PermissionManagerItem;
