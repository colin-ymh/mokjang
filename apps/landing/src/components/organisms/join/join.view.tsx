import { ChangeEvent } from 'react';
import { Church } from '@mokjang/models';
import styled from 'styled-components';
import { GRAY, GREEN, LOCALE, MAIN, WHITE, YELLOW } from '@mokjang/constants';
import { BorderInput, Button, MainText, SvgIcon } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../locales/client';

import { Svg } from '@mokjang/assets';
import { getTranslatedMemberCount } from '@mokjang/utils';
import { usePathname } from 'next/navigation';

const JoinContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 800px;
  padding: 100px;
  background-color: ${WHITE};
`;

const WidthWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;

  gap: 30px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  background-color: ${GREEN.LIGHT};
  border-radius: 100%;
`;

const InformationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardContainer = styled.div<{
  $backgroundColor: string;
  $borderColor: string;
  $flexDirection: 'row' | 'column';
}>`
  display: flex;
  flex-direction: ${({ $flexDirection }) => $flexDirection};
  border-radius: 10px;
  border: ${({ $borderColor }) => `2px solid ${$borderColor}`};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 20px;
  gap: 20px;
`;

const CardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export type JoinViewProps = {
  joinCode: string;
  isConfirmed: boolean;
  isChecked: boolean;
  church: Church;
  onChangeJoinCode: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickCodeConfirm: () => void;
  onClickChurchChecked: () => void;
  onClickJoinRequest: () => void;
};

const JoinView = ({
  joinCode,
  isConfirmed,
  isChecked,
  church,
  onChangeJoinCode,
  onClickCodeConfirm,
  onClickChurchChecked,
  onClickJoinRequest,
}: JoinViewProps) => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const t_join = useScopedI18n('join');
  const t_info = useScopedI18n('join.info');
  const t_code = useScopedI18n('join.joinCode');
  const t_checked = useScopedI18n('join.checked');
  const t_button = useScopedI18n('button');

  return (
    <>
      <JoinContainer>
        <WidthWrapper>
          <HeaderContainer>
            <MainText fontSize={30} fontWeight={700}>
              {t_join('title')}
            </MainText>
            <MainText fontSize={18} fontWeight={400} color={GRAY.DARK}>
              {t_join('description')}
            </MainText>
          </HeaderContainer>
          <InputContainer>
            <MainText fontSize={14} fontWeight={500} color={GRAY.DARK}>
              {t_code('title')}
            </MainText>
            <RowContainer>
              <BorderInput value={joinCode} onChange={onChangeJoinCode} />
              <Button
                text={t_button('confirm')}
                width={80}
                height={40}
                onClick={onClickCodeConfirm}
                disabled={joinCode.length < 4}
                backgroundColor={
                  joinCode.length < 4 ? GRAY.DEFAULT : MAIN.DEFAULT
                }
              />
            </RowContainer>
            <MainText fontSize={12} fontWeight={400} color={GRAY.SEMI_DARK}>
              {t_code('description')}
            </MainText>
          </InputContainer>
          {isConfirmed && church.id && (
            <CardContainer
              $backgroundColor={GREEN.EXTRA_LIGHT}
              $borderColor={GREEN.LIGHT}
              $flexDirection={'column'}
            >
              <TitleContainer>
                <IconContainer>
                  <SvgIcon
                    svg={Svg.Check}
                    width={2}
                    size={18}
                    color={GREEN.DEFAULT}
                  />
                </IconContainer>
                <MainText fontSize={18} fontWeight={600}>
                  {t_checked('title')}
                </MainText>
              </TitleContainer>
              <InformationList>
                <RowContainer>
                  <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
                    {t('churchName')}
                  </MainText>
                  <MainText fontSize={16} fontWeight={500}>
                    {church.name}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
                    {t('denomination')}
                  </MainText>
                  <MainText fontSize={16} fontWeight={500}>
                    {church.denomination}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
                    {t('pastor')}
                  </MainText>
                  <MainText fontSize={16} fontWeight={500}>
                    {church.pastor}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
                    {t('memberCount')}
                  </MainText>
                  <MainText fontSize={16} fontWeight={500}>
                    {getTranslatedMemberCount(locale, church.memberCount)}
                  </MainText>
                </RowContainer>
                <RowContainer>
                  <MainText fontSize={14} fontWeight={400} color={GRAY.DARK}>
                    {t('address')}
                  </MainText>
                  <MainText fontSize={16} fontWeight={500}>
                    {church.address}
                  </MainText>
                </RowContainer>
              </InformationList>
              {!isChecked && (
                <CardContainer
                  $backgroundColor={YELLOW.EXTRA_LIGHT}
                  $borderColor={YELLOW.DEFAULT}
                  $flexDirection={'row'}
                >
                  <SvgIcon
                    svg={Svg.Warning}
                    width={2}
                    size={18}
                    color={YELLOW.SEMI_DARK}
                  />
                  <CardContentContainer>
                    <MainText color={YELLOW.DARK}>
                      {t_checked('warning1')}
                    </MainText>
                    <MainText color={YELLOW.DARK}>
                      {t_checked('warning2')}
                    </MainText>
                  </CardContentContainer>
                </CardContainer>
              )}
              {!isChecked && (
                <Button
                  text={t_checked('button')}
                  backgroundColor={YELLOW.SEMI_DARK}
                  color={WHITE}
                  height={50}
                  fontSize={16}
                  fontWeight={600}
                  icon={
                    <SvgIcon
                      svg={Svg.Check}
                      width={2}
                      size={18}
                      color={WHITE}
                    />
                  }
                  onClick={onClickChurchChecked}
                />
              )}

              {isChecked && (
                <CardContainer
                  $backgroundColor={MAIN.EXTRA_LIGHT}
                  $borderColor={MAIN.LIGHT}
                  $flexDirection={'row'}
                >
                  <SvgIcon
                    svg={Svg.Check}
                    width={2}
                    size={18}
                    color={MAIN.DEFAULT}
                  />
                  <MainText color={MAIN.DEFAULT}>{t_checked('title')}</MainText>
                </CardContainer>
              )}
            </CardContainer>
          )}

          <CardContainer
            $backgroundColor={GRAY.EXTRA_LIGHT}
            $borderColor={GRAY.LIGHT}
            $flexDirection={'row'}
          >
            <SvgIcon svg={Svg.Warning} width={2} size={18} color={GRAY.DARK} />
            <CardContentContainer>
              <MainText color={GRAY.DARK}>{t_info('title')}</MainText>
              <MainText color={GRAY.DARK}>{t_info('description')}</MainText>
            </CardContentContainer>
          </CardContainer>
          <Button
            text={t_join('button')}
            width={500}
            height={40}
            disabled={!(isChecked && isConfirmed)}
            backgroundColor={
              isChecked && isConfirmed ? MAIN.DEFAULT : GRAY.DEFAULT
            }
            onClick={onClickJoinRequest}
          />
        </WidthWrapper>
      </JoinContainer>
    </>
  );
};

export default JoinView;
