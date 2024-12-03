import SideBarView from "@/components/molecules/layout/side-bar.view";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setHeaderId } from "@/redux/reducers/layout-reducer";

const SideBar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onClickButton = (id: string) => {
    dispatch(setHeaderId(id));
  };

  const props = {
    onClickButton,
  };

  return (
    <>
      <SideBarView {...props} />
    </>
  );
};

export default SideBar;
