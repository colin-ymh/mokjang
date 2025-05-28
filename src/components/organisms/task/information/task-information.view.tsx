import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useTaskStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { useI18n } from '../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { getFormattedDate } from '@/utils/format';
import React from 'react';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { GRAY } from '@/constants/styles/color';
import { TASK_STATUS } from '@/constants/status/status';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 30px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DivideLine = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${GRAY.DEFAULT};
  flex-shrink: 0;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const CommentContentContainer = styled.div`
  display: flex;
  padding: 10px;
  min-height: 50px;
`;

type TaskInformationViewProps = {
  onChangeStatus: (status: TASK_STATUS) => void;
};

const TaskInformationView = ({ onChangeStatus }: TaskInformationViewProps) => {
  const t = useI18n();

  const { targetTask } = useSelector((state: RootState) => state.targetTask);

  const statusDropdownItems = useTaskStatusDropdownItems();

  return (
    <InformationContainer>
      <MetaContainer>
        {/* 진행 상태 */}
        <ColumnContainer>
          <MainText>{t('status')}</MainText>
          <StatusDropdown
            value={targetTask.status}
            items={statusDropdownItems}
            onChangeItem={onChangeStatus}
            width={150}
            height={40}
          />
        </ColumnContainer>
        {/* 진행자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('inCharge')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MemberProfilePopupButton
              key={targetTask.inCharge.id}
              member={targetTask.inCharge}
            />
          </ContentContainer>
        </RowContainer>
        {/* 일자 */}
        <RowContainer>
          <TitleContainer>
            <MainText>{t('taskDate')}</MainText>
          </TitleContainer>
          <ContentContainer>
            <MainText>
              {targetTask.startDate && getFormattedDate(targetTask.startDate)}
            </MainText>
            <MainText>{'-'}</MainText>
            <MainText>
              {targetTask.endDate && getFormattedDate(targetTask.endDate)}
            </MainText>
          </ContentContainer>
        </RowContainer>
      </MetaContainer>
      <DivideLine />
      <CommentContainer>
        {/* 내용 */}
        <ColumnContainer>
          <TitleContainer>
            <MainText>{t('content')}</MainText>
          </TitleContainer>
          <CommentContentContainer>
            <MainText
              dangerouslySetInnerHTML={{
                __html: targetTask.content,
              }}
            />
          </CommentContentContainer>
        </ColumnContainer>
      </CommentContainer>
    </InformationContainer>
  );
};

export default TaskInformationView;
