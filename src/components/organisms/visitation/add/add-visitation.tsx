import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import {
  DEFAULT_VISITATION_DETAIL,
  VISITATION_METHOD,
} from '@/models/visitation/visitation';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@/utils/date';
import AddVisitationView from '@/components/organisms/visitation/add/add-visitation.view';
import { TASK_STATUS } from '@/constants/status/status';

type AddVisitationProps = {};

const AddVisitation = ({}: AddVisitationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  /* ── Status ── */
  const onChangeStatus = (status: TASK_STATUS) =>
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

  const onChangeVisitedMembers = (values: MemberDropdownType[]) => {
    setVisitedMembers(values);
  };

  const onClickDeleteVisitedMember = (memberId: string) => {
    const newVisitedMembers = visitedMembers.filter(
      (m) => m.value !== memberId
    );
    setVisitedMembers(newVisitedMembers);
  };

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
  const onChangeContent = (content: string) => {
    const prevContent =
      targetVisitation.visitationDetails?.[0]?.visitationContent || BLANK;

    if (prevContent === content) return; // 값이 같으면 dispatch 안 함

    const originalDetail =
      targetVisitation.visitationDetails?.[0] || DEFAULT_VISITATION_DETAIL;

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: [
          {
            ...originalDetail,
            visitationContent: content,
          },
        ],
      })
    );
  };

  const onChangePray = (pray: string) => {
    const prevPray =
      targetVisitation.visitationDetails?.[0]?.visitationPray || BLANK;

    if (prevPray === pray) return; // 값이 같으면 dispatch 안 함

    const originalDetail =
      targetVisitation.visitationDetails?.[0] || DEFAULT_VISITATION_DETAIL;

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: [
          {
            ...originalDetail,
            visitationPray: pray,
          },
        ],
      })
    );
  };

  const props = {
    visitedMembers,
    inCharge,
    receivers,
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
