import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import Button from "@/components/atoms/common/button/button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { GRAY, WHITE } from "@/constants/styles/color";
import ToggleButton from "@/components/atoms/common/button/toggle-button";
import { useGenderToggleButtonItems } from "@/hooks/toggle-button/toggle-button-items";
import { GENDER } from "@/constants/constant";
import {
  useBaptismDropdownItems,
  useOfficerDropdownItems,
} from "@/hooks/dropdown/dropdown-items";
import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { useI18n } from "../../../../locales/client";
import { FLEX_DIRECTION } from "@/constants/styles/style";

const MemberFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
`;

const FilterList = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
`;

const GenderToggleContainer = styled.div`
  display: flex;
  width: 100px;
  height: 40px;
`;

type MemberFilterViewProps = {
  onClickGenderToggle: (value: GENDER) => void;
};

const MemberFilterView = ({ onClickGenderToggle }: MemberFilterViewProps) => {
  const t = useI18n();

  const { genderFilter, baptismFilter, officerFilter } = useSelector(
    (state: RootState) => state.memberFilter,
  );

  return (
    <MemberFilterContainer>
      {/*<FilterList>*/}
      {/*  <GenderToggleContainer>*/}
      {/*    <ToggleButton*/}
      {/*      value={genderFilter}*/}
      {/*      items={useGenderToggleButtonItems()}*/}
      {/*      onClick={onClickGenderToggle}*/}
      {/*    />*/}
      {/*  </GenderToggleContainer>*/}
      {/*  <LabelDropdown*/}
      {/*    label={t("baptism")}*/}
      {/*    value={baptismFilter}*/}
      {/*    items={useBaptismDropdownItems()}*/}
      {/*    flexDirection={FLEX_DIRECTION.ROW}*/}
      {/*    height={40}*/}
      {/*    width={100}*/}
      {/*  />*/}
      {/*  <LabelDropdown*/}
      {/*    label={t("officer")}*/}
      {/*    value={officerFilter}*/}
      {/*    items={useOfficerDropdownItems()}*/}
      {/*    flexDirection={FLEX_DIRECTION.ROW}*/}
      {/*    height={40}*/}
      {/*    width={100}*/}
      {/*  />*/}
      {/*  <LabelDropdown*/}
      {/*    label={t("ministry")}*/}
      {/*    value={officerFilter}*/}
      {/*    items={useOfficerDropdownItems()}*/}
      {/*    flexDirection={FLEX_DIRECTION.ROW}*/}
      {/*    height={40}*/}
      {/*    width={100}*/}
      {/*  />*/}
      {/*  <LabelDropdown*/}
      {/*    label={t("education")}*/}
      {/*    value={officerFilter}*/}
      {/*    items={useOfficerDropdownItems()}*/}
      {/*    flexDirection={FLEX_DIRECTION.ROW}*/}
      {/*    height={40}*/}
      {/*    width={100}*/}
      {/*  />*/}
      {/*  <LabelDropdown*/}
      {/*    label={t("group")}*/}
      {/*    value={officerFilter}*/}
      {/*    items={useOfficerDropdownItems()}*/}
      {/*    flexDirection={FLEX_DIRECTION.ROW}*/}
      {/*    height={40}*/}
      {/*    width={100}*/}
      {/*  />*/}
      {/*</FilterList>*/}
      <Button width={100} height={40} backgroundColor={GRAY.DARK}>
        <MainText color={WHITE}>필터 추가하기</MainText>
      </Button>
    </MemberFilterContainer>
  );
};

export default MemberFilterView;
