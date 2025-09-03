import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import styled from 'styled-components';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { PermissionTemplate } from '@/models/permission/permission';
import {
  MainText,
  RadioButton,
  SvgIcon,
} from '../../../../../../../packages/components/src';
import { CURSOR } from '@/constants/styles/style';
import { useScopedI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;

  padding: 20px;
  width: 100%;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

const TemplateItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  padding: 20px 10px;
  gap: 10px;
  border-radius: 10px;
  background-color: ${({ $isSelected }) =>
    $isSelected ? MAIN.EXTRA_LIGHT : WHITE};
  border: ${({ $isSelected }) =>
    `1px solid ${$isSelected ? MAIN.DEFAULT : GRAY.LIGHT}`};
  cursor: pointer;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DescriptionItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  gap: 10px;
  border-radius: 10px;
  background-color: ${MAIN.EXTRA_LIGHT};
  border: 1px solid ${MAIN.LIGHT};
`;

type EditPermissionTemplateProps = {
  selectedTemplateId: string | null;
  onClickTemplateItem: (id: string) => void;
};

const EditPermissionTemplate = ({
  selectedTemplateId,
  onClickTemplateItem,
}: EditPermissionTemplateProps) => {
  const t_description = useScopedI18n('description');
  const { permissionTemplates } = useSelector(
    (state: RootState) => state.permissionTemplateFilter
  );

  return (
    <>
      <TemplateList>
        <ListContainer>
          {permissionTemplates?.map((item: PermissionTemplate) => (
            <TemplateItem
              key={item.id}
              $isSelected={selectedTemplateId === item.id}
              onClick={() => onClickTemplateItem(item.id)}
            >
              <RadioButton
                isSelected={selectedTemplateId === item.id}
                isBorder={false}
                onClick={() => onClickTemplateItem(item.id)}
              />
              <ColumnContainer>
                <MainText
                  fontSize={16}
                  fontWeight={500}
                  cursor={CURSOR.POINTER}
                >
                  {item.title}
                </MainText>
                <MainText
                  fontSize={14}
                  fontWeight={400}
                  color={GRAY.DARK}
                  cursor={CURSOR.POINTER}
                >
                  {'설명이 들어갈 자리입니다 아아아아아'}
                </MainText>
              </ColumnContainer>
            </TemplateItem>
          ))}
        </ListContainer>

        {selectedTemplateId === null && (
          <DescriptionItem>
            <SvgIcon svg={Svg.ArrowRight} color={MAIN.DEFAULT} />
            <MainText fontSize={14} fontWeight={400} color={MAIN.DEFAULT}>
              {t_description('editPermissionTemplate')}
            </MainText>
          </DescriptionItem>
        )}
      </TemplateList>
    </>
  );
};

export default EditPermissionTemplate;
