import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Group } from '@/models/management/management';

const GroupInformationContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const GroupContentContainer = styled.div`
  display: flex;

  flex-direction: row;
  padding: 10px;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  padding: 0 10px;
`;

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  width: 100%;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const DivideLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
`;

type GroupInformationProps = {
  group: Group;
};

const GroupInformation = ({ group }: GroupInformationProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');

  return (
    <GroupInformationContainer>
      {/* 그룹 상세 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('groupInformation')}</MainText>
      </ListTypeHeader>
      <GroupContentContainer>
        <RowContainer>
          <InformationContainer>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{group.name}</MainText>
            </ContentContainer>
          </InformationContainer>
        </RowContainer>
        {/*<DivideLine />*/}
        <RowContainer>
          <InformationContainer>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
            </TitleContainer>
            <ContentContainer>
              {group.roles.map((role) => {
                return <MainText>{role.role}</MainText>;
              })}
            </ContentContainer>
          </InformationContainer>
        </RowContainer>
      </GroupContentContainer>
    </GroupInformationContainer>
  );
};

export default GroupInformation;
