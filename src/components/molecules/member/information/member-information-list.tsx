import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setMembers } from '@/redux/reducers/member-filter-reducer';
import {
  DEFAULT_MEMBER,
  setMember,
} from '@/redux/reducers/member-register-reducer';

import { MembersApi } from '@/api/churches/members.api';
import { MinistryHistoryApi } from '@/api/history/ministry-history.api';
import { OfficerHistoryApi } from '@/api/history/officer-history.api';
import { GroupHistoryApi } from '@/api/history/group-history.api';
import MemberInformationListView from '@/components/molecules/member/information/member-information-list.view';
import { MEMBER } from '@/constants/member/member-column';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
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

type InformationListProps = { targetMemberId: string };

const InformationList = ({ targetMemberId }: InformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const ministryHistoryApi = new MinistryHistoryApi(false);
  const officerHistoryApi = new OfficerHistoryApi(false);
  const groupHistoryApi = new GroupHistoryApi(false);
  const membersApi = new MembersApi(false);
  const ministriesApi = new MinistriesApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { members } = useSelector((state: RootState) => state.memberFilter);

  // 교인 초기 상태
  const [prevMember, setPrevMember] = useState<Member>(DEFAULT_MEMBER);

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

  // ================================
  // 공통 유틸: API 응답 후 상태 업데이트
  // ================================
  const handleHistorySuccess = (
    response: any,
    closeModal: () => void
  ): void => {
    closeModal();
    const newMember = getMemberFromServer(response.data.data);
    setPrevMember(newMember);

    const newMembers = members.map((m: Member) =>
      m.id === newMember.id ? newMember : m
    );
    dispatch(setMembers(newMembers));
  };

  // ================================
  // 개인정보 (이름, 생년월일 등) 수정
  // ================================
  const onClickItem = (id: MEMBER) => {
    dispatch(setMember(prevMember));
    setFocusItem(id);
    setIsEditShown(true);
  };

  const onClickClose = () => {
    setIsEditShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  const onClickSave = () => {
    membersApi
      .editMember(
        { churchId, memberId: prevMember.id },
        getEditMemberBody(member)
      )
      .then((response) => {
        if (response.status === 200) {
          setIsEditShown(false);
          const newMember = getMemberFromServer(response.data);
          setPrevMember(newMember);

          // 교인 목록에서도 업데이트
          const newMembers = members.map((mem: Member) =>
            mem.id === newMember.id ? newMember : mem
          );
          dispatch(setMembers(newMembers));
        }
      });
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

  const onClickSaveBaptism = (newBaptism: BAPTISM) => {
    if (newBaptism !== prevMember.baptism) {
      membersApi
        .editMember(
          { churchId, memberId: prevMember.id },
          { baptism: newBaptism }
        )
        .then((response) => {
          setIsBaptismModalShown(false);
          const updatedMember = getMemberFromServer(response.data);
          setPrevMember({ ...prevMember, baptism: updatedMember.baptism });

          const newMembers = members.map((m: Member) =>
            m.id === updatedMember.id ? updatedMember : m
          );
          dispatch(setMembers(newMembers));
        });
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

  const onClickSaveNewGroup = (
    groupId: string,
    groupRoleId: string,
    startDate: string
  ) => {
    // 이력이 없는 경우 = 새로 생성
    if (!targetGroupHistory) {
      groupHistoryApi
        .createGroupHistory(
          { churchId, memberId: targetMemberId },
          {
            groupId,
            groupRoleId,
            startDate,
          }
        )
        .then((response) =>
          handleHistorySuccess(response, () => setIsGroupModalShown(false))
        );
      return;
    }

    // 이력이 있는 경우
    if (groupId === BLANK) {
      // 그룹 제거(이력 종료)
      groupHistoryApi
        .stopGroupHistory({ churchId, memberId: targetMemberId }, {})
        .then((response) =>
          handleHistorySuccess(response, () => setIsGroupModalShown(false))
        );
    } else if (groupId === prevMember.group?.id) {
      // 그룹 동일 => 날짜 수정
      groupHistoryApi
        .editGroupHistory(
          {
            churchId,
            memberId: targetMemberId,
            groupHistoryId: targetGroupHistory.id,
          },
          { startDate }
        )
        .then(() => setIsGroupModalShown(false));
    } else {
      // 기존 이력 종료 후 새로운 이력 생성
      groupHistoryApi
        .stopGroupHistory({ churchId, memberId: targetMemberId }, {})
        .then(() => {
          groupHistoryApi
            .createGroupHistory(
              { churchId, memberId: targetMemberId },
              {
                groupId,
                groupRoleId,
                startDate,
              }
            )
            .then((response) =>
              handleHistorySuccess(response, () => setIsGroupModalShown(false))
            );
        });
    }
  };

  // ================================
  // 사역 수정
  // ================================
  const onClickOpenMinistryModal = (ministry?: Ministry) => {
    setIsMinistryModalShown(true);
    if (ministry) {
      setTargetMinistry(ministry);
    }
  };

  const onClickCloseMinistryModal = () => {
    setIsMinistryModalShown(false);
    setTargetMinistry(DEFAULT_MINISTRY);
  };

  const onClickSaveNewMinistry = (
    ministryGroupId: string,
    ministryId: string,
    startDate: string
  ) => {
    // 이력이 없는 경우(새로 생성)
    if (!targetMinistryHistory) {
      ministryHistoryApi
        .createMinistryHistory(
          { churchId, memberId: targetMemberId },
          {
            ministryId,
            startDate,
          }
        )
        .then((response) =>
          handleHistorySuccess(response, () => setIsMinistryModalShown(false))
        );
      return;
    }

    // 기존 이력이 있는 경우
    if (ministryGroupId === BLANK) {
      // 완전히 사역 중단
      ministryHistoryApi
        .stopMinistryHistory(
          { churchId, memberId: targetMemberId, ministryId: targetMinistry.id },
          {}
        )
        .then((response) =>
          handleHistorySuccess(response, () => setIsMinistryModalShown(false))
        );
    } else if (ministryId === targetMinistry.id) {
      // 사역 동일 => 날짜만 수정
      ministryHistoryApi
        .editMinistryHistory(
          {
            churchId,
            memberId: targetMemberId,
            ministryHistoryId: targetMinistryHistory.id,
          },
          { startDate }
        )
        .then(() => setIsMinistryModalShown(false));
    } else {
      // 기존 이력 중단 후 새로운 이력 생성
      ministryHistoryApi
        .stopMinistryHistory(
          { churchId, memberId: targetMemberId, ministryId: targetMinistry.id },
          {}
        )
        .then(() => {
          ministryHistoryApi
            .createMinistryHistory(
              { churchId, memberId: targetMemberId },
              {
                ministryId,
                startDate,
              }
            )
            .then((response) =>
              handleHistorySuccess(response, () =>
                setIsMinistryModalShown(false)
              )
            );
        });
    }
  };

  // 새로운 사역 만들기
  const onClickCreateMinistry = (
    ministryGroupId: string,
    startDate: string,
    ministryName: string
  ) => {
    ministriesApi
      .createMinistry({ churchId }, { ministryGroupId, name: ministryName })
      .then((response) => {
        const newMinistry: Ministry = response.data;
        console.log(newMinistry);

        onClickSaveNewMinistry(ministryGroupId, newMinistry.id, startDate);
      });
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

  const onClickSaveNewOfficer = (officerId: string, startDate: string) => {
    // 이력이 없는 경우 = 새로 생성
    if (!targetOfficerHistory) {
      officerHistoryApi
        .createOfficerHistory(
          { churchId, memberId: targetMemberId },
          {
            officerId,
            startDate,
          }
        )
        .then((response) =>
          handleHistorySuccess(response, () => setIsOfficerModalShown(false))
        );
      return;
    }

    // 기존 이력이 있는 경우
    if (officerId === NONE) {
      // 직분 중단
      officerHistoryApi
        .stopOfficerHistory({ churchId, memberId: targetMemberId }, {})
        .then((response) =>
          handleHistorySuccess(response, () => setIsOfficerModalShown(false))
        );
    } else if (officerId === prevMember.officer?.id) {
      // 직분 동일 => 날짜만 수정
      officerHistoryApi
        .editOfficerHistory(
          {
            churchId,
            memberId: targetMemberId,
            officerHistoryId: targetOfficerHistory.id,
          },
          { startDate }
        )
        .then(() => setIsOfficerModalShown(false));
    } else {
      // 기존 이력 종료 후 새로 생성
      officerHistoryApi
        .stopOfficerHistory({ churchId, memberId: targetMemberId }, {})
        .then(() => {
          officerHistoryApi
            .createOfficerHistory(
              { churchId, memberId: targetMemberId },
              {
                officerId,
                startDate,
              }
            )
            .then((response) =>
              handleHistorySuccess(response, () =>
                setIsOfficerModalShown(false)
              )
            );
        });
    }
  };

  // ================================
  // 서버에서 특정 교인 정보 불러오기
  // ================================
  const fetchMember = () => {
    membersApi
      .getMember({ churchId, memberId: targetMemberId })
      .then((response) => {
        const newMember = getMemberFromServer(response.data.data);
        if (newMember) setPrevMember(newMember);
      });
  };

  useEffect(() => {
    fetchMember();
  }, [targetMemberId]);

  // ================================
  // 현재 이력/상태 정보 불러오기
  // ================================
  const fetchCurrentOfficerHistory = () => {
    if (prevMember.officer?.id) {
      officerHistoryApi
        .getOfficerHistory({ churchId, memberId: prevMember.id })
        .then((response) => {
          const current = response.data.data.find(
            (history: OfficerHistory) => history.endDate === null
          );
          if (current) setTargetOfficerHistory(current);
        });
    } else {
      setTargetOfficerHistory(undefined);
    }
  };

  const fetchCurrentGroupHistory = () => {
    if (prevMember.group?.id) {
      groupHistoryApi
        .getGroupHistory({ churchId, memberId: prevMember.id })
        .then((response) => {
          const current = response.data.data.find(
            (history: GroupHistory) => history.endDate === null
          );
          if (current) setTargetGroupHistory(current);
        });
    } else {
      setTargetGroupHistory(undefined);
    }
  };

  const fetchCurrentMinistryHistory = () => {
    // targetMinistry가 설정되어 있을 때만 조회
    if (targetMinistry.id) {
      ministryHistoryApi
        .getMinistryHistory({ churchId, memberId: prevMember.id })
        .then((response) => {
          const current = response.data.data.find(
            (history: MinistryHistory) =>
              history.ministrySnapShot === targetMinistry.name
          );
          if (current) setTargetMinistryHistory(current);
        });
    } else {
      setTargetMinistryHistory(undefined);
    }
  };

  useEffect(() => {
    fetchCurrentOfficerHistory();
    fetchCurrentGroupHistory();
  }, [prevMember]);

  useEffect(() => {
    fetchCurrentMinistryHistory();
  }, [targetMinistry]);

  // ================================
  // 렌더링
  // ================================
  const props = {
    prevMember,
    onClickItem,
    onClickOpenBaptismModal,
    onClickOpenGroupModal,
    onClickOpenMinistryModal,
    onClickOpenOfficerModal,
  };

  return (
    <>
      <MemberInformationListView {...props} />
      {/* 교인 정보 수정 */}
      <CustomPopup
        isShow={isEditShown}
        onClickClose={onClickClose}
        width={30}
        height={80}
        isPercentage={true}
        headerRight={<Button text="저장" onClick={onClickSave} />}
      >
        <MemberEdit focusItem={focusItem} />
      </CustomPopup>

      {/* 신급 수정 */}
      <CustomPopup
        isShow={isBaptismModalShown}
        onClickClose={onClickCloseBaptismModal}
        width={400}
        height={400}
      >
        <BaptismModal
          targetBaptism={prevMember.baptism}
          onClickSave={onClickSaveBaptism}
        />
      </CustomPopup>

      {/* 소그룹 수정 */}
      <CustomPopup
        isShow={isGroupModalShown}
        onClickClose={onClickCloseGroupModal}
        width={400}
        height={600}
      >
        <GroupModal
          targetHistory={targetGroupHistory}
          onClickSaveNewGroup={onClickSaveNewGroup}
        />
      </CustomPopup>

      {/* 사역 수정 */}
      <CustomPopup
        isShow={isMinistryModalShown}
        onClickClose={onClickCloseMinistryModal}
        width={400}
        height={600}
      >
        <MinistryModal
          targetHistory={targetMinistryHistory}
          onClickSaveNewMinistry={onClickSaveNewMinistry}
          onClickCreateMinistry={onClickCreateMinistry}
        />
      </CustomPopup>

      {/* 직분 수정 */}
      <CustomPopup
        isShow={isOfficerModalShown}
        onClickClose={onClickCloseOfficerModal}
        width={400}
        height={600}
      >
        <OfficerModal
          targetHistory={targetOfficerHistory}
          onClickSaveNewOfficer={onClickSaveNewOfficer}
        />
      </CustomPopup>
    </>
  );
};

export default InformationList;
