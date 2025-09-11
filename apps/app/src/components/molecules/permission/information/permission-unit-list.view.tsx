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
  selectedUnitIds: number[];
  onClick: (id: number) => void;
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
              id={1}
              title={t_unit('member.read.title')}
              description={t_unit('member.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(1)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={2}
              title={t_unit('member.write.title')}
              description={t_unit('member.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(2)}
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
              id={3}
              title={t_unit('visitation.read.title')}
              description={t_unit('member.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(3)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={4}
              title={t_unit('visitation.write.title')}
              description={t_unit('visitation.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(4)}
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
              id={5}
              title={t_unit('education.read.title')}
              description={t_unit('education.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(5)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={6}
              title={t_unit('education.write.title')}
              description={t_unit('education.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(6)}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('task.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={7}
              title={t_unit('task.read.title')}
              description={t_unit('task.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(7)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={8}
              title={t_unit('task.write.title')}
              description={t_unit('task.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(8)}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('worship.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={9}
              title={t_unit('worship.read.title')}
              description={t_unit('worship.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(9)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={10}
              title={t_unit('worship.write.title')}
              description={t_unit('worship.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(10)}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('management.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={11}
              title={t_unit('management.read.title')}
              description={t_unit('management.read.description')}
              onClick={onClick}
              // isSelected={selectedUnitIds?.includes(11)}
              isSelected={true}
              isEditable={false}
            />
            <PermissionUnitItem
              id={12}
              title={t_unit('management.write.title')}
              description={t_unit('management.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(12)}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
        <LabelContainer>
          <TitleContainer>
            <MainText fontSize={14} fontWeight={600}>
              {t_unit('permission.title')}
            </MainText>
          </TitleContainer>
          <ItemContainer>
            <PermissionUnitItem
              id={13}
              title={t_unit('permission.read.title')}
              description={t_unit('permission.read.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(13)}
              isEditable={isEditable}
            />
            <PermissionUnitItem
              id={14}
              title={t_unit('permission.write.title')}
              description={t_unit('permission.write.description')}
              onClick={onClick}
              isSelected={selectedUnitIds?.includes(14)}
              isEditable={isEditable}
            />
          </ItemContainer>
        </LabelContainer>
      </ListContainer>
    </>
  );
};

export default PermissionUnitListView;
