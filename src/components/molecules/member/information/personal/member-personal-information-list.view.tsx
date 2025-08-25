import styled from 'styled-components';
import { usePathname } from 'next/navigation';

import { MainText } from '@/components/atoms/common/text/main-text';
import { MEMBER } from '@/constants/column/member-column';
import { GRAY, MAIN, PURPLE } from '@/constants/styles/color';
import {
  CALENDAR_MODE,
  GENDER,
  GROUP_ROLE,
  MARRIAGE,
} from '@/constants/constant';
import { LOCALE } from '@/constants/state/locale';
import { getFormattedMobilePhone } from '@/utils/format';
import {
  getAge,
  getDateFromDateString,
  getDateStringFromDate,
} from '@/utils/date';

import { useI18n } from '../../../../../../locales/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';
import {
  getTranslatedAge,
  getTranslatedDateFromDateString,
} from '@/utils/translate';
import { SIZE } from '@/constants/styles/style';
import MainTag from '@/components/atoms/common/tag/main-tag';

import User from '../../../../../../public/svg/user.svg';
import Male from '../../../../../../public/svg/male.svg';
import Female from '../../../../../../public/svg/female.svg';
import Cake from '../../../../../../public/svg/cake.svg';
import Heart from '../../../../../../public/svg/heart.svg';
import Briefcase from '../../../../../../public/svg/briefcase.svg';
import Academic from '../../../../../../public/svg/academic-cap.svg';
import MobilePhone from '../../../../../../public/svg/mobile-phone.svg';
import Phone from '../../../../../../public/svg/phone.svg';
import Pin from '../../../../../../public/svg/pin.svg';
import Car from '../../../../../../public/svg/car.svg';
import Users from '../../../../../../public/svg/users.svg';
import Star from '../../../../../../public/svg/star.svg';
import Sparkle from '../../../../../../public/svg/sparkle.svg';
import Calendar from '../../../../../../public/svg/calendar.svg';
import Setting from '../../../../../../public/svg/setting.svg';
import Pencil from '../../../../../../public/svg/pencil.svg';
import React from 'react';
import useWindowSize from '@/hooks/window/window';

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
        <SvgIcon svg={User} size={18} width={2} color={GRAY.DARK} />
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
          svg={targetMember.gender === GENDER.FEMALE ? Female : Male}
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
        <SvgIcon svg={Cake} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Heart} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Briefcase} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Academic} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Pin} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={MobilePhone} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Phone} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Car} size={18} width={1} color={GRAY.DARK} />
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
        <SvgIcon svg={Users} size={18} width={2} color={GRAY.DARK} />
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
            svg={Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickGroupOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 직분 */}
      <InformationItem>
        <SvgIcon svg={Star} size={18} width={2} color={GRAY.DARK} />
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
            svg={Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickOfficerOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 사역 */}
      <InformationItem>
        <SvgIcon svg={Users} size={18} width={2} color={GRAY.DARK} />
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
            svg={Pencil}
            size={18}
            width={2}
            color={GRAY.DARK}
            onClick={onClickMinistryOpen}
          />
        </EditButtonContainer>
      </InformationItem>

      {/* 신급 */}
      <InformationItem>
        <SvgIcon svg={Sparkle} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Calendar} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Setting} size={18} width={2} color={GRAY.DARK} />
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
        <SvgIcon svg={Pencil} size={18} width={2} color={GRAY.DARK} />
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
