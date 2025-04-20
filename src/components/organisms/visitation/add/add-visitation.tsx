import styled from 'styled-components';
import LabelInput from '@/components/atoms/common/input/label-input';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BLANK } from '@/constants/constant';
import { getFormattedTitle } from '@/utils/format';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { GRAY, WHITE } from '@/constants/styles/color';
import Button from '@/components/atoms/common/button/button';
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
import Quill, { QuillHandle } from '@/components/atoms/common/input/quill';

const AddVisitationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  gap: 20px;
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

const ButtonContainer = styled.div<{ $isShown: boolean }>`
  display: flex;
  // display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  height: ${({ $isShown }) => ($isShown ? '40px' : '0')};
  flex-grow: 0;
  overflow: hidden;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: row;
  gap: 10px;
  opacity: ${({ $isShown }) => ($isShown ? '1' : '0')};

  transition: all 0.2s ease;
`;

export enum ADD_VISITATION_MODE {
  ADD = 'add',
  EDIT = 'edit',
  DISPLAY = 'display',
}

type AddVisitationProps = {
  mode?: ADD_VISITATION_MODE;
};

const AddVisitation = ({
  mode = ADD_VISITATION_MODE.ADD,
}: AddVisitationProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');
  const t_placeholder = useScopedI18n('placeholder');

  // ===== status =====
  const statusDropdownItems = useVisitationStatusDropdownItems();

  const [status, setStatus] = useState<VISITATION_STATUS>(
    VISITATION_STATUS.RESERVE
  );

  const onChangeStatus = (status: VISITATION_STATUS) => {
    setStatus(status);
  };
  // ===== status =====

  // ===== title =====
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>(BLANK);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(getFormattedTitle(event.target.value));
  };

  const [isTitleFocused, setIsTitleFocused] = useState(false);

  useEffect(() => {
    if (titleRef.current && mode === ADD_VISITATION_MODE.DISPLAY) {
      const titleInput = titleRef.current;

      const handleFocus = () => setIsTitleFocused(true);
      const handleBlur = () => setIsTitleFocused(false);

      titleInput.addEventListener('focus', handleFocus);
      titleInput.addEventListener('blur', handleBlur);

      return () => {
        titleInput.removeEventListener('focus', handleFocus);
        titleInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  const onClickTitleCancel = () => {};

  const onClickTitleSave = () => {};

  // ===== title =====

  // ===== visited member =====
  const visitedMemberRef = useRef<HTMLInputElement>(null);

  // 선택된 교인들 (대상자)
  const [visitedMembers, setVisitedMembers] = useState<MemberDropdownType[]>(
    []
  );

  const onChangeVisitedMembers = (values: MemberDropdownType[]) => {
    setVisitedMembers(values);
  };

  const [isVisitedMemberFocused, setIsVisitedMemberFocused] = useState(false);

  useEffect(() => {
    if (visitedMemberRef.current && mode === ADD_VISITATION_MODE.DISPLAY) {
      const visitedMemberInput = visitedMemberRef.current;

      const handleFocus = () => setIsVisitedMemberFocused(true);
      const handleBlur = () => setIsVisitedMemberFocused(false);

      visitedMemberInput.addEventListener('focus', handleFocus);
      visitedMemberInput.addEventListener('blur', handleBlur);

      return () => {
        visitedMemberInput.removeEventListener('focus', handleFocus);
        visitedMemberInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  // ===== visited member =====

  // ===== method =====
  const methodItems = useVisitationMethodDropdownItems();

  const [method, setMethod] = useState<VISITATION_METHOD>(
    VISITATION_METHOD.IN_PERSON
  );

  const onChangeMethod = (method: VISITATION_METHOD) => {
    setMethod(method);
  };

  // ===== method =====

  // ===== instructor =====
  const instructorRef = useRef<HTMLInputElement>(null);

  // 담당자
  const [instructor, setInstructor] = useState<MemberDropdownType[]>([]);

  const onChangeInstructor = (values: MemberDropdownType[]) => {
    setInstructor(values);
  };

  const [isInstructorFocused, setIsInstructorFocused] = useState(false);

  useEffect(() => {
    if (instructorRef.current && mode === ADD_VISITATION_MODE.DISPLAY) {
      const instructorInput = instructorRef.current;

      const handleFocus = () => setIsInstructorFocused(true);
      const handleBlur = () => setIsInstructorFocused(false);

      instructorInput.addEventListener('focus', handleFocus);
      instructorInput.addEventListener('blur', handleBlur);

      return () => {
        instructorInput.removeEventListener('focus', handleFocus);
        instructorInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  // ===== instructor =====

  // ===== receiver =====
  const receiverRef = useRef<HTMLInputElement>(null);

  // 선택된 보고대상자들
  const [receivers, setReceivers] = useState<MemberDropdownType[]>([]);

  const onChangeReceivers = (values: MemberDropdownType[]) => {
    setReceivers(values);
  };

  const [isReceiverFocused, setIsReceiverFocused] = useState(false);

  useEffect(() => {
    if (receiverRef.current) {
      const receiverInput = receiverRef.current;

      const handleFocus = () => setIsReceiverFocused(true);
      const handleBlur = () => setIsReceiverFocused(false);

      receiverInput.addEventListener('focus', handleFocus);
      receiverInput.addEventListener('blur', handleBlur);

      return () => {
        receiverInput.removeEventListener('focus', handleFocus);
        receiverInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);
  // ===== receiver =====

  // ===== content =====
  const contentRef = useRef<QuillHandle>(null);

  const [content, setContent] = useState<string>(BLANK);
  const [isContentFocused, setIsContentFocused] = useState(false);

  const onChangeContent = (value: string) => {
    setContent(value);
  };

  const onFocusContent = () => {
    if (mode === ADD_VISITATION_MODE.DISPLAY) setIsContentFocused(true);
  };
  const onBlurContent = () => {
    if (mode === ADD_VISITATION_MODE.DISPLAY) setIsContentFocused(false);
  };
  // ===== content =====

  // ===== pray =====
  const prayRef = useRef<QuillHandle>(null);

  const [pray, setPray] = useState<string>(BLANK);
  const [isPrayFocused, setIsPrayFocused] = useState(false);

  const onChangePray = (value: string) => {
    setPray(value);
  };

  const onFocusPray = () => {
    if (mode === ADD_VISITATION_MODE.DISPLAY) setIsPrayFocused(true);
  };
  const onBlurPray = () => {
    if (mode === ADD_VISITATION_MODE.DISPLAY) setIsPrayFocused(false);
  };
  // ===== pray =====

  return (
    <AddVisitationContainer>
      {/* 상태 */}
      {mode !== ADD_VISITATION_MODE.ADD && (
        <LabelDropdown
          label={t('status')}
          value={status}
          items={statusDropdownItems}
          onChangeItem={onChangeStatus}
          width={100}
          height={40}
        />
      )}

      {/* 제목 */}
      <InputContainer>
        <LabelInput
          ref={titleRef}
          label={t('title')}
          value={title}
          onChange={onChangeTitle}
          placeholder={t_placeholder('title')}
          borderColor={
            mode === ADD_VISITATION_MODE.DISPLAY && !isTitleFocused
              ? WHITE
              : GRAY.DEFAULT
          }
          height={40}
        />
        <ButtonContainer $isShown={isTitleFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
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
            isEditable={
              mode === ADD_VISITATION_MODE.ADD ||
              (mode === ADD_VISITATION_MODE.DISPLAY && isVisitedMemberFocused)
            }
            placeholder={
              visitedMembers.length === 0 ? t_placeholder('name') : BLANK
            }
          />
        </LabelContainer>

        <ButtonContainer $isShown={isVisitedMemberFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
      </InputContainer>

      {/* 방식 */}
      <LabelDropdown
        label={t('method')}
        value={method}
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
              (mode === ADD_VISITATION_MODE.DISPLAY && isInstructorFocused)
            }
            isSingle={true}
            placeholder={
              instructor.length === 0 ? t_placeholder('name') : BLANK
            }
          />
        </LabelContainer>
        <ButtonContainer $isShown={isInstructorFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
      </InputContainer>

      {/* 내용 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('visitationContent')}</MainText>
          <Quill
            ref={contentRef}
            value={content}
            onChange={onChangeContent}
            onFocus={onFocusContent}
            onBlur={onBlurContent}
            isEditable={mode === ADD_VISITATION_MODE.ADD || isContentFocused}
            minHeight={120}
            placeholder={t_placeholder('visitationContent')}
          />
        </LabelContainer>
        <ButtonContainer $isShown={isContentFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
      </InputContainer>

      {/* 기도제목 */}
      <InputContainer>
        <LabelContainer>
          <MainText>{t('visitationPray')}</MainText>
          <Quill
            ref={prayRef}
            value={pray}
            onChange={onChangePray}
            onFocus={onFocusPray}
            onBlur={onBlurPray}
            isEditable={mode === ADD_VISITATION_MODE.ADD || isPrayFocused}
            minHeight={120}
            placeholder={t_placeholder('visitationPray')}
          />
        </LabelContainer>
        <ButtonContainer $isShown={isPrayFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
      </InputContainer>

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
              (mode === ADD_VISITATION_MODE.DISPLAY && isReceiverFocused)
            }
            placeholder={receivers.length === 0 ? t_placeholder('name') : BLANK}
          />
        </LabelContainer>
        <ButtonContainer $isShown={isReceiverFocused}>
          <Button
            text={t_button('cancel')}
            height={30}
            width={50}
            color={GRAY.DEFAULT}
            backgroundColor={WHITE}
            borderColor={GRAY.LIGHT}
          />
          <Button
            text={t_button('save')}
            height={30}
            width={50}
            borderColor={GRAY.LIGHT}
          />
        </ButtonContainer>
      </InputContainer>
    </AddVisitationContainer>
  );
};

export default AddVisitation;
