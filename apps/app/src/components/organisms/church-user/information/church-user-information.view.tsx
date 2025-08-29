import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useI18n } from '../../../../../locales/client';
import React from 'react';
import { MainText } from '../../../atoms/common/text/main-text';
import { SIZE } from '../../../../constants/styles/style';
import HeaderBar from '../../../atoms/layout/header/header-bar';
import { CHURCH_USER_HEADER_ID } from '../../../../constants/layout/header';
import { useChurchUserHeaderBarItems } from '../../../../hooks/layout/header-bar-items';
import ChurchUserAccount from '../../../molecules/church-user/information/church-user-account';
import { getFormattedMobilePhone } from '../../../../utils/format';
import ChurchUserPermission from '../../../molecules/church-user/information/church-user-permission';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height: 50px;
  flex-shrink: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
`;

type ChurchUserInformationViewProps = {
  isManager: boolean;
  headerBarValue: CHURCH_USER_HEADER_ID;
  onChangeHeader: (value: CHURCH_USER_HEADER_ID) => void;
};

const ChurchUserInformationView = ({
  isManager,
  headerBarValue,
  onChangeHeader,
}: ChurchUserInformationViewProps) => {
  const t = useI18n();
  const headerBarItems = useChurchUserHeaderBarItems(isManager);
  const { targetChurchUser } = useSelector(
    (state: RootState) => state.targetChurchUser
  );

  return (
    <InformationContainer>
      <HeaderContainer>
        <MainText size={SIZE.LARGE} fontWeight={600}>
          {`${targetChurchUser?.user.name}(${getFormattedMobilePhone(targetChurchUser?.user.mobilePhone)})`}
        </MainText>
      </HeaderContainer>
      <ContentContainer>
        <HeaderBar
          value={headerBarValue}
          items={headerBarItems}
          onClick={onChangeHeader}
        />
        {headerBarValue === CHURCH_USER_HEADER_ID.ACCOUNT && (
          <ChurchUserAccount />
        )}
        {headerBarValue === CHURCH_USER_HEADER_ID.PERMISSION && (
          <ChurchUserPermission />
        )}
      </ContentContainer>
    </InformationContainer>
  );
};

export default ChurchUserInformationView;
