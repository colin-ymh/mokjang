import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMembers } from '@/redux/reducers/filter/member-filter-reducer';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';

import { MembersApi } from '@/api/members/members.api';
import { MinistryHistoryApi } from '@/api/history/ministry-history.api';
import { OfficerHistoryApi } from '@/api/history/officer-history.api';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import MemberInformationListView from '@/components/molecules/member/information/member-information-list.view';
import { MEMBER } from '@/constants/member/member-column';
import Button from '@/components/atoms/common/button/button';
import MemberEdit from '@/components/organisms/edit/member-edit';
import OfficerModal from '@/components/atoms/common/modal/officer-modal';
import GroupModal from '@/components/atoms/common/modal/group-modal';
import { BAPTISM, BLANK, NONE } from '@/constants/constant';
import { getEditMemberBody, getMemberFromServer } from '@/utils/member';
import {
  GroupHistory,
  MinistryHistory,
  OfficerHistory,
} from '@/models/member/history';
import { Member } from '@/models/member/member';
import { DEFAULT_MINISTRY, Ministry } from '@/models/management/management';
import MinistryModal from '@/components/atoms/common/modal/ministry-modal';
import BaptismModal from '@/components/atoms/common/modal/baptism-modal';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import ToastPopup from '@/components/atoms/common/popup/toast-popup';
import { useScopedI18n } from '../../../../../locales/client';
import BottomSheet from '@/components/atoms/common/bottom-sheet/bottom-sheet';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';

type MemberInformationListProps = {};

