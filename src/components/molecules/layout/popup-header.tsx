import PopupHeaderView from "@/components/molecules/layout/popup-header.view";

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
