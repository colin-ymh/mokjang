import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import HeaderBarView from "@/components/molecules/layout/header/header-bar.view";
import { useMemberInformationHeaderBarItems } from "@/hooks/layout/header-bar-items";
import MemberImageInput from "@/components/atoms/register/member-image-input";
import { MainText } from "@/components/atoms/common/text/main-text";
import { getFormattedMobilePhone } from "@/utils/format";
import { GRAY } from "@/constants/styles/color";

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  gap: 30px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

type MemberInformationHeaderProps = {
  contentId: string;
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  contentId,
  onClickItem,
}: MemberInformationHeaderProps) => {
  const { member } = useSelector((state: RootState) => state.memberRegister);

  return (
    <InformationHeader>
      <Information>
        <MemberImageInput
          value={member?.profileImage}
          onChange={() => {}}
          width={80}
          height={80}
        />
        <TextContainer>
          <MainText fontSize={18}>{member.name}</MainText>
          <MainText fontSize={16}>
            {getFormattedMobilePhone(member.mobilePhone)}
          </MainText>
        </TextContainer>
      </Information>

      <HeaderBarView
        value={contentId}
        items={useMemberInformationHeaderBarItems()}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
