import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getTrimmedString } from '@/utils/format';
import { VISITATION } from '@/constants/visitation/visitation-column';
import { BLANK } from '@/constants/constant';
import VisitationRowView, {
  VISITATION_SEARCH_FILTER,
} from '@/components/molecules/visitation/visitation-row.view';
import { VisitationFilteredItemType } from '@/components/atoms/visitation/visitation-filtered-item';
import { setVisitationFilter } from '@/redux/reducers/visitation-filter-reducer';
import { VISITATION_STATUS } from '@/models/visitation/visitation';

const VisitationRow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { visitationFilter } = useSelector(
    (state: RootState) => state.visitationFilter
  );
  // 기간 설정  모달 on off
  const [isModalShown, setIsAddFilterShown] = useState<boolean>(false);

  // 목록 설정 모달 열기
  const onClickPeriodModal = () => {
    setIsAddFilterShown(!isModalShown);
  };

  // 목록 설정 닫기
  const onClickClosePeriodModal = () => {
    setIsAddFilterShown(false);
  };

  // 기간 저장
  const onClickSavePeriod = (startDate: string, endDate: string) => {
    dispatch(
      setVisitationFilter({
        ...visitationFilter,
        [VISITATION.FROM_DATE]: startDate,
        [VISITATION.TO_DATE]: endDate,
      })
    );
    setIsAddFilterShown(false);
  };

  // 상태 필터
  const [statusFilter, setStatusFilter] = useState<
    VISITATION_STATUS | undefined
  >(undefined);

  // 검색 주제 선택
  const onClickStatusFilterItem = (value: VISITATION_STATUS) => {
    setStatusFilter(value);
    if (value) {
      dispatch(
        setVisitationFilter({
          ...visitationFilter,
          [VISITATION.STATUS]: [value],
        })
      );
    } else {
      dispatch(
        setVisitationFilter({
          ...visitationFilter,
          [VISITATION.STATUS]: [],
        })
      );
    }
  };

  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<VISITATION_SEARCH_FILTER>(
    VISITATION.TITLE
  );
  // 검색 내용 ref
  const searchRef = useRef<HTMLInputElement>(null);
  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 필터 내용 태그
  const [filteredItems, setFilteredItems] = useState<
    VisitationFilteredItemType[]
  >([]);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: VISITATION_SEARCH_FILTER) => {
    setSearchFilter(value);
  };

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 검색 버튼
  const onClickSearch = () => {
    dispatch(
      setVisitationFilter({ ...visitationFilter, [searchFilter]: searchValue })
    );
  };

  // 검색 중 엔터
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchRef.current === document.activeElement) {
      onClickSearch();
    }
  };

  // 필터된 내용들을 태그 형식으로 변환
  useEffect(() => {
    let newFilterItems: VisitationFilteredItemType[] = [];

    // 상태
    if (visitationFilter.visitationStatus.length > 0) {
      newFilterItems.push({
        title: VISITATION.STATUS,
        value: visitationFilter.visitationStatus,
      });
    } else {
      setStatusFilter(undefined);
    }

    // 방식
    if (visitationFilter.visitationMethod.length > 0) {
      newFilterItems.push({
        title: VISITATION.METHOD,
        value: visitationFilter.visitationMethod,
      });
    }
    // 종류
    if (visitationFilter.visitationType.length > 0) {
      newFilterItems.push({
        title: VISITATION.TYPE,
        value: visitationFilter.visitationType,
      });
    }

    // 일자
    if (
      visitationFilter.fromVisitationDate ||
      visitationFilter.toVisitationDate
    ) {
      newFilterItems.push({
        title: VISITATION.DATE,
        value: [
          visitationFilter.fromVisitationDate,
          visitationFilter.toVisitationDate,
        ],
      });
    }

    // 이름
    if (visitationFilter.visitationTitle) {
      newFilterItems.push({
        title: VISITATION.TITLE,
        value: [visitationFilter.visitationTitle],
      });
    }

    setFilteredItems(newFilterItems);
  }, [visitationFilter]);

  useEffect(() => {}, []);

  const props = {
    isModalShown,
    statusFilter,
    searchFilter,
    searchValue,
    searchRef,
    filteredItems,
    onClickStatusFilterItem,
    onClickPeriodModal,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onClickSearch,
    onKeyDown,
    onClickClosePeriodModal,
    onClickSavePeriod,
  };

  return (
    <>
      <VisitationRowView {...props} />
    </>
  );
};

export default VisitationRow;
