import { GRAY, MAIN, YELLOW } from '@mokjang/constants';
import { DEFAULT_MEMBER, Member } from '@mokjang/models';
import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import ProfileImage from '../../../common/image/profile-image';
import { BLANK } from '@mokjang/constants';
import { MinistryGroup } from '@mokjang/models';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@mokjang/constants';
import { useI18n } from '../../../../../../locales/client';
import {
  getTranslatedAlreadyMinistryGroupLeader,
  getTranslatedNewMinistryGroupLeader,
} from '@mokjang/utils';

import { Svg } from '@mokjang/assets';
import { RadioButton } from '@mokjang/components';
import { MainTag } from '@mokjang/components';

const EditMinistryGroupLeaderContainer = styled.div`
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

const ArrowIcon = styled(Svg.ArrorUp)`
  width: 14px;
  height: 14px;
  stroke: ${MAIN.DEFAULT};
  transform: rotate(90deg);
`;

type EditMinistryGroupLeaderProps = {
  ministryGroup: MinistryGroup;
  members: Member[];
  onChangeLeaderId: (id: string) => void;
};

const EditMinistryMinistryGroupLeader = ({
  ministryGroup,
  members,
  onChangeLeaderId,
}: EditMinistryGroupLeaderProps) => {
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
    const prevMinistryGroupLeader = members.find(
      (member) => member.id === ministryGroup.leaderMemberId
    );

    if (prevMinistryGroupLeader) {
      setSelectedMember(prevMinistryGroupLeader);
    } else {
      setSelectedMember(members[0]);
    }
  }, [ministryGroup, members]);

  return (
    <EditMinistryGroupLeaderContainer>
      <MemberListHeader>
        <MainText>{t('editMinistryGroupLeader')}</MainText>
        <MainText color={GRAY.DEFAULT}>
          {t('description.editMinistryGroupLeader')}
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
                {ministryGroup.leaderMemberId === member.id && (
                  <MainTag
                    title={t('ministryGroupLeader')}
                    backgroundColor={YELLOW.LIGHT}
                    color={YELLOW.DARK}
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
            {ministryGroup.leaderMemberId !== selectedMember.id
              ? getTranslatedNewMinistryGroupLeader(locale, selectedMember.name)
              : getTranslatedAlreadyMinistryGroupLeader(
                  locale,
                  selectedMember.name
                )}
          </MainText>
        </ResultContainer>
      }
    </EditMinistryGroupLeaderContainer>
  );
};

export default EditMinistryMinistryGroupLeader;
