import Image from 'next/image';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY } from '@/constants/styles/color';
import { MemberTableProps } from '@/components/molecules/member/list/member-table';
import { MainText } from '@/components/atoms/common/text/main-text';

import DefaultImage from '../../../../../public/png/default-member-image.png';
import { useI18n } from '../../../../../locales/client';

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${GRAY.LIGHT};
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  gap: 10px;
  border-bottom: 1px solid ${GRAY.LIGHT};
  height: 70px;
  cursor: pointer;
`;

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 9px;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MemberItemList = ({ onClickMemberItem }: MemberTableProps) => {
  const t = useI18n();
  const { members, memberFilter, memberOrderBy, memberOrderDirection } =
    useSelector((state: RootState) => state.memberFilter);

  return (
    <MemberListContainer>
      {members.map((member) => (
        <MemberItem
          key={member.id}
          onClick={() => onClickMemberItem(member.id)}
        >
          <ProfileImage
            src={member.profileImage || DefaultImage}
            alt={`profileImage`}
          />
          <MemberDetails>
            <MainText>{`${member.name} ${member.officer?.id || t('churchMember')}`}</MainText>
            <MainText>{member.mobilePhone}</MainText>
            <MainText>{member.group?.id}</MainText>
          </MemberDetails>
        </MemberItem>
      ))}
    </MemberListContainer>
  );
};

export default MemberItemList;
