import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, WHITE } from '@/constants/styles/color';
import Button from '@/components/atoms/common/button/button';
import {
  DEFAULT_VISITATION,
  DEFAULT_VISITATION_DETAIL,
  Visitation,
  VISITATION_METHOD,
  VISITATION_STATUS,
  VisitationDetail,
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
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { Member } from '@/models/member/member';
import { DEFAULT_MEMBER } from '@/redux/reducers/member-register-reducer';
import { setVisitations } from '@/redux/reducers/visitation-filter-reducer';

const AddVisitationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px 20px 25px 20px;
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

const ButtonContainer = styled.div<{
  $isShown: boolean;
  mode: ADD_VISITATION_MODE;
}>`
  display: flex;
  // display: ${({ $isShown, mode }) =>
    mode === ADD_VISITATION_MODE.DISPLAY && $isShown ? 'flex' : 'none'};
  height: ${({ mode, $isShown }) =>
    mode === ADD_VISITATION_MODE.DISPLAY && $isShown ? '40px' : '0'};
  flex-grow: 0;
  overflow: hidden;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: row;
  gap: 10px;
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};

  transition: all 0.2s ease;
`;

const DetailContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
`;

export enum ADD_VISITATION_MODE {
  ADD = 'add',
  DISPLAY = 'display',
}

type AddVisitationProps = {};

const AddVisitation = ({}: AddVisitationProps) => {
  const { visitations } = useSelector(
    (state: RootState) => state.visitationFilter
  );
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const { churchId } = useSelector((state: RootState) => state.church);

  const visitationsApi = new VisitationsApi(false);

  const [prevVisitation, setPrevVisitation] = useState<Visitation>(
    targetVisitation || DEFAULT_VISITATION
  );

  useEffect(() => {
    fetchVisitation();
  }, [targetVisitation.id]);

  const mode =
    prevVisitation.id !== BLANK
      ? ADD_VISITATION_MODE.DISPLAY
      : ADD_VISITATION_MODE.ADD;

  const dispatch = useDispatch<AppDispatch>();

  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_placeholder = useScopedI18n('placeholder');

  // ===== focus 관리 =====
  const [focusedValue, setFocusedValue] = useState<string>(BLANK);

  const onFocus = (id: string) => {
    setFocusedValue(id);
  };

  const onBlur = () => {
    setFocusedValue(BLANK);
  };

  // ===== status =====
  const statusDropdownItems = useVisitationStatusDropdownItems();

  const onChangeStatus = (status: VISITATION_STATUS) => {
    dispatch(
      setTargetVisitation({ ...targetVisitation, visitationStatus: status })
    );

    if (mode === ADD_VISITATION_MODE.DISPLAY) {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { visitationStatus: status }
        )
        .then((response) => {
          fetchVisitation();
        });
    }
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

  const onClickCancelTitle = () => {
    dispatch(
      setTargetVisitation({
        ...targetVisitation,
        visitationTitle: prevVisitation.visitationTitle,
      })
    );
    onBlur();
  };

  const onClickSaveTitle = () => {
    if (prevVisitation.visitationTitle !== targetVisitation.visitationTitle) {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { visitationTitle: targetVisitation.visitationTitle }
        )
        .then((response) => {
          fetchVisitation();
        });
    }
    onBlur();
  };

  // ===== title =====

  // ===== visited member =====
  const visitedMemberRef = useRef<HTMLInputElement>(null);

  // 선택된 교인들 (대상자)
  const [visitedMembers, setVisitedMembers] = useState<MemberDropdownType[]>(
    []
  );

  useEffect(() => {
    if (prevVisitation.members) {
      const newVisitedMembers = prevVisitation.members.map((member) => {
        return {
          value: member.id,
          title: member.name,
        };
      });

      setVisitedMembers(newVisitedMembers);
    } else {
      setVisitedMembers([]);
    }
  }, [prevVisitation.members]);

  const onChangeVisitedMembers = (values: MemberDropdownType[]) => {
    setVisitedMembers(values);
  };

  const onClickCancelVisitedMembers = () => {
    const newVisitedMembers = prevVisitation.members.map((member) => {
      return {
        value: member.id,
        title: member.name,
      };
    });
    setVisitedMembers(newVisitedMembers);
    onBlur();
  };

  const onClickSaveVisitedMembers = () => {
    const prevMemberIds = prevVisitation.members.map((member) => {
      return member.id;
    });
    const targetMemberIds = targetVisitation.members.map((member) => {
      return member.id;
    });

    if (prevMemberIds !== targetMemberIds) {
      // 배열 비교를 위해 Set으로 변환
      const prevSet = new Set(prevMemberIds);
      const targetSet = new Set(targetMemberIds);

      // 추가된 멤버 ID: target에는 있는데 prev에는 없는 것
      const addMemberIds = targetMemberIds.filter((id) => !prevSet.has(id));

      // 삭제된 멤버 ID: prev에는 있는데 target에는 없는 것
      const deleteMemberIds = prevMemberIds.filter((id) => !targetSet.has(id));

      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { addMemberIds, deleteMemberIds }
        )
        .then((response) => {
          fetchVisitation();
        });
    }

    onBlur();
  };

  // ===== visited member =====

  // ===== method =====
  const methodItems = useVisitationMethodDropdownItems();

  const onChangeMethod = (method: VISITATION_METHOD) => {
    dispatch(
      setTargetVisitation({ ...targetVisitation, visitationMethod: method })
    );

    if (mode === ADD_VISITATION_MODE.DISPLAY) {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { visitationMethod: method }
        )
        .then((response) => {
          fetchVisitation();
        });
    }
  };

  // ===== method =====

  // ===== instructor =====
  const instructorRef = useRef<HTMLInputElement>(null);

  // 담당자
  const [instructor, setInstructor] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (prevVisitation.instructorId) {
      const newInstructor = {
        value: prevVisitation.instructor.id,
        title: prevVisitation.instructor.name,
      };

      setInstructor([newInstructor]);
    } else {
      setInstructor([]);
    }
  }, [prevVisitation.instructor]);

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

  const onClickCancelInstructor = () => {
    const newInstructor = {
      value: prevVisitation.instructor.id,
      title: prevVisitation.instructor.name,
    };

    setInstructor([newInstructor]);
    onBlur();
  };

  const onClickSaveInstructor = () => {
    if (prevVisitation.instructor.id !== targetVisitation.instructorId) {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { instructorId: targetVisitation.instructorId }
        )
        .then((response) => {
          fetchVisitation();
        });
    }

    onBlur();
  };

  // ===== instructor =====

  // ===== receiver =====
  const receiverRef = useRef<HTMLInputElement>(null);

  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  useEffect(() => {
    if (prevVisitation.reports) {
      const newReceivers = prevVisitation.reports.map((report) => {
        return {
          value: report.receiver.id,
          title: report.receiver.name,
        };
      });
      setReceivers(newReceivers);
    } else {
      setReceivers([]);
    }
  }, [prevVisitation.reports]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);

    const receiverIds = values.map((value) => {
      return value.value;
    });

    dispatch(
      setTargetVisitation({ ...targetVisitation, receiverIds: receiverIds })
    );
  };

  const onClickCancelReceivers = () => {
    const newReceivers = prevVisitation.reports.map((report) => {
      return {
        value: report.receiver.id,
        title: report.receiver.name,
      };
    });
    setReceivers(newReceivers);
    onBlur();
  };

  const onClickSaveReceivers = () => {
    const prevReceiversIds = prevVisitation.reports.map((report) => {
      return report.receiver.id;
    });
    const targetReceiversIds = targetVisitation.receiverIds;

    if (prevReceiversIds !== targetReceiversIds) {
      // 배열 비교를 위해 Set으로 변환
      const prevSet = new Set(prevReceiversIds);
      const targetSet = new Set(targetReceiversIds);

      // 추가된 멤버 ID: target에는 있는데 prev에는 없는 것
      const addReceiverIds = targetReceiversIds.filter(
        (id) => !prevSet.has(id)
      );

      // 삭제된 멤버 ID: prev에는 있는데 target에는 없는 것
      const deleteReceiverIds = prevReceiversIds.filter(
        (id) => !targetSet.has(id)
      );

      if (addReceiverIds.length !== 0) {
        visitationsApi
          .addReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: addReceiverIds }
          )
          .then((response) => {
            fetchVisitation();
          });
      }

      if (deleteReceiverIds.length !== 0) {
        visitationsApi
          .deleteReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: deleteReceiverIds }
          )
          .then((response) => {
            fetchVisitation();
          });
      }
    }

    onBlur();
  };

  // ===== receiver =====

  // ===== Detail =====
  const [details, setDetails] = useState<VisitationDetail[]>([
    DEFAULT_VISITATION_DETAIL,
  ]);

  useEffect(() => {
    if (prevVisitation.visitationDetails) {
      setDetails(prevVisitation.visitationDetails);
    } else {
      setDetails([]);
    }
  }, [prevVisitation.visitationDetails]);

  const onChangeContent = (memberId: string, content: string) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.memberId === memberId
          ? { ...detail, visitationContent: content }
          : detail
      )
    );
  };

  const onChangePray = (memberId: string, pray: string) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.memberId === memberId
          ? { ...detail, visitationPray: pray }
          : detail
      )
    );
  };

  const onClickCancelContent = (memberId: string) => {
    const prevDetail = prevVisitation.visitationDetails.find(
      (detail) => detail.memberId === memberId
    );

    if (prevDetail) {
      setDetails((prev) =>
        prev.map((detail) =>
          detail.memberId === memberId
            ? { ...detail, visitationContent: prevDetail.visitationContent }
            : detail
        )
      );
    }

    onBlur();
  };

  const onClickSaveContent = (memberId: string) => {
    const newDetail = details.find((detail) => detail.memberId === memberId);

    if (newDetail?.id) {
      visitationsApi
        .editVisitationDetails(
          {
            churchId,
            visitationId: prevVisitation.id,
            detailId: newDetail.id,
          },
          { visitationContent: newDetail.visitationContent }
        )
        .then((response) => {
          fetchVisitation();
        });
    }
    onBlur();
  };

  const onClickCancelPray = (memberId: string) => {
    const prevDetail = prevVisitation.visitationDetails.find(
      (detail) => detail.memberId === memberId
    );

    if (prevDetail) {
      setDetails((prev) =>
        prev.map((detail) =>
          detail.memberId === memberId
            ? { ...detail, visitationPray: prevDetail.visitationPray }
            : detail
        )
      );
    }
    onBlur();
  };

  const onClickSavePray = (memberId: string) => {
    const newDetail = details.find((detail) => detail.memberId === memberId);

    if (newDetail?.id) {
      visitationsApi
        .editVisitationDetails(
          {
            churchId,
            visitationId: prevVisitation.id,
            detailId: newDetail.id,
          },
          { visitationPray: newDetail.visitationPray }
        )
        .then((response) => {
          fetchVisitation();
        });
    }
    onBlur();
  };

  useEffect(() => {
    const newMembers = visitedMembers.map((member): Member => {
      return { ...DEFAULT_MEMBER, id: member.value, name: member.title };
    });
    dispatch(setTargetVisitation({ ...targetVisitation, members: newMembers }));

    // 대상자 모두 삭제
    // 기존에 작성된 내용은 유지하고, 할당된 id 만 초기화
    if (visitedMembers.length === 0) {
      setDetails([{ ...details[0], memberId: BLANK }]);
    }

    // 대상자 없음 => 생성
    // 기존에 작성된 내용은 유지하고, id 만 새로 할당
    else if (visitedMembers.length === 1) {
      setDetails([{ ...details[0], memberId: visitedMembers[0].value }]);
    }

    // 그 외
    else {
      setDetails((prev) => {
        // 1) visitedMembers 에 새로 생긴 멤버 추가
        const added = visitedMembers
          .filter((vm) => !prev.some((d) => d.memberId === vm.value))
          .map((vm) => ({
            id: BLANK,
            memberId: vm.value,
            visitationContent: BLANK,
            visitationPray: BLANK,
          }));

        // 2) 제거된 멤버 필드 삭제
        const updated = prev.filter((d) =>
          visitedMembers.some((vm) => vm.value === d.memberId)
        );

        return [...updated, ...added];
      });
    }
  }, [visitedMembers]);

  useEffect(() => {
    dispatch(
      setTargetVisitation({ ...targetVisitation, visitationDetails: details })
    );
  }, [details]);

  const fetchVisitation = () => {
    if (targetVisitation.id && targetVisitation.id !== BLANK) {
      visitationsApi
        .getVisitation({
          churchId,
          visitationId: targetVisitation.id,
        })
        .then((response) => {
          const newVisitation = response.data;

          const newVisitations = visitations.map((visitation) => {
            if (visitation.id === newVisitation.id) {
              return newVisitation;
            } else {
              return visitation;
            }
          });
          setPrevVisitation(newVisitation);
          dispatch(setVisitations(newVisitations));
          dispatch(setTargetVisitation(newVisitation));
        });
    } else {
      setPrevVisitation(DEFAULT_VISITATION);
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
    }
  };

  // ===== Detail =====

  return (
    <AddVisitationContainer>
      {/* 상태 */}
      {mode !== ADD_VISITATION_MODE.ADD && (
        <LabelDropdown
          label={t('status')}
          value={targetVisitation.visitationStatus}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={40}
        />
      )}

      {/* 제목 */}
      <InputContainer onFocus={() => onFocus('title')}>
        <LabelInput
          ref={titleRef}
          label={t('title')}
          value={targetVisitation.visitationTitle}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={
            mode === ADD_VISITATION_MODE.DISPLAY && focusedValue !== 'title'
              ? WHITE
              : GRAY.DEFAULT
          }
          height={40}
        />
        <ButtonContainer mode={mode} $isShown={focusedValue === 'title'}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickCancelTitle}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickSaveTitle}
          />
        </ButtonContainer>
      </InputContainer>

      {/* 대상자 */}
      <InputContainer onFocus={() => onFocus('visitedMember')}>
        <LabelContainer>
          <MainText>{t('visitedMember')}</MainText>
          <MultiMemberDropdown
            ref={visitedMemberRef}
            values={visitedMembers}
            onChangeValues={onChangeVisitedMembers}
            height={40}
            isEditable={
              mode === ADD_VISITATION_MODE.ADD ||
              (mode === ADD_VISITATION_MODE.DISPLAY &&
                focusedValue === 'visitedMember')
            }
            placeholder={
              visitedMembers.length === 0 ? t_placeholder('name') : BLANK
            }
          />
        </LabelContainer>

        <ButtonContainer
          mode={mode}
          $isShown={focusedValue === 'visitedMember'}
        >
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickCancelVisitedMembers}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickSaveVisitedMembers}
          />
        </ButtonContainer>
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
            isEditable={
              mode === ADD_VISITATION_MODE.ADD ||
              (mode === ADD_VISITATION_MODE.DISPLAY &&
                focusedValue === 'instructor')
            }
            isSingle={true}
            placeholder={
              instructor.length === 0 ? t_placeholder('name') : BLANK
            }
            onFocus={() => onFocus('instructor')}
            // isUserMember={true}
          />
        </LabelContainer>
        <ButtonContainer mode={mode} $isShown={focusedValue === 'instructor'}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickCancelInstructor}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickSaveInstructor}
          />
        </ButtonContainer>
      </InputContainer>

      {details.map((detail) => (
        <DetailContainer key={detail.memberId}>
          {/* 내용 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationContent')}</MainText>
              <Quill
                value={detail.visitationContent}
                onChange={(event) => onChangeContent(detail.memberId, event)}
                onFocus={() => onFocus(`content-${detail.memberId}`)}
                isEditable={
                  mode === ADD_VISITATION_MODE.ADD ||
                  focusedValue === `content-${detail.memberId}`
                }
                minHeight={120}
                placeholder={t_placeholder('visitationContent')}
              />
            </LabelContainer>
            <ButtonContainer
              mode={mode}
              $isShown={focusedValue === `content-${detail.memberId}`}
            >
              <Button
                text={t_button('cancel')}
                height={30}
                width={50}
                color={GRAY.DEFAULT}
                backgroundColor={WHITE}
                borderColor={GRAY.SEMI_LIGHT}
                onClick={() => onClickCancelContent(detail.memberId)}
              />
              <Button
                text={t_button('save')}
                height={30}
                width={50}
                borderColor={GRAY.SEMI_LIGHT}
                onClick={() => onClickSaveContent(detail.memberId)}
              />
            </ButtonContainer>
          </InputContainer>

          {/* 기도제목 */}
          <InputContainer>
            <LabelContainer>
              <MainText>{t('visitationPray')}</MainText>
              <Quill
                value={detail.visitationPray}
                onChange={(event) => onChangePray(detail.memberId, event)}
                onFocus={() => onFocus(`pray-${detail.memberId}`)}
                isEditable={
                  mode === ADD_VISITATION_MODE.ADD ||
                  focusedValue === `pray-${detail.memberId}`
                }
                minHeight={120}
                placeholder={t_placeholder('visitationPray')}
              />
            </LabelContainer>
            <ButtonContainer
              mode={mode}
              $isShown={focusedValue === `pray-${detail.memberId}`}
            >
              <Button
                text={t_button('cancel')}
                height={30}
                width={50}
                color={GRAY.DEFAULT}
                backgroundColor={WHITE}
                borderColor={GRAY.SEMI_LIGHT}
                onClick={() => onClickCancelPray(detail.memberId)}
              />
              <Button
                text={t_button('save')}
                height={30}
                width={50}
                borderColor={GRAY.SEMI_LIGHT}
                onClick={() => onClickSavePray(detail.memberId)}
              />
            </ButtonContainer>
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
            isEditable={
              mode === ADD_VISITATION_MODE.ADD ||
              (mode === ADD_VISITATION_MODE.DISPLAY &&
                focusedValue === 'receiver')
            }
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
            onFocus={() => onFocus('receiver')}
          />
        </LabelContainer>
        <ButtonContainer mode={mode} $isShown={focusedValue === 'receiver'}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickCancelReceivers}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.SEMI_LIGHT}
            onClick={onClickSaveReceivers}
          />
        </ButtonContainer>
      </InputContainer>
    </AddVisitationContainer>
  );
};

export default AddVisitation;
