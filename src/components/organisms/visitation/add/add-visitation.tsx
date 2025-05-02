import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedDate, getFormattedTitle } from '@/utils/format';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { BLACK, GRAY } from '@/constants/styles/color';
import {
  VISITATION_METHOD,
  VISITATION_STATUS,
} from '@/models/visitation/visitation';
import {
  useVisitationMethodDropdownItems,
  useVisitationStatusDropdownItems,
} from '@/hooks/dropdown/dropdown-items';
import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import MultiMemberDropdown from '@/components/atoms/common/dropdown/multi-member-dropdown';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';
import { MainText } from '@/components/atoms/common/text/main-text';
import Quill from '@/components/atoms/common/input/quill';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetVisitation } from '@/redux/reducers/target-visitation';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { getDateTimeFromString, getStringFromDateTime } from '@/utils/date';
import { ko } from 'date-fns/locale';
import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';

const AddVisitationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 50px 20px;
  gap: 20px;
  overflow-y: auto;
`;

const LabelContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const PeriodContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  border: 1px solid ${GRAY.DEFAULT};
  border-radius: 5px;
  height: 40px;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
`;

const DetailContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

type AddVisitationProps = {};

const AddVisitation = ({}: AddVisitationProps) => {
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const dispatch = useDispatch<AppDispatch>();

  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  // ===== status =====
  const statusDropdownItems = useVisitationStatusDropdownItems();

  const onChangeStatus = (status: VISITATION_STATUS) => {
    dispatch(
      setTargetVisitation({ ...targetVisitation, visitationStatus: status })
    );
  };
  // ===== status =====

  // ===== title =====
  const titleRef = useRef<HTMLInputElement>(null);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationTitle: getFormattedTitle(event.target.value),
      })
    );
  };
  // ===== title =====

  // ===== period =====
  const onChangeStartDate = (date: Date | null): void => {
    if (date) {
      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          visitationStartDate: getStringFromDateTime(date),
        })
      );
    }
  };
  // ===== period =====

  // ===== visited member =====
  const visitedMemberRef = useRef<HTMLInputElement>(null);

  // 선택된 교인들 (대상자)
  const [visitedMembers, setVisitedMembers] = useState<MemberDropdownType[]>(
    []
  );

  useEffect(() => {
    if (targetVisitation.members) {
      const newVisitedMembers = targetVisitation.members.map((member) => {
        return {
          value: member.id,
          title: member.name,
        };
      });

      setVisitedMembers(newVisitedMembers);
    } else {
      setVisitedMembers([]);
    }
  }, [targetVisitation.members]);

  const onChangeVisitedMembers = (values: MemberDropdownType[]) => {
    setVisitedMembers(values);
  };

  // ===== visited member =====

  // ===== method =====
  const methodItems = useVisitationMethodDropdownItems();

  const onChangeMethod = (method: VISITATION_METHOD) => {
    dispatch(
      setTargetVisitation({ ...targetVisitation, visitationMethod: method })
    );
  };

  // ===== method =====

  // ===== instructor =====
  const instructorRef = useRef<HTMLInputElement>(null);

  // 담당자
  const [instructor, setInstructor] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetVisitation.instructorId) {
      const newInstructor = {
        value: targetVisitation.instructor.id,
        title: targetVisitation.instructor.name,
      };

      setInstructor([newInstructor]);
    } else {
      setInstructor([]);
    }
  }, [targetVisitation.instructor]);

  const onChangeInstructor = (values: MemberDropdownType[]) => {
    const newInstructor = values[0];
    setInstructor(values);

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        instructorId: newInstructor ? newInstructor.value : BLANK,
      })
    );
  };

  // ===== instructor =====

  // ===== receiver =====
  const receiverRef = useRef<HTMLInputElement>(null);

  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (targetVisitation.reports) {
      const newReceivers = targetVisitation.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
        };
      });
      setReceivers(newReceivers);
    } else {
      setReceivers([]);
    }
  }, [targetVisitation.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);

    const receiverIds = values.map((value) => {
      return value.value;
    });

    dispatch(
      setTargetVisitation({ ...targetVisitation, receiverIds: receiverIds })
    );
  };

  // ===== receiver =====

  const onChangeContent = (memberId: string, content: string) => {
    const newDetails = targetVisitation.visitationDetails.map((detail) =>
      detail.memberId === memberId
        ? { ...detail, visitationContent: content }
        : detail
    );

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: newDetails,
      })
    );
  };

  const onChangePray = (memberId: string, pray: string) => {
    const newDetails = targetVisitation.visitationDetails.map((detail) =>
      detail.memberId === memberId
        ? { ...detail, visitationPray: pray }
        : detail
    );

    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationDetails: newDetails,
      })
    );
  };

  useEffect(() => {
    const newMembers = visitedMembers.map((member): Member => {
      return { ...DEFAULT_MEMBER, id: member.value, name: member.title };
    });

    const isSame =
      JSON.stringify(targetVisitation.members) === JSON.stringify(newMembers);

    if (!isSame) {
      dispatch(
        setTargetVisitation({ ...targetVisitation, members: newMembers })
      );
    }

    const prevDetails = targetVisitation.visitationDetails;

    // 대상자 모두 삭제
    // 기존에 작성된 내용은 유지하고, 할당된 id 만 초기화
    if (visitedMembers.length === 0) {
      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          visitationDetails: [
            { ...prevDetails[0], memberId: BLANK, member: DEFAULT_MEMBER },
          ],
        })
      );
    }

    // 대상자 없음 => 생성
    // 기존에 작성된 내용은 유지하고, id 만 새로 할당
    else if (visitedMembers.length === 1) {
      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          visitationDetails: [
            {
              ...prevDetails[0],
              memberId: visitedMembers[0].value,
              member: { ...DEFAULT_MEMBER, name: visitedMembers[0].title },
            },
          ],
        })
      );
    }

    // 그 외
    else {
      const added = visitedMembers
        .filter((vm) => !prevDetails.some((d) => d.memberId === vm.value))
        .map((vm) => ({
          id: BLANK,
          memberId: vm.value,
          visitationContent: BLANK,
          visitationPray: BLANK,
          member: { ...DEFAULT_MEMBER, name: vm.title },
        }));

      // 2) 제거된 멤버 필드 삭제
      const updated = prevDetails.filter((d) =>
        visitedMembers.some((vm) => vm.value === d.memberId)
      );

      dispatch(
        setTargetVisitation({
          ...targetVisitation,
          visitationDetails: [...updated, ...added],
        })
      );
    }
  }, [visitedMembers]);

  // ===== Detail =====

  return (
    <AddVisitationContainer>
      {/* 상태 */}
      <InputContainer>
        <MainText>{t('status')}</MainText>
        <StatusDropdown
          value={targetVisitation.visitationStatus}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={40}
        />
      </InputContainer>

      {/* 제목 */}
      <InputContainer>
        <LabelInput
          ref={titleRef}
          label={t('title')}
          value={targetVisitation.visitationTitle}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={GRAY.DEFAULT}
          height={40}
        />
      </InputContainer>

      {/* 기간 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('period')}</MainText>
          <PeriodContainer>
            <CustomDatePicker
              value={targetVisitation.visitationStartDate}
              selected={getDateTimeFromString(
                targetVisitation.visitationStartDate
              )}
              onChange={onChangeStartDate}
              dateFormat="yyyy-MM-dd"
              placeholderText={t('startDate')}
              showYearDropdown={true}
              scrollableYearDropdown
              yearDropdownItemNumber={50}
              locale={ko}
              // showTimeSelect={true}
              showTimeInput={true}
              showTimeCaption={true}
              timeCaption={'시간'}
              timeIntervals={15}
              timeFormat="aa h:mm"
            />
            {/*<MainText*/}
            {/*  color={!targetVisitation.visitationStartDate ? 'gray' : BLACK}*/}
            {/*>*/}
            {/*  {targetVisitation.visitationStartDate*/}
            {/*    ? getFormattedDate(targetVisitation.visitationStartDate)*/}
            {/*    : t('startDate')}*/}
            {/*</MainText>*/}
            <MainText>{'-'}</MainText>
            <MainText
              color={!targetVisitation.visitationEndDate ? 'gray' : BLACK}
            >
              {targetVisitation.visitationEndDate
                ? getFormattedDate(targetVisitation.visitationEndDate)
                : t('endDate')}
            </MainText>
          </PeriodContainer>
        </LabelContainer>
      </InputContainer>

      {/* 대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('visitedMember')}</MainText>
          <MultiMemberDropdown
            ref={visitedMemberRef}
            values={visitedMembers}
            onChangeValues={onChangeVisitedMembers}
            height={40}
            placeholder={
              visitedMembers.length === 0 ? t_placeholder('name') : BLANK
            }
          />
        </LabelContainer>
      </InputContainer>

      {/* 방식 */}
      <LabelDropdown
        label={t('method')}
        value={targetVisitation.visitationMethod}
        items={methodItems}
        onChangeItem={onChangeMethod}
        height={40}
      />

      {/* 담당자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('instructor')}</MainText>
          <MultiMemberDropdown
            ref={instructorRef}
            values={instructor}
            onChangeValues={onChangeInstructor}
            height={40}
            isSingle={true}
            placeholder={
              instructor.length === 0 ? t_placeholder('name') : BLANK
            }
            // isUserMember={true}
          />
        </LabelContainer>
      </InputContainer>

      {targetVisitation.visitationDetails.map((detail) => (
        <DetailContainer key={detail.memberId}>
          {detail.member?.name &&
            targetVisitation.visitationDetails.length !== 1 && (
              <MainText fontWeight={600}>{detail.member.name}</MainText>
            )}
          {/* 내용 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationContent')}</MainText>
              <Quill
                value={detail.visitationContent}
                onChange={(event) => onChangeContent(detail.memberId, event)}
                minHeight={120}
                placeholder={t_placeholder('visitationContent')}
              />
            </LabelContainer>
          </InputContainer>

          {/* 기도제목 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationPray')}</MainText>
              <Quill
                value={detail.visitationPray}
                onChange={(event) => onChangePray(detail.memberId, event)}
                minHeight={120}
                placeholder={t_placeholder('visitationPray')}
              />
            </LabelContainer>
          </InputContainer>
        </DetailContainer>
      ))}

      {/* 보고대상자 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('receiver')}</MainText>
          <MultiMemberDropdown
            ref={receiverRef}
            values={receivers}
            onChangeValues={onChangeReceivers}
            height={40}
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
          />
        </LabelContainer>
      </InputContainer>
    </AddVisitationContainer>
  );
};

export default AddVisitation;
