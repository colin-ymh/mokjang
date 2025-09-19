import React from 'react';
import styled from 'styled-components';
import { MainTag, MainText, ProfileImage } from '@mokjang/components';
import {
  GRAY,
  GROUP_ROLE,
  LOCALE,
  MAIN,
  MINISTRY_GROUP_ROLE,
  PURPLE,
  SIZE,
  VIOLET,
  YELLOW,
} from '@mokjang/constants';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useI18n } from '../../../../../../locales/client';
import { getRegisterAfterDate } from '@mokjang/utils';
import { usePathname } from 'next/navigation';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  gap: 10px;
  position: relative;
  //border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: 20px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const TagContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 20px;
  gap: 10px;
`;

type MemberInformationHeaderViewProps = {};

const MemberInformationHeaderView = ({}: MemberInformationHeaderViewProps) => {
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  return (
    <>
      <InformationHeader>
        <Information>
          <ProfileImage
            value={targetMember?.profileImageUrl}
            width={75}
            height={75}
          />

          <TextContainer>
            <RowContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{targetMember.name}</MainText>
              {/*<MainText color={GRAY.DEFAULT}>*/}
              {/*  {targetMember?.officerHistory &&*/}
              {/*    targetMember?.officerHistory[0]?.officer?.name}*/}
              {/*</MainText>*/}
            </RowContainer>
            <RowContainer>
              <MainText color={GRAY.DARK}>
                {(targetMember?.groupHistory &&
                  targetMember?.groupHistory[0]?.group?.name) ||
                  t('noGroup')}
              </MainText>
            </RowContainer>
          </TextContainer>
        </Information>

        <TagContainer>
          <MainTag
            title={getRegisterAfterDate(basePath, targetMember.registeredAt)}
            color={VIOLET.DARK}
            backgroundColor={VIOLET.LIGHT}
          />
          {targetMember.churchUser && (
            <MainTag
              title={t('manager')}
              color={PURPLE.DARK}
              backgroundColor={PURPLE.LIGHT}
            />
          )}
          {targetMember.groupRole === GROUP_ROLE.LEADER && (
            <MainTag
              title={t('groupLeader')}
              color={YELLOW.DARK}
              backgroundColor={YELLOW.LIGHT}
            />
          )}
          {targetMember.ministryGroupRole === MINISTRY_GROUP_ROLE.LEADER && (
            <MainTag
              title={t('ministryGroupLeader')}
              color={MAIN.DARK}
              backgroundColor={MAIN.LIGHT}
            />
          )}
        </TagContainer>
      </InformationHeader>
    </>
  );
};

export default MemberInformationHeaderView;
