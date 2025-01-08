import React from 'react';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';

export type HeaderBarItem = {
  id: string;
  title: string;
};

type HeaderBarProps = {
  value: string;
  items: HeaderBarItem[];
  onClick: (id: any) => void;
};

const HeaderBar = ({ value, items, onClick }: HeaderBarProps) => {
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
