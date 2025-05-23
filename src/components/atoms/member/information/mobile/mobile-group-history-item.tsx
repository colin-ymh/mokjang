import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

import { GroupHistory } from '@/models/member/history';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate, getLocaleDateFromDashDate } from '@/utils/format';
import { GRAY, WHITE } from '@/constants/styles/color';
import SlideButtonList from '@/components/atoms/common/button/slide-button-list';
import { LOCALE } from '@/constants/state/locale';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { SIZE } from '@/constants/styles/style';

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
  align-items: flex-start;
  width: 100%;
  padding: 10px 30px;
  border-radius: 5px;
  position: relative;
  flex-direction: column;
  //cursor: pointer;
  transition: background-color 0.3s;
  // &:hover {
  //   background-color: ${GRAY.SEMI_LIGHT};
  // }
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
`;

const PeriodContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const DateContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type MobileGroupHistoryItemProps = {
  group: GroupHistory;
  onClickEditGroup: (group: GroupHistory) => void;
  onClickConfirmDelete: (groupId: string) => void;
  isCurrent?: boolean;
};

const MobileGroupHistoryItem = ({
  group,
  onClickEditGroup,
  onClickConfirmDelete,
  isCurrent,
}: MobileGroupHistoryItemProps) => {
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
        {/* 그룹명 + 역할 */}
        <TitleContainer>
          <MainText size={SIZE.MEDIUM}>{group.groupSnapShot}</MainText>
          <MainText size={SIZE.MEDIUM} color={GRAY.SEMI_DARK}>
            {group.groupRoleSnapShot}
          </MainText>
        </TitleContainer>
        {/* 기간 */}
        <PeriodContainer>
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
            right={10}
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

export default MobileGroupHistoryItem;
