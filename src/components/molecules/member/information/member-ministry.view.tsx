import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MinistryHistory } from '@/models/member/history';
import MinistryHistoryItem from '@/components/atoms/member/information/ministry-history-item';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import MinistryModal from '@/components/atoms/common/modal/ministry-modal';

import { useI18n } from '../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.LIGHT};
  border-top: 1px solid ${GRAY.SEMI_LIGHT};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const MinistryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

type MemberMinistryViewProps = {
  ministryHistory: MinistryHistory[];
  targetMinistryHistory: MinistryHistory;
  isModalShown: boolean;
  onClickCloseModal: () => void;
  onClickEditMinistry: (ministry: MinistryHistory) => void;
  onClickSaveMinistryHistory: (startDate?: string, endDate?: string) => void;
  onClickConfirmDelete: (ministryId: string) => void;
};

const MemberMinistryView = ({
  ministryHistory,
  targetMinistryHistory,
  isModalShown,
  onClickCloseModal,
  onClickEditMinistry,
  onClickConfirmDelete,
  onClickSaveMinistryHistory,
}: MemberMinistryViewProps) => {
  const t = useI18n();
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('ministry')}</MainText>
      </ListTypeHeader>
      {/* 현재 사역 이력 */}
      <MinistryListContainer>
        {ministryHistory
          .filter((ministry) => ministry.endDate === null)
          .map((ministry) => {
            return (
              <MinistryHistoryItem
                key={ministry.id}
                ministry={ministry}
                onClickEditMinistry={onClickEditMinistry}
                onClickConfirmDelete={onClickConfirmDelete}
                isCurrent={true}
              />
            );
          })}
      </MinistryListContainer>

      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('history')}</MainText>
      </ListTypeHeader>
      {/* 이력 */}
      <MinistryListContainer>
        {ministryHistory
          .filter((ministry) => ministry.endDate)
          .map((ministry) => {
            return (
              <MinistryHistoryItem
                key={ministry.id}
                ministry={ministry}
                onClickEditMinistry={onClickEditMinistry}
                onClickConfirmDelete={onClickConfirmDelete}
              />
            );
          })}
      </MinistryListContainer>
      {/* 그룹 추가 및 수정 모달*/}
      <CustomPopup
        isShow={isModalShown}
        onClickCancel={onClickCloseModal}
        width={400}
        height={400}
      >
        <MinistryModal
          targetMemberId={targetMember.id}
          targetHistory={targetMinistryHistory}
          onClickSaveMinistryHistory={onClickSaveMinistryHistory}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default MemberMinistryView;
