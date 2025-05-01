import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { OfficerHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import { LOCALE } from '@/constants/state/locale';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import React, { useState } from 'react';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

const BackgroundContainer = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-bottom: ${({ $isCurrent }) => ($isCurrent ? '0px' : '1px')} solid
    ${GRAY.SEMI_LIGHT};
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 50px;
  border-radius: 5px;
  position: relative;
  //cursor: pointer;
  transition: background-color 0.3s;
  // &:hover {
  //   background-color: ${GRAY.SEMI_LIGHT};
  // }
`;

const NameContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
`;

const PeriodContainer = styled.div`
  display: flex;
  gap: 20px;
  flex: 2;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type OfficerHistoryItemProps = {
  officer: OfficerHistory;
  onClickEditOfficer: (officer: OfficerHistory) => void;
  onClickConfirmDelete: (officerId: string) => void;
  isCurrent?: boolean;
};

const OfficerHistoryItem = ({
  officer,
  onClickEditOfficer,
  onClickConfirmDelete,
  isCurrent,
}: OfficerHistoryItemProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 기존 직분 삭제하기
  const onClickDeleteOfficer = () => {
    setIsPopupShown(true);
  };

  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <BackgroundContainer $isCurrent={isCurrent}>
      <ItemContainer>
        {/* 직분명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('officer')}</MainText>
          <MainText>{officer.officerSnapShot}</MainText>
        </NameContainer>
        {/* 직분 시작 교회 */}
        <RoleContainer>
          <MainText color={GRAY.DARK}>{t('officerStartChurch')}</MainText>
          <MainText>{officer.officerStartChurch}</MainText>
        </RoleContainer>
        {/* 기간 */}
        <PeriodContainer>
          <MainText color={GRAY.DARK}>{t('period')}</MainText>
          <DateContainer>
            <MainText>
              {getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(officer.startDate)
              )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {officer?.endDate
                ? getLocaleDateFromDashDate(
                    basePath,
                    getFormattedDate(officer?.endDate)
                  )
                : t('inProgress')}
            </MainText>
          </DateContainer>
        </PeriodContainer>
        {/* 버튼들 */}
        {!isCurrent && (
          <SlideButtonList
            isAddShown={false}
            buttonSize={25}
            onClickEdit={() => onClickEditOfficer(officer)}
            onClickDelete={onClickDeleteOfficer}
          />
        )}
      </ItemContainer>
      <ConfirmPopup
        title={t_popup('deleteHistoryTitle')}
        body={t_popup('deleteHistoryBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(officer.id)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </BackgroundContainer>
  );
};

export default OfficerHistoryItem;
