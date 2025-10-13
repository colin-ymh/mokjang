import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import {
  setFilteredItems,
  setMemberFilter,
} from '../../../../redux/reducers/filter/member-filter-reducer';

import {
  getAge,
  getDateFromDateString,
  getTranslatedAge,
  getTrimmedString,
} from '@mokjang/utils';
import MemberFilterRowView from './member-filter-row.view';
import { BLACK, BLANK, DESTRUCTIVE, LOCALE, MEMBER } from '@mokjang/constants';
import { FilteredItemType } from '../../../atoms/member/setting/filtered-item.view';
import { usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getMembersFromXlsx } from '@/utils/xlsx';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { Loading } from '@mokjang/components';
import { MembersApi } from '@/api/members/members.api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const MemberFilterRow = () => {
  const t_popup = useScopedI18n('popup');
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const dispatch = useDispatch<AppDispatch>();

  const membersApi = new MembersApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { memberFilter } = useSelector(
    (state: RootState) => state.memberFilter
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isExcelOpened, setIsExcelOpened] = useState(true);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickExcel = () => {
    setIsExcelOpened(!isExcelOpened);
  };

  const onClickExcelDownload = () => {
    const { data } = supabase.storage
      .from('file')
      .getPublicUrl('xlsx/ekkly_member_upload.xlsx', {
        download: '교인등록_엑셀시트.xlsx',
      });

    // data.publicUrl 그대로 열면 다운로드
    window.location.href = data.publicUrl;
  };

  const onClickExcelUpload = () => {
    fileInputRef.current?.click();
  };

  const onChangeUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // object[]로 변환
      const newMembers = await getMembersFromXlsx(file);

      await membersApi.createMembersBulk({ churchId }, { members: newMembers });
      dispatch(setToastBackgroundColor(BLACK));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));

      // ✅ 로딩이 종료되면 페이지를 새로고침
      window.location.reload();
    } catch (error: any) {
      if (error instanceof Error) {
        dispatch(setToastText(t_popup('bulkFail')));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      event.target.value = '';
      setIsLoading(false);
    }
  };

  // 그룹 필터 설정 on off
  const [isGroupFilterShown, setIsGroupFilterShown] = useState<boolean>(false);

  // 교인 필터 설정 on off
  const [isMemberFilterShown, setIsMemberFilterShown] =
    useState<boolean>(false);

  // 표시 항목 설정 on off
  const [isHeaderFilterShown, setIsHeaderFilterShown] =
    useState<boolean>(false);

  // 그룹 필터 설정 열기
  const onClickGroupFilterOpen = () => {
    setIsGroupFilterShown(true);
  };

  // 그룹 필터 설정 닫기
  const onClickGroupFilterClose = () => {
    setIsGroupFilterShown(false);
  };

  // 교인 필터 설정 열기
  const onClickMemberFilterOpen = () => {
    setIsMemberFilterShown(true);
  };

  // 교인 필터 설정 닫기
  const onClickMemberFilterClose = () => {
    setIsMemberFilterShown(false);
  };

  // 표시 항목 설정 열기
  const onClickHeaderFilterOpen = () => {
    setIsHeaderFilterShown(true);
  };

  // 표시 항목 설정 닫기
  const onClickHeaderFilterClose = () => {
    setIsHeaderFilterShown(false);
  };

  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(setMemberFilter({ ...memberFilter, search: searchValue }));
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 필터된 내용들을 태그 형식으로 변환
  useEffect(() => {
    let newFilterItems: FilteredItemType[] = [];

    // 그룹
    if (memberFilter.groupId) {
      newFilterItems.push({
        title: MEMBER.GROUP,
        value: [memberFilter.groupId],
      });
    }

    // 직분
    if (memberFilter.officerIds.length > 0) {
      newFilterItems.push({
        title: MEMBER.OFFICER,
        value: memberFilter.officerIds,
      });
    }
    // 결혼
    if (memberFilter.marriageStatuses.length > 0) {
      newFilterItems.push({
        title: MEMBER.MARRIAGE,
        value: memberFilter.marriageStatuses,
      });
    }
    // 신급
    if (memberFilter.baptismStatuses.length > 0) {
      newFilterItems.push({
        title: MEMBER.BAPTISM,
        value: memberFilter.baptismStatuses,
      });
    }

    // 생년월일
    if (memberFilter.birthFrom || memberFilter.birthTo) {
      newFilterItems.push({
        title: MEMBER.BIRTH,
        value: [
          getTranslatedAge(
            locale,
            getAge(getDateFromDateString(memberFilter.birthTo))
          ),
          getTranslatedAge(
            locale,
            getAge(getDateFromDateString(memberFilter.birthFrom))
          ),
        ],
      });
    }

    // 등록일
    if (memberFilter.registeredFrom || memberFilter.registeredTo) {
      newFilterItems.push({
        title: MEMBER.REGISTERED_AT,
        value: [memberFilter.registeredFrom, memberFilter.registeredTo],
      });
    }

    // 이름
    if (memberFilter.search) {
      newFilterItems.push({
        title: MEMBER.SEARCH,
        value: [memberFilter.search],
      });
    }

    dispatch(setFilteredItems(newFilterItems));
  }, [memberFilter]);

  const props = {
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
  };

  return (
    <>
      <MemberFilterRowView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default MemberFilterRow;
