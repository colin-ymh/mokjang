'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RequiredMark from '@/components/atoms/common/text/required-mark';
import BorderInput from '@/components/atoms/common/input/border-input';
import Button from '@/components/atoms/common/button/button';
import Plus from '../../../../../../public/svg/plus.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import BorderTextarea from '@/components/atoms/common/input/border-textarea';
import { SIZE } from '@/constants/styles/style';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationViewContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  height: 40px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const GoalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

type AddEducationViewProps = {
  isEdit: boolean;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeEducationGoal: (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onClickAddGoal: () => void;
};

const AddEducationView = ({
  isEdit,
  onChangeName,
  onChangeDescription,
  onChangeEducationGoal,
  onClickAddGoal,
}: AddEducationViewProps) => {
  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');

  return (
    <AddEducationViewContainer>
      <HeaderContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
          {t(isEdit ? 'title.editEducation' : 'title.addEducation')}
        </MainText>
      </HeaderContainer>
      <ContentContainer>
        {/* 제목 */}
        <ColumnContainer>
          <TitleContainer>
            <MainText>
              {t('educationName')}
              <RequiredMark />
            </MainText>
          </TitleContainer>
          <BorderInput
            value={targetEducation.name}
            onChange={onChangeName}
            placeholder={t_placeholder('educationName')}
            borderColor={GRAY.LIGHT}
            maxLength={50}
          />
        </ColumnContainer>

        {/* 요약 */}
        <ColumnContainer>
          <TitleContainer>
            <MainText>{t('educationDescription')}</MainText>
          </TitleContainer>
          <BorderTextarea
            value={targetEducation.description}
            onChange={onChangeDescription}
            placeholder={t_placeholder('educationDescription')}
            borderColor={GRAY.LIGHT}
            maxLength={300}
          />
        </ColumnContainer>

        {/* 목표 */}
        <ColumnContainer>
          <RowContainer>
            <TitleContainer>
              <MainText>{t('educationGoal')}</MainText>
            </TitleContainer>
            <Button
              text={t('button.addEducationGoal')}
              onClick={onClickAddGoal}
              height={30}
              width={'auto'}
              backgroundColor={'transparent'}
              color={MAIN.DEFAULT}
              icon={<SvgIcon svg={Plus} color={MAIN.DEFAULT} />}
            />
          </RowContainer>
          <GoalList>
            {targetEducation.goals.map((goal, index) => (
              <BorderInput
                key={index}
                value={goal}
                onChange={(event) => onChangeEducationGoal(index, event)}
                placeholder={t_placeholder('educationGoal')}
                borderColor={GRAY.LIGHT}
              />
            ))}
          </GoalList>
        </ColumnContainer>
      </ContentContainer>
    </AddEducationViewContainer>
  );
};

export default AddEducationView;
