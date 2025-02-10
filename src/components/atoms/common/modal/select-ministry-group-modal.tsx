import styled from 'styled-components';

import { MinistryGroup } from '@/models/management/management';
import { BLACK, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import SelectMinistryGroupItem from '@/components/atoms/common/modal/select-ministry-group-item';

import ChevronLeft from '../../../../../public/svg/chevron-left.svg';
import { useI18n } from '../../../../../locales/client';

const SelectMinistryGroupContainer = styled.div`
  display: flex;
  background-color: ${WHITE};
  width: 100%;
  height: 100%;
  border-radius: 5px;
  flex-direction: column;
  z-index: 400;
  position: relative;
`;

const GoBackContainer = styled.div`
  display: flex;
  height: 30px;
  padding: 10px;
  gap: 10px;
  align-items: center;
`;

const GoBackButton = styled(ChevronLeft)`
  width: 20px;
  height: 20px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

const MinistryGroupList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 10px;
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
`;

type SelectMinistryGroupModalProps = {
  ministryGroups: MinistryGroup[];
  currentMinistryGroup: MinistryGroup;
  selectedMinistryGroup: MinistryGroup;
  parentMinistryGroups: MinistryGroup[];
  onClickParent: (ministry: MinistryGroup) => void;
  onClickSaveMinistryGroup: (ministry: MinistryGroup) => void;
  onClickCloseDropdown: () => void;
  onClickGoBack: () => void;
};

const SelectMinistryGroupModal = ({
  ministryGroups,
  currentMinistryGroup,
  selectedMinistryGroup,
  parentMinistryGroups,
  onClickParent,
  onClickSaveMinistryGroup,
  onClickCloseDropdown,
  onClickGoBack,
}: SelectMinistryGroupModalProps) => {
  const t = useI18n();

  return (
    <SelectMinistryGroupContainer>
      <GoBackContainer>
        <GoBackButton
          onClick={() => parentMinistryGroups.length !== 0 && onClickGoBack()}
        />
        <MainText>
          {[...parentMinistryGroups, currentMinistryGroup]
            .map((parent) => parent.name)
            .join(' > ')}
        </MainText>
      </GoBackContainer>
      <MinistryGroupList>
        {ministryGroups.map((ministry) => {
          return (
            <SelectMinistryGroupItem
              key={ministry.id}
              ministry={ministry}
              onClick={() => {
                onClickParent(ministry);
              }}
              isSelected={ministry.id === selectedMinistryGroup.id}
            />
          );
        })}
      </MinistryGroupList>
      <ButtonContainer>
        <Button
          text={t('button.save')}
          onClick={() => {
            onClickSaveMinistryGroup(selectedMinistryGroup);
            onClickCloseDropdown();
          }}
          height={30}
        />
      </ButtonContainer>
    </SelectMinistryGroupContainer>
  );
};

export default SelectMinistryGroupModal;
