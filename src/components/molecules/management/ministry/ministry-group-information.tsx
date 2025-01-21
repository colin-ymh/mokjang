import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import {
  DEFAULT_MINISTRY_GROUP,
  Ministry,
  MinistryGroup,
} from '@/models/management/management';
import { useEffect, useState } from 'react';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import EditMinistryGroup from '@/components/molecules/management/ministry/edit-ministry-group';

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

const DivideLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${GRAY.LIGHT};
`;

type MinistryGroupInformationProps = {
  ministryGroupId: string;
};

const MinistryMinistryGroupInformation = ({
  ministryGroupId,
}: MinistryGroupInformationProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const ministriesApi = new MinistriesApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 그룹
  const [ministryGroup, setMinistryGroup] = useState<MinistryGroup>(
    DEFAULT_MINISTRY_GROUP
  );

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

  // 서버에서 그룹 불러오기
  const fetchMinistryGroup = () => {
    ministryGroupsApi
      .getMinistryGroup({ churchId, ministryGroupId })
      .then((response) => {
        setMinistryGroup(response.data);
        if (response.data?.ministries) setMinistries(response.data.ministries);
      });
  };

  useEffect(() => {
    if (churchId && ministryGroupId) {
      fetchMinistryGroup();
    }
  }, [churchId, ministryGroupId]);

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
              {ministryGroup?.ministries?.map((ministry) => {
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
          fetchMinistryGroup={fetchMinistryGroup}
        />
      </CustomPopup>
    </MinistryGroupInformationContainer>
  );
};

export default MinistryMinistryGroupInformation;
