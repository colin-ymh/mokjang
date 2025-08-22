import { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import Button from '@/components/atoms/common/button/button';
import { GRAY, WHITE } from '@/constants/styles/color';
import MemberTableHeaderSetting from '@/components/molecules/member/setting/member-table-header-setting';
import FilteredItem from '@/components/atoms/member/setting/filtered-item';

import { useScopedI18n } from '../../../../../locales/client';
import SearchInput from '@/components/atoms/common/input/search-input';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';

import Setting from '../../../../../public/svg/setting.svg';
import Group from '../../../../../public/svg/group.svg';
import Filter from '../../../../../public/svg/filter.svg';
import GroupFilter from '@/components/molecules/member/setting/group-filter';
import ResetFilteredItem from '@/components/atoms/member/setting/reset-filtered-item';
import MemberFilter from '@/components/molecules/member/setting/member-filter';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${WHITE};
`;

const RowTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const RowBottom = styled.div`
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FilteredItemList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  overflow-x: scroll;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const SettingIcon = styled(Setting)`
  width: 14px;
  height: 14px;
  stroke: ${GRAY.EXTRA_DARK};
  stroke-width: 1.5px;
`;

const GroupIcon = styled(Group)`
  width: 14px;
  height: 14px;
  stroke: ${GRAY.EXTRA_DARK};
  stroke-width: 1.5px;
`;

const FilterIcon = styled(Filter)`
  width: 14px;
  height: 14px;
  stroke: ${GRAY.EXTRA_DARK};
  stroke-width: 1.5px;
`;

type MemberFilterViewProps = {
  isGroupFilterShown: boolean;
  isMemberFilterShown: boolean;
  isHeaderFilterShown: boolean;
  searchValue: string;
  searchRef: Ref<HTMLInputElement>;
  onClickGroupFilterOpen: () => void;
  onClickGroupFilterClose: () => void;
  onClickMemberFilterOpen: () => void;
  onClickMemberFilterClose: () => void;
  onClickHeaderFilterOpen: () => void;
  onClickHeaderFilterClose: () => void;
  onChangeSearchValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSearch: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const MemberFilterRowView = ({
  isGroupFilterShown,
  isMemberFilterShown,
  isHeaderFilterShown,
  searchValue,
  searchRef,
  onClickGroupFilterOpen,
  onClickGroupFilterClose,
  onClickMemberFilterOpen,
  onClickMemberFilterClose,
  onClickHeaderFilterOpen,
  onClickHeaderFilterClose,
  onChangeSearchValue,
  onClickSearch,
  onKeyDown,
}: MemberFilterViewProps) => {
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');

  const { filteredItems } = useSelector(
    (state: RootState) => state.memberFilter
  );

  return (
    <>
      <MemberFilterContainer>
        <RowTop>
          {/* 검색 부분 */}
          <LeftContainer>
            <SearchInput
              searchRef={searchRef}
              searchValue={searchValue}
              onChangeSearchValue={onChangeSearchValue}
              onKeyDown={onKeyDown}
              onClickSearch={onClickSearch}
            />
            {/* 그룹 필터 활성화 버튼 */}
            <Button
              text={t_button('groupFilter')}
              height={30}
              width={'auto'}
              onClick={onClickGroupFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.EXTRA_DARK}
              icon={<GroupIcon />}
            />
            {/* 교인 필터 활성화 버튼 */}
            <Button
              text={t_button('memberFilter')}
              height={30}
              width={'auto'}
              onClick={onClickMemberFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.EXTRA_DARK}
              icon={<FilterIcon />}
            />
          </LeftContainer>

          <ButtonContainer>
            {/* 표시 항목 설정 활성화 버튼 */}
            <Button
              text={t_button('tableHeaderSetting')}
              height={30}
              width={'auto'}
              onClick={onClickHeaderFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.EXTRA_DARK}
              icon={<SettingIcon />}
            />
          </ButtonContainer>
        </RowTop>

        {/* 필터 설정된 값들 */}
        {filteredItems.length > 0 && (
          <RowBottom>
            <FilteredItemList>
              {filteredItems.map((item) => (
                <FilteredItem key={item.title} item={item} />
              ))}
            </FilteredItemList>
            <ResetFilteredItem />
          </RowBottom>
        )}
      </MemberFilterContainer>

      {/* 그룹 필터 설정 모달 */}
      <CustomPopup
        isShow={isGroupFilterShown}
        headerTitle={t_title('groupFilter')}
        onClickCancel={onClickGroupFilterClose}
        width={400}
        height={500}
      >
        <GroupFilter />
      </CustomPopup>

      {/* 교인 필터 설정 모달 */}
      <CustomPopup
        isShow={isMemberFilterShown}
        headerTitle={t_title('memberFilter')}
        onClickCancel={onClickMemberFilterClose}
        width={500}
        height={800}
        cancelText={t_button('close')}
      >
        <MemberFilter />
      </CustomPopup>

      {/* 표시 항목 설정 모달 */}
      <CustomPopup
        isShow={isHeaderFilterShown}
        headerTitle={t_title('tableHeaderSetting')}
        onClickCancel={onClickHeaderFilterClose}
        width={500}
        height={800}
      >
        <MemberTableHeaderSetting />
      </CustomPopup>
    </>
  );
};

export default MemberFilterRowView;
