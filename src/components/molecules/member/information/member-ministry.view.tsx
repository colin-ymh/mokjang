import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { MinistryHistory } from '@/models/member/history';
import MinistryHistoryItem from '@/components/atoms/member/information/ministry-history-item';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

import { useI18n } from '../../../../../locales/client';
import MinistryModal from '@/components/atoms/common/modal/ministry-modal';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const ListTypeHeader = styled.div`
  display: flex;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  border-top: 1px solid ${GRAY.LIGHT};
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
  targetMinistry: MinistryHistory;
  isModalShown: boolean;
  onClickCloseModal: () => void;
  onClickEditMinistry: (ministry: MinistryHistory) => void;
  onClickSaveMinistryHistory: (startDate?: string, endDate?: string) => void;
  onClickDeleteMinistry: (ministryId: string) => void;
};

const MemberMinistryView = ({
  ministryHistory,
  targetMinistry,
  isModalShown,
  onClickCloseModal,
  onClickEditMinistry,
  onClickDeleteMinistry,
  onClickSaveMinistryHistory,
}: MemberMinistryViewProps) => {
  const t = useI18n();
  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('ministry')}</MainText>
      </ListTypeHeader>
      {/* 이력 */}
      <MinistryListContainer>
        {ministryHistory.map((ministry) => {
          return (
            <MinistryHistoryItem
              key={ministry.id}
              ministry={ministry}
              onClickEditMinistry={onClickEditMinistry}
              onClickDeleteMinistry={onClickDeleteMinistry}
            />
          );
        })}
      </MinistryListContainer>
      {/* 그룹 추가 및 수정 모달*/}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
        width={400}
        height={400}
      >
        <MinistryModal
          isHistory={true}
          prevMinistry={targetMinistry}
          onClickSaveMinistryHistory={onClickSaveMinistryHistory}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default MemberMinistryView;
