import styled from 'styled-components';

import { GroupHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { GRAY, WHITE } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import React, { useState } from 'react';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

const BackgroundContainer = styled.div<{ $isCurrent?: boolean }>`
  display: flex;
  width: 100%;
  padding: 10px 0;
  border-bottom: ${({ $isCurrent }) => ($isCurrent ? '0px' : '1px')} solid
    ${GRAY.LIGHT};
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
  //   background-color: ${GRAY.LIGHT};
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

type GroupHistoryItemProps = {
  group: GroupHistory;
  onClickEditGroup: (group: GroupHistory) => void;
  onClickConfirmDelete: (groupId: string) => void;
  isCurrent?: boolean;
};

const GroupHistoryItem = ({
  group,
  onClickEditGroup,
  onClickConfirmDelete,
  isCurrent,
}: GroupHistoryItemProps) => {
  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickDeleteGroup = () => {
    setIsPopupShown(true);
  };

  const t = useI18n();
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <BackgroundContainer $isCurrent={isCurrent}>
      <ItemContainer>
        {/* 그룹명 */}
        <NameContainer>
          <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
          <MainText>{group.groupSnapShot}</MainText>
        </NameContainer>
        {/* 역할 */}
        <RoleContainer>
          <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
          <MainText>{group.groupRoleSnapShot}</MainText>
        </RoleContainer>
        {/* 기간 */}
        <PeriodContainer>
          <MainText color={GRAY.DARK}>{t('period')}</MainText>
          <DateContainer>
            <MainText>
              {getLocaleDateFromDashDate(
                basePath,
                getFormattedDate(group.startDate)
              )}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {group?.endDate
                ? getLocaleDateFromDashDate(
                    basePath,
                    getFormattedDate(group?.endDate)
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
            onClickEdit={() => onClickEditGroup(group)}
            onClickDelete={() => onClickDeleteGroup()}
            backgroundColor={WHITE}
          />
        )}
      </ItemContainer>
      <ConfirmPopup
        title={t_popup('deleteHistoryTitle')}
        body={t_popup('deleteHistoryBody')}
        isShow={isPopupShown}
        onClickLeftButton={() => setIsPopupShown(false)}
        onClickRightButton={() => onClickConfirmDelete(group.id)}
        leftButtonText={t_button('cancel')}
        rightButtonText={t_button('confirm')}
        buttonNum={2}
      />
    </BackgroundContainer>
  );
};

export default GroupHistoryItem;
