import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { MembersApi } from '@/api/members/members.api';
import { MinistryHistoryApi } from '@/api/history/ministry-history.api';
import { OfficerHistoryApi } from '@/api/history/officer-history.api';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import MemberInformationListView from '@/components/molecules/member/information/personal/member-personal-information-list.view';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { GroupMembersApi } from '@/api/management/group/group-membes.api';
import { getDateStringFromDate } from '@/utils/date';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import EditMemberGroup from '@/components/molecules/member/information/personal/edit-member-group';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import { DEFAULT_GROUP_HISTORY } from '@/models/member/history';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { setMembers } from '@/redux/reducers/filter/member-filter-reducer';

type MemberPersonalInformationListProps = {};

const MemberPersonalInformationList =
  ({}: MemberPersonalInformationListProps) => {
    const t = useI18n();
    const t_popup = useScopedI18n('popup');

    const dispatch = useDispatch<AppDispatch>();
    const ministryHistoryApi = new MinistryHistoryApi(false);
    const officerHistoryApi = new OfficerHistoryApi(false);
    const groupHistoryApi = new GroupHistoryApi(false);
    const membersApi = new MembersApi(false);
    const ministriesApi = new MinistriesApi(false);
    const groupMembersApi = new GroupMembersApi(false);

    const { churchId } = useSelector((state: RootState) => state.church);
    const { members, memberPage } = useSelector(
      (state: RootState) => state.memberFilter
    );
    const { targetMember } = useSelector(
      (state: RootState) => state.targetMember
    );
    const { targetGroupHistory } = useSelector(
      (state: RootState) => state.targetHistory
    );

    const [isGroupOpened, setIsGroupOpened] = useState<boolean>(false);
    const [isMinistryOpened, setIsMinistryOpened] = useState<boolean>(false);
    const [isOfficerOpened, setIsOfficerOpened] = useState<boolean>(false);

    const [isGroupSaveEnabled, setIsGroupSaveEnabled] =
      useState<boolean>(false);
    const [isMinistrySaveEnabled, setIsMinistrySaveEnabled] =
      useState<boolean>(false);
    const [isOfficerSaveEnabled, setIsOfficerSaveEnabled] =
      useState<boolean>(false);

    const [thrownError, setThrownError] = useState<Error | null>(null);
    if (thrownError) {
      throw thrownError;
    }

    const onClickGroupOpen = () => setIsGroupOpened(true);
    const onClickGroupClose = () => setIsGroupOpened(false);

    const onClickMinistryOpen = () => setIsMinistryOpened(true);
    const onClickMinistryClose = () => setIsMinistryOpened(false);

    const onClickOfficerOpen = () => setIsOfficerOpened(true);
    const onClickOfficerClose = () => setIsOfficerOpened(false);

    const onClickSaveGroup = async () => {
      try {
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

    const props = {
      onClickGroupOpen,
    };

    return (
      <>
        <MemberInformationListView {...props} />

        {/* 그룹 수정 */}
        <CustomPopup
          isShow={isGroupOpened}
          onClickCancel={onClickGroupClose}
          onClickDone={onClickSaveGroup}
          headerTitle={t('title.editGroupInformation')}
          width={500}
          height={500}
          doneDisabled={!isGroupSaveEnabled}
        >
          <EditMemberGroup onClickDeleteGroup={onClickDeleteGroup} />
        </CustomPopup>
      </>
    );
  };

export default MemberPersonalInformationList;
