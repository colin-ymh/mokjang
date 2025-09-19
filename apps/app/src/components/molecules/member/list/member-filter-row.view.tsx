import React, { ChangeEvent, Ref } from 'react';
import styled from 'styled-components';

import { Button, CustomPopup, SvgIcon } from '@mokjang/components';
import { GRAY, WHITE } from '@mokjang/constants';
import MemberTableHeaderSetting from '../setting/member-table-header-setting';
import FilteredItem from '../../../atoms/member/setting/filtered-item';

import { useScopedI18n } from '../../../../../locales/client';
import SearchInput from '../../../atoms/common/input/search-input';

import { Svg } from '@mokjang/assets';
import GroupFilter from '../setting/group-filter';
import ResetFilteredItem from '../../../atoms/member/setting/reset-filtered-item';
import MemberFilter from '../setting/member-filter';
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

const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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

const FileSelector = styled.input`
  display: none;
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

  fileInputRef: Ref<HTMLInputElement>;
  isExcelOpened: boolean;
  onClickExcel: () => void;
  onClickExcelDownload: () => void;
  onClickExcelUpload: () => void;
  onChangeUpload: (event: ChangeEvent<HTMLInputElement>) => void;
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

  fileInputRef,
  isExcelOpened,
  onClickExcel,
  onClickExcelDownload,
  onClickExcelUpload,
  onChangeUpload,
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
              color={GRAY.SEMI_DARK}
            />
            {/* 그룹 필터 활성화 버튼 */}
            <Button
              text={t_button('groupFilter')}
              height={30}
              width={'auto'}
              onClick={onClickGroupFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.SEMI_DARK}
              icon={<SvgIcon svg={Svg.Group} color={GRAY.SEMI_DARK} />}
            />
            {/* 교인 필터 활성화 버튼 */}
            <Button
              text={t_button('memberFilter')}
              height={30}
              width={'auto'}
              onClick={onClickMemberFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.SEMI_DARK}
              icon={<SvgIcon svg={Svg.Filter} color={GRAY.SEMI_DARK} />}
            />
          </LeftContainer>

          <RightContainer>
            <Button
              height={30}
              width={'auto'}
              onClick={onClickExcel}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.SEMI_DARK}
              icon={
                <SvgIcon
                  svg={isExcelOpened ? Svg.Cancel : Svg.Download}
                  color={GRAY.SEMI_DARK}
                />
              }
            />
            {/* 엑셀 다운로드 */}
            {isExcelOpened && (
              <Button
                text={t_button('downloadMemberExcel')}
                height={30}
                width={'auto'}
                onClick={onClickExcelDownload}
                backgroundColor={WHITE}
                borderColor={GRAY.LIGHT}
                color={GRAY.SEMI_DARK}
                icon={<SvgIcon svg={Svg.Download} color={GRAY.SEMI_DARK} />}
              />
            )}
            {/* 엑셀 업로드 */}
            {isExcelOpened && (
              <Button
                text={t_button('uploadMemberExcel')}
                height={30}
                width={'auto'}
                onClick={onClickExcelUpload}
                backgroundColor={WHITE}
                borderColor={GRAY.LIGHT}
                color={GRAY.SEMI_DARK}
                icon={<SvgIcon svg={Svg.Upload} color={GRAY.SEMI_DARK} />}
              />
            )}
            <FileSelector
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={onChangeUpload}
            />
            {/* 표시 항목 설정 활성화 버튼 */}
            <Button
              text={t_button('tableHeaderSetting')}
              height={30}
              width={'auto'}
              onClick={onClickHeaderFilterOpen}
              backgroundColor={WHITE}
              borderColor={GRAY.LIGHT}
              color={GRAY.SEMI_DARK}
              icon={<SvgIcon svg={Svg.Setting} color={GRAY.SEMI_DARK} />}
            />
          </RightContainer>
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
        onClickClose={onClickGroupFilterClose}
        onClickCancel={onClickGroupFilterClose}
        width={400}
        height={500}
        cancelText={t_button('close')}
      >
        <GroupFilter />
      </CustomPopup>

      {/* 교인 필터 설정 모달 */}
      <CustomPopup
        isShow={isMemberFilterShown}
        headerTitle={t_title('memberFilter')}
        onClickClose={onClickMemberFilterClose}
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
        onClickClose={onClickHeaderFilterClose}
        onClickCancel={onClickHeaderFilterClose}
        width={500}
        height={800}
        cancelText={t_button('close')}
      >
        <MemberTableHeaderSetting />
      </CustomPopup>
    </>
  );
};

export default MemberFilterRowView;
