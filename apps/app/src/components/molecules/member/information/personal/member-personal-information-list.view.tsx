import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { Button, MainTag, MainText, SvgIcon } from '@mokjang/components';
import {
  CALENDAR_MODE,
  CONCEALED,
  GENDER,
  GRAY,
  GROUP_ROLE,
  LOCALE,
  MAIN,
  MARRIAGE,
  MEMBER,
  SIZE,
  WHITE,
  YELLOW,
} from '@mokjang/constants';
import {
  getAge,
  getDateFromDateString,
  getFormattedPhone,
  getTranslatedAge,
  getTranslatedDateFromDateString,
} from '@mokjang/utils';

import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';

import { Svg } from '@mokjang/assets';
import React from 'react';
import useWindowSize from '../../../../../hooks/window/window';
import { MinistryDetailHistory } from '@mokjang/models';

const InformationContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: auto;
  height: ${({ height }) => height}px;
`;

const InformationItem = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  padding: 10px;
  gap: 20px;

  &:last-child {
    border-bottom: none;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  flex-grow: 1;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 150px;
`;

const InformationTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  gap: 10px;
`;

const RowTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

type PersonalInformationListViewProps = {
  onClickGroupOpen?: () => void;
  onClickOfficerOpen?: () => void;
  onClickMinistryOpen?: () => void;
};

const PersonalInformationListView = ({
  onClickGroupOpen,
  onClickOfficerOpen,
  onClickMinistryOpen,
}: PersonalInformationListViewProps) => {
  const t_button = useScopedI18n('button');
  const { height } = useWindowSize();
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const t = useI18n();

  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer height={height - 300}>
      {/* 이름 */}
      <InformationItem>
        <SvgIcon svg={Svg.User} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.NAME)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.name}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 성별 */}
      <InformationItem>
        <SvgIcon
          svg={targetMember.gender === GENDER.FEMALE ? Svg.Female : Svg.Male}
          size={18}
          color={GRAY.DARK}
        />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.GENDER)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {t(targetMember.gender as GENDER)}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 생년월일 */}
      <InformationItem>
        <SvgIcon svg={Svg.Cake} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText
              color={GRAY.DARK}
            >{`${t(MEMBER.BIRTH)} / ${t(MEMBER.AGE)}`}</MainText>
          </TitleContainer>

          <InformationTextWrapper>
            {targetMember.birth && (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {`${getTranslatedDateFromDateString(basePath, targetMember.birth)} / ${getTranslatedAge(basePath, getAge(getDateFromDateString(targetMember.birth)))}`}
              </MainText>
            )}
            {targetMember.birth && (
              <MainText color={GRAY.DEFAULT}>
                {t(
                  targetMember.isLunar
                    ? CALENDAR_MODE.LUNAR
                    : CALENDAR_MODE.SOLAR
                )}
              </MainText>
            )}
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 결혼 */}
      <InformationItem>
        <SvgIcon svg={Svg.Heart} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.MARRIAGE)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.marriage === CONCEALED ? (
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {t('concealed')}
                </MainText>
              ) : targetMember.marriage ? (
                `${t(targetMember.marriage as MARRIAGE)} ${targetMember.detailMarriage ? `(${targetMember.detailMarriage})` : ''}`
              ) : (
                ''
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 직업 */}
      <InformationItem>
        <SvgIcon svg={Svg.Briefcase} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.OCCUPATION)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.occupation === CONCEALED ? (
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {t('concealed')}
                </MainText>
              ) : (
                targetMember.occupation
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 학교 */}
      <InformationItem>
        <SvgIcon svg={Svg.AcademicCap} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.SCHOOL)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.school === CONCEALED ? (
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {t('concealed')}
                </MainText>
              ) : (
                targetMember.school
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 도로명 주소 */}
      <InformationItem>
        <SvgIcon svg={Svg.Pin} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.ADDRESS)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            {targetMember.address === CONCEALED ? (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {t('concealed')}
              </MainText>
            ) : (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {targetMember.address}
              </MainText>
            )}
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 상세 주소 */}
      <InformationItem>
        <SvgIcon svg={Svg.Pin} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.DETAIL_ADDRESS)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            {targetMember.address === CONCEALED ? (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {t('concealed')}
              </MainText>
            ) : (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {targetMember.detailAddress}
              </MainText>
            )}
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 휴대전화번호 */}
      <InformationItem>
        <SvgIcon svg={Svg.MobilePhone} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.MOBILE_PHONE)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.mobilePhone === CONCEALED ? (
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {t('concealed')}
                </MainText>
              ) : (
                getFormattedPhone(targetMember.mobilePhone)
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 차량 번호 */}
      <InformationItem>
        <SvgIcon svg={Svg.Car} size={18} width={1} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.VEHICLE_NUMBER)}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            {targetMember?.vehicleNumber?.map((number, index) => (
              <MainText key={index}>{number}</MainText>
            ))}
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 그룹 */}
      <InformationItem>
        <SvgIcon svg={Svg.Users} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.GROUP)}</MainText>
          </TitleContainer>
          <RowTextWrapper>
            <InformationTextWrapper>
              {targetMember.groupHistory === CONCEALED ? (
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {t('concealed')}
                </MainText>
              ) : (
                <>
                  <MainText size={SIZE.LARGE} fontWeight={400}>
                    {targetMember?.groupHistory &&
                      targetMember?.groupHistory[0]?.group?.name}
                  </MainText>
                  {targetMember.groupRole === GROUP_ROLE.LEADER && (
                    <MainTag
                      title={t('groupLeader')}
                      color={YELLOW.DARK}
                      backgroundColor={YELLOW.LIGHT}
                    />
                  )}
                </>
              )}
            </InformationTextWrapper>
          </RowTextWrapper>
        </TextContainer>
        <Button
          width={'auto'}
          text={t_button('edit')}
          borderColor={MAIN.LIGHT}
          backgroundColor={WHITE}
          color={MAIN.DEFAULT}
          height={30}
          onClick={onClickGroupOpen}
        />
      </InformationItem>

      {/* 직분 */}
      <InformationItem>
        <SvgIcon svg={Svg.Star} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t(MEMBER.OFFICER)}</MainText>
          </TitleContainer>
          <RowTextWrapper>
            {targetMember.officerHistory === CONCEALED ? (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {t('concealed')}
              </MainText>
            ) : (
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {targetMember?.officerHistory &&
                  targetMember?.officerHistory[0]?.officer?.name}
              </MainText>
            )}
          </RowTextWrapper>
        </TextContainer>
        <Button
          width={'auto'}
          text={t_button('edit')}
          borderColor={MAIN.LIGHT}
          backgroundColor={WHITE}
          color={MAIN.DEFAULT}
          height={30}
          onClick={onClickOfficerOpen}
        />
      </InformationItem>

      {/* 사역 */}
      {targetMember.ministryGroupHistory === CONCEALED ? (
        <InformationItem>
          <SvgIcon svg={Svg.Star} size={18} width={2} color={GRAY.DARK} />
          <TextContainer>
            <TitleContainer>
              <MainText color={GRAY.DARK}>{t(MEMBER.MINISTRIES)}</MainText>
            </TitleContainer>
            <RowTextWrapper>
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {t('concealed')}
              </MainText>
            </RowTextWrapper>
          </TextContainer>
          <Button
            width="auto"
            text={t_button('edit')}
            borderColor={MAIN.LIGHT}
            backgroundColor={WHITE}
            color={MAIN.DEFAULT}
            height={30}
            onClick={onClickMinistryOpen}
          />
        </InformationItem>
      ) : (
        Array.isArray(targetMember.ministryGroupHistory) &&
        targetMember.ministryGroupHistory.map((history) => (
          <InformationItem key={history.id ?? history.id}>
            <SvgIcon svg={Svg.Star} size={18} width={2} color={GRAY.DARK} />
            <TextContainer>
              <TitleContainer>
                <MainText color={GRAY.DARK}>{t(MEMBER.MINISTRIES)}</MainText>
              </TitleContainer>
              <RowTextWrapper>
                <MainText size={SIZE.LARGE} fontWeight={400}>
                  {history.ministryGroup.name}
                </MainText>
                {history.ministryGroupDetailHistory.map(
                  (detailHistory: MinistryDetailHistory) => {
                    if (detailHistory?.role) {
                      return (
                        <MainTag
                          key={detailHistory.id}
                          title={t('ministryGroupLeader')}
                          color={MAIN.DARK}
                          backgroundColor={MAIN.LIGHT}
                        />
                      );
                    } else if (detailHistory?.ministry) {
                      return (
                        <MainText key={detailHistory.id} color={GRAY.DEFAULT}>
                          {
                            history.ministryGroupDetailHistory[0].ministry
                              ?.name as string
                          }
                        </MainText>
                      );
                    }
                  }
                )}
              </RowTextWrapper>
            </TextContainer>
            <Button
              width="auto"
              text={t_button('edit')}
              borderColor={MAIN.LIGHT}
              backgroundColor={WHITE}
              color={MAIN.DEFAULT}
              height={30}
              onClick={onClickMinistryOpen}
            />
          </InformationItem>
        ))
      )}

      {/* 신급 */}
      <InformationItem>
        <SvgIcon svg={Svg.Sparkle} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t('baptism')}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {t(targetMember.baptism)}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 교회등록일 */}
      <InformationItem>
        <SvgIcon svg={Svg.Calendar} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t('registeredAt')}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {getTranslatedDateFromDateString(
                basePath,
                targetMember.registeredAt
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 시스템등록일 */}
      <InformationItem>
        <SvgIcon svg={Svg.Setting} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t('createdAt')}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {getTranslatedDateFromDateString(
                basePath,
                targetMember.registeredAt
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 최종수정일 */}
      <InformationItem>
        <SvgIcon svg={Svg.Pencil} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <TitleContainer>
            <MainText color={GRAY.DARK}>{t('updatedAt')}</MainText>
          </TitleContainer>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {getTranslatedDateFromDateString(
                basePath,
                targetMember.updatedAt
              )}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>
    </InformationContainer>
  );
};

export default PersonalInformationListView;
