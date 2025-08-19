import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
import {
  getDateFromDateString,
  getDateFromInput,
  getDateStringFromDate,
} from '@/utils/date';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import StopWarningButton from '@/components/atoms/common/button/stop-warning-button';
import SelectMinistryHierarchy from '@/components/organisms/ministry/select-ministry-hierarchy';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { BLANK } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

const EditMemberMinistryViewContainer = styled.div`
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

type EditMemberMinistryViewProps = {
  isMinistryOpen: boolean;
  dropdownItems: DropdownValueType[];
  onClickMinistryOpen: () => void;
  onClickMinistryClose: () => void;
  onClickDeleteMinistry: (ministryGroupId: string) => void;
  onChangeMinistryGroup: (ministryGroupId: string | null) => void;
  onChangeMinistry: (ministryId: string) => void;
  onChangeStartDate: (date: Date | null) => void;
};

const EditMemberMinistryView = ({
  isMinistryOpen,
  dropdownItems,
  onClickMinistryOpen,
  onClickMinistryClose,
  onClickDeleteMinistry,
  onChangeMinistryGroup,
  onChangeMinistry,
  onChangeStartDate,
}: EditMemberMinistryViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_warning = useScopedI18n('warning');

  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  return (
    <>
      <EditMemberMinistryViewContainer>
        {/* 사역 그룹 */}
        <LabelInput
          label={t('ministryGroup')}
          value={
            targetMinistryHistory.ministryGroupSnapShot ||
            targetMinistryHistory.ministryGroup?.name
          }
          onClick={onClickMinistryOpen}
          onChange={() => {}} // 필요하다면 구현
        />
        {/* 사역 */}
        <LabelDropdown
          label={t('ministry')}
          value={
            targetMinistryHistory.ministryGroupDetailHistory &&
            targetMinistryHistory.ministryGroupDetailHistory.length > 0
              ? targetMinistryHistory.ministryGroupDetailHistory[0]?.ministry.id
              : BLANK
          }
          items={dropdownItems}
          onChangeItem={onChangeMinistry}
        />
        {/* 시작 날짜 */}
        <LabelContainer>
          <MainText color={GRAY.SEMI_DARK} size={SIZE.SMALL}>
            {t('startDate')}
          </MainText>
          <CustomDatePicker
            value={
              targetMinistryHistory.startDate
                ? getDateStringFromDate(
                    getDateFromInput(targetMinistryHistory.startDate)
                  )
                : undefined
            }
            selected={
              targetMinistryHistory.startDate
                ? getDateFromDateString(targetMinistryHistory.startDate)
                : null
            }
            onChange={onChangeStartDate}
            placeholderText={t('startDate')}
            maxDate={new Date()}
          />
        </LabelContainer>
        {targetMember.ministryGroupHistory &&
          targetMember.ministryGroupHistory.length > 0 && (
            <StopWarningButton
              description={t_warning('stopMinistryHistory')}
              buttonText={t_button('stopMinistryHistory')}
              onClick={() =>
                onClickDeleteMinistry(
                  targetMinistryHistory.ministryGroup.id as string
                )
              }
              // disabled={!!selectedMinistry?.membersCount || false}
            />
          )}
      </EditMemberMinistryViewContainer>

      <CustomPopup
        isShow={isMinistryOpen}
        onClickCancel={onClickMinistryClose}
        cancelText={t('button.close')}
        width={450}
        height={350}
        isHeaderShown={false}
      >
        <EditMemberMinistryViewContainer>
          <SelectMinistryHierarchy
            onChange={onChangeMinistryGroup}
            isAllSelectable={false}
          />
        </EditMemberMinistryViewContainer>
      </CustomPopup>
    </>
  );
};

export default EditMemberMinistryView;
