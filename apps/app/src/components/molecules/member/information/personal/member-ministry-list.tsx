import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';
import { MinistryGroupMembersApi } from '../../../../../api/management/ministry/ministry-group-members.api';
import {
  DEFAULT_MINISTRY_HISTORY,
  MinistryHistory,
} from '../../../../../models/member/history';
import { setTargetMinistryHistory } from '../../../../../redux/reducers/target/target-history-reducer';
import { setTargetMember } from '../../../../../redux/reducers/target/target-member-reducer';
import MemberMinistryListView from './member-ministry-list.view';
import { MinistryHistoryApi } from '../../../../../api/history/ministry-history.api';
import { BLANK } from '../../../../../constants/constant';
import CustomPopup from '../../../../atoms/common/popup/custom-popup';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import EditMemberMinistry from './edit-member-ministry';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../../../utils/date';
import { setMembers } from '../../../../../redux/reducers/filter/member-filter-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '../../../../../constants/styles/color';
import { MinistryMembersApi } from '../../../../../api/management/ministry/ministry-mebers.api';

const MemberMinistryList = () => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { members } = useSelector((state: RootState) => state.memberFilter);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const ministryGroupMembersApi = new MinistryGroupMembersApi(false);
  const ministryMembersApi = new MinistryMembersApi(false);
  const ministryHistoryApi = new MinistryHistoryApi(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isAddOpened, setIsAddOpened] = useState<boolean>(false);

  const [prevHistory, setPrevHistory] = useState<MinistryHistory>(
    DEFAULT_MINISTRY_HISTORY
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [cursor, setCursor] = useState<string>(BLANK);
  const LIMIT = 10;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMinistries = async () => {
    try {
      if (isLoading || !hasMore) return;
      setIsLoading(true);

      const response = await ministryHistoryApi.getCurrentMinistryGroupHistory({
        churchId,
        memberId: targetMember.id,
        limit: LIMIT,
        cursor,
      });

      const newMinistries: MinistryHistory[] = response?.data?.data || [];
      const nextCursor: string =
        response?.data?.nextCursor ?? response?.data?.meta?.nextCursor ?? BLANK;

      const prevMinistries: MinistryHistory[] =
        targetMember.ministryGroupHistory || [];

      // 중복 제거하며 병합 (id 기준)
      const merged = [...prevMinistries, ...newMinistries].reduce<
        MinistryHistory[]
      >((acc, cur) => {
        if (!acc.find((m) => m.ministryGroup.id === cur.ministryGroup.id))
          acc.push(cur);
        return acc;
      }, []);

      // targetMember에 병합된 사역 이력 반영
      dispatch(
        setTargetMember({
          ...targetMember,
          ministryGroupHistory: merged,
        })
      );

      // 다음 커서/hasMore 갱신
      setCursor(nextCursor);
      setHasMore(response?.data?.hasMore);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setThrownError(new Error(String(error)));
    }
  };

  useEffect(() => {
    setCursor(BLANK);
    setHasMore(true);
    fetchMinistries();
  }, [targetMember.id]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    if (nearBottom && !isLoading && hasMore) {
      fetchMinistries();
    }
  };

  const onClickAddOpen = (history?: MinistryHistory) => {
    setIsAddOpened(true);

    if (history) {
      setPrevHistory(history);
      dispatch(
        setTargetMinistryHistory({
          ...history,
          startDate: getDateStringFromDate(
            getDateFromDateString(history.startDate)
          ),
        })
      );
    } else {
      dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));
    }
  };

  const onClickAddClose = () => {
    setIsAddOpened(false);
    dispatch(setTargetMinistryHistory(DEFAULT_MINISTRY_HISTORY));

    if (prevHistory.id) {
      setPrevHistory(DEFAULT_MINISTRY_HISTORY);
    }
  };

  const onClickDone = async () => {
    try {
      const isMinistryGroupChanged =
        prevHistory.ministryGroup?.id !==
        targetMinistryHistory.ministryGroup?.id;
      const isMinistryChanged =
        prevHistory.ministryGroupDetailHistory[0]?.ministry !==
        targetMinistryHistory.ministryGroupDetailHistory[0]?.ministry;
      const isStartDateChanged =
        prevHistory.startDate !== targetMinistryHistory.startDate;

      // 시작 날짜만 변경
      if (!isMinistryGroupChanged && !isMinistryChanged && isStartDateChanged) {
        await ministryHistoryApi.editMinistryGroupHistory(
          {
            churchId,
            memberId: targetMember.id,
            ministryGroupHistoryId: targetMinistryHistory.id,
          },
          { startDate: targetMinistryHistory.startDate }
        );
      }
      // 사역 변경
      else if (!isMinistryGroupChanged && isMinistryChanged) {
        await ministryMembersApi.editMemberMinistry(
          {
            churchId,
            ministryGroupId: targetMinistryHistory.id,
            ministryId: targetMinistryHistory.ministryGroupDetailHistory[0]
              .ministry?.id as string,
          },
          {
            memberId: targetMember.id,
          }
        );
      }
      // 사역 그룹 변경
      else if (isMinistryGroupChanged) {
        await ministryGroupMembersApi.createMinistryGroupMember(
          {
            churchId,
            ministryGroupId: targetMinistryHistory.ministryGroup.id as string,
          },
          {
            members: [
              {
                memberId: targetMember.id,
                ministryId:
                  targetMinistryHistory.ministryGroupDetailHistory[0]?.ministry
                    ?.id || undefined,
              },
            ],
            startDate: targetMinistryHistory.startDate,
          }
        );
      }

      // 수정인 경우
      if (prevHistory.ministryGroup?.id) {
        dispatch(
          setTargetMember({
            ...targetMember,
            ministryGroupHistory: targetMember.ministryGroupHistory?.map(
              (history) => {
                if (history.id === targetMinistryHistory.id) {
                  return targetMinistryHistory;
                } else {
                  return history;
                }
              }
            ) || [targetMinistryHistory],
          })
        );
      }
      // 추가인 경우
      else {
        dispatch(
          setTargetMember({
            ...targetMember,
            ministryGroupHistory: targetMember.ministryGroupHistory
              ? [...targetMember.ministryGroupHistory, targetMinistryHistory]
              : [targetMinistryHistory],
          })
        );
      }

      setIsAddOpened(false);
    } catch (error) {
      setThrownError(new Error(String(error)));
    }
  };

  const onClickDeleteMinistry = (ministryGroupId: string) => {
    try {
      ministryGroupMembersApi.deleteMinistryGroupMember(
        {
          churchId,
          ministryGroupId,
        },
        {
          memberIds: [targetMember.id],
          endDate: getDateStringFromDate(new Date()),
        }
      );

      const newTargetMember = {
        ...targetMember,
        ministryGroupHistory: targetMember.ministryGroupHistory?.filter(
          (history) => history.ministryGroup.id !== ministryGroupId
        ),
      };

      const newMembers = members.map((member) => {
        if (member.id === targetMember.id) {
          return newTargetMember;
        } else {
          return member;
        }
      });

      dispatch(setTargetMember(newTargetMember));
      dispatch(setMembers(newMembers));

      setIsAddOpened(false);
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
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

  useEffect(() => {
    if (!targetMinistryHistory?.ministryGroup?.id) {
      setIsSaveEnabled(false);
      return;
    }

    if (!targetMinistryHistory.startDate) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetMinistryHistory]);

  const props = {
    scrollRef,
    onScroll,
    isAddOpened,
    onClickAddOpen,
    onClickAddClose,
  };

  return (
    <>
      <MemberMinistryListView {...props} />

      {/* 사역 추가 */}
      <CustomPopup
        isShow={isAddOpened}
        onClickCancel={onClickAddClose}
        onClickDone={onClickDone}
        headerTitle={t('title.editMinistry')}
        width={600}
        height={600}
        doneDisabled={!isSaveEnabled}
      >
        <EditMemberMinistry onClickDeleteMinistry={onClickDeleteMinistry} />
      </CustomPopup>
    </>
  );
};

export default MemberMinistryList;
