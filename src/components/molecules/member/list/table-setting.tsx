import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  INITIAL_MEMBER_FILTER,
  INITIAL_TABLE_HEADER_LIST,
  setFilterAfter,
  setFilterBefore,
  setFilterItems,
  setFilterValue,
  setMemberFilter,
  setMemberTableHeaderItemList,
} from '@/redux/reducers/member-filter-reducer';

import TableSettingView from '@/components/molecules/member/list/table-setting.view';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { getTranslatedMemberColumn } from '@/utils/translate';
import { MEMBER } from '@/constants/member/member-column';
import { BLANK, NULL } from '@/constants/constant';
import { getFormattedDate } from '@/utils/format';

import { useI18n } from '../../../../../locales/client';

type AddFilterProps = {
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const TableSetting = ({ setIsShown }: AddFilterProps) => {
  const {
    memberTableHeaderItemList,
    memberFilter,
    filterValue,
    filterItems,
    filterBefore,
    filterAfter,
  } = useSelector((state: RootState) => state.memberFilter);
  const dispatch = useDispatch<AppDispatch>();
  const t = useI18n();

  // 필터 가능 항목
  const [filterDropdownItems, setFilterDropdownItems] = useState<
    DropdownValueType[]
  >([]);

  const DEFAULT_FILTER_ITEM = { value: NULL, title: '필터 추가하기' };

  // 칼럼들을 드래그하여 순서 변경
  const onDragItem = (fromIndex: number, toIndex: number) => {
    const updatedHeaders = [...memberTableHeaderItemList];
    const [movedItem] = updatedHeaders.splice(fromIndex, 1);
    updatedHeaders.splice(toIndex, 0, movedItem);

    dispatch(setMemberTableHeaderItemList(updatedHeaders));
  };

  // 드롭다운 아이템을 선택 시 이벤트
  const onChangeFilter = (id: MEMBER | typeof NULL) => {
    dispatch(setFilterValue(id));

    // 해당 드롭다운에 대한 필터값들 설정
    if (id !== NULL) {
      // 날짜형 필터인 경우 (3가지)
      if (
        [MEMBER.BIRTH, MEMBER.REGISTERED_AT, MEMBER.UPDATED_AT].includes(id)
      ) {
        if (id === MEMBER.BIRTH) {
          dispatch(setFilterAfter(memberFilter.birthAfter));
          dispatch(setFilterBefore(memberFilter.birthBefore));
        } else if (id === MEMBER.REGISTERED_AT) {
          dispatch(setFilterAfter(memberFilter.registerAfter));
          dispatch(setFilterBefore(memberFilter.registerBefore));
        } else if (id === MEMBER.UPDATED_AT) {
          dispatch(setFilterAfter(memberFilter.updateAfter));
          dispatch(setFilterBefore(memberFilter.updateBefore));
        }
      }
      // 그 외 선택형 필터인 경우
      else if (
        [
          MEMBER.GENDER,
          MEMBER.GROUP,
          MEMBER.MINISTRIES,
          MEMBER.OFFICER,
          MEMBER.EDUCATIONS,
          MEMBER.MARRIAGE,
          MEMBER.BAPTISM,
        ].includes(id)
      ) {
        dispatch(
          setFilterItems(
            memberFilter[
              id as
                | MEMBER.GENDER
                | MEMBER.GROUP
                | MEMBER.MINISTRIES
                | MEMBER.OFFICER
                | MEMBER.EDUCATIONS
                | MEMBER.MARRIAGE
                | MEMBER.BAPTISM
            ]
          )
        );
      }
    }
  };

  // 현재 보여지는 헤더 중 필터 가능한 항목들을 추려 드롭다운 아이템으로 변환
  useEffect(() => {
    const newFilterDropdownItems = memberTableHeaderItemList
      .filter((item) => item.isShown && item.isFilterable)
      .map((item) => {
        return { value: item.id, title: getTranslatedMemberColumn(t, item.id) };
      });

    setFilterDropdownItems([...newFilterDropdownItems, DEFAULT_FILTER_ITEM]);
  }, [memberTableHeaderItemList]);

  // 필터 아이템 체크버튼 이벤트
  const onClickFilterItem = (itemId: string) => {
    // 이전 선택 여부
    const isSelected = filterItems?.includes(itemId);

    let newItems;

    if (isSelected) {
      // 이미 선택된 상태였으면
      // 지우기
      newItems = filterItems.filter((prev) => prev !== itemId);
    } else {
      // 선택이 안된 상태였으면
      // 새로 추가하기
      newItems = [...filterItems, itemId];
    }
    dispatch(setFilterItems(newItems));
  };

  // 선택형 필터의 내용 변경 시, 서버에 즉시 적용
  useEffect(() => {
    // 필터 내용이 변경되면
    // memberFilter 를 수정하여 서버에 재요청
    dispatch(setMemberFilter({ ...memberFilter, [filterValue]: filterItems }));
  }, [filterItems]);

  // 필터 닫기
  const onClickCancel = () => {
    setIsShown(false);
  };

  // 필터 초기화
  const onClickReset = () => {
    dispatch(setMemberFilter(INITIAL_MEMBER_FILTER));
    dispatch(setMemberTableHeaderItemList(INITIAL_TABLE_HEADER_LIST));
    dispatch(setFilterValue(NULL));
    dispatch(setFilterItems([]));
    dispatch(setFilterAfter(BLANK));
    dispatch(setFilterBefore(BLANK));
  };

  // ~부터 날짜 변경
  const onChangeAfter = (event: ChangeEvent<HTMLInputElement>) => {
    const newDateAfter = getFormattedDate(event.target.value);
    dispatch(setFilterAfter(newDateAfter));
  };

  // ~까지 날짜 변경
  const onChangeBefore = (event: ChangeEvent<HTMLInputElement>) => {
    const newDateBefore = getFormattedDate(event.target.value);
    dispatch(setFilterBefore(newDateBefore));
  };

  // 날짜 변경 시 이벤트
  useEffect(() => {
    if (filterValue === MEMBER.BIRTH) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          birthBefore: filterBefore,
          birthAfter: filterAfter,
        })
      );
    } else if (filterValue === MEMBER.REGISTERED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          registerBefore: filterBefore,
          registerAfter: filterAfter,
        })
      );
    } else if (filterValue === MEMBER.UPDATED_AT) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          updateBefore: filterBefore,
          updateAfter: filterAfter,
        })
      );
    }
  }, [filterAfter, filterBefore]);

  // 만약 특정 필터를 보고있던 중, 해당 필터를 비활성화 한 경우
  // 필터 내용을 초기화
  useEffect(() => {
    if (
      !memberTableHeaderItemList.find((item) => item.id === filterValue)
        ?.isShown
    ) {
      dispatch(setFilterValue(NULL));
    }
  }, [memberTableHeaderItemList]);

  // esc 시에 설정창 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsShown(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setIsShown]);

  const props = {
    filterValue,
    filterDropdownItems,
    onDragItem,
    onChangeFilter,
    onClickFilterItem,
    onClickCancel,
    onClickReset,
    onChangeAfter,
    onChangeBefore,
  };

  return (
    <>
      <TableSettingView {...props} />
    </>
  );
};

export default TableSetting;
