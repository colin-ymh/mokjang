import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { SIZE } from '@/constants/styles/style';
import TableOrderItem from '@/components/atoms/member/list/table-order-item';
import { MEMBER } from '@/constants/member/member-column';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import Dropdown from '@/components/atoms/common/dropdown/dropdown';
import { NULL } from '@/constants/constant';
import { useMemberFilterContent } from '@/hooks/filter/filter';
import FilterItemList from '@/components/atoms/member/list/filter-item-list';
import DateFilter from '@/components/atoms/member/list/date-filter';

import Cancel from '../../../../../public/svg/cancel.svg';
import Reset from '../../../../../public/svg/arrow-uturn.svg';
import { useI18n, useScopedI18n } from '../../../../../locales/client';

const TableSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px;
  z-index: 50;
`;

const SettingHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const TitleContainer = styled.div`
  padding: 10px;
`;

const SettingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 10px;
`;

const OrderItemList = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow-y: auto;
`;

const DivideLine = styled.div`
  height: 100%;
  width: 1px;
  background-color: ${GRAY.LIGHT};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const ResetButton = styled(Reset)`
  display: flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
  stroke-width: 1px;
  margin-top: 2px;
`;

const FilterContainer = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
`;

type TableSettingViewProps = {
  filterValue: MEMBER | typeof NULL;
  filterDropdownItems: DropdownValueType[];
  onDragItem: (fromIndex: number, toIndex: number) => void;
  onChangeFilter: (id: MEMBER | typeof NULL) => void;
  onClickFilterItem: (itemId: string) => void;
  onClickCancel: () => void;
  onClickReset: () => void;
  onChangeAfter: (date: Date | null) => void;
  onChangeRawAfter: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeBefore: (date: Date | null) => void;
  onChangeRawBefore: (event: ChangeEvent<HTMLInputElement>) => void;
};

const TableSettingView = ({
  filterValue,
  filterDropdownItems,
  onDragItem,
  onChangeFilter,
  onClickFilterItem,
  onClickCancel,
  onClickReset,
  onChangeAfter,
  onChangeRawAfter,
  onChangeBefore,
  onChangeRawBefore,
}: TableSettingViewProps) => {
  const { memberTableHeaderItemList, filterItems, filterAfter, filterBefore } =
    useSelector((state: RootState) => state.memberFilter);
  const { officers, educations, ministries } = useSelector(
    (state: RootState) => state.church
  );

  const t = useI18n();
  const t_button = useScopedI18n('button');

  const [filterContent, setFilterContent] = useState<any>();

  useEffect(() => {
    if (filterValue !== NULL) {
      setFilterContent(
        useMemberFilterContent(t, officers, educations, ministries, filterValue)
      );
    }
  }, [filterValue]);

  return (
    <TableSettingContainer>
      {/* Header */}
      <SettingHeader>
        <TitleContainer>
          <MainText size={SIZE.LARGE}>{t_button('filterSetting')}</MainText>
        </TitleContainer>
        <ButtonContainer>
          <ResetButton onClick={onClickReset} />
          <CancelButton onClick={onClickCancel} />
        </ButtonContainer>
      </SettingHeader>
      {/* Content */}
      <SettingContent>
        {/* 헤더 순서 설정*/}
        <ContentContainer>
          <OrderItemList>
            {memberTableHeaderItemList
              .filter((item) => item.id !== 'check')
              .map((item, index) => (
                <TableOrderItem
                  key={item.id}
                  item={item}
                  index={index}
                  onDrag={onDragItem}
                  onChangeFilter={onChangeFilter}
                />
              ))}
          </OrderItemList>
        </ContentContainer>
        <DivideLine />
        {/* 필터 설정 */}
        <ContentContainer>
          <Dropdown
            value={filterValue}
            items={filterDropdownItems}
            borderColor={GRAY.LIGHT}
            onChangeItem={onChangeFilter}
          />
          <FilterContainer>
            {filterValue !== NULL &&
            [MEMBER.BIRTH, MEMBER.REGISTERED_AT, MEMBER.UPDATED_AT].includes(
              filterValue
            ) ? (
              <DateFilter
                dateAfter={filterAfter}
                dateBefore={filterBefore}
                onChangeAfter={onChangeAfter}
                onChangeRawAfter={onChangeRawAfter}
                onChangeBefore={onChangeBefore}
                onChangeRawBefore={onChangeRawBefore}
              />
            ) : (
              <FilterItemList
                items={filterContent}
                filterItems={filterItems}
                onClickFilterItem={onClickFilterItem}
              />
            )}
          </FilterContainer>
        </ContentContainer>
      </SettingContent>
    </TableSettingContainer>
  );
};

export default TableSettingView;
