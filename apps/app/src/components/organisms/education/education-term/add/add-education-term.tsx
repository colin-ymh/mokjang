import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';

import {
  getDateFromDateString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import { setTargetEducationTerm } from '../../../../../redux/reducers/target/target-education-term-reducer';
import AddEducationTermView from './add-education-term.view';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';
import { getFormattedContent } from '@mokjang/utils';

type AddEducationTermProps = { isEdit?: boolean };

const AddEducationTerm = ({ isEdit = false }: AddEducationTermProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const dispatch = useDispatch<AppDispatch>();

  // ===== term =====
  const onChangeTerm = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        term: event.target.value.replace(/\D/g, ''),
      })
    );
  };

  useEffect(() => {
    if (targetEducationTerm.term === BLANK) {
      if (targetEducation.educationTerms?.length > 0) {
        dispatch(
          setTargetEducationTerm({
            ...targetEducationTerm,
            term: targetEducation.educationTerms[0].term + 1,
          })
        );
      } else {
        dispatch(
          setTargetEducationTerm({
            ...targetEducationTerm,
            term: '1',
          })
        );
      }
    }
  }, [targetEducation.educationTerms]);
  // ===== term =====

  // ===== period =====
  /* ── Period ── */
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationTerm.startDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetEducationTerm.startDate)
        );
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationTerm.startDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetEducationTerm.startDate)
      );
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        startDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetEducationTerm.endDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetEducationTerm.endDate)
        );
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          endDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetEducationTerm.endDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetEducationTerm.endDate)
      );
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        endDate: `${prevDate}T${newTime}`,
      })
    );
  };
  // ===== period =====

  // ===== inCharge =====
  // 담당자
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationTerm.inCharge?.id) {
      const newInCharge = {
        value: targetEducationTerm.inCharge.id,
        title: targetEducationTerm.inCharge.name,
      };

      setInCharge([newInCharge]);
    } else {
      setInCharge([]);
    }
  }, [targetEducationTerm.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    const newInCharge = values[0];
    setInCharge(values);

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        inChargeId: newInCharge ? newInCharge.value : BLANK,
      })
    );
  };

  // ===== inCharge =====

  // ===== location =====

  const onChangeLocation = (event: ChangeEvent<HTMLInputElement>) => {
    const newLocation = getFormattedContent(event.target.value, 30);
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        location: newLocation,
      })
    );
  };
  // ===== location =====

  /* ── Receivers ── */
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetEducationTerm.reports) {
      setReceivers(
        targetEducationTerm.reports.map((r) => ({
          value: r.receiver.id,
          title: r.receiver.name,
        }))
      );
    } else {
      setReceivers([]);
    }
  }, [targetEducationTerm.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        receiverIds: values.map((v) => v.value),
      })
    );
  };

  const onClickDeleteReceiver = (receiverId: string) => {
    const newReceivers = receivers.filter((r) => r.value !== receiverId);
    setReceivers(newReceivers);
    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        receiverIds: newReceivers.map((r) => r.value),
      })
    );
  };

  const props = {
    isEdit,
    inCharge,
    onChangeTerm,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeInCharge,
    onChangeLocation,
    receivers,
    onChangeReceivers,
    onClickDeleteReceiver,
  };

  return (
    <>
      <AddEducationTermView {...props} />
    </>
  );
};

export default AddEducationTerm;
