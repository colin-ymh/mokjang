import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { getStringFromDateTime } from '@/utils/date';
import { setTargetEducationTerm } from '@/redux/reducers/target-education-term-reducer';
import AddEducationTermView from '@/components/organisms/education/education-term/add/add-education-term.view';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

type AddEducationTermProps = {};

const AddEducationTerm = ({}: AddEducationTermProps) => {
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== term =====
  const onChangeTerm = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        term: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== term =====

  // ===== period =====
  const onChangeStartDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: getStringFromDateTime(date),
        })
      );
    }
  };

  const onChangeEndDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          endDate: getStringFromDateTime(date),
        })
      );
    }
  };
  // ===== period =====

  // ===== comment =====
  const [comment, setComment] = useState<string>(BLANK);

  const onChangeComment = (newComment: string) => {
    setComment(newComment);
  };

  useEffect(() => {
    // dispatch(
    //   setTargetEducationTerm({
    //     ...targetEducationTerm,
    //     comment,
    //   })
    // );
  }, [comment]);

  useEffect(() => {
    // setComment(targetEducationTerm.comment);
  }, [targetEducationTerm.id]);
  // ===== comment =====

  // ===== receiver =====
  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationTerm.reports) {
      const newReceivers = targetEducationTerm.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
        };
      });
      setReceivers(newReceivers);
    } else {
      setReceivers([]);
    }
  }, [targetEducationTerm.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);

    const receiverIds = values.map((value) => {
      return value.value;
    });

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        receiverIds: receiverIds,
      })
    );
  };

  // ===== receiver =====

  const props = {
    comment,
    receivers,
    onChangeTerm,
    onChangeStartDate,
    onChangeEndDate,
    onChangeComment,
    onChangeReceivers,
  };

  return (
    <>
      <AddEducationTermView {...props} />
    </>
  );
};

export default AddEducationTerm;