const MemberInformationList = ({}: MemberInformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const ministryHistoryApi = new MinistryHistoryApi(false);
  const officerHistoryApi = new OfficerHistoryApi(false);
  const groupHistoryApi = new GroupHistoryApi(false);
  const membersApi = new MembersApi(false);
  const ministriesApi = new MinistriesApi(false);

  const t_popup = useScopedI18n('popup');

  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { members } = useSelector((state: RootState) => state.memberFilter);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 저장 완료 토스트 팝업
  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  // 현재 활성화된 이력
  const [targetOfficerHistory, setTargetOfficerHistory] = useState<
    OfficerHistory | undefined
  >(undefined);
  const [targetGroupHistory, setTargetGroupHistory] = useState<
    GroupHistory | undefined
  >(undefined);
  const [targetMinistryHistory, setTargetMinistryHistory] = useState<
    MinistryHistory | undefined
  >(undefined);

  // 선택된 사역
  const [targetMinistry, setTargetMinistry] =
    useState<Ministry>(DEFAULT_MINISTRY);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);
  const [focusItem, setFocusItem] = useState<MEMBER>(MEMBER.NAME);

  // 신급 수정 모달
  const [isBaptismModalShown, setIsBaptismModalShown] =
    useState<boolean>(false);

  // 그룹 수정 모달
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  // 사역 수정 모달
  const [isMinistryModalShown, setIsMinistryModalShown] =
    useState<boolean>(false);

  // 직분 수정 모달
  const [isOfficerModalShown, setIsOfficerModalShown] =
    useState<boolean>(false);

  useEffect(() => {
    setIsBaptismModalShown(false);
    setIsGroupModalShown(false);
    setIsMinistryModalShown(false);
    setIsOfficerModalShown(false);
  }, [member.id]);

  // ================================
  // 공통 유틸: API 응답 후 상태 업데이트
  // ================================
  const handleHistorySuccess = async (closeModal: () => void) => {
    closeModal();

    const response = await membersApi.getMember({
      churchId,
      memberId: targetMember.id,
    });
    const newMember = response.data.data;

    dispatch(setTargetMember(newMember));

    const newMembers = members.map((m: Member) =>
      m.id === newMember.id ? newMember : m
    );
    dispatch(setMembers(newMembers));
  };

  // ================================
  // 개인정보 (이름, 생년월일 등) 수정
  // ================================
  const onClickItem = (id: MEMBER) => {
    dispatch(setMember(targetMember));
    setFocusItem(id);
    setIsEditShown(true);
  };

  const onClickClose = () => {
    setIsEditShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  const onClickSave = async () => {
    try {
      await membersApi
        .editMember(
          { churchId, memberId: targetMember.id },
          getEditMemberBody(member)
        )
        .then((response) => {
          if (response.status === 200) {
            setIsEditShown(false);
            const newMember = getMemberFromServer(response.data);
            dispatch(setTargetMember(newMember));

            // 교인 목록에서도 업데이트
            const newMembers = members.map((mem: Member) =>
              mem.id === newMember.id ? newMember : mem
            );
            dispatch(setMembers(newMembers));
          }
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // ================================
  // 신급 수정
  // ================================
  const onClickOpenBaptismModal = () => {
    setIsBaptismModalShown(true);
  };

  const onClickCloseBaptismModal = () => {
    setIsBaptismModalShown(false);
  };

  const onClickSaveBaptism = async (newBaptism: BAPTISM) => {
    try {
      if (newBaptism !== targetMember.baptism) {
        membersApi
          .editMember(
            { churchId, memberId: targetMember.id },
            { baptism: newBaptism }
          )
          .then((response) => {
            setIsBaptismModalShown(false);
            const updatedMember = getMemberFromServer(response.data);
            dispatch(
              setTargetMember({
                ...targetMember,
                baptism: updatedMember.baptism,
              })
            );

            const newMembers = members.map((m: Member) =>
              m.id === updatedMember.id ? updatedMember : m
            );
            dispatch(setMembers(newMembers));
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // ================================
  // 소그룹(그룹) 수정
  // ================================
  const onClickOpenGroupModal = () => {
    setIsGroupModalShown(true);
  };

  const onClickCloseGroupModal = () => {
    setIsGroupModalShown(false);
  };

  const onClickSaveNewGroup = async (
    groupId: string,
    groupRoleId: string,
    startDate: string
  ) => {
    try {
      // 이력이 없는 경우 = 새로 생성
      if (!targetGroupHistory) {
        await groupHistoryApi
          .createGroupHistory(
            { churchId, memberId: targetMember.id },
            {
              groupId,
              groupRoleId: groupRoleId || undefined,
              startDate,
            }
          )
          .then((response) => {
            handleHistorySuccess(() => setIsGroupModalShown(false));
          });
        return;
      }

      // 이력이 있는 경우
      if (groupId === BLANK) {
        // 그룹 제거(이력 종료)
        await groupHistoryApi
          .stopGroupHistory({ churchId, memberId: targetMember.id }, {})
          .then((response) =>
            handleHistorySuccess(() => setIsGroupModalShown(false))
          );
      } else if (
        groupId === targetMember.group?.id &&
        groupRoleId === targetMember.groupRole?.id
      ) {
        // 그룹과 역할 동일 => 날짜 수정
        await groupHistoryApi
          .editGroupHistory(
            {
              churchId,
              memberId: targetMember.id,
              groupHistoryId: targetGroupHistory.id,
            },
            { startDate }
          )
          .then(() => setIsGroupModalShown(false));
      } else {
        // 기존 이력 종료 후 새로운 이력 생성
        await groupHistoryApi
          .stopGroupHistory({ churchId, memberId: targetMember.id }, {})
          .then(() => {
            groupHistoryApi
              .createGroupHistory(
                { churchId, memberId: targetMember.id },
                {
                  groupId,
                  groupRoleId: groupRoleId || undefined,
                  startDate,
                }
              )
              .then((response) =>
                handleHistorySuccess(() => setIsGroupModalShown(false))
              );
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // ================================
  // 사역 수정
  // ================================
  const onClickOpenMinistryModal = (ministry?: Ministry) => {
    if (ministry) {
      setTargetMinistry(ministry);
    }
    setIsMinistryModalShown(true);
  };

  const onClickCloseMinistryModal = () => {
    setIsMinistryModalShown(false);
    setTargetMinistry(DEFAULT_MINISTRY);
  };

  const onClickSaveNewMinistry = async (
    ministryGroupId: string,
    ministryId: string,
    startDate: string
  ) => {
    try {
      // 이력이 없는 경우(새로 생성)
      if (!targetMinistryHistory) {
        await ministryHistoryApi
          .createMinistryHistory(
            { churchId, memberId: targetMember.id },
            {
              ministryId,
              startDate,
            }
          )
          .then((response) =>
            handleHistorySuccess(() => setIsMinistryModalShown(false))
          );
        return;
      }

      // 기존 이력이 있는 경우
      if (ministryGroupId === BLANK) {
        // 완전히 사역 중단
        await ministryHistoryApi
          .stopMinistryHistory(
            {
              churchId,
              memberId: targetMember.id,
              ministryId: targetMinistry.id,
            },
            {}
          )
          .then((response) =>
            handleHistorySuccess(() => setIsMinistryModalShown(false))
          );
      } else if (ministryId === targetMinistry.id) {
        // 사역 동일 => 날짜만 수정
        await ministryHistoryApi
          .editMinistryHistory(
            {
              churchId,
              memberId: targetMember.id,
              ministryHistoryId: targetMinistryHistory.id,
            },
            { startDate }
          )
          .then(() => setIsMinistryModalShown(false));
      } else {
        // 기존 이력 중단 후 새로운 이력 생성
        await ministryHistoryApi
          .stopMinistryHistory(
            {
              churchId,
              memberId: targetMember.id,
              ministryId: targetMinistry.id,
            },
            {}
          )
          .then(() => {
            ministryHistoryApi
              .createMinistryHistory(
                { churchId, memberId: targetMember.id },
                {
                  ministryId,
                  startDate,
                }
              )
              .then((response) =>
                handleHistorySuccess(() => setIsMinistryModalShown(false))
              );
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // 새로운 사역 만들기
  const onClickCreateMinistry = async (
    ministryGroupId: string,
    startDate: string,
    ministryName: string
  ) => {
    try {
      ministriesApi
        .createMinistry({ churchId }, { ministryGroupId, name: ministryName })
        .then((response) => {
          const newMinistry: Ministry = response.data;

          onClickSaveNewMinistry(ministryGroupId, newMinistry.id, startDate);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // ================================
  // 직분 수정
  // ================================
  const onClickOpenOfficerModal = () => {
    setIsOfficerModalShown(true);
  };

  const onClickCloseOfficerModal = () => {
    setIsOfficerModalShown(false);
  };

  const onClickSaveNewOfficer = async (
    officerId: string,
    startDate: string
  ) => {
    try {
      // 이력이 없는 경우 = 새로 생성
      if (!targetOfficerHistory) {
        await officerHistoryApi
          .createOfficerHistory(
            { churchId, memberId: targetMember.id },
            {
              officerId,
              startDate,
            }
          )
          .then((response) =>
            handleHistorySuccess(() => setIsOfficerModalShown(false))
          );
        return;
      }

      // 기존 이력이 있는 경우
      if (officerId === NONE) {
        // 직분 중단
        await officerHistoryApi
          .stopOfficerHistory({ churchId, memberId: targetMember.id }, {})
          .then((response) =>
            handleHistorySuccess(() => setIsOfficerModalShown(false))
          );
      } else if (officerId === targetMember.officer?.id) {
        // 직분 동일 => 날짜만 수정
        await officerHistoryApi
          .editOfficerHistory(
            {
              churchId,
              memberId: targetMember.id,
              officerHistoryId: targetOfficerHistory.id,
            },
            { startDate }
          )
          .then(() => setIsOfficerModalShown(false));
      } else {
        // 기존 이력 종료 후 새로 생성
        await officerHistoryApi
          .stopOfficerHistory({ churchId, memberId: targetMember.id }, {})
          .then(() => {
            officerHistoryApi
              .createOfficerHistory(
                { churchId, memberId: targetMember.id },
                {
                  officerId,
                  startDate,
                }
              )
              .then((response) =>
                handleHistorySuccess(() => setIsOfficerModalShown(false))
              );
          });
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsToastShown(true);
    }
  };

  // ================================
  // 현재 이력/상태 정보 불러오기
  // ================================
  const fetchCurrentOfficerHistory = async () => {
    if (!targetMember.officer?.id) {
      setTargetOfficerHistory(undefined);
      return;
    }

    try {
      const response = await officerHistoryApi.getOfficerHistory({
        churchId,
        memberId: targetMember.id,
      });
      const current = response.data.data.find(
        (history: OfficerHistory) => history.endDate === null
      );
      if (current) setTargetOfficerHistory(current);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const fetchCurrentGroupHistory = async () => {
    if (!targetMember.group?.id) {
      setTargetGroupHistory(undefined);
      return;
    }

    try {
      const response = await groupHistoryApi.getGroupHistory({
        churchId,
        memberId: targetMember.id,
      });
      const current = response.data.data.find(
        (history: GroupHistory) => history.endDate === null
      );
      if (current) setTargetGroupHistory(current);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const fetchCurrentMinistryHistory = async () => {
    if (!targetMinistry.id) {
      setTargetMinistryHistory(undefined);
      return;
    }

    try {
      const response = await ministryHistoryApi.getMinistryHistory({
        churchId,
        memberId: targetMember.id,
      });
      const currentHistory = response.data.data.find(
        (history: MinistryHistory) =>
          history.ministrySnapShot === targetMinistry.name
      );
      if (currentHistory) {
        setTargetMinistryHistory(currentHistory);
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    fetchCurrentOfficerHistory();
    fetchCurrentGroupHistory();
  }, [targetMember]);

  useEffect(() => {
    fetchCurrentMinistryHistory();
  }, [targetMinistry]);

  // ================================
  // 렌더링
  // ================================
  const props = {
    onClickItem,
    onClickOpenBaptismModal,
    onClickOpenGroupModal,
    onClickOpenMinistryModal,
    onClickOpenOfficerModal,
  };

  return (
    <>
      <MemberInformationListView {...props} />
      {isToastShown && (
        <ToastPopup
          setIsShow={setIsToastShown}
          text={t_popup('saveComplete')}
        />
      )}
      {/* 교인 정보 수정 */}
      <SlidePopup
        isShow={isEditShown}
        onClickClose={onClickClose}
        headerRight={<Button text="저장" onClick={onClickSave} />}
      >
        <MemberEdit focusItem={focusItem} />
      </SlidePopup>

      {/* 신급 수정 */}
      <BottomSheet
        isOpened={isBaptismModalShown}
        onDismiss={onClickCloseBaptismModal}
        snapPoints={[50]}
        isSnapPercentage={true}
      >
        <BaptismModal
          targetBaptism={targetMember.baptism}
          onClickSave={onClickSaveBaptism}
        />
      </BottomSheet>

      {/* 소그룹 수정 */}
      <BottomSheet
        isOpened={isGroupModalShown}
        onDismiss={onClickCloseGroupModal}
        snapPoints={[50]}
        isSnapPercentage={true}
      >
        <GroupModal
          targetHistory={targetGroupHistory}
          onClickSaveNewGroup={onClickSaveNewGroup}
        />
      </BottomSheet>

      {/*/!* 소그룹 수정 *!/*/}
      {/*<CustomPopup*/}
      {/*  isShow={isGroupModalShown}*/}
      {/*  onClickClose={onClickCloseGroupModal}*/}
      {/*  width={400}*/}
      {/*  height={600}*/}
      {/*>*/}
      {/*  <GroupModal*/}
      {/*    targetHistory={targetGroupHistory}*/}
      {/*    onClickSaveNewGroup={onClickSaveNewGroup}*/}
      {/*  />*/}
      {/*</CustomPopup>*/}

      {/* 사역 수정 */}
      <BottomSheet
        isOpened={isMinistryModalShown}
        onDismiss={onClickCloseMinistryModal}
        snapPoints={[50]}
        isSnapPercentage={true}
      >
        <MinistryModal
          targetHistory={targetMinistryHistory}
          onClickSaveNewMinistry={onClickSaveNewMinistry}
          onClickCreateMinistry={onClickCreateMinistry}
        />
      </BottomSheet>

      {/* 직분 수정 */}
      <BottomSheet
        isOpened={isOfficerModalShown}
        onDismiss={onClickCloseOfficerModal}
        snapPoints={[50]}
        isSnapPercentage={true}
      >
        <OfficerModal
          targetHistory={targetOfficerHistory}
          onClickSaveNewOfficer={onClickSaveNewOfficer}
        />
      </BottomSheet>
    </>
  );
};

export default MemberInformationList;
