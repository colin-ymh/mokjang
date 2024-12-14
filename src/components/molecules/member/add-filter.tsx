import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  INITIAL_MEMBER_FILTER,
  setMemberFilter,
} from "@/redux/reducers/member-filter-reducer";

import AddFilterView, {
  NONE_SEARCH_FILTER,
  SEARCH_FILTER,
} from "@/components/molecules/member/add-filter.view";
import { MEMBER } from "@/constants/member/member-column";
import { BAPTISM, BLANK, GENDER, NULL } from "@/constants/constant";
import { getFormattedDate, getTrimmedString } from "@/utils/format";
import { getIsWellFormedBirth } from "@/utils/check";

type AddFilterProps = {
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const AddFilter = ({ setIsShown }: AddFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  // 검색 필터 주제
  const [searchFilter, setSearchFilter] = useState<SEARCH_FILTER>(MEMBER.NAME);

  // 검색 필터 내용
  const [searchValue, setSearchValue] = useState<string>(BLANK);

  // 현재 열려있는 필터
  const [openedFilter, setOpenedFilter] = useState<NONE_SEARCH_FILTER>(NULL);

  // 생년월일 ~부터
  const [birthAfter, setBirthAfter] = useState<string>(BLANK);

  // 생년월일 ~까지
  const [birthBefore, setBirthBefore] = useState<string>(BLANK);

  // 성별 필터
  const [gender, setGender] = useState<GENDER | typeof NULL>(NULL);

  // 신급 필터
  const [baptism, setBaptism] = useState<BAPTISM | typeof NULL>(NULL);

  // 직분 필터
  const [officer, setOfficer] = useState<string | typeof NULL>(NULL);

  // 검색 주제 선택
  const onClickSearchFilterItem = (value: SEARCH_FILTER) => {
    setSearchFilter(value);
  };

  // 검색 내용 변경
  const onChangeSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getTrimmedString(event.target.value);
    setSearchValue(newValue);
  };

  // 특정 필터 열고 닫기
  const onClickFilterTitle = (value: NONE_SEARCH_FILTER) => {
    if (openedFilter === value) {
      setOpenedFilter(NULL);
    } else {
      setOpenedFilter(value);
    }
  };

  // birthAfter 변경
  const onChangeBirthAfter = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getFormattedDate(event.target.value);
    setBirthAfter(newValue);
  };

  // birthBefore 변경
  const onChangeBirthBefore = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = getFormattedDate(event.target.value);
    setBirthBefore(newValue);
  };

  // 성별 변경
  const onChangeGender = (value: GENDER | typeof NULL) => {
    setGender(value);
  };

  // 신급 변경
  const onChangeBaptism = (value: BAPTISM | typeof NULL) => {
    setBaptism(value);
  };

  // 직분 변경
  const onChangeOfficer = (value: string | typeof NULL) => {
    setOfficer(value);
  };

  const onClickSearch = () => {
    let newMemberFilter = { ...INITIAL_MEMBER_FILTER };

    // 선택된 필터에만 값을 설정
    if (searchFilter === MEMBER.NAME) {
      newMemberFilter.name = searchValue;
    } else if (searchFilter === MEMBER.SCHOOL) {
      newMemberFilter.school = searchValue;
    } else if (searchFilter === MEMBER.VEHICLE_NUMBER) {
      newMemberFilter.vehicleNumber = searchValue;
    }

    if (getIsWellFormedBirth(birthAfter)) {
      newMemberFilter.birthAfter = getFormattedDate(birthAfter);
    }

    if (getIsWellFormedBirth(birthBefore)) {
      newMemberFilter.birthBefore = getFormattedDate(birthBefore);
    }

    if (gender !== NULL) {
      newMemberFilter.gender = gender;
    }

    if (baptism !== NULL) {
      newMemberFilter.baptism = baptism;
    }

    dispatch(setMemberFilter(newMemberFilter));

    setIsShown(false);
  };

  const onClickClose = () => {
    setIsShown(false);
  };

  const onClickReset = () => {
    setSearchFilter(MEMBER.NAME);
    setSearchValue(BLANK);
    setBaptism(NULL);
    setGender(NULL);
    setBirthAfter(BLANK);
    setBirthBefore(BLANK);
    setOfficer(NULL);
  };

  const props = {
    searchFilter,
    searchValue,
    openedFilter,
    birthAfter,
    birthBefore,
    gender,
    baptism,
    officer,
    onClickFilterTitle,
    onClickSearchFilterItem,
    onChangeSearchValue,
    onChangeBirthAfter,
    onChangeBirthBefore,
    onChangeGender,
    onChangeBaptism,
    onChangeOfficer,
    onClickSearch,
    onClickClose,
    onClickReset,
  };

  return (
    <>
      <AddFilterView {...props} />
    </>
  );
};

export default AddFilter;
