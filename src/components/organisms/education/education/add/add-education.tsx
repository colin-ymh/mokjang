import React, { ChangeEvent, useEffect } from 'react';
import { getFormattedContent, getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import AddEducationView from '@/components/organisms/education/education/add/add-education.view';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';
import { BLANK } from '@/constants/constant';

type AddEducationProps = {
  isEdit?: boolean;
};

const AddEducation = ({ isEdit = false }: AddEducationProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== name =====
  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducation({
        ...targetEducation,
        name: getFormattedTitle(event.target.value, 50),
      })
    );
  };
  // ===== name =====

  // ===== description =====
  const onChangeDescription = (
    event: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    dispatch(
      setTargetEducation({
        ...targetEducation,
        description: getFormattedContent(event.target.value, 300),
      })
    );
  };
  // ===== description =====

  // ===== goal =====
  const onChangeEducationGoal = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(
      setTargetEducation({
        ...targetEducation,
        goals: targetEducation.goals.map((goal, i) => {
          if (i === index) {
            return event.target.value;
          } else {
            return goal;
          }
        }),
      })
    );
  };

  const onClickAddGoal = () => {
    if (targetEducation.goals.length < 6) {
      dispatch(
        setTargetEducation({
          ...targetEducation,
          goals: [...targetEducation.goals, BLANK],
        })
      );
    }
  };
  // ===== goal =====

  useEffect(() => {
    if (targetEducation.goals.length === 0) {
      dispatch(
        setTargetEducation({
          ...targetEducation,
          goals: [BLANK],
        })
      );
    }
  }, [targetEducation.id]);

  const props = {
    isEdit,
    onChangeName,
    onChangeDescription,
    onChangeEducationGoal,
    onClickAddGoal,
  };

  return (
    <>
      <AddEducationView {...props} />
    </>
  );
};

export default AddEducation;
