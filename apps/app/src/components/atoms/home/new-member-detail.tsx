import MemberProfilePopupButton from '../../molecules/common/button/member-profile-popup-button';
import { MainText } from '../common/text/main-text';
import { GRAY, MAIN } from '../../../constants/styles/color';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../utils/date';
import styled from 'styled-components';
import { Member } from '../../../models/member/member';
import { useI18n } from '../../../../locales/client';
import { getTranslatedMemberCount } from '@mokjang/utils';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../constants/state/locale';
import MainTag from '../common/tag/main-tag';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  gap: 10px;
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100px;
  background-color: ${MAIN.EXTRA_LIGHT};
  border-radius: 10px;

  justify-content: center;
  align-items: center;
`;

const MemberDetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  overflow-y: auto;
  justify-content: space-between;
`;

const DetailItem = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: flex-end;
  gap: 5px;
`;

type NewMemberDetailProps = {
  memberDetails: Member[];
};

const NewMemberDetail = ({ memberDetails }: NewMemberDetailProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();

  return (
    <DetailContainer>
      <TotalContainer>
        <MainText color={MAIN.DEFAULT} fontSize={22} fontWeight={700}>
          {getTranslatedMemberCount(locale, memberDetails.length)}
        </MainText>
        <MainText color={GRAY.DARK}>{t('newMember')}</MainText>
      </TotalContainer>
      <MemberDetailList>
        {memberDetails.map((member) => (
          <DetailItem key={member.id}>
            <MemberProfilePopupButton member={member} />
            <RightContainer>
              {member.group ? (
                <MainTag title={member.group.name || t('noGroup')} />
              ) : (
                <div></div>
              )}
              <MainText color={GRAY.SEMI_LIGHT}>
                {`${t('registeredAt')}: ${getDateStringFromDate(getDateFromDateString(member.registeredAt))}`}
              </MainText>
            </RightContainer>
          </DetailItem>
        ))}
      </MemberDetailList>
    </DetailContainer>
  );
};

export default NewMemberDetail;
