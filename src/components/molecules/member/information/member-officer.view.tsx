import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import {
  DEFAULT_OFFICER_HISTORY,
  OfficerHistory,
} from '@/models/member/history';
import OfficerHistoryItem from '@/components/atoms/member/information/officer-history-item';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

import { useI18n } from '../../../../../locales/client';
import OfficerModal from '@/components/atoms/common/modal/officer-modal';

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

const OfficerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
`;

type MemberOfficerViewProps = {
  officerHistory: OfficerHistory[];
  targetOfficerHistory: OfficerHistory;
  isModalShown: boolean;
  onClickCloseModal: () => void;
  onClickEditOfficer: (officer: OfficerHistory) => void;
  onClickSaveOfficerHistory: (startDate?: string, endDate?: string) => void;
  onClickDeleteOfficer: (officerId: string) => void;
};

const MemberOfficerView = ({
  officerHistory,
  targetOfficerHistory,
  isModalShown,
  onClickCloseModal,
  onClickEditOfficer,
  onClickDeleteOfficer,
  onClickSaveOfficerHistory,
}: MemberOfficerViewProps) => {
  const t = useI18n();
  const currentHistory = officerHistory.find(
    (history) => history.endDate === null
  );
  return (
    <ListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('officer')}</MainText>
      </ListTypeHeader>
      {/* 이력 */}
      <OfficerListContainer>
        {currentHistory && (
          <OfficerHistoryItem
            officer={currentHistory || DEFAULT_OFFICER_HISTORY}
            onClickEditOfficer={onClickEditOfficer}
            onClickDeleteOfficer={onClickDeleteOfficer}
            isCurrent={true}
          />
        )}
      </OfficerListContainer>
      {/* 그룹 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t('history')}</MainText>
      </ListTypeHeader>
      {/* 이력 */}
      <OfficerListContainer>
        {officerHistory
          .filter((officer) => officer.endDate)
          .map((officer) => {
            return (
              <OfficerHistoryItem
                key={officer.id}
                officer={officer}
                onClickEditOfficer={onClickEditOfficer}
                onClickDeleteOfficer={onClickDeleteOfficer}
              />
            );
          })}
      </OfficerListContainer>
      {/* 그룹 추가 및 수정 모달*/}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickCloseModal}
        width={400}
        height={400}
      >
        <OfficerModal
          targetHistory={targetOfficerHistory}
          onClickSaveOfficerHistory={onClickSaveOfficerHistory}
        />
      </CustomPopup>
    </ListContainer>
  );
};

export default MemberOfficerView;
