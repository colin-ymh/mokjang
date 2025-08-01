import React, { ChangeEvent, useState } from 'react';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import AddEducationView from '@/components/organisms/education/education/add/add-education.view';
import { setTargetEducation } from '@/redux/reducers/target/target-education-reducer';

type AddEducationProps = {};

const AddEducation = ({}: AddEducationProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const dispatch = useDispatch<AppDispatch>();

  const [educationGoals, setEducationGoals] = useState<string[]>(['']);

  // ===== name =====
  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducation({
        ...targetEducation,
        name: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== name =====

  // ===== description =====
  const onChangeDescription = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducation({
        ...targetEducation,
        description: event.target.value,
      })
    );
  };
  // ===== description =====

  // ===== goal =====
  const onChangeEducationGoal = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setEducationGoals(
      educationGoals.map((goal, i) => {
        if (i === index) {
          return event.target.value;
        } else {
          return goal;
        }
      })
    );
    // dispatch(
    //   setTargetEducation({
    //     ...targetEducation,
    //     educationGoals: targetEducation.educationGoals.map((goal, i) => {
    //       if (i === index) {
    //         return event.target.value;
    //       } else {
    //         return goal;
    //       }
    //     }),
    //   })
    // );
  };

  const onClickAddGoal = () => {
    if (educationGoals.length < 6) {
      setEducationGoals([...educationGoals, '']);
    }
    // if (targetEducation.educationGoals.length < 6) {
    //   dispatch(
    //     setTargetEducation({
    //       ...targetEducation,
    //       educationGoals: [...targetEducation.educationGoals, ''],
    //     })
    //   );
    // }
  };
  // ===== goal =====

  const props = {
    onChangeName,
    onChangeDescription,
    onChangeEducationGoal,
    onClickAddGoal,

    educationGoals,
  };

  return (
    <>
      <AddEducationView {...props} />
    </>
  );
};

export default AddEducation;
