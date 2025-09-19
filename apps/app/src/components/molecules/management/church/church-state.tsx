import styled from 'styled-components';
import { useI18n } from '../../../../../locales/client';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { Button, MainText, SvgIcon } from '@mokjang/components';
import { ChurchesApi } from '@/api/churches/churches.api';
import { setChurch } from '@/redux/reducers/church-reducer';
import { setIsToastShown, setToastBackgroundColor, setToastText, } from '@/redux/reducers/toast-popup-reducer';
import { CURSOR, DESTRUCTIVE, WHITE } from '@mokjang/constants';
import { useState } from 'react';
import { GroupsApi } from '@/api/management/group/groups.api';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import { Svg } from '@mokjang/assets';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: row;

  gap: 20px;
`;

const InformationItemContainer = styled.div<{ $backgroundColor: string }>`
  display: flex;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  height: 80px;
  padding: 16px;
  border-radius: 12px;
  gap: 10px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const RefreshButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 15px;
  right: 15px;
`;

const MEMBER_COUNT_BACKGROUND = '#EFF6FF';
const GROUP_COUNT_BACKGROUND = '#F0FDF4';
const MINISTRY_GROUP_COUNT_BACKGROUND = '#FAF5FF';

const MEMBER_COUNT_COLOR = '#2563EB';
const GROUP_COUNT_COLOR = '#16A34A';
const MINISTRY_GROUP_COUNT_COLOR = '#9333EA';

type ChurchStateProps = {};

const ChurchState = ({}: ChurchStateProps) => {
  const { church, churchId } = useSelector((state: RootState) => state.church);
  const t = useI18n();

  const dispatch = useDispatch<AppDispatch>();
  const churchesApi = new ChurchesApi(false);
  const groupsApi = new GroupsApi(false);
  const ministryGroupsApi = new MinistryGroupsApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  const onClickRefreshMemberCount = async () => {
    try {
      const response = await churchesApi.refreshMemberCount({ churchId });
      const newChurch = response.data;
      dispatch(setChurch(newChurch));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickRefreshGroupCount = async () => {
    try {
      const response = await groupsApi.refreshGroupCount({ churchId });
      const newGroupCount = response.data.groupCount;
      dispatch(
        setChurch({
          ...church,
          groupCount: newGroupCount,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  const onClickRefreshMinistryGroupCount = async () => {
    try {
      const response = await ministryGroupsApi.refreshMinistryGroupCount({
        churchId,
      });
      const newMinistryGroupCount = response.data.ministryGroupCount;
      dispatch(
        setChurch({
          ...church,
          ministryGroupCount: newMinistryGroupCount,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  return (
    <InformationContainer>
      <InformationItemContainer $backgroundColor={MEMBER_COUNT_BACKGROUND}>
        <MainText color={MEMBER_COUNT_COLOR} fontSize={25} fontWeight={700}>
          {church.memberCount}
        </MainText>
        <MainText color={MEMBER_COUNT_COLOR}>{t('memberCount')}</MainText>
        <RefreshButtonContainer>
          <Button
            onClick={onClickRefreshMemberCount}
            icon={
              <SvgIcon
                cursor={CURSOR.POINTER}
                svg={Svg.ArrowPath}
                width={2}
                size={16}
                color={WHITE}
                bottom={0.1}
              />
            }
            width={25}
            height={25}
          />
        </RefreshButtonContainer>
      </InformationItemContainer>
      <InformationItemContainer $backgroundColor={GROUP_COUNT_BACKGROUND}>
        <MainText color={GROUP_COUNT_COLOR} fontSize={25} fontWeight={700}>
          {church.groupCount}
        </MainText>
        <MainText color={GROUP_COUNT_COLOR}>{t('groupCount')}</MainText>
        <RefreshButtonContainer>
          <Button
            onClick={onClickRefreshGroupCount}
            icon={
              <SvgIcon
                cursor={CURSOR.POINTER}
                svg={Svg.ArrowPath}
                width={2}
                size={16}
                color={WHITE}
                bottom={0.1}
              />
            }
            width={25}
            height={25}
            backgroundColor={GROUP_COUNT_COLOR}
          />
        </RefreshButtonContainer>
      </InformationItemContainer>
      <InformationItemContainer
        $backgroundColor={MINISTRY_GROUP_COUNT_BACKGROUND}
      >
        <MainText
          color={MINISTRY_GROUP_COUNT_COLOR}
          fontSize={25}
          fontWeight={700}
        >
          {church.ministryGroupCount}
        </MainText>
        <MainText color={MINISTRY_GROUP_COUNT_COLOR}>
          {t('ministryGroupCount')}
        </MainText>
        <RefreshButtonContainer>
          <Button
            onClick={onClickRefreshMinistryGroupCount}
            icon={
              <SvgIcon
                cursor={CURSOR.POINTER}
                svg={Svg.ArrowPath}
                width={2}
                size={16}
                color={WHITE}
                bottom={0.1}
              />
            }
            width={25}
            height={25}
            backgroundColor={MINISTRY_GROUP_COUNT_COLOR}
          />
        </RefreshButtonContainer>
      </InformationItemContainer>
    </InformationContainer>
  );
};

export default ChurchState;
