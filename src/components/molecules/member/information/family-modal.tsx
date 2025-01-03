import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

import LabelDropdown from "@/components/atoms/common/dropdown/label-dropdown";
import { onClickEnter } from "@/utils/input";
import { getTrimmedString } from "@/utils/format";
import { GetMembersResponse, MembersApi } from "@/api/churches/members.api";
import { DropdownValueType } from "@/components/atoms/common/dropdown/dropdown-item";
import { setMember } from "@/redux/reducers/member-register-reducer";
import { BLANK, FAMILY, GENDER } from "@/constants/constant";
import { Member } from "@/models/member/member";
import { useFamilyRelationDropdownItems } from "@/hooks/dropdown/dropdown-items";
import Button from "@/components/atoms/common/button/button";

import { useI18n, useScopedI18n } from "../../../../../locales/client";
import Cancel from "../../../../../public/svg/cancel.svg";

const FamilyModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 20px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

type FamilyModalProps = {
  member: Member;
  familyMember: Member;
  onClickClose: () => void;
  onClickSave: (
    isEdit: boolean,
    familyMemberId: string,
    relation: FAMILY,
  ) => void;
};

const FamilyModal = ({
  member,
  familyMember,
  onClickSave,
  onClickClose,
}: FamilyModalProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n("placeholder");
  const membersApi = new MembersApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId,
  );

  // 수정인지 추가인지 여부
  const isEdit = familyMember.name !== BLANK;

  // 검색된 가족 목록
  const [familyMemberItems, setFamilyMemberItems] = useState<
    DropdownValueType[]
  >([]);

  // 가족 이름
  const [familyMemberName, setFamilyMemberName] = useState<string>(BLANK);
  // 선택된 가족의 성별
  const [familyGender, setFamilyGender] = useState<GENDER | undefined>();

  // 가족 관계
  const [familyRelation, setFamilyRelation] = useState<FAMILY>(FAMILY.FAMILY);

  // 가족 관계 드롭다운 아이템
  const familyRelationItems = useFamilyRelationDropdownItems(familyGender);

  // 수정인 경우, 대상을 미리 받아옴
  useEffect(() => {
    if (familyMember) {
      setFamilyMemberName(familyMember.name);
      setFamilyGender(familyMember.gender as GENDER);
      setFamilyRelation(familyMember.relation);
    }
  }, [familyMember]);

  // 가족 이름 변경 시 이벤트
  const onChangeFamilyMemberName = (event: ChangeEvent<HTMLInputElement>) => {
    const newFamilyMemberName = getTrimmedString(event.target.value);
    setFamilyMemberName(newFamilyMemberName);

    if (newFamilyMemberName) {
      membersApi
        .getMembers({
          churchId,
          name: newFamilyMemberName,
          page: 1,
          take: 5,
        })
        .then((response: AxiosResponse) => {
          const members: GetMembersResponse[] = response.data.data;
          const newFamilyMemberItems: DropdownValueType[] = members.map(
            (member) => {
              return { value: member.id, title: member.name };
            },
          );

          setFamilyMemberItems(newFamilyMemberItems);
        });
    }
  };

  // 가족 선택 시 이벤트
  const onChangeFamilyMemberId = (value: string) => {
    // setFamilyMemberName()

    membersApi.getMember({ churchId, memberId: value }).then((response) => {
      if (response.status === 200) {
        setFamilyGender(response.data.data.gender);
      }
    });
  };

  // 가족 관계 변경 시 이벤트
  const onChangeFamilyRelation = (value: FAMILY) => {
    setFamilyRelation(value);
  };

  // esc 시에 설정창 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClickClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClickClose]);

  return (
    <FamilyModalContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton onClick={onClickClose} />
      </HeaderContainer>
      {/* 내용 */}
      <ContentContainer>
        {/* 가족 */}
        <LabelDropdown
          enterKeyHint={"done"}
          label={t("family")}
          value={familyMemberName}
          items={familyMemberItems}
          onChange={onChangeFamilyMemberName}
          onChangeItem={onChangeFamilyMemberId}
          placeholder={t_placeholder("family")}
          isEditable={familyMember.name === BLANK}
          onKeyDown={onClickEnter}
        />
        {/* 가족관계 */}
        <LabelDropdown
          label={t("relation")}
          value={familyRelation}
          items={familyRelationItems}
          onChangeItem={onChangeFamilyRelation}
        />
      </ContentContainer>
      <ButtonContainer>
        <Button
          text={t("button.save")}
          height={30}
          onClick={() => onClickSave(isEdit, familyMember.id, familyRelation)}
        />
      </ButtonContainer>
    </FamilyModalContainer>
  );
};

export default FamilyModal;
