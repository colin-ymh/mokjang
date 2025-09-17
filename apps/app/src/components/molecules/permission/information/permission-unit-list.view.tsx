import styled from 'styled-components';
import PermissionUnitItem from '../../../atoms/permission/information/permission-unit-item';
import { MainText } from '../../../../../../../packages/components/src';
import { useScopedI18n } from '../../../../../locales/client';
import { getPermissionUnitId } from '@/utils/permission';
import { ACTION, DOMAIN } from '@mokjang/models';

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
    <ListContainer>
      {/* MEMBER */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.MEMBER}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.MEMBER, ACTION.READ)}
            title={t_unit(`${DOMAIN.MEMBER}.${ACTION.READ}.title`)}
            description={t_unit(`${DOMAIN.MEMBER}.${ACTION.READ}.description`)}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.MEMBER, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.MEMBER, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.MEMBER}.${ACTION.WRITE}.title`)}
            description={t_unit(`${DOMAIN.MEMBER}.${ACTION.WRITE}.description`)}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.MEMBER, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* VISITATION */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.VISITATION}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.VISITATION, ACTION.READ)}
            title={t_unit(`${DOMAIN.VISITATION}.${ACTION.READ}.title`)}
            description={t_unit(
              `${DOMAIN.VISITATION}.${ACTION.READ}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.VISITATION, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.VISITATION, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.VISITATION}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.VISITATION}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.VISITATION, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* EDUCATION */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.EDUCATION}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.EDUCATION, ACTION.READ)}
            title={t_unit(`${DOMAIN.EDUCATION}.${ACTION.READ}.title`)}
            description={t_unit(
              `${DOMAIN.EDUCATION}.${ACTION.READ}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.EDUCATION, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.EDUCATION, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.EDUCATION}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.EDUCATION}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.EDUCATION, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* TASK */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.TASK}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.TASK, ACTION.READ)}
            title={t_unit(`${DOMAIN.TASK}.${ACTION.READ}.title`)}
            description={t_unit(`${DOMAIN.TASK}.${ACTION.READ}.description`)}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.TASK, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.TASK, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.TASK}.${ACTION.WRITE}.title`)}
            description={t_unit(`${DOMAIN.TASK}.${ACTION.WRITE}.description`)}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.TASK, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* WORSHIP */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.WORSHIP}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.WORSHIP, ACTION.READ)}
            title={t_unit(`${DOMAIN.WORSHIP}.${ACTION.READ}.title`)}
            description={t_unit(`${DOMAIN.WORSHIP}.${ACTION.READ}.description`)}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.WORSHIP, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.WORSHIP, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.WORSHIP}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.WORSHIP}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.WORSHIP, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* WORSHIP ATTENDANCE */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.WORSHIP_ATTENDANCE}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.WORSHIP_ATTENDANCE, ACTION.READ)}
            title={t_unit(`${DOMAIN.WORSHIP_ATTENDANCE}.${ACTION.READ}.title`)}
            description={t_unit(
              `${DOMAIN.WORSHIP_ATTENDANCE}.${ACTION.READ}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.WORSHIP_ATTENDANCE, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.WORSHIP_ATTENDANCE, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.WORSHIP_ATTENDANCE}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.WORSHIP_ATTENDANCE}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.WORSHIP_ATTENDANCE, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* MANAGEMENT */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.MANAGEMENT}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.MANAGEMENT, ACTION.READ)}
            title={t_unit(`${DOMAIN.MANAGEMENT}.${ACTION.READ}.title`)}
            description={t_unit(
              `${DOMAIN.MANAGEMENT}.${ACTION.READ}.description`
            )}
            onClick={onClick}
            isSelected={true} // 기존 로직 유지
            isEditable={false} // 기존 로직 유지
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.MANAGEMENT, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.MANAGEMENT}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.MANAGEMENT}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.MANAGEMENT, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>

      {/* PERMISSION */}
      <LabelContainer>
        <TitleContainer>
          <MainText fontSize={14} fontWeight={600}>
            {t_unit(`${DOMAIN.PERMISSION}.title`)}
          </MainText>
        </TitleContainer>
        <ItemContainer>
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.PERMISSION, ACTION.READ)}
            title={t_unit(`${DOMAIN.PERMISSION}.${ACTION.READ}.title`)}
            description={t_unit(
              `${DOMAIN.PERMISSION}.${ACTION.READ}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.PERMISSION, ACTION.READ)
            )}
            isEditable={isEditable}
          />
          <PermissionUnitItem
            id={getPermissionUnitId(DOMAIN.PERMISSION, ACTION.WRITE)}
            title={t_unit(`${DOMAIN.PERMISSION}.${ACTION.WRITE}.title`)}
            description={t_unit(
              `${DOMAIN.PERMISSION}.${ACTION.WRITE}.description`
            )}
            onClick={onClick}
            isSelected={selectedUnitIds?.includes(
              getPermissionUnitId(DOMAIN.PERMISSION, ACTION.WRITE)
            )}
            isEditable={isEditable}
          />
        </ItemContainer>
      </LabelContainer>
    </ListContainer>
  );
};

export default PermissionUnitListView;
