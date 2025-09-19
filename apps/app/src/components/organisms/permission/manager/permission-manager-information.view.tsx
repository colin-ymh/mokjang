import styled from 'styled-components';
import React, { MutableRefObject } from 'react';
import { MainTag, MainText, ProfileImage } from '@mokjang/components';
import { useI18n } from '../../../../../locales/client';
import { ChurchUser } from '@mokjang/models';
import { GRAY, GREEN, RED } from '@mokjang/constants';
import { getFormattedPhone } from '@mokjang/utils';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  overflow-y: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 30px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ManagerItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  gap: 10px;
  align-content: center;
  position: relative;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
`;

const StatusContainer = styled.div`
  display: flex;
  position: absolute;
  top: 10px;
  right: 10px;
`;

type PermissionManagerInformationProps = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  managers: ChurchUser[];
};

const PermissionManagerInformation = ({
  scrollRef,
  managers,
}: PermissionManagerInformationProps) => {
  const t = useI18n();

  return (
    <InformationContainer ref={scrollRef}>
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={16} fontWeight={600}>
            {`${t('manager')}`}
          </MainText>
        </TitleContainer>
      </LabelContainer>
      {managers.map((manager) => (
        <ManagerItem key={manager.id}>
          <ProfileImage
            value={manager.member.profileImageUrl}
            width={50}
            height={50}
          />
          <ColumnContainer>
            <MainText>{manager.user.name}</MainText>
            <MainText color={GRAY.SEMI_DARK}>
              {getFormattedPhone(manager.user.mobilePhone)}
            </MainText>
          </ColumnContainer>
          <StatusContainer>
            <MainTag
              title={manager.isPermissionActive ? t('active') : t('inactive')}
              color={manager.isPermissionActive ? GREEN.DARK : RED.DARK}
              backgroundColor={
                manager.isPermissionActive ? GREEN.LIGHT : RED.LIGHT
              }
            />
          </StatusContainer>
        </ManagerItem>
      ))}
    </InformationContainer>
  );
};

export default PermissionManagerInformation;
