import React from 'react';

import { HeaderBarItem } from './header-bar.view';
import PopupHeaderBarView from './popup-header-bar.view';

type PopupHeaderBarProps = {
  value: string;
  items: HeaderBarItem[];
  onClick: (id: any) => void;
};

const PopupHeaderBar = ({ value, items, onClick }: PopupHeaderBarProps) => {
  const props = {
    value,
    items,
    onClick,
  };
  return (
    <>
      <PopupHeaderBarView {...props} />
    </>
  );
};

export default PopupHeaderBar;
