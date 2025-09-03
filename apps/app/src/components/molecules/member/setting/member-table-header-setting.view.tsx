import React from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { MAIN } from '@mokjang/constants';
import { useI18n } from '../../../../../locales/client';
import { Svg } from '@mokjang/assets';
import TableHeaderSettingItem from '../../../atoms/member/setting/table-header-setting-item';
import { MainText } from '@mokjang/components';

const TableSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  gap: 20px;
`;

const SettingHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const WarningIcon = styled(Svg.Warning)`
  width: 20px;
  height: 20px;
  stroke: ${MAIN.DEFAULT};
  stroke-width: 2px;
`;

const OrderItemList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

type TableSettingViewProps = {
  onDrop: (fromIndex: number, toIndex: number) => void;
};

const MemberTableHeaderSettingView = ({ onDrop }: TableSettingViewProps) => {
  const t = useI18n();
  const { memberTableHeaderItemList } = useSelector(
    (state: RootState) => state.memberFilter
  );
  return (
    <TableSettingContainer>
      <SettingHeader>
        <WarningIcon />
        <MainText>{t('description.tableHeaderSetting')}</MainText>
      </SettingHeader>
      <OrderItemList>
        {memberTableHeaderItemList.map((item, index) => (
          <TableHeaderSettingItem
            key={`${item}-${index}`}
            item={item}
            index={index}
            onDrop={onDrop}
          />
        ))}
      </OrderItemList>
    </TableSettingContainer>
  );
};

export default MemberTableHeaderSettingView;
