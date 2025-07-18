import {
  GRAY,
  LEADER_BACKGROUND_COLOR,
  LEADER_FONT_COLOR,
  MAIN,
} from '@/constants/styles/color';
import { DEFAULT_MEMBER, Member } from '@/models/member/member';
import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import ProfileImage from '@/components/atoms/common/image/profile-image';
import { BLANK } from '@/constants/constant';
import { Group } from '@/models/management/management';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { useI18n } from '../../../../../../locales/client';
import {
  getTranslatedAlreadyGroupLeader,
  getTranslatedNewGroupLeader,
} from '@/utils/translate';

import ArrowUp from '../../../../../../public/svg/arror-up.svg';
import RadioButton from '@/components/atoms/common/radio-button/radio-button';
import MainTag from '@/components/atoms/common/tag/main-tag';

const EditGroupLeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const MemberListHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MemberListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  max-height: 200px;
  overflow-y: auto;
`;

const MemberItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: ${({ $isSelected }) =>
    `1px solid ${$isSelected ? MAIN.DEFAULT : GRAY.EXTRA_LIGHT}`};
  border-radius: 10px;
  background-color: ${({ $isSelected }) => $isSelected && MAIN.EXTRA_LIGHT};
  cursor: pointer;
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const ResultContainer = styled.div`
  display: flex;
  border-radius: 10px;
  border: 1px solid ${MAIN.LIGHT};
  background-color: ${MAIN.EXTRA_LIGHT};
  padding: 20px;
  align-items: center;
  gap: 10px;
`;

const ArrowIcon = styled(ArrowUp)`
  width: 14px;
  height: 14px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(90deg);
`;

type EditGroupLeaderProps = {
  group: Group;
  members: Member[];
  onChangeLeaderId: (id: string) => void;
};

const EditGroupLeader = ({
  group,
  members,
  onChangeLeaderId,
}: EditGroupLeaderProps) => {
  const t = useI18n();

  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const [selectedMember, setSelectedMember] = useState<Member>(DEFAULT_MEMBER);

  const onClickMember = (member: Member) => {
    setSelectedMember(member);
  };

  useEffect(() => {
    onChangeLeaderId(selectedMember.id);
  }, [selectedMember]);

  useEffect(() => {
    const prevGroupLeader = members.find(
      (member) => member.id === group.leaderMemberId
    );

    if (prevGroupLeader) {
      setSelectedMember(prevGroupLeader);
    } else {
      setSelectedMember(members[0]);
    }
  }, [group, members]);

  return (
    <EditGroupLeaderContainer>
      <MemberListHeader>
        <MainText>{t('editGroupLeader')}</MainText>
        <MainText color={GRAY.DEFAULT}>
          {t('editGroupLeaderDescription')}
        </MainText>
      </MemberListHeader>
      <MemberListContainer>
        {members.map((member) => {
          return (
            <MemberItem
              key={member.id}
              onClick={() => onClickMember(member)}
              $isSelected={selectedMember.id === member.id}
            >
              <ProfileContainer>
                <ProfileImage value={member?.profileImageUrl} />
                <ProfileDetail>
                  <MainText>{`${member.name} ${member.officer?.name || BLANK}`}</MainText>
                  <MainTag title={member.group?.name || t('noGroup')} />
                </ProfileDetail>
                {group.leaderMemberId === member.id && (
                  <MainTag
                    title={t('groupLeader')}
                    backgroundColor={LEADER_BACKGROUND_COLOR}
                    color={LEADER_FONT_COLOR}
                  />
                )}
              </ProfileContainer>

              <RadioButton isSelected={selectedMember.id === member.id} />
            </MemberItem>
          );
        })}
      </MemberListContainer>
      {
        <ResultContainer>
          <ArrowIcon />
          <MainText color={MAIN.DEFAULT}>
            {group.leaderMemberId !== selectedMember.id
              ? getTranslatedNewGroupLeader(locale, selectedMember.name)
              : getTranslatedAlreadyGroupLeader(locale, selectedMember.name)}
          </MainText>
        </ResultContainer>
      }
    </EditGroupLeaderContainer>
  );
};

export default EditGroupLeader;
