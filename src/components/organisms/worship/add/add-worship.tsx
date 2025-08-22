import { ChangeEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getFormattedContent, getFormattedTitle } from '@/utils/format';
import { setTargetWorship } from '@/redux/reducers/target/target-worship-reducer';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getGroup } from '@/utils/group';
import AddWorshipView from '@/components/organisms/worship/add/add-worship.view';

type AddWorshipProps = {};

const AddWorship = ({}: AddWorshipProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetWorship } = useSelector(
    (state: RootState) => state.targetWorship
  );
  const { groups } = useSelector((state: RootState) => state.church);

  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = getFormattedTitle(event.target.value, 50);
    dispatch(setTargetWorship({ ...targetWorship, title: newTitle }));
  };

  const onClickGroupModalOpen = () => setIsGroupModalShown(true);

  const onClickGroupModalClose = () => setIsGroupModalShown(false);

  const onChangeGroup = (groupId: string | null) => {
    const newGroup = getGroup(groupId, groups);
    setSelectedGroup(newGroup);

    dispatch(
      setTargetWorship({
        ...targetWorship,
        worshipTargetGroupIds: newGroup.id ? [newGroup.id] : [],
      })
    );
    setIsGroupModalShown(false);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = getFormattedContent(event.target.value, 500);
    dispatch(
      setTargetWorship({ ...targetWorship, description: newDescription })
    );
  };

  const onChangeWorshipDay = (worshipDay: number) => {
    dispatch(setTargetWorship({ ...targetWorship, worshipDay }));
  };

  const onChangeRepeatPeriod = (repeatPeriod: number) => {
    dispatch(setTargetWorship({ ...targetWorship, repeatPeriod }));
  };

  useEffect(() => {
    if (targetWorship?.worshipTargetGroups?.length > 0) {
      const newGroup = getGroup(
        targetWorship.worshipTargetGroups[0].group.id,
        groups
      );
      setSelectedGroup(newGroup);

      dispatch(
        setTargetWorship({
          ...targetWorship,
          worshipTargetGroupIds: newGroup.id ? [newGroup.id] : [],
        })
      );
    }
  }, [targetWorship.worshipTargetGroups]);

  const props = {
    selectedGroup,
    isGroupModalShown,
    onClickGroupModalOpen,
    onClickGroupModalClose,
    onChangeTitle,
    onChangeGroup,
    onChangeWorshipDay,
    onChangeRepeatPeriod,
    onChangeDescription,
  };

  return (
    <>
      <AddWorshipView {...props} />
    </>
  );
};

export default AddWorship;
