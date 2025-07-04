import { ChangeEvent } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getFormattedTitle } from '@/utils/format';
import { getDateStringFromDate } from '@/utils/date';
import AddChurchEventView from '@/components/organisms/church-event/add/add-church-event.view';
import { setTargetChurchEvent } from '@/redux/reducers/target/target-church-event-reducer';

type AddChurchEventProps = {};

const AddChurchEvent = ({}: AddChurchEventProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetChurchEvent } = useSelector(
    (state: RootState) => state.targetChurchEvent
  );

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = getFormattedTitle(event.target.value);
    dispatch(setTargetChurchEvent({ ...targetChurchEvent, title: newTitle }));
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;
    dispatch(
      setTargetChurchEvent({
        ...targetChurchEvent,
        description: newDescription,
      })
    );
  };

  const onChangeChurchEventDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetChurchEvent({
          ...targetChurchEvent,
          date: getDateStringFromDate(date),
        })
      );
    }
  };

  const props = {
    onChangeTitle,
    onChangeDescription,
    onChangeChurchEventDate,
  };

  return (
    <>
      <AddChurchEventView {...props} />
    </>
  );
};

export default AddChurchEvent;
