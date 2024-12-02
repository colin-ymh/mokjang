import React from "react";
import styled from "styled-components";

import { MainText } from "@/components/atoms/common/text/main-text";
import HeaderBarView from "@/components/molecules/layout/header/header-bar.view";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setContentId } from "@/redux/reducers/layout-reducer";

const HeaderBarContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const BarItem = styled.div`
  display: flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
`;

export type HeaderBarItem = {
  id: string;
  title: string;
};

type HeaderBarProps = {
  items: HeaderBarItem[];
};

const HeaderBar = ({ items }: HeaderBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const onClick = (id: string) => {
    dispatch(setContentId(id));
  };
  const props = {
    items,
    onClick,
  };
  return (
    <>
      <HeaderBarView {...props} />
    </>
  );
};

export default HeaderBar;
