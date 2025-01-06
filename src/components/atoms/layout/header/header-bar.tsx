import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { setContentId } from '@/redux/reducers/layout-reducer';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';

export type HeaderBarItem = {
  id: string;
  title: string;
};

type HeaderBarProps = {
  value: string;
  items: HeaderBarItem[];
};

const HeaderBar = ({ value, items }: HeaderBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const onClick = (id: string) => {
    dispatch(setContentId(id));
  };
  const props = {
    value,
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
