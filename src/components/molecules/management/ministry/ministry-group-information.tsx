import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { Ministry, MinistryGroup } from '@/models/management/management';
import { useEffect, useState } from 'react';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import EditMinistryGroup from '@/components/molecules/management/ministry/edit-ministry-group';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';

const MinistryGroupInformationContainer = styled.div`
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

const MinistryGroupContentContainer = styled.div`
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

type MinistryGroupInformationProps = {
  ministryGroup: MinistryGroup;
  fetchMinistryGroups: () => void;
};

const MinistryMinistryGroupInformation = ({
  ministryGroup,
  fetchMinistryGroups,
}: MinistryGroupInformationProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');
  const t_popup = useScopedI18n('popup');
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 그룹 역할
  const [ministries, setMinistries] = useState<Ministry[]>([]);

  // 그룹 정보 수정 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  // 그룹 정보 수정 모달 열기
  const onClickOpen = () => {
    setIsModalShown(true);
  };

  // 그룹 정보 수정 모달 닫기
  const onClickClose = () => {
    setIsModalShown(false);
  };

  // 사역 그룹의 역할 불러오기
  const fetchMinistries = async () => {
    try {
      const response = await ministryGroupsApi.getMinistryGroup({
        churchId,
        ministryGroupId: ministryGroup.id as string,
      });

      const newMinistryGroup: MinistryGroup = response.data;
      if (newMinistryGroup?.ministries) {
        setMinistries(newMinistryGroup.ministries);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (ministryGroup.id) {
      fetchMinistries();
    }
  }, [ministryGroup]);

  return (
    <MinistryGroupInformationContainer>
      {/* 그룹 상세 헤더 */}
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>
          {t_header('ministryGroupInformation')}
        </MainText>
      </ListTypeHeader>
      <MinistryGroupContentContainer>
        {/* 그룹명*/}
        <RowContainer>
          <InformationContainer onClick={onClickOpen}>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupName')}</MainText>
            </TitleContainer>
            <ContentContainer>
              <MainText>{ministryGroup.name}</MainText>
            </ContentContainer>
          </InformationContainer>
        </RowContainer>
        {/*<DivideLine />*/}
        {/* 그룹 역할 */}
        <RowContainer>
          <InformationContainer onClick={onClickOpen}>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t('groupRole')}</MainText>
            </TitleContainer>
            <ContentContainer>
              {ministries.map((ministry) => {
                return <MainText key={ministry.id}>{ministry.name}</MainText>;
              })}
            </ContentContainer>
          </InformationContainer>
        </RowContainer>
      </MinistryGroupContentContainer>
      {/* 그룹 수정 모달 */}
      <CustomPopup
        isShow={isModalShown}
        onClickClose={onClickClose}
        width={30}
        height={70}
        isPercentage={true}
      >
        <EditMinistryGroup
          ministryGroup={ministryGroup}
          ministries={ministries}
          onClickClose={onClickClose}
          fetchMinistryGroups={fetchMinistryGroups}
          setIsToastShown={setIsToastShown}
        />
      </CustomPopup>
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
    </MinistryGroupInformationContainer>
  );
};

export default MinistryMinistryGroupInformation;
