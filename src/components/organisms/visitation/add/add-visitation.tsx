import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import {
  VISITATION_METHOD,
  VisitationDetail,
} from '@/models/visitation/visitation';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@/utils/date';
import AddVisitationView from '@/components/organisms/visitation/add/add-visitation.view';
import { VISITATION_STATUS } from '@/constants/status/status';

const AddVisitation = () => {
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const dispatch = useDispatch<AppDispatch>();

  /* ── Status ── */
  const onChangeStatus = (status: VISITATION_STATUS) =>
    dispatch(setTargetVisitation({ ...targetVisitation, status: status }));

  /* ── Title ── */
  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        title: getFormattedTitle(e.target.value),
      })
    );

  /* ── Period ── */
  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetVisitation.startDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetVisitation.startDate)
        );
      }

      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          startDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeStartTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetVisitation.startDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetVisitation.startDate)
      );
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        startDate: `${prevDate}T${newTime}`,
      })
    );
  };

  const onChangeEndDate = (date: Date | null) => {
    if (date) {
      const newDate = getDateStringFromDate(date);
      let prevTime = '00:00';

      if (targetVisitation.endDate) {
        prevTime = getTimeStringFromDate(
          getDateFromDateString(targetVisitation.endDate)
        );
      }

      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          endDate: `${newDate}T${prevTime}`,
        })
      );
    }
  };

  const onChangeEndTime = (value: number) => {
    let prevDate = '2000-01-01';
    const newTime = getHourFromMinute(value);

    if (targetVisitation.endDate) {
      prevDate = getDateStringFromDate(
        getDateFromDateString(targetVisitation.endDate)
      );
    }

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        endDate: `${prevDate}T${newTime}`,
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
        targetVisitation.members.map((m) => ({ value: m.id, title: m.name }))
      );
    } else {
      setVisitedMembers([]);
    }
  }, [targetVisitation.id]);

  const onChangeVisitedMembers = (values: MemberDropdownType[]) =>
    setVisitedMembers(values);

  /* ── Method ── */
  const onChangeMethod = (m: VISITATION_METHOD) =>
    dispatch(setTargetVisitation({ ...targetVisitation, visitationMethod: m }));

  /* ── Instructor ── */
  const [inCharge, setInCharge] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetVisitation.inChargeId) {
      setInCharge([
        {
          value: targetVisitation.inCharge.id,
          title: targetVisitation.inCharge.name,
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
      setReceivers(
        targetVisitation.reports.map((r) => ({
          value: r.receiver.id,
          title: r.receiver.name,
        }))
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

  /* ───────────────────────────── Local details (content / pray) ───────────────────────────── */
  const createPlaceholderDetail = (): VisitationDetail => ({
    id: BLANK,
    memberId: BLANK,
    visitationContent: BLANK,
    visitationPray: BLANK,
    member: DEFAULT_MEMBER,
  });

  const [localDetails, setLocalDetails] = useState<VisitationDetail[]>(
    targetVisitation.visitationDetails?.length > 0
      ? targetVisitation.visitationDetails
      : [createPlaceholderDetail()]
  );

  /* Redux 에서 새로운 visitation 을 불러오면 로컬 detail 초기화 */
  useEffect(() => {
    setLocalDetails((prev) =>
      targetVisitation.visitationDetails.length > 0
        ? targetVisitation.visitationDetails
        : prev
    );
  }, [targetVisitation.id]);

  /** content/pray 입력 핸들러 */
  const onChangeContent = (memberId: string, content: string) =>
    setLocalDetails((prev) =>
      prev.map((d) =>
        d.memberId === memberId ? { ...d, visitationContent: content } : d
      )
    );

  const onChangePray = (memberId: string, pray: string) =>
    setLocalDetails((prev) =>
      prev.map((d) =>
        d.memberId === memberId ? { ...d, visitationPray: pray } : d
      )
    );

  /** debounce: 500ms 동안 입력이 없을 때만 전역 상태 반영 */
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          visitationDetails: localDetails,
        })
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [localDetails]);

  /* ── visitedMembers ↔ localDetails 동기화 ── */
  useEffect(() => {
    const newMembers = visitedMembers.map((vm) => ({
      ...DEFAULT_MEMBER,
      id: vm.value,
      name: vm.title,
    }));

    setLocalDetails((prev) => {
      let next = [...prev];

      // 1) 대상자 없음 (placeholder 유지)
      if (visitedMembers.length === 0) {
        if (next.length === 0) next.push(createPlaceholderDetail());
        if (next.length > 1) next = [next[0]]; // 여전히 첫 번째 항목만 사용
        return next;
      }

      // 2) 대상자 1명 & placeholder 변환
      if (
        visitedMembers.length === 1 &&
        next.length === 1 &&
        next[0].memberId === BLANK
      ) {
        next[0] = {
          ...next[0],
          memberId: visitedMembers[0].value,
          member: { ...DEFAULT_MEMBER, name: visitedMembers[0].title },
        };
      }

      // 3) 추가/삭제 반영
      const added = visitedMembers
        .filter((vm) => !next.some((d) => d.memberId === vm.value))
        .map((vm) => ({
          id: BLANK,
          memberId: vm.value,
          visitationContent: BLANK,
          visitationPray: BLANK,
          member: { ...DEFAULT_MEMBER, name: vm.title },
        }));
      const updated = next.filter((d) =>
        visitedMembers.some((vm) => vm.value === d.memberId)
      );
      return [...updated, ...added];
    });

    // 전역 상태(멤버 목록)는 즉시 반영 (세부내용은 debounce)
    dispatch(setTargetVisitation({ ...targetVisitation, members: newMembers }));
  }, [visitedMembers]);

  const props = {
    visitedMembers,
    inCharge,
    receivers,
    localDetails,
    onChangeStatus,
    onChangeTitle,
    onChangeStartDate,
    onChangeStartTime,
    onChangeEndDate,
    onChangeEndTime,
    onChangeVisitedMembers,
    onChangeMethod,
    onChangeInCharge,
    onChangeReceivers,
    onChangeContent,
    onChangePray,
  };
  return (
    <>
      <AddVisitationView {...props} />
    </>
  );
};

export default AddVisitation;
