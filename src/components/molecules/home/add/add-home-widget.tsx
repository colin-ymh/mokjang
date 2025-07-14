import AddHomeWidgetView from '@/components/molecules/home/add/add-home-widget.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { HOME_WIDGET } from '@/constants/constant';
import { setHomeWidgets } from '@/redux/reducers/filter/home-widget-filter-reducer';

const AddHomeWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  const onClickAdd = async (widget: HOME_WIDGET) => {
    try {
      const newHomeWidget = [...homeWidgets, widget];
      dispatch(setHomeWidgets(newHomeWidget));
    } catch (error) {
      console.log(error);
    }
  };

  const props = {
    onClickAdd,
  };

  return (
    <>
      <AddHomeWidgetView {...props} />
    </>
  );
};

export default AddHomeWidget;
