import styled from 'styled-components';

import { useScopedI18n } from '../../../../locales/client';
import { Button, MainText } from '../../../../../../packages/components/src';
import { GRAY } from '../../../../../../packages/constants/src';
import ChurchInitBar, {
  INIT_STEP,
} from '@/components/molecules/church/church-init-bar';
import GroupInit from '@/components/molecules/church/group-init';
import { useCallback, useMemo, useState } from 'react';
import MinistryInit from '@/components/molecules/church/ministry-init';
import OfficerInit from '@/components/molecules/church/officer-init';
import { usePageRouter } from '@/utils/router'; // ✅ 추가

const ChurchInitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 50px 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const BoxContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 좌우 정렬 유지 */
  align-items: center;
  gap: 20px;
  width: 700px;
`;

const ChurchInit = () => {
  const router = usePageRouter();
  const t_register = useScopedI18n('register.churchInit');
  const t_button = useScopedI18n('button');

  const [currentPage, setCurrentPage] = useState<INIT_STEP>(INIT_STEP.GROUP);

  // 단계 순서 고정 (진행바와 동일 순서)
  const steps = useMemo(
    () => [INIT_STEP.GROUP, INIT_STEP.OFFICER, INIT_STEP.MINISTRY],
    []
  );

  const currentIndex = steps.indexOf(currentPage);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < steps.length - 1;
  const isLast = !hasNext;

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    setCurrentPage(steps[currentIndex - 1]);
  }, [hasPrev, currentIndex, steps]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    setCurrentPage(steps[currentIndex + 1]);
  }, [hasNext, currentIndex, steps]);

  const goStart = useCallback(() => {
    router.push('/main'); // ✅ 마지막 단계에서 실행
  }, [router]);

  return (
    <ChurchInitContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_register('title')}
        </MainText>
        <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
          {t_register('description')}
        </MainText>
      </HeaderContainer>

      <ChurchInitBar currentPage={currentPage} />

      <BoxContainer>
        {currentPage === INIT_STEP.GROUP && <GroupInit />}
        {currentPage === INIT_STEP.MINISTRY && <MinistryInit />}
        {currentPage === INIT_STEP.OFFICER && <OfficerInit />}
      </BoxContainer>

      <ButtonContainer>
        {/* 이전 단계가 없으면 버튼 숨김 */}
        {hasPrev ? (
          <Button
            text={t_button('prevStage')}
            onClick={goPrev}
            width={200}
            height={50}
            fontWeight={500}
            fontSize={16}
          />
        ) : (
          <div /> /* 공간 유지용 (좌우 정렬 균형) */
        )}

        {/* 마지막 단계에서는 '시작하기' 버튼으로 대체 */}
        {hasNext ? (
          <Button
            text={t_button('nextStage')}
            onClick={goNext}
            width={200}
            height={50}
            fontWeight={500}
            fontSize={16}
          />
        ) : (
          <Button
            text={t_button('start')}
            onClick={goStart}
            width={200}
            height={50}
            fontWeight={600}
            fontSize={16}
          />
        )}
      </ButtonContainer>
    </ChurchInitContainer>
  );
};

export default ChurchInit;
