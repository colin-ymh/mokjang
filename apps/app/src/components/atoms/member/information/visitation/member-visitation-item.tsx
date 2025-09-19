import styled from 'styled-components';
import { MainTag, MainText } from '@mokjang/components';
import { CURSOR, GRAY, LOCALE, SIZE } from '@mokjang/constants';
import { useI18n } from '../../../../../../locales/client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Visitation, VISITATION_TYPE } from '@mokjang/models';
import { getTranslatedStartEndDate } from '@mokjang/utils';
import MemberProfilePopupButton from '../../../../molecules/common/button/member-profile-popup-button';
import {
  getStatusBackgroundColor,
  getStatusFontColor,
} from '../../../../../utils/color';

const ItemContainer = styled.div`
  display: flex;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${GRAY.LIGHT};
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;

  &:hover {
    border-width: 2px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  padding-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

type MemberVisitationItemProps = {
  visitation: Visitation;
  onClickVisitation: (visitation: Visitation) => void;
};

const MemberVisitationItem = ({
  visitation,
  onClickVisitation,
}: MemberVisitationItemProps) => {
  // 로케일 코드
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <>
      <ItemContainer onClick={() => onClickVisitation(visitation)}>
        <TitleContainer>
          {/* 제목 */}
          <MainText size={SIZE.EXTRA_LARGE} cursor={CURSOR.POINTER}>
            {visitation.title}
          </MainText>
          <MainTag
            title={t(visitation.status)}
            color={getStatusFontColor(visitation.status)}
            backgroundColor={getStatusBackgroundColor(visitation.status)}
          />
        </TitleContainer>
        {/* 날짜 */}
        <ContentContainer>
          <MainText color={GRAY.SEMI_DARK} cursor={CURSOR.POINTER}>
            {t('period')}
          </MainText>
          <MainText cursor={CURSOR.POINTER}>
            {getTranslatedStartEndDate(
              locale,
              visitation.startDate,
              visitation.endDate
            )}
          </MainText>
        </ContentContainer>
        <RowContainer>
          {/* 유형 */}
          <ContentContainer>
            <MainText color={GRAY.SEMI_DARK} cursor={CURSOR.POINTER}>
              {t('type')}
            </MainText>
            <MainText cursor={CURSOR.POINTER}>
              {visitation.visitationType === VISITATION_TYPE.SINGLE
                ? t('visitationTypeSingle')
                : t('visitationTypeGroup')}
            </MainText>
          </ContentContainer>
          {/* 담당자 */}
          <ContentContainer>
            <MainText color={GRAY.SEMI_DARK} cursor={CURSOR.POINTER}>
              {t('inCharge')}
            </MainText>
            <MemberProfilePopupButton
              member={visitation.inCharge}
              isProfileImageShown={false}
            />
          </ContentContainer>
        </RowContainer>
      </ItemContainer>
    </>
  );
};

export default MemberVisitationItem;
