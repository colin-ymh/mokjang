import styled from 'styled-components';

import { Group } from '@/models/management/management';
import SelectGroupViewModalItem from '@/components/atoms/member/information/select-group-item';
import { BLACK } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';

import ChevronLeft from '../../../../../public/svg/chevron-left.svg';
import { useI18n } from '../../../../../locales/client';

const SelectGroupViewContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const GoBackContainer = styled.div`
  display: flex;
  //height: 30px;
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

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

type SelectGroupViewModalProps = {
  selectedGroup: Group;
  groups: Group[];
  groupList: Group[];
  parentGroups: Group[];
  onClickGoBack: () => void;
  onClose: () => void;
  onClickParent: (group: Group) => void;
  onClickSave: (group: Group) => void;
};

const SelectGroupView = ({
  selectedGroup,
  groups,
  groupList,
  parentGroups,
  onClickGoBack,
  onClose,
  onClickParent,
  onClickSave,
}: SelectGroupViewModalProps) => {
  const t = useI18n();

  return (
    <SelectGroupViewContainer>
      <ContentContainer>
        <GoBackContainer>
          <GoBackButton
            onClick={() =>
              parentGroups.length !== 0 ? onClickGoBack() : onClose()
            }
          />
          <MainText>
            {groupList.map((parent) => parent.name).join(' > ')}
          </MainText>
        </GoBackContainer>
        <GroupList>
          {groups.map((group) => {
            return (
              <SelectGroupViewModalItem
                key={group.id}
                group={group}
                onClick={() => {
                  onClickParent(group);
                }}
                isSelected={group.id === selectedGroup.id}
              />
            );
          })}
        </GroupList>
      </ContentContainer>
      <ButtonContainer>
        <Button
          text={t('button.save')}
          onClick={() => {
            onClickSave(selectedGroup);
            onClose();
          }}
          height={30}
        />
      </ButtonContainer>
    </SelectGroupViewContainer>
  );
};

export default SelectGroupView;
