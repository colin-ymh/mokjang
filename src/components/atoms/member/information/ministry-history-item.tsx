import styled from 'styled-components';

import { MinistryHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate } from '@/utils/format';
import { GRAY } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import React, { useState } from 'react';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { getTranslatedDateFromDateString } from '@/utils/translate';

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

type MinistryHistoryItemProps = {
  ministry: MinistryHistory;
  onClickEditMinistry: (ministry: MinistryHistory) => void;
  onClickConfirmDelete: (ministryId: string) => void;
  isCurrent?: boolean;
};

const MinistryHistoryItem = ({
  ministry,
  onClickEditMinistry,
  onClickConfirmDelete,
  isCurrent,
}: MinistryHistoryItemProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickDeleteMinistry = () => {
    setIsPopupShown(true);
  };

  const t = useI18n();
  // 로케일 코드
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <BackgroundContainer $isCurrent={isCurrent}>
      <ItemContainer>
        {/* 그룹명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
          <MainText>{ministry.ministryGroupSnapShot}</MainText>
        </NameContainer>
        {/* 역할 */}
        <RoleContainer>
          <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
          <MainText>{ministry.ministrySnapShot}</MainText>
        </RoleContainer>
        {/* 기간 */}
        <PeriodContainer>
          <MainText color={GRAY.DARK}>{t('period')}</MainText>
          <DateContainer>
            <MainText>
              {getTranslatedDateFromDateString(
                basePath,
                getFormattedDate(ministry.startDate)
              )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {ministry?.endDate
                ? getTranslatedDateFromDateString(
                    basePath,
                    getFormattedDate(ministry?.endDate)
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
            onClickEdit={() => onClickEditMinistry(ministry)}
            onClickDelete={onClickDeleteMinistry}
          />
        )}
      </ItemContainer>
      <ConfirmPopup
        title={t_popup('deleteHistoryTitle')}
        body={t_popup('deleteHistoryBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(ministry.id)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </BackgroundContainer>
  );
};

export default MinistryHistoryItem;
