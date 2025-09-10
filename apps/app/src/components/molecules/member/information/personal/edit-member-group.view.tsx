import styled from 'styled-components';
import { CustomPopup, LabelInput, MainText } from '@mokjang/components';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import SelectGroupHierarchy from '../../../../organisms/group/select-group-hierarchy';
import CustomDatePicker from '../../../../../vendor/date-picker/custom-date-picker';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { GRAY, SIZE } from '@mokjang/constants';
import StopWarningButton from '../../../../atoms/common/button/stop-warning-button';

const EditMemberGroupViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
`;

type EditMemberGroupViewProps = {
  isGroupOpen: boolean;
  onClickGroupOpen: () => void;
  onClickGroupClose: () => void;
  onClickDeleteGroup: () => void;
  onChangeGroup: (groupId: string | null) => void;
  onChangeStartDate: (date: Date | null) => void;
};

const EditMemberGroupView = ({
  isGroupOpen,
  onClickGroupOpen,
  onClickGroupClose,
  onClickDeleteGroup,
  onChangeGroup,
  onChangeStartDate,
}: EditMemberGroupViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetGroupHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditMemberGroupViewContainer>
        <LabelInput
          label={t('group')}
          value={
            targetGroupHistory.groupSnapShot || targetGroupHistory.group?.name
          }
          onClick={onClickGroupOpen}
          onChange={() => {}} // 필요하다면 구현
        />
        {/* 시작 날짜 */}
        <LabelContainer>
          <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
            {t('startDate')}
          </MainText>
          <CustomDatePicker
            value={
              targetGroupHistory.startDate
                ? getDateStringFromDate(
                    getDateFromDateString(targetGroupHistory.startDate)
                  )
                : undefined
            }
            selected={
              targetGroupHistory.startDate
                ? getDateFromDateString(targetGroupHistory.startDate)
                : null
            }
            onChange={onChangeStartDate}
            placeholderText={t('startDate')}
            maxDate={new Date()}
          />
        </LabelContainer>
        {targetMember.groupHistory && targetMember.groupHistory.length > 0 && (
          <BoxContainer>
            <StopWarningButton
              description={t_warning('stopGroupHistory')}
              buttonText={t_button('stopGroupHistory')}
              onClick={onClickDeleteGroup}
              // disabled={!!selectedGroup?.membersCount || false}
            />
          </BoxContainer>
        )}
      </EditMemberGroupViewContainer>

      <CustomPopup
        isShow={isGroupOpen}
        onClickClose={onClickGroupClose}
        onClickCancel={onClickGroupClose}
        cancelText={t('button.close')}
        width={450}
        height={350}
        isHeaderShown={false}
      >
        <EditMemberGroupViewContainer>
          <SelectGroupHierarchy
            onChange={onChangeGroup}
            isAllSelectable={false}
          />
        </EditMemberGroupViewContainer>
      </CustomPopup>
    </>
  );
};

export default EditMemberGroupView;
