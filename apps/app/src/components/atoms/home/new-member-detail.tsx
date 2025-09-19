import { MainTag, MainText, ProfileImage } from '@mokjang/components';
import { GRAY, LOCALE } from '@mokjang/constants';
import { getTranslatedDateFromDateString } from '@mokjang/utils';
import styled from 'styled-components';
import { Member } from '@mokjang/models';
import { useI18n } from '../../../../locales/client';
import { usePathname } from 'next/navigation';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  gap: 10px;
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
  align-content: center;
  gap: 10px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
      {/*<TotalContainer>*/}
      {/*  <MainText color={MAIN.DEFAULT} fontSize={22} fontWeight={700}>*/}
      {/*    {getTranslatedMemberCount(locale, memberDetails.length)}*/}
      {/*  </MainText>*/}
      {/*  <MainText color={GRAY.DARK}>{t('newMember')}</MainText>*/}
      {/*</TotalContainer>*/}
      <MemberDetailList>
        {memberDetails.map((member) => (
          <DetailItem key={member.id}>
            <ProfileImage
              value={member.profileImageUrl}
              width={40}
              height={40}
            />
            <ColumnContainer>
              <RowContainer>
                <MainText>{member.name}</MainText>
                <MainTag title={member.group?.name || t('noGroup')} />
                {/*<MainText color={GRAY.SEMI_DARK}>*/}
                {/*  {`${t('registeredAt')}`}*/}
                {/*</MainText>*/}
              </RowContainer>
              <RowContainer>
                <MainText color={GRAY.SEMI_DARK}>
                  {`${getTranslatedDateFromDateString(locale, member.registeredAt)}`}
                </MainText>
              </RowContainer>
            </ColumnContainer>
          </DetailItem>
        ))}
      </MemberDetailList>
    </DetailContainer>
  );
};

export default NewMemberDetail;
