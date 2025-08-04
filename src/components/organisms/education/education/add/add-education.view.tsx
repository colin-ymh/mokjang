'use client';

import styled from 'styled-components';
import React, { ChangeEvent } from 'react';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RequiredMark from '@/components/atoms/common/text/required-mark';
import BorderInput from '@/components/atoms/common/input/border-input';
import { SIZE } from '@/constants/styles/style';
import Button from '@/components/atoms/common/button/button';
import Plus from '../../../../../../public/svg/plus.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';

/* ──────────────────────────────── Styled Components ─────────────────────────────── */
const AddEducationViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
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
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (event: ChangeEvent<HTMLInputElement>) => void;
  onChangeEducationGoal: (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onClickAddGoal: () => void;
};

const AddEducationView = ({
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
      {/* 제목 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t('educationName')}
            <RequiredMark />
          </MainText>
          <BorderInput
            value={targetEducation.name}
            onChange={onChangeName}
            placeholder={t_placeholder('educationName')}
            borderColor={GRAY.LIGHT}
          />
        </ContentContainer>
      </CardContainer>

      {/* 요약 */}
      <CardContainer>
        <ContentContainer>
          <MainText size={SIZE.EXTRA_LARGE}>
            {t('educationDescription')}
          </MainText>
          <BorderInput
            value={targetEducation.description}
            onChange={onChangeDescription}
            placeholder={t_placeholder('educationDescription')}
            borderColor={GRAY.LIGHT}
          />
        </ContentContainer>
      </CardContainer>

      {/* 목표 */}
      <CardContainer>
        <ContentContainer>
          <RowContainer>
            <MainText size={SIZE.EXTRA_LARGE}>{t('educationGoal')}</MainText>
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
        </ContentContainer>
      </CardContainer>
    </AddEducationViewContainer>
  );
};

export default AddEducationView;
