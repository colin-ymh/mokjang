import React from 'react';

import HeaderBarView, { HeaderBarItem } from './header-bar.view';

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
