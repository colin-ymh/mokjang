import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { MainText } from '@mokjang/components';
import { MEMBER } from '@mokjang/constants';
import { GRAY, MAIN, PURPLE } from '@mokjang/constants';
import {
  CALENDAR_MODE,
  GENDER,
  GROUP_ROLE,
  MARRIAGE,
} from '@mokjang/constants';
import { LOCALE } from '@mokjang/constants';
import { getFormattedMobilePhone } from '@mokjang/utils';
import {
  getAge,
  getDateFromDateString,
  getDateStringFromDate,
} from '@mokjang/utils';

import { useI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { SvgIcon } from '@mokjang/components';
import {
  getTranslatedAge,
  getTranslatedDateFromDateString,
} from '@mokjang/utils';
import { SIZE } from '@mokjang/constants';
import { MainTag } from '@mokjang/components';

import { Svg } from '@mokjang/assets';
import React from 'react';
import useWindowSize from '../../../../../hooks/window/window';

const InformationContainer = styled.div<{ height: number }>`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
  height: ${({ height }) => height}px;
`;

const InformationItem = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${GRAY.EXTRA_LIGHT};
  padding: 10px;
  gap: 20px;

  &:last-child {
    border-bottom: none;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 10px;
  min-height: 60px;
`;

const InformationTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  gap: 10px;
`;

const ColumnTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 40px;
  gap: 5px;
`;

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
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
  const { height } = useWindowSize();
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const t = useI18n();

  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  return (
    <InformationContainer height={height - 350}>
      {/* 이름 */}
      <InformationItem>
        <SvgIcon svg={Svg.User} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.NAME)}</MainText>
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
          <MainText color={GRAY.DARK}>{t(MEMBER.GENDER)}</MainText>
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
          <MainText
            color={GRAY.DARK}
          >{`${t(MEMBER.BIRTH)} / ${t(MEMBER.AGE)}`}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {`${getTranslatedDateFromDateString(basePath, targetMember.birth)} / ${getTranslatedAge(basePath, getAge(getDateFromDateString(targetMember.birth)))}`}
            </MainText>
            <MainTag
              title={t(
                targetMember.isLunar ? CALENDAR_MODE.LUNAR : CALENDAR_MODE.SOLAR
              )}
            />
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 결혼 */}
      <InformationItem>
        <SvgIcon svg={Svg.Heart} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.MARRIAGE)}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {`${t(targetMember.marriage as MARRIAGE)} ${targetMember.detailMarriage ? `(${targetMember.detailMarriage})` : ''}`}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 직업 */}
      <InformationItem>
        <SvgIcon svg={Svg.Briefcase} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.OCCUPATION)}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.occupation}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 학교 */}
      <InformationItem>
        <SvgIcon svg={Svg.AcademicCap} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.SCHOOL)}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.school}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 도로명 주소 */}
      <InformationItem>
        <SvgIcon svg={Svg.Pin} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.ADDRESS)}</MainText>
          <ColumnTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.address}
            </MainText>
            <MainText color={GRAY.DARK}>{targetMember.detailAddress}</MainText>
          </ColumnTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 휴대전화번호 */}
      <InformationItem>
        <SvgIcon svg={Svg.MobilePhone} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.MOBILE_PHONE)}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {getFormattedMobilePhone(targetMember.mobilePhone)}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 집전화번호 */}
      <InformationItem>
        <SvgIcon svg={Svg.Phone} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.HOME_PHONE)}</MainText>
          <InformationTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember.homePhone}
            </MainText>
          </InformationTextWrapper>
        </TextContainer>
      </InformationItem>

      {/* 차량 번호 */}
      <InformationItem>
        <SvgIcon svg={Svg.Car} size={18} width={1} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.VEHICLE_NUMBER)}</MainText>
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
          <MainText color={GRAY.DARK}>{t(MEMBER.GROUP)}</MainText>
          <ColumnTextWrapper>
            <InformationTextWrapper>
              <MainText size={SIZE.LARGE} fontWeight={400}>
                {targetMember?.groupHistory &&
                  targetMember?.groupHistory[0]?.group?.name}
              </MainText>
              {targetMember.groupRole === GROUP_ROLE.LEADER && (
                <MainTag
                  title={t('groupLeader')}
                  color={MAIN.DARK}
                  backgroundColor={MAIN.LIGHT}
                />
              )}
            </InformationTextWrapper>
            {targetMember?.groupHistory &&
              targetMember.groupHistory.length > 0 && (
                <MainText color={GRAY.DARK}>
                  {getTranslatedDateFromDateString(
                    basePath,
                    getDateStringFromDate(
                      getDateFromDateString(
                        targetMember?.groupHistory[0]?.startDate
                      )
                    )
                  )}
                </MainText>
              )}
          </ColumnTextWrapper>
        </TextContainer>
        <EditButtonContainer onClick={onClickGroupOpen}>
          <SvgIcon
            svg={Svg.Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickGroupOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 직분 */}
      <InformationItem>
        <SvgIcon svg={Svg.Star} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.OFFICER)}</MainText>
          <ColumnTextWrapper>
            <MainText size={SIZE.LARGE} fontWeight={400}>
              {targetMember?.officerHistory &&
                targetMember?.officerHistory[0]?.officer?.name}
            </MainText>
            {targetMember?.officerHistory &&
              targetMember.officerHistory.length > 0 && (
                <MainText color={GRAY.DARK}>
                  {getTranslatedDateFromDateString(
                    basePath,
                    getDateStringFromDate(
                      getDateFromDateString(
                        targetMember?.officerHistory[0]?.startDate
                      )
                    )
                  )}
                </MainText>
              )}
          </ColumnTextWrapper>
        </TextContainer>
        <EditButtonContainer onClick={onClickOfficerOpen}>
          <SvgIcon
            svg={Svg.Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickOfficerOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 사역 */}
      <InformationItem>
        <SvgIcon svg={Svg.Users} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t(MEMBER.MINISTRIES)}</MainText>
          <ColumnTextWrapper>
            {targetMember.ministryGroupHistory
              ?.slice(0, 3)
              .map((ministryHistory) => (
                <InformationTextWrapper key={ministryHistory.id}>
                  <MainText size={SIZE.LARGE} fontWeight={400}>
                    {ministryHistory.ministryGroup?.name}
                  </MainText>
                  {ministryHistory.ministryGroupDetailHistory.map(
                    (detailHistory) => {
                      if (detailHistory?.role) {
                        return (
                          <MainTag
                            key={detailHistory.id}
                            title={t('ministryGroupLeader')}
                            color={PURPLE.DARK}
                            backgroundColor={PURPLE.LIGHT}
                          />
                        );
                      } else if (detailHistory?.ministry) {
                        return (
                          <MainTag
                            key={detailHistory.id}
                            title={
                              ministryHistory.ministryGroupDetailHistory[0]
                                .ministry?.name as string
                            }
                            color={MAIN.DARK}
                            backgroundColor={MAIN.LIGHT}
                          />
                        );
                      }
                    }
                  )}

                  <MainText color={GRAY.DARK}>
                    {getTranslatedDateFromDateString(
                      basePath,
                      getDateStringFromDate(
                        getDateFromDateString(ministryHistory.startDate)
                      )
                    )}
                  </MainText>
                </InformationTextWrapper>
              ))}
          </ColumnTextWrapper>
        </TextContainer>
        <EditButtonContainer onClick={onClickMinistryOpen}>
          <SvgIcon
            svg={Svg.Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickMinistryOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 신급 */}
      <InformationItem>
        <SvgIcon svg={Svg.Sparkle} size={18} width={2} color={GRAY.DARK} />
        <TextContainer>
          <MainText color={GRAY.DARK}>{t('baptism')}</MainText>
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
          <MainText color={GRAY.DARK}>{t('registeredAt')}</MainText>
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
          <MainText color={GRAY.DARK}>{t('createdAt')}</MainText>
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
          <MainText color={GRAY.DARK}>{t('updatedAt')}</MainText>
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
