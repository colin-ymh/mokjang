import PopupHeaderView from '@/components/atoms/layout/header/popup-header.view';

type PopupHeaderProps = {
  onClickLeft: () => void;
};
const PopupHeader = ({ onClickLeft }: PopupHeaderProps) => {
  const props = {
    onClickLeft,
  };
  return (
    <>
      <PopupHeaderView {...props} />
    </>
  );
};
export default PopupHeader;
