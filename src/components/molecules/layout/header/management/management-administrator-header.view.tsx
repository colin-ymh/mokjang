import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useManagementAdministratorHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { SIZE } from '@/constants/styles/style';

import { useScopedI18n } from '../../../../../../locales/client';
import { useParams } from 'next/navigation';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px 20px 0 20px;
  gap: 20px;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const HeaderBottomContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

type ManagementAdministratorHeaderViewProps = {
  onClickHeaderBar: (id: string) => void;
};

const ManagementAdministratorHeaderView = ({
  onClickHeaderBar,
}: ManagementAdministratorHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const headerBarItems = useManagementAdministratorHeaderBarItems();

  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>{t_header('administrator')}</MainText>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default ManagementAdministratorHeaderView;
