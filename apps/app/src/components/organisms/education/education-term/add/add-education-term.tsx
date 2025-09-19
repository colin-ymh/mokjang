import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';

import {
  getDateFromDateString,
  getDateStringFromDate,
  getFormattedContent,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import { setTargetEducationTerm } from '../../../../../redux/reducers/target/target-education-term-reducer';
import AddEducationTermView from './add-education-term.view';
import { MemberDropdownType } from '../../../../atoms/common/dropdown/member-dropdown-item';

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
  /* 날짜 문자열 + 시간 문자열 → ISO 비슷한 포맷 */
  const combineDateTime = (ymd: string, hm: string) => `${ymd}T${hm}`;

  /* HH:mm → 분 */
  const toMinutes = (hm: string) => {
    const [h, m] = hm.split(':').map(Number);
    return h * 60 + m;
  };

  /* ── 시작 날짜 변경 ── */
  const onChangeStartDate = (date: Date | null) => {
    if (!date) return;

    const newStartYmd = getDateStringFromDate(date);
    const prevStartHm = targetEducationTerm.startDate
      ? getTimeStringFromDate(
          getDateFromDateString(targetEducationTerm.startDate)
        )
      : '08:00';

    // 기본: 시작일 갱신
    let nextStart = combineDateTime(newStartYmd, prevStartHm);

    // 종료일 관련 교정
    if (targetEducationTerm.endDate) {
      const endDateObj = getDateFromDateString(targetEducationTerm.endDate);
      const prevEndYmd = getDateStringFromDate(endDateObj);
      const prevEndHm = getTimeStringFromDate(endDateObj);

      let nextEndYmd = prevEndYmd;
      let nextEndHm = prevEndHm;

      // 시작일이 종료일을 넘어가면 종료 "날짜"를 시작 날짜로 이동
      if (newStartYmd > prevEndYmd) {
        nextEndYmd = newStartYmd;
      }

      // 같은 날인데 시작 시간이 종료 시간보다 크면 종료 "시간"을 시작 시간으로 맞춤
      if (nextEndYmd === newStartYmd) {
        if (toMinutes(prevStartHm) > toMinutes(prevEndHm)) {
          nextEndHm = prevStartHm;
        }
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: nextStart,
          endDate: combineDateTime(nextEndYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 날짜 변경 ── */
  const onChangeEndDate = (date: Date | null) => {
    if (!date) return;

    const newEndYmd = getDateStringFromDate(date);
    const prevEndHm = targetEducationTerm.endDate
      ? getTimeStringFromDate(
          getDateFromDateString(targetEducationTerm.endDate)
        )
      : '08:00';

    let nextEnd = combineDateTime(newEndYmd, prevEndHm);

    if (targetEducationTerm.startDate) {
      const startDateObj = getDateFromDateString(targetEducationTerm.startDate);
      const prevStartYmd = getDateStringFromDate(startDateObj);
      const prevStartHm = getTimeStringFromDate(startDateObj);

      let nextStartYmd = prevStartYmd;
      let nextStartHm = prevStartHm;

      // 종료일이 시작일보다 앞이면 시작 "날짜"를 종료 날짜로 이동
      if (newEndYmd < prevStartYmd) {
        nextStartYmd = newEndYmd;
      }

      // 같은 날인데 종료 시간이 시작 시간보다 작으면 시작 "시간"을 종료 시간으로 맞춤
      if (nextStartYmd === newEndYmd) {
        if (toMinutes(prevEndHm) < toMinutes(prevStartHm)) {
          nextStartHm = prevEndHm;
        }
      }

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: combineDateTime(nextStartYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        endDate: nextEnd,
      })
    );
  };

  /* ── 시작 시간 변경 ── */
  const onChangeStartTime = (value: number) => {
    const newStartHm = getHourFromMinute(value);
    const prevStartYmd = targetEducationTerm.startDate
      ? getDateStringFromDate(
          getDateFromDateString(targetEducationTerm.startDate)
        )
      : '2000-01-01';

    // 기본: 시작 시간 갱신
    let nextStart = combineDateTime(prevStartYmd, newStartHm);

    if (targetEducationTerm.endDate) {
      const endDateObj = getDateFromDateString(targetEducationTerm.endDate);
      const endYmd = getDateStringFromDate(endDateObj);
      const endHm = getTimeStringFromDate(endDateObj);

      // 같은 날이고, 시작 시간이 종료 시간보다 크면 종료 시간을 시작 시간에 맞춤
      const nextEndHm =
        prevStartYmd === endYmd && toMinutes(newStartHm) > toMinutes(endHm)
          ? newStartHm
          : endHm;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: nextStart,
          endDate: combineDateTime(endYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 시간 변경 ── */
  const onChangeEndTime = (value: number) => {
    const newEndHm = getHourFromMinute(value);
    const prevEndYmd = targetEducationTerm.endDate
      ? getDateStringFromDate(
          getDateFromDateString(targetEducationTerm.endDate)
        )
      : '2000-01-01';

    let nextEnd = combineDateTime(prevEndYmd, newEndHm);

    if (targetEducationTerm.startDate) {
      const startDateObj = getDateFromDateString(targetEducationTerm.startDate);
      const startYmd = getDateStringFromDate(startDateObj);
      const startHm = getTimeStringFromDate(startDateObj);

      // 같은 날이고, 종료 시간이 시작 시간보다 작으면 시작 시간을 종료 시간에 맞춤
      const nextStartHm =
        startYmd === prevEndYmd && toMinutes(newEndHm) < toMinutes(startHm)
          ? newEndHm
          : startHm;

      dispatch(
        setTargetEducationTerm({
          ...targetEducationTerm,
          startDate: combineDateTime(startYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetEducationTerm({
        ...targetEducationTerm,
        endDate: nextEnd,
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
        officer: targetEducationTerm.inCharge.officer?.name || BLANK,
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
          officer: r.receiver.officer?.name || BLANK,
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
