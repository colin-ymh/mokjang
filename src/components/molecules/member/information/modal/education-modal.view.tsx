import React from 'react';
import styled from 'styled-components';

import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { useEducationDropdownItems } from '@/hooks/dropdown/dropdown-items';
import Button from '@/components/atoms/common/button/button';

import { useI18n } from '../../../../../../locales/client';
import Cancel from '../../../../../../public/svg/cancel.svg';
import { NULL } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

const EducationModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

type EducationModalViewProps = {
  isEdit: boolean;
  educationId: string;
  educationItems: DropdownValueType[];
  onClickClose: () => void;
  onChangeEducation: (id: string) => void;
};

const EducationModalView = ({
  isEdit,
  educationId,
  educationItems,
  onClickClose,
  onChangeEducation,
}: EducationModalViewProps) => {
  const t = useI18n();

  return (
    <EducationModalViewContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton onClick={onClickClose} />
      </HeaderContainer>
      {/* 내용 */}
      <ContentContainer>
        {/* 교육 선택 */}
        <LabelDropdown
          label={t('education')}
          value={educationId}
          items={educationItems}
          onChangeItem={onChangeEducation}
        />
      </ContentContainer>
      <ButtonContainer>
        <Button text={t('button.save')} height={30} onClick={() => {}} />
      </ButtonContainer>
    </EducationModalViewContainer>
  );
};

export default EducationModalView;
