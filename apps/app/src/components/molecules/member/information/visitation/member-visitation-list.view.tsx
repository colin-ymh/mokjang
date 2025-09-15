import styled from 'styled-components';
import { Button, MainText } from '@mokjang/components';
import { GRAY, MAIN, SIZE, TASK_STATUS, WHITE } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import React, { RefObject } from 'react';
import useWindowSize from '../../../../../hooks/window/window';
import { Visitation } from '@mokjang/models';
import AddVisitation from '../../../../organisms/visitation/add/add-visitation';
import MemberVisitationItem from '../../../../atoms/member/information/visitation/member-visitation-item';
import ConfirmPopup from '../../../../atoms/common/popup/error-popup';
import VisitationInformation from '../../../../organisms/visitation/information/visitation-information';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';
import EmptyList from '@/components/atoms/common/image/empty-list';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const VisitationListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PlusIcon = styled(Svg.Plus)`
  width: 18px;
  height: 18px;
  stroke: ${WHITE};
  stroke-width: 2px;
`;

const VisitationList = styled.div<{ height: number }>`
  display: flex;
  gap: 10px;
  flex-direction: column;
  height: ${({ height }) => height}px;
  overflow-y: auto;
`;

type FamilyInformationListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  isModalShown: boolean;
  isInformationShown: boolean;
  isSaveEnabled: boolean;
  isPopupShown: boolean;
  visitations: Visitation[];
  onClickConfirmOpen: () => void;
  onClickConfirmClose: () => void;
  onClickOpenModal: (visitation?: Visitation) => void;
  onClickCloseModal: () => void;
  onClickAddDone: () => void;
  onClickVisitation: (visitation: Visitation) => void;
  onCloseVisitation: () => void;
  onClickDelete: () => void;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onChangeStatus: (status: TASK_STATUS) => void;
};

const MemberVisitationListView = ({
  scrollRef,
  isModalShown,
  isInformationShown,
  isSaveEnabled,
  isPopupShown,
  visitations,
  onClickConfirmOpen,
  onClickConfirmClose,
  onClickOpenModal,
  onClickCloseModal,
  onClickAddDone,
  onClickVisitation,
  onCloseVisitation,
  onClickDelete,
  onScroll,
  onChangeStatus,
}: FamilyInformationListViewProps) => {
  const { height } = useWindowSize();

  const t_popup = useScopedI18n('popup');
  const t_button = useScopedI18n('button');
  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  return (
    <>
      <ListContainer>
        {/* 심방 목록 헤더 */}
        <VisitationListHeader>
          <MainText size={SIZE.EXTRA_LARGE}>{t_header('visitation')}</MainText>
          {/* 심방 추가 버튼*/}
          <Button
            width={'auto'}
            text={t_button('addVisitation')}
            onClick={() => onClickOpenModal()}
            icon={<PlusIcon />}
            height={30}
          />
        </VisitationListHeader>
        <VisitationList
          ref={scrollRef}
          onScroll={onScroll}
          height={height - 400}
        >
          {visitations.length > 0 ? (
            visitations.map((visitation) => {
              return (
                <MemberVisitationItem
                  key={visitation.id}
                  visitation={visitation}
                  onClickVisitation={onClickVisitation}
                />
              );
            })
          ) : (
            <EmptyList width={200} height={200} />
          )}
        </VisitationList>
      </ListContainer>

      {/* 심방 상세정보 팝업*/}
      <ScrollSlidePopup
        isShow={isInformationShown}
        onClickClose={onCloseVisitation}
        headerTitle={targetVisitation?.title}
        doneText={t_button('edit')}
        cancelText={t_button('delete')}
        onClickDone={() => onClickOpenModal(targetVisitation)}
        onClickCancel={onClickConfirmOpen}
        stageTwoTop={40}
        inCharge={targetVisitation.inCharge}
        startDate={targetVisitation.startDate}
        endDate={targetVisitation.endDate}
        status={targetVisitation.status}
        onChangeStatus={onChangeStatus}
        disabledKeyboard={true}
      >
        <>
          {/* 삭제 확인 팝업 */}
          <ConfirmPopup
            title={t_popup('deleteVisitationTitle')}
            body={t_popup('deleteVisitationBody')}
            buttonNum={2}
            isShow={isPopupShown}
            onClickLeftButton={onClickConfirmClose}
            onClickRightButton={() => {
              onClickDelete();
              onClickConfirmClose();
            }}
            leftButtonText={t_button('cancel')}
            rightButtonText={t_button('delete')}
          />
          <VisitationInformation onChangeStatus={onChangeStatus} />
        </>
      </ScrollSlidePopup>

      {/* 심방 추가 팝업*/}
      <ScrollSlidePopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
        onClickCancel={onClickCloseModal}
        headerTitle={t_title('addVisitation')}
        onClickDone={onClickAddDone}
        doneDisabled={!isSaveEnabled}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : GRAY.LIGHT}
        isAnimation={false}
      >
        <AddVisitation />
      </ScrollSlidePopup>
    </>
  );
};

export default MemberVisitationListView;
