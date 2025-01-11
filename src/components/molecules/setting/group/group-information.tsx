import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Group } from '@/models/setting/setting';

const InformationContainer = styled.div`
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

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 10px;
`;

type GroupInformationProps = {
  group: Group;
};

const GroupInformation = ({ group }: GroupInformationProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');

  return (
    <InformationContainer>
      {/* 그룹 상세 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('groupInformation')}</MainText>
      </ListTypeHeader>
      <ContentContainer>
        <RowContainer>
          <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
          <MainText>{group.name}</MainText>
        </RowContainer>
        <RowContainer>
          <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
          <MainText>{}</MainText>
        </RowContainer>
      </ContentContainer>
    </InformationContainer>
  );
};

export default GroupInformation;
