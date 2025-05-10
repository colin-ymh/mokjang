// components/molecules/member/information/select-group.view.tsx
import styled from 'styled-components';
import { Group } from '@/models/management/management';
import SelectGroupItem from '@/components/atoms/member/information/select-group-item';
import { BLACK } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import ChevronLeft from '/public/svg/chevron-left.svg';
import { useI18n } from '../../../../../locales/client';

/* ---------- styled ---------- */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
`;
const BackIcon = styled(ChevronLeft)`
  width: 20px;
  height: 20px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;
const List = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;
const Footer = styled.div`
  padding: 20px;
`;

/* ---------- props ---------- */
type ViewProps = {
  currentChildren: Group[];
  selectedGroup: Group;
  breadcrumb: Group[];
  hasParent: boolean;
  onGoBack: () => void;
  onEnterGroup: (g: Group) => void;
  onSave: () => void;
  onClose: () => void;
};

const SelectGroupView = ({
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
      {/* ----- 상단 헤더 ----- */}
      <Header>
        <BackIcon onClick={hasParent ? onGoBack : onClose} />
        <MainText>{breadcrumb.map((g) => g.name).join(' > ')}</MainText>
      </Header>

      {/* ----- 그룹 리스트 ----- */}
      <List>
        {currentChildren.map((g) => (
          <SelectGroupItem
            key={g.id}
            group={g}
            onClick={() => onEnterGroup(g)}
            isSelected={g.id === selectedGroup.id}
          />
        ))}
      </List>

      {/* ----- 하단 버튼 ----- */}
      <Footer>
        <Button text={t('button.save')} onClick={onSave} height={30} />
      </Footer>
    </Container>
  );
};

export default SelectGroupView;
