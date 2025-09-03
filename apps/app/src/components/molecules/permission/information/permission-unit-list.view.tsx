import styled from 'styled-components';
import PermissionUnitItem from '../../../atoms/permission/information/permission-unit-item';
import { MainText } from '../../../../../../../packages/components/src';
import { useScopedI18n } from '../../../../../locales/client';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
  padding: 0 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 30px;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export type PermissionUnitListViewProps = {
  selectedUnitIds: string[];
  onClick: (id: string) => void;
  isEditable: boolean;
};

const PermissionUnitListView = ({
  selectedUnitIds,
  onClick,
  isEditable,
}: PermissionUnitListViewProps) => {
  const t_unit = useScopedI18n('unit');

  return (
    <>
      <ListContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('member.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={'1'}
              title={t_unit('member.write.title')}
              description={t_unit('member.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('1')}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={'2'}
              title={t_unit('member.read.title')}
              description={t_unit('member.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('2')}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('visitation.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={'3'}
              title={t_unit('visitation.write.title')}
              description={t_unit('visitation.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('3')}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={'4'}
              title={t_unit('visitation.read.title')}
              description={t_unit('member.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('4')}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('education.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={'5'}
              title={t_unit('education.write.title')}
              description={t_unit('education.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('5')}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={'6'}
              title={t_unit('education.read.title')}
              description={t_unit('education.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('6')}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('church.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={'7'}
              title={t_unit('church.write.title')}
              description={t_unit('church.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('7')}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('manager.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={'8'}
              title={t_unit('manager.write.title')}
              description={t_unit('manager.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes('8')}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
      </ListContainer>
    </>
  );
};

export default PermissionUnitListView;
