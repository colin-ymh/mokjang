import { HeaderBarItem, PopupHeaderBarView } from './popup-header-bar.view';

type PopupHeaderBarProps = {
  value: string;
  items: HeaderBarItem[];
  onClick: (id: any) => void;
};

export const PopupHeaderBar = ({
  value,
  items,
  onClick,
}: PopupHeaderBarProps) => {
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
