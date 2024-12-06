import styled from "styled-components";

import HeaderBarView from "@/components/molecules/layout/header/header-bar.view";
import { useMemberInformationHeaderBarItems } from "@/hooks/layout/header-bar-items";
import MemberImageInput from "@/components/atoms/register/member-image-input";
import React from "react";
import { MainText } from "@/components/atoms/common/text/main-text";

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  background-color: aqua;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
`;

type MemberInformationHeaderProps = {
  onClickItem: (id: string) => void;
};

const MemberInformationHeader = ({
  onClickItem,
}: MemberInformationHeaderProps) => {
  return (
    <InformationHeader>
      <Information>
        <MemberImageInput
          value={""}
          onChange={() => {}}
          // width={50}
          // height={50}
        />
        <MainText>홍길동</MainText>
      </Information>

      <HeaderBarView
        items={useMemberInformationHeaderBarItems()}
        onClick={onClickItem}
      />
    </InformationHeader>
  );
};

export default MemberInformationHeader;
