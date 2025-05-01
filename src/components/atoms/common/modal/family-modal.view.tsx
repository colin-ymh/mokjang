import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

import LabelDropdown from '@/components/atoms/common/dropdown/label-dropdown';
import { onClickEnter } from '@/utils/input';
import { BLANK, FAMILY } from '@/constants/constant';
import { FamilyMember } from '@/models/member/member';
import Button from '@/components/atoms/common/button/button';

import { useI18n, useScopedI18n } from '../../../../../locales/client';
import Cancel from '../../../../../public/svg/cancel.svg';
import { MemberDropdownValueType } from '@/models/dropdown/dropdown';
import MemberDropdown from '@/components/atoms/common/dropdown/member-dropdown';
import { GRAY } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

const FamilyModalViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  z-index: 50;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 10px;
  height: 30px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const CancelButton = styled(Cancel)`
  display: flex;
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

type FamilyModalViewProps = {
  familyMember: FamilyMember;
  familyMemberName: string;
  familyMemberId: string;
  familyMemberItems: MemberDropdownValueType[];
  familyRelation: FAMILY;
  familyRelationItems: MemberDropdownValueType[];
  isEdit: boolean;
  onClickClose: () => void;
  onClickCreateFamily: (
    familyMemberId: string,
    relation: FAMILY,
    isFetch: boolean
  ) => void;
  onClickEditFamily: (familyMemberId: string, relation: FAMILY) => void;
  onChangeFamilyMemberName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeFamilyMemberId: (id: string) => void;
  onChangeFamilyRelation: (value: FAMILY) => void;
};

const FamilyModalView = ({
  familyMember,
  familyMemberName,
  familyMemberId,
  familyMemberItems,
  familyRelation,
  familyRelationItems,
  isEdit,
  onClickClose,
  onClickCreateFamily,
  onClickEditFamily,
  onChangeFamilyMemberName,
  onChangeFamilyMemberId,
  onChangeFamilyRelation,
}: FamilyModalViewProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  return (
    <FamilyModalViewContainer>
      {/* 헤더 */}
      <HeaderContainer>
        <CancelButton onClick={onClickClose} />
      </HeaderContainer>
      {/* 내용 */}
      <ContentContainer>
        <MainText>{t('family')}</MainText>
        {/* 가족 */}
        <MemberDropdown
          enterKeyHint={'done'}
          // label={t('family')}
          value={familyMemberName}
          items={familyMemberItems}
          onChange={onChangeFamilyMemberName}
          onChangeItem={onChangeFamilyMemberId}
          placeholder={t_placeholder('family')}
          isEditable={familyMember.familyMember.name === BLANK}
          onKeyDown={onClickEnter}
        />
        {/* 가족관계 */}
        <LabelDropdown
          label={t('relation')}
          value={familyRelation}
          items={familyRelationItems}
          onChangeItem={onChangeFamilyRelation}
        />
      </ContentContainer>
      {isEdit ? (
        // 수정 버튼
        <ButtonContainer>
          <Button
            text={t('button.edit')}
            height={30}
            onClick={() => {
              onClickEditFamily(familyMemberId, familyRelation);
            }}
          />
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          {/* 단일 추가 */}
          <Button
            text={t('button.saveFamily')}
            height={30}
            onClick={() => {
              onClickCreateFamily(familyMemberId, familyRelation, false);
            }}
          />
          {/* 가족 전체 추가 */}
          <Button
            text={t('button.fetchFamily')}
            height={30}
            onClick={() => {
              onClickCreateFamily(familyMemberId, familyRelation, true);
            }}
            backgroundColor={GRAY.SEMI_LIGHT}
            disabled={true}
          />
        </ButtonContainer>
      )}
    </FamilyModalViewContainer>
  );
};

export default FamilyModalView;
