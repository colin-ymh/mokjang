import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';

import { MembersApi } from '../../../../../api/members/members.api';
import MemberInformationListView from './member-personal-information-list.view';
import { GroupMembersApi } from '../../../../../api/management/group/group-membes.api';
import { getDateFromDateString, getDateStringFromDate } from '@mokjang/utils';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import EditMemberGroup from './edit-member-group';
import { CustomPopup } from '@mokjang/components';
import { setTargetMember } from '../../../../../redux/reducers/target/target-member-reducer';
import {
  DEFAULT_GROUP_HISTORY,
  DEFAULT_OFFICER_HISTORY,
} from '@mokjang/models';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { BLACK, CONCEALED, DESTRUCTIVE } from '@mokjang/constants';
import { setMembers } from '../../../../../redux/reducers/filter/member-filter-reducer';
import { OfficerMembersApi } from '../../../../../api/management/officer/officer-members.api';
import EditMemberOfficer from './edit-member-officer';
import {
  setTargetGroupHistory,
  setTargetOfficerHistory,
} from '../../../../../redux/reducers/target/target-history-reducer';
import { GroupHistoryApi } from '../../../../../api/history/group-history.api';
import { OfficerHistoryApi } from '../../../../../api/history/officer-history.api';
import MemberMinistryList from './member-ministry-list';

type MemberPersonalInformationListProps = {};

