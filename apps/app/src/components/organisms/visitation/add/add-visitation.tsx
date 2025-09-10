import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getFormattedTitle,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import { DEFAULT_VISITATION_DETAIL, Member } from '@mokjang/models';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import AddVisitationView from './add-visitation.view';

type AddVisitationProps = {
  isEdit?: boolean;
};

const AddVisitation = ({ isEdit = false }: AddVisitationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  /* ── Title ── */
  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        title: getFormattedTitle(e.target.value),
      })
    );

  /* ── Period ── */
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
    const prevStartHm = targetVisitation.startDate
      ? getTimeStringFromDate(getDateFromDateString(targetVisitation.startDate))
      : '00:00';

    // 기본: 시작일 갱신
    let nextStart = combineDateTime(newStartYmd, prevStartHm);

    // 종료일 관련 교정
    if (targetVisitation.endDate) {
      const endDateObj = getDateFromDateString(targetVisitation.endDate);
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
        setTargetVisitation({
          ...targetVisitation,
          startDate: nextStart,
          endDate: combineDateTime(nextEndYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 날짜 변경 ── */
  const onChangeEndDate = (date: Date | null) => {
    if (!date) return;

    const newEndYmd = getDateStringFromDate(date);
    const prevEndHm = targetVisitation.endDate
      ? getTimeStringFromDate(getDateFromDateString(targetVisitation.endDate))
      : '00:00';

    let nextEnd = combineDateTime(newEndYmd, prevEndHm);

    if (targetVisitation.startDate) {
      const startDateObj = getDateFromDateString(targetVisitation.startDate);
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
        setTargetVisitation({
          ...targetVisitation,
          startDate: combineDateTime(nextStartYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        endDate: nextEnd,
      })
    );
  };

  /* ── 시작 시간 변경 ── */
  const onChangeStartTime = (value: number) => {
    const newStartHm = getHourFromMinute(value);
    const prevStartYmd = targetVisitation.startDate
      ? getDateStringFromDate(getDateFromDateString(targetVisitation.startDate))
      : '2000-01-01';

    // 기본: 시작 시간 갱신
    let nextStart = combineDateTime(prevStartYmd, newStartHm);

    if (targetVisitation.endDate) {
      const endDateObj = getDateFromDateString(targetVisitation.endDate);
      const endYmd = getDateStringFromDate(endDateObj);
      const endHm = getTimeStringFromDate(endDateObj);

      // 같은 날이고, 시작 시간이 종료 시간보다 크면 종료 시간을 시작 시간에 맞춤
      const nextEndHm =
        prevStartYmd === endYmd && toMinutes(newStartHm) > toMinutes(endHm)
          ? newStartHm
          : endHm;

      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          startDate: nextStart,
          endDate: combineDateTime(endYmd, nextEndHm),
        })
      );
      return;
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        startDate: nextStart,
      })
    );
  };

  /* ── 종료 시간 변경 ── */
  const onChangeEndTime = (value: number) => {
    const newEndHm = getHourFromMinute(value);
    const prevEndYmd = targetVisitation.endDate
      ? getDateStringFromDate(getDateFromDateString(targetVisitation.endDate))
      : '2000-01-01';

    let nextEnd = combineDateTime(prevEndYmd, newEndHm);

    if (targetVisitation.startDate) {
      const startDateObj = getDateFromDateString(targetVisitation.startDate);
      const startYmd = getDateStringFromDate(startDateObj);
      const startHm = getTimeStringFromDate(startDateObj);

      // 같은 날이고, 종료 시간이 시작 시간보다 작으면 시작 시간을 종료 시간에 맞춤
      const nextStartHm =
        startYmd === prevEndYmd && toMinutes(newEndHm) < toMinutes(startHm)
          ? newEndHm
          : startHm;

      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          startDate: combineDateTime(startYmd, nextStartHm),
          endDate: nextEnd,
        })
      );
      return;
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        endDate: nextEnd,
      })
    );
  };

  /* ── Visited Members ── */
  const [visitedMembers, setVisitedMembers] = useState<MemberDropdownType[]>(
    []
  );

  useEffect(() => {
    if (targetVisitation.members) {
      setVisitedMembers(
        targetVisitation.members.map((m) => ({
          value: m.id,
          title: m.name,
          officer: m.officer?.name || BLANK,
        }))
      );

      // const memberIds = targetVisitation.members.map((member) => {
      //   return member.id;
      // });
      //
      // dispatch(
      //   setTargetVisitation({ ...targetVisitation, memberIds: memberIds })
      // );
    } else {
      setVisitedMembers([]);
    }
  }, [targetVisitation.id]);

  useEffect(() => {
    const newMembers = visitedMembers.map((member) => {
      return {
        id: member.value,
        name: member.title,
        officer: member.officer,
      } as Member;
    });
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        members: newMembers,
      })
    );
  }, [visitedMembers]);

  const onChangeVisitedMembers = (values: MemberDropdownType[]) => {
    setVisitedMembers(values);
  };

  const onClickDeleteVisitedMember = (memberId: string) => {
    const newVisitedMembers = visitedMembers.filter(
      (m) => m.value !== memberId
    );
    setVisitedMembers(newVisitedMembers);
  };

  /* ── Instructor ── */
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetVisitation.inChargeId) {
      setInCharge([
        {
          value: targetVisitation.inCharge.id,
          title: targetVisitation.inCharge.name,
          officer: targetVisitation.inCharge?.officer?.name || BLANK,
        },
      ]);
    } else {
      setInCharge([]);
    }
  }, [targetVisitation.id]);

  const onChangeInCharge = (values: MemberDropdownType[]) => {
    setInCharge(values);
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        inChargeId: values[0] ? values[0].value : BLANK,
      })
    );
  };

  /* ── Receivers ── */
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetVisitation.reports) {
      const newReceivers = targetVisitation.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
          officer: report.receiver?.officer?.name || BLANK,
        };
      });
      setReceivers(newReceivers);

      const receiverIds = targetVisitation.reports.map((report) => {
        return report.receiver.id;
      });

      dispatch(
        setTargetVisitation({ ...targetVisitation, receiverIds: receiverIds })
      );
    } else {
      setReceivers([]);
    }
  }, [targetVisitation.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        receiverIds: values.map((v) => v.value),
      })
    );
  };

  const onClickDeleteReceiver = (receiverId: string) => {
    const newReceivers = receivers.filter((r) => r.value !== receiverId);
    setReceivers(newReceivers);
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        receiverIds: newReceivers.map((r) => r.value),
      })
    );
  };

  /** content/pray 입력 핸들러 */
  const onChangeContent = (content: string, delta: any, source: string) => {
    if (source !== 'user') return; // 사용자가 입력한 경우만 dispatch

    const prevContent =
      targetVisitation.visitationDetails?.[0]?.visitationContent || BLANK;

    if (prevContent === content) return;

    const originalDetail =
      targetVisitation.visitationDetails?.[0] || DEFAULT_VISITATION_DETAIL;

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: [{ ...originalDetail, visitationContent: content }],
      })
    );
  };

  const onChangePray = (pray: string, delta: any, source: string) => {
    if (source !== 'user') return; // 사용자가 입력한 경우만 dispatch

    const prevPray =
      targetVisitation.visitationDetails?.[0]?.visitationPray || BLANK;

    if (prevPray === pray) return;

    const originalDetail =
      targetVisitation.visitationDetails?.[0] || DEFAULT_VISITATION_DETAIL;

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: [{ ...originalDetail, visitationPray: pray }],
      })
    );
  };

  const props = {
    isEdit,
    visitedMembers,
    inCharge,
    receivers,
    onChangeTitle,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeVisitedMembers,
    onChangeInCharge,
    onChangeReceivers,
    onChangeContent,
    onChangePray,
    onClickDeleteVisitedMember,
    onClickDeleteReceiver,
  };
  return (
    <>
      <AddVisitationView {...props} />
    </>
  );
};

export default AddVisitation;
