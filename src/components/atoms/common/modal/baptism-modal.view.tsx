import React from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { MAIN } from '@/constants/styles/color';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';

import { useI18n } from '../../../../../locales/client';
import { useBaptismDropdownItems } from '@/hooks/dropdown/dropdown-items';
import { BAPTISM } from '@/constants/constant';

const BaptismModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

type BaptismModalViewProps = {
  selectedBaptism: BAPTISM;
  onClickItem: (baptism: BAPTISM) => void;
  onClickSave: (baptism: BAPTISM) => void;
};

const BaptismModalView = ({
  selectedBaptism,
  onClickItem,
  onClickSave,
}: BaptismModalViewProps) => {
  const t = useI18n();
  const baptismDropdownItems = useBaptismDropdownItems();

  return (
    <BaptismModalViewContainer>
      {/* 내용 */}
      <ContentContainer>
        <GroupContainer>
          {/* 신급 */}
          <LabelDropdown
            label={t('baptism')}
            value={selectedBaptism}
            items={baptismDropdownItems}
            onChangeItem={onClickItem}
          />
        </GroupContainer>
      </ContentContainer>
      {/* 버튼 */}
      <ButtonContainer>
        <Button
          text={t('button.save')}
          backgroundColor={MAIN.DEFAULT}
          height={30}
          onClick={() => {
            onClickSave(selectedBaptism);
          }}
        />
      </ButtonContainer>
    </BaptismModalViewContainer>
  );
};

export default BaptismModalView;