const MemberPersonalInformationList =
  ({}: MemberPersonalInformationListProps) => {
    const t = useI18n();
    const t_popup = useScopedI18n('popup');
    const t_button = useScopedI18n('button');

    const dispatch = useDispatch<AppDispatch>();
    const membersApi = new MembersApi(false);
    const groupMembersApi = new GroupMembersApi(false);
    const groupHistoryApi = new GroupHistoryApi(false);
    const officerMembersApi = new OfficerMembersApi(false);
    const officerHistoryApi = new OfficerHistoryApi(false);

    const { churchId } = useSelector((state: RootState) => state.church);
    const { members } = useSelector((state: RootState) => state.memberFilter);
    const { targetMember } = useSelector(
      (state: RootState) => state.targetMember
    );
    const { targetGroupHistory, targetOfficerHistory } = useSelector(
      (state: RootState) => state.targetHistory
    );

    const [isGroupOpened, setIsGroupOpened] = useState<boolean>(false);
    const [isMinistryOpened, setIsMinistryOpened] = useState<boolean>(false);
    const [isOfficerOpened, setIsOfficerOpened] = useState<boolean>(false);

    const [isGroupSaveEnabled, setIsGroupSaveEnabled] =
      useState<boolean>(false);
    const [isOfficerSaveEnabled, setIsOfficerSaveEnabled] =
      useState<boolean>(false);

    const [thrownError, setThrownError] = useState<Error | null>(null);
    if (thrownError) {
      throw thrownError;
    }

    const onClickGroupOpen = () => {
      setIsGroupOpened(true);

      if (
        targetMember.groupHistory &&
        targetMember.groupHistory.length > 0 &&
        targetMember.groupHistory !== CONCEALED
      ) {
        dispatch(
          setTargetGroupHistory({
            ...targetMember.groupHistory[0],
            startDate: getDateStringFromDate(
              getDateFromDateString(targetMember.groupHistory[0].startDate)
            ),
          })
        );
      } else {
        setTargetGroupHistory(DEFAULT_GROUP_HISTORY);
      }
    };
    const onClickGroupClose = () => {
      setIsGroupOpened(false);
      dispatch(setTargetGroupHistory(DEFAULT_GROUP_HISTORY));
    };

    const onClickMinistryOpen = () => {
      setIsMinistryOpened(true);
    };
    const onClickMinistryClose = () => {
      setIsMinistryOpened(false);
    };

    const onClickOfficerOpen = () => {
      setIsOfficerOpened(true);

      if (
        targetMember.officerHistory &&
        targetMember.officerHistory !== CONCEALED &&
        targetMember.officerHistory.length > 0
      ) {
        dispatch(
          setTargetOfficerHistory({
            ...targetMember.officerHistory[0],
            startDate: getDateStringFromDate(
              getDateFromDateString(targetMember.officerHistory[0].startDate)
            ),
          })
        );
      } else {
        dispatch(setTargetOfficerHistory(DEFAULT_OFFICER_HISTORY));
      }
    };

    const onClickOfficerClose = () => {
      setIsOfficerOpened(false);
      dispatch(setTargetOfficerHistory(DEFAULT_OFFICER_HISTORY));
    };

    // ===================== 그룹 ===================== //
    const onClickSaveGroup = async () => {
      try {
        // 날짜만 수정하는 경우
        if (
          targetMember.groupHistory &&
          targetMember.groupHistory.length > 0 &&
          targetMember.groupHistory !== CONCEALED &&
          targetMember.groupHistory[0].groupId === targetGroupHistory.groupId &&
          targetMember.groupHistory[0].startDate !==
            targetGroupHistory.startDate
        ) {
          await groupHistoryApi.editGroupHistory(
            {
              churchId,
              memberId: targetMember.id,
              groupHistoryId: targetGroupHistory.id,
            },
            {
              startDate: targetGroupHistory.startDate,
            }
          );
        } else {
          await groupMembersApi.addGroupMember(
            {
              churchId,
              groupId: targetGroupHistory.groupId,
            },
            {
              memberIds: [targetMember.id],
              startDate: targetGroupHistory.startDate,
            }
          );
        }

        const response = await membersApi.getMember({
          churchId,
          memberId: targetMember.id,
        });

        const newTargetMember = response.data.data;

        const newMembers = members.map((member) => {
          if (member.id === targetMember.id) {
            return newTargetMember;
          } else {
            return member;
          }
        });

        dispatch(setTargetMember(newTargetMember));
        dispatch(setMembers(newMembers));
        dispatch(setTargetGroupHistory(DEFAULT_GROUP_HISTORY));

        setIsGroupOpened(false);
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

    const onClickDeleteGroup = () => {
      if (!targetMember.groupId) return;

      try {
        groupMembersApi.deleteGroupMember(
          {
            churchId,
            groupId: targetMember.groupId,
          },
          {
            memberIds: [targetMember.id],
            endDate: getDateStringFromDate(new Date()),
          }
        );

        const newTargetMember = {
          ...targetMember,
          groupHistory: [DEFAULT_GROUP_HISTORY],
          groupRole: undefined,
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

        setIsGroupOpened(false);
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
      if (!targetGroupHistory.groupId) {
        setIsGroupSaveEnabled(false);
        return;
      }

      if (!targetGroupHistory.startDate) {
        setIsGroupSaveEnabled(false);
        return;
      }

      setIsGroupSaveEnabled(true);
    }, [targetGroupHistory]);

    // ===================== 그룹 ===================== //

    // ===================== 직분 ===================== //
    const onClickSaveOfficer = async () => {
      try {
        // 날짜만 수정하는 경우
        if (
          targetMember.officerHistory &&
          targetMember.officerHistory.length > 0 &&
          targetMember.officerHistory !== CONCEALED &&
          targetMember.officerHistory[0].officer.id ===
            targetOfficerHistory.officer.id &&
          targetMember.officerHistory[0].startDate !==
            targetOfficerHistory.startDate
        ) {
          await officerHistoryApi.editOfficerHistory(
            {
              churchId,
              memberId: targetMember.id,
              officerHistoryId: targetOfficerHistory.id,
            },
            {
              startDate: targetOfficerHistory.startDate,
            }
          );
        } else {
          await officerMembersApi.addOfficerMember(
            {
              churchId,
              officerId: targetOfficerHistory.officer.id,
            },
            {
              memberIds: [targetMember.id],
              startDate: targetOfficerHistory.startDate,
            }
          );
        }

        const response = await membersApi.getMember({
          churchId,
          memberId: targetMember.id,
        });

        const newTargetMember = response.data.data;

        const newMembers = members.map((member) => {
          if (member.id === targetMember.id) {
            return newTargetMember;
          } else {
            return member;
          }
        });

        dispatch(setTargetMember(newTargetMember));
        dispatch(setMembers(newMembers));
        dispatch(setTargetOfficerHistory(DEFAULT_OFFICER_HISTORY));

        setIsOfficerOpened(false);
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

    const onClickDeleteOfficer = () => {
      if (!targetMember.officerId) return;

      try {
        officerMembersApi.deleteOfficerMember(
          {
            churchId,
            officerId: targetMember.officerId,
          },
          {
            memberIds: [targetMember.id],
            endDate: getDateStringFromDate(new Date()),
          }
        );

        const newTargetMember = {
          ...targetMember,
          officerHistory: [DEFAULT_OFFICER_HISTORY],
          officerRole: undefined,
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

        setIsOfficerOpened(false);
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
      if (!targetOfficerHistory.officer.id) {
        setIsOfficerSaveEnabled(false);
        return;
      }

      if (!targetOfficerHistory.startDate) {
        setIsOfficerSaveEnabled(false);
        return;
      }

      setIsOfficerSaveEnabled(true);
    }, [targetOfficerHistory]);

    // ===================== 직분 ===================== //

    const props = {
      onClickGroupOpen,
      onClickOfficerOpen,
      onClickMinistryOpen,
    };

    return (
      <>
        <MemberInformationListView {...props} />

        {/* 그룹 수정 */}
        <CustomPopup
          isShow={isGroupOpened}
          onClickClose={onClickGroupClose}
          onClickCancel={onClickGroupClose}
          onClickDone={onClickSaveGroup}
          headerTitle={t('title.editGroupInformation')}
          width={500}
          height={500}
          doneDisabled={!isGroupSaveEnabled}
          cancelText={t_button('cancel')}
          doneText={t_button('save')}
        >
          <EditMemberGroup onClickDeleteGroup={onClickDeleteGroup} />
        </CustomPopup>

        {/* 직분 수정 */}
        <CustomPopup
          isShow={isOfficerOpened}
          onClickClose={onClickOfficerClose}
          onClickCancel={onClickOfficerClose}
          onClickDone={onClickSaveOfficer}
          headerTitle={t('title.editOfficerInformation')}
          width={500}
          height={500}
          doneDisabled={!isOfficerSaveEnabled}
          cancelText={t_button('cancel')}
          doneText={t_button('save')}
        >
          <EditMemberOfficer onClickDeleteOfficer={onClickDeleteOfficer} />
        </CustomPopup>

        {/* 사역 목록 */}
        <CustomPopup
          isShow={isMinistryOpened}
          onClickClose={onClickMinistryClose}
          onClickCancel={onClickMinistryClose}
          headerTitle={t('title.ministryList')}
          width={600}
          height={600}
          cancelText={t_button('cancel')}
        >
          <MemberMinistryList />
        </CustomPopup>
      </>
    );
  };

export default MemberPersonalInformationList;
