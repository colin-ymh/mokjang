import EditWorshipSessionView from './edit-worship-session.view';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { getFormattedTitle } from '@/utils/format';
import { setTargetWorshipSession } from '@/redux/reducers/target/target-worship-session-reducer';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { BLANK } from '@/constants/constant';

const EditWorshipSession = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetWorshipSession } = useSelector(
    (state: RootState) => state.targetWorshipSession
  );

  const onChangeSessionTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newSessionTitle = getFormattedTitle(event.target.value);
    dispatch(
      setTargetWorshipSession({
        ...targetWorshipSession,
        title: newSessionTitle,
      })
    );
  };

  const onChangeBibleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newBibleTitle = getFormattedTitle(event.target.value);
    dispatch(
      setTargetWorshipSession({
        ...targetWorshipSession,
        bibleTitle: newBibleTitle,
      })
    );
  };

  const onChangeVideoUrl = (event: ChangeEvent<HTMLInputElement>) => {
    const newVideoUrl = event.target.value;
    dispatch(
      setTargetWorshipSession({
        ...targetWorshipSession,
        videoUrl: newVideoUrl,
      })
    );
  };

  // ===== inCharge =====
  // 담당자
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetWorshipSession.inChargeId) {
      const newInCharge = {
        value: targetWorshipSession.inCharge.id,
        title: targetWorshipSession.inCharge.name,
      };

      setInCharge([newInCharge]);
    } else {
      setInCharge([]);
    }
  }, [targetWorshipSession.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    const newInCharge = values[0];
    setInCharge(values);

    dispatch(
      setTargetWorshipSession({
        ...targetWorshipSession,
        inChargeId: newInCharge ? newInCharge.value : BLANK,
      })
    );
  };

  // ===== inCharge =====

  // ===== description =====
  const [description, setDescription] = useState<string>(BLANK);

  const onChangeDescription = (newContent: string) => {
    setDescription(newContent);
  };

  useEffect(() => {
    dispatch(
      setTargetWorshipSession({
        ...targetWorshipSession,
        description,
      })
    );
  }, [description]);

  useEffect(() => {
    setDescription(targetWorshipSession.description);
  }, [targetWorshipSession.id]);
  // ===== description =====

  const props = {
    inCharge,
    description,
    onChangeSessionTitle,
    onChangeBibleTitle,
    onChangeVideoUrl,
    onChangeInCharge,
    onChangeDescription,
  };

  return (
    <>
      <EditWorshipSessionView {...props} />
    </>
  );
};

export default EditWorshipSession;
