import styled from 'styled-components';

import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { useI18n } from '../../../../../../locales/client';
import { SIZE } from '@/constants/styles/style';
import Star from '../../../../../../public/svg/star.svg';
import Calendar from '../../../../../../public/svg/calendar.svg';
import User from '../../../../../../public/svg/user.svg';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import React from 'react';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { Visitation, VISITATION_TYPE } from '@/models/visitation/visitation';
import { getTranslatedDateFromDateString } from '@/utils/translate';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import MainTag from '@/components/atoms/common/tag/main-tag';
import { getStatusBackgroundColor, getStatusFontColor } from '@/utils/color';

const ItemContainer = styled.div`
  display: flex;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid ${GRAY.LIGHT};
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
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
          <MainText size={SIZE.EXTRA_LARGE}>{visitation.title}</MainText>
          <MainTag
            title={t(visitation.status)}
            color={getStatusFontColor(visitation.status)}
            backgroundColor={getStatusBackgroundColor(visitation.status)}
          />
        </TitleContainer>
        {/* 날짜 */}
        <ContentContainer>
          <SvgIcon svg={Calendar} color={GRAY.SEMI_DARK} />
          <MainText color={GRAY.SEMI_DARK}>{t('period')}</MainText>
          <MainText>
            {`${getTranslatedDateFromDateString(locale, visitation.startDate)}
                -
                ${getTranslatedDateFromDateString(locale, visitation.endDate)}`}
          </MainText>
        </ContentContainer>
        <RowContainer>
          {/* 유형 */}
          <ContentContainer>
            <SvgIcon svg={Star} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('type')}</MainText>
            <MainText>
              {visitation.visitationType === VISITATION_TYPE.SINGLE
                ? t('visitationTypeSingle')
                : t('visitationTypeGroup')}
            </MainText>
          </ContentContainer>
          {/* 담당자 */}
          <ContentContainer>
            <SvgIcon svg={User} color={GRAY.SEMI_DARK} />
            <MainText color={GRAY.SEMI_DARK}>{t('inCharge')}</MainText>
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
