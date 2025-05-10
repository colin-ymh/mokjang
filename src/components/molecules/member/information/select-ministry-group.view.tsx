// components/molecules/member/information/select-ministry-group.view.tsx
import styled from 'styled-components';
import { MinistryGroup } from '@/models/management/management';
import SelectMinistryGroupItem from '@/components/atoms/member/information/select-ministry-group-item';
import ChevronLeft from '/public/svg/chevron-left.svg';
import { BLACK, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import { useI18n } from '../../../../../locales/client';

/* styled ----------------------------------------------------------------- */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${WHITE};
  border-radius: 5px;
  position: relative;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  height: 30px;
`;
const Back = styled(ChevronLeft)`
  width: 20px;
  height: 20px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;
const List = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;
const Footer = styled.div`
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  padding: 10px;
`;

/* props ------------------------------------------------------------------ */
type ViewProps = {
  currentChildren: MinistryGroup[];
  selectedGroup: MinistryGroup;
  breadcrumb: MinistryGroup[];
  hasParent: boolean;
  onGoBack: () => void;
  onEnterGroup: (g: MinistryGroup) => void;
  onSave: () => void;
  onClose: () => void;
};

const SelectMinistryGroupView = ({
  currentChildren,
  selectedGroup,
  breadcrumb,
  hasParent,
  onGoBack,
  onEnterGroup,
  onSave,
  onClose,
}: ViewProps) => {
  const t = useI18n();

  return (
    <Container>
      {/* --- 상단 --- */}
      <Header>
        <Back onClick={hasParent ? onGoBack : onClose} />
        <MainText>{breadcrumb.map((g) => g.name).join(' > ')}</MainText>
      </Header>

      {/* --- 리스트 --- */}
      <List>
        {currentChildren.map((g) => (
          <SelectMinistryGroupItem
            key={g.id}
            ministry={g}
            onClick={() => onEnterGroup(g)}
            isSelected={g.id === selectedGroup.id}
          />
        ))}
      </List>

      {/* --- 버튼 --- */}
      <Footer>
        <Button text={t('button.save')} onClick={onSave} height={30} />
      </Footer>
    </Container>
  );
};

export default SelectMinistryGroupView;
