import React, { ChangeEvent, useEffect, useState } from 'react';
import { BLANK } from '@mokjang/constants';
import { getFormattedTitle } from '@mokjang/utils';
import { DEFAULT_VISITATION_DETAIL } from '@mokjang/models';
import { MemberDropdownType } from '../../../atoms/common/dropdown/member-dropdown-item';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setTargetVisitation } from '../../../../redux/reducers/target/target-visitation-reducer';
import {
  getDateFromDateString,
  getDateStringFromDate,
  getHourFromMinute,
  getTimeStringFromDate,
} from '@mokjang/utils';
import AddVisitationView from './add-visitation.view';
import { Member } from '@mokjang/models';

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

  useEffect(() => {
    const newMembers = visitedMembers.map((member) => {
      return { id: member.value, name: member.title } as Member;
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
