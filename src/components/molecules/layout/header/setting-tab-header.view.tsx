import React from 'react';
import styled from 'styled-components';

import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { useSettingHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { SIZE } from '@/constants/styles/style';

import { useI18n, useScopedI18n } from '../../../../../locales/client';

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

type SettingTabHeaderViewProps = {};

const SettingTabHeaderView = ({}: SettingTabHeaderViewProps) => {
  const t = useI18n();
  const contentId = useSelector((state: RootState) => state.layout.contentId);
  const headerBarItems = useSettingHeaderBarItems();

  return (
    <HeaderContainer>
      <MainText size={SIZE.EXTRA_LARGE}>{t('setting')}</MainText>
      <HeaderBottomContainer>
        <HeaderBar value={contentId} items={headerBarItems} />
      </HeaderBottomContainer>
    </HeaderContainer>
  );
};

export default SettingTabHeaderView;
