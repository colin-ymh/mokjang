import React from "react";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, MAIN } from "@/constants/styles/color";
import { SIZE } from "@/constants/styles/style";
import TableOrderItem from "@/components/atoms/member/list/table-order-item";
import { MEMBER } from "@/constants/member/member-column";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import Dropdown from "@/components/atoms/common/dropdown/dropdown";
import { NULL } from "@/constants/constant";
import { useMemberFilterContent } from "@/hooks/filter/filter";

import Cancel from "../../../../../public/svg/cancel.svg";
import Check from "../../../../../public/svg/check.svg";
import { useI18n, useScopedI18n } from "../../../../../locales/client";

const TableSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 10px;
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

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
`;

const FilterContainer = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: 10px 0;
`;

const FilterItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterItem = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
`;

const ItemDivideLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${GRAY.LIGHT};
`;

const CheckButton = styled(Check)<{ $isSelected: boolean }>`
  display: flex;
  stroke: ${({ $isSelected }) => ($isSelected ? MAIN.DEFAULT : GRAY.DEFAULT)};
`;

type TableSettingViewProps = {
  filterValue: MEMBER | typeof NULL;
  filterDropdownItems: DropdownValueType[];
  onDragItem: (fromIndex: number, toIndex: number) => void;
  onChangeFilter: (id: MEMBER | typeof NULL) => void;
};

const TableSettingView = ({
  filterValue,
  filterDropdownItems,
  onDragItem,
  onChangeFilter,
}: TableSettingViewProps) => {
  const memberTableHeaderItemList = useSelector(
    (state: RootState) => state.memberFilter.memberTableHeaderItemList,
  );
  const { officers } = useSelector((state: RootState) => state.church);
  const t = useI18n();
  const t_button = useScopedI18n("button");

  return (
    <TableSettingContainer>
      {/* Header */}
      <SettingHeader>
        <TitleContainer>
          <MainText size={SIZE.LARGE}>{t_button("filterSetting")}</MainText>
        </TitleContainer>
        <CancelButton />
      </SettingHeader>
      {/* Content */}
      <SettingContent>
        {/* 헤더 순서 설정*/}
        <ContentContainer>
          <OrderItemList>
            {memberTableHeaderItemList.map((item, index) => (
              <TableOrderItem
                key={item.id}
                item={item}
                index={index}
                onDrag={onDragItem}
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
              useMemberFilterContent(t, officers, filterValue)?.map((item) => {
                return (
                  <FilterItemContainer key={item.value}>
                    <FilterItem>
                      <MainText>{item.title}</MainText>
                      {/*<CheckButton />*/}
                    </FilterItem>
                    <ItemDivideLine />
                  </FilterItemContainer>
                );
              })}
          </FilterContainer>
        </ContentContainer>
      </SettingContent>
    </TableSettingContainer>
  );
};

export default TableSettingView;
