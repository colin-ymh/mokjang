import React from 'react';
import styled from 'styled-components';

import { BLACK, GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../../locales/client';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { MAIN_HEADER_ID } from '@/constants/layout/header';
import Button from '@/components/atoms/common/button/button';
import { useAttendanceHeaderBarItems } from '@/hooks/layout/header-bar-items';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useParams } from 'next/navigation';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import AttendanceInformation from '@/components/organisms/attendance/information/attendance-information';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import AddWorship from '@/components/organisms/worship/add/add-worship';
import CancelIcon from '../../../../../../../public/svg/cancel.svg';
import EditWorshipSession from '@/components/organisms/attendance/edit/edit-worship-session';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 120px;
    justify-content: space-between;
    padding: 0;
    border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
`;

const HeaderBottomContainer = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Cancel = styled(CancelIcon)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

type MainAttendanceHeaderViewProps = {
  isSessionShown: boolean;
  isAddWorshipOpened: boolean;
  isSaveEnabled: boolean;
  isEditEnabled: boolean;
  isEditOpened: boolean;
  onClickCloseEditModal: () => void;
  onClickSessionSave: () => void;
  onClickSessionClose: () => void;
  onClickEditOpen: () => void;
  onClickCloseModal: () => void;
  onClickSaveWorship: () => void;
  onClickHeaderBar: (id: string) => void;
  onClickSessionOpen: () => void;
  onClickAddWorship: () => void;
};

const MainAttendanceHeaderView = ({
  isSessionShown,
  isAddWorshipOpened,
  isSaveEnabled,
  isEditEnabled,
  isEditOpened,
  onClickCloseEditModal,
  onClickSessionSave,
  onClickEditOpen,
  onClickSessionClose,
  onClickCloseModal,
  onClickSaveWorship,
  onClickHeaderBar,
  onClickSessionOpen,
  onClickAddWorship,
}: MainAttendanceHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const headerBarItems = useAttendanceHeaderBarItems();

  return (
    <>
      <HeaderContainer>
        <HeaderTopContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {`${t_header(MAIN_HEADER_ID.WORSHIP)} / ${t_header(MAIN_HEADER_ID.ATTENDANCE)}`}
          </MainText>
          {contentId === MAIN_HEADER_ID.ATTENDANCE ? (
            <Button
              text={t_button('addWorshipSession')}
              onClick={onClickSessionOpen}
              width={150}
              height={30}
            />
          ) : (
            <Button
              text={t_button('addWorship')}
              onClick={onClickAddWorship}
              width={100}
              height={30}
            />
          )}
        </HeaderTopContainer>
        <HeaderBottomContainer>
          <HeaderBar
            value={contentId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </HeaderBottomContainer>
      </HeaderContainer>

      {/* 회차 상세정보 팝업*/}
      <SlidePopup
        isShow={isSessionShown}
        isFooterShown={false}
        onClickClose={onClickSessionClose}
        headerRight={
          <ButtonRow>
            <KebabDropdown
              items={[
                {
                  value: 'edit',
                  title: t_button('edit'),
                  onClick: onClickEditOpen,
                },
              ]}
              width={150}
            />
            <ButtonContainer onClick={onClickSessionClose}>
              <Cancel />
            </ButtonContainer>
          </ButtonRow>
        }
      >
        <AttendanceInformation />
      </SlidePopup>

      {/* 회차 상세 수정 팝업 */}
      <SlidePopup
        isShow={isEditOpened}
        headerTitle={t_title('editWorshipInformation')}
        onClickDone={onClickSessionSave}
        doneBackgroundColor={isEditEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isEditEnabled}
        onClickClose={onClickCloseEditModal}
      >
        <EditWorshipSession />
      </SlidePopup>

      {/* 예배 추가 */}
      <CustomPopup
        isShow={isAddWorshipOpened}
        onClickCancel={onClickCloseModal}
        headerTitle={t_title('addWorship')}
        width={500}
        height={500}
        onClickDone={onClickSaveWorship}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddWorship />
      </CustomPopup>
    </>
  );
};

export default MainAttendanceHeaderView;
