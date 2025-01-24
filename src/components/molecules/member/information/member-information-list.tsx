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
import { BLANK, NONE } from '@/constants/constant';
import { getEditMemberBody, getMemberFromServer } from '@/utils/member';
import {
  GroupHistory,
  MinistryHistory,
  OfficerHistory,
} from '@/models/member/history';
import { Member } from '@/models/member/member';
import { DEFAULT_MINISTRY, Ministry } from '@/models/management/management';
import MinistryModal from '@/components/atoms/common/modal/ministry-modal';

type InformationListProps = { targetMemberId: string };

const InformationList = ({ targetMemberId }: InformationListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const ministryHistoryApi = new MinistryHistoryApi(false);
  const officerHistoryApi = new OfficerHistoryApi(false);
  const groupHistoryApi = new GroupHistoryApi(false);

  const { churchId } = useSelector((state: RootState) => state.church);
  const { member } = useSelector((state: RootState) => state.memberRegister);
  const { members } = useSelector((state: RootState) => state.memberFilter);

  const membersApi = new MembersApi(false);

  // 교인 초기 상태
  const [prevMember, setPrevMember] = useState<Member>(DEFAULT_MEMBER);

  // 설정된 직분
  const [targetOfficerHistory, setTargetOfficerHistory] = useState<
    OfficerHistory | undefined
  >(undefined);

  // 설정된 그룹
  const [targetGroupHistory, setTargetGroupHistory] = useState<
    GroupHistory | undefined
  >(undefined);

  // 설정된 사역 (이력)
  const [targetMinistryHistory, setTargetMinistryHistory] = useState<
    MinistryHistory | undefined
  >(undefined);

  // 설정된 사역
  const [targetMinistry, setTargetMinistry] =
    useState<Ministry>(DEFAULT_MINISTRY);

  // 교인 개인정보 모달 활성화 여부
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 어떤 개인정보를 통해 수정을 시작했는지 판단
  const [focusItem, setFocusItem] = useState<MEMBER>(MEMBER.NAME);

  // 교인 상세 정보 클릭 시, 이벤트
  const onClickItem = (id: MEMBER) => {
    dispatch(setMember(prevMember));
    setFocusItem(id);
    setIsEditShown(true);
  };

  // 교인 상세 모달 닫기
  const onClickClose = () => {
    setIsEditShown(false);
    dispatch(setMember(DEFAULT_MEMBER));
  };

  // 수정한 교인 정보 저장
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

          const newMembers = members.map((member: Member) => {
            if (member.id === newMember.id) {
              return newMember;
            } else {
              return member;
            }
          });

          dispatch(setMembers(newMembers));
        }
      });
  };

  // 소그룹 수정 모달 활성화 여부
  const [isGroupModalShown, setIsGroupModalShown] = useState<boolean>(false);

  // 소그룹 수정 모달 열기
  const onClickOpenGroupModal = () => {
    setIsGroupModalShown(true);
  };

  // 소그룹 수정 모달 닫기
  const onClickCloseGroupModal = () => {
    setIsGroupModalShown(false);
  };

  // 그룹 저장
  const onClickSaveNewGroup = (
    groupId: string,
    groupRoleId: string,
    startDate: string
  ) => {
    // 생성
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
        .then((response) => {
          setIsGroupModalShown(false);
          const newMember = getMemberFromServer(response.data.data);
          setPrevMember(newMember);

          const newMembers = members.map((member: Member) => {
            if (member.id === newMember.id) {
              return newMember;
            } else {
              return member;
            }
          });

          dispatch(setMembers(newMembers));
        });
    }
    // 수정
    else if (targetGroupHistory) {
      if (groupId === BLANK) {
        groupHistoryApi
          .stopGroupHistory(
            {
              churchId,
              memberId: targetMemberId,
            },
            {}
          )
          .then((response) => {
            setIsGroupModalShown(false);
            const newMember = getMemberFromServer(response.data.data);
            setPrevMember(newMember);

            const newMembers = members.map((member: Member) => {
              if (member.id === newMember.id) {
                return newMember;
              } else {
                return member;
              }
            });

            dispatch(setMembers(newMembers));
          });
      }

      // 그룹은 안바꾼 경우
      // 그냥 날짜 수정
      else if (groupId === prevMember.group?.id) {
        groupHistoryApi
          .editGroupHistory(
            {
              churchId,
              memberId: targetMemberId,
              groupHistoryId: targetGroupHistory.id,
            },
            {
              startDate,
            }
          )
          .then(() => {
            setIsGroupModalShown(false);
          });
      } else {
        // 그룹까지 바꾼 경우
        // 이전 이력 종료 이후
        // 새로 생성
        groupHistoryApi
          .stopGroupHistory(
            {
              churchId,
              memberId: targetMemberId,
            },
            {}
          )
          .then(() => {
            groupHistoryApi
              .createGroupHistory(
                {
                  churchId,
                  memberId: targetMemberId,
                },
                {
                  groupId,
                  groupRoleId,
                  startDate,
                }
              )
              .then((response) => {
                setIsGroupModalShown(false);
                const newMember = getMemberFromServer(response.data.data);
                setPrevMember(newMember);

                const newMembers = members.map((member: Member) => {
                  if (member.id === newMember.id) {
                    return newMember;
                  } else {
                    return member;
                  }
                });

                dispatch(setMembers(newMembers));
              });
          });
      }
    }
  };

  const fetchCurrentGroupHistory = () => {
    // 그룹
    if (prevMember.group?.id) {
      groupHistoryApi
        .getGroupHistory({
          churchId,
          memberId: prevMember.id,
        })
        .then((response) => {
          const currentHistory = response.data.data.find(
            (history: GroupHistory) => history.endDate === null
          );
          if (currentHistory) {
            setTargetGroupHistory(currentHistory);
          }
        });
    } else {
      setTargetGroupHistory(undefined);
    }
  };

  // 사역 수정 모달 활성화 여부
  const [isMinistryModalShown, setIsMinistryModalShown] =
    useState<boolean>(false);

  // 사역 수정 모달 열기
  const onClickOpenMinistryModal = (ministry?: Ministry) => {
    setIsMinistryModalShown(true);
    if (ministry) {
      setTargetMinistry(ministry);
    }
  };

  // 사역 수정 모달 닫기
  const onClickCloseMinistryModal = () => {
    setIsMinistryModalShown(false);
    setTargetMinistry(DEFAULT_MINISTRY);
  };

  // 사역 저장
  const onClickSaveNewMinistry = (
    ministryGroupId: string,
    ministryId: string,
    startDate: string
  ) => {
    // 생성
    if (!targetMinistryHistory) {
      ministryHistoryApi
        .createMinistryHistory(
          { churchId, memberId: targetMemberId },
          {
            ministryId,
            startDate,
          }
        )
        .then((response) => {
          setIsMinistryModalShown(false);
          const newMember = getMemberFromServer(response.data.data);
          setPrevMember(newMember);

          const newMembers = members.map((member: Member) => {
            if (member.id === newMember.id) {
              return newMember;
            } else {
              return member;
            }
          });

          dispatch(setMembers(newMembers));
        });
    }
    // 수정
    else if (targetMinistryHistory) {
      if (ministryGroupId === BLANK) {
        ministryHistoryApi
          .stopMinistryHistory(
            {
              churchId,
              memberId: targetMemberId,
              ministryId,
            },
            {}
          )
          .then((response) => {
            setIsMinistryModalShown(false);
            const newMember = getMemberFromServer(response.data.data);
            setPrevMember(newMember);

            const newMembers = members.map((member: Member) => {
              if (member.id === newMember.id) {
                return newMember;
              } else {
                return member;
              }
            });

            dispatch(setMembers(newMembers));
          });
      }

      // 그룹은 안바꾼 경우
      // 그냥 날짜 수정
      else if (targetMinistry.id === ministryId) {
        ministryHistoryApi
          .editMinistryHistory(
            {
              churchId,
              memberId: targetMemberId,
              ministryHistoryId: targetMinistryHistory.id,
            },
            {
              startDate,
            }
          )
          .then(() => {
            setIsMinistryModalShown(false);
          });
      } else {
        // 그룹까지 바꾼 경우
        // 이전 이력 종료 이후
        // 새로 생성
        ministryHistoryApi
          .stopMinistryHistory(
            {
              churchId,
              memberId: targetMemberId,
              ministryId: targetMinistry.id,
            },
            {}
          )
          .then(() => {
            ministryHistoryApi
              .createMinistryHistory(
                {
                  churchId,
                  memberId: targetMemberId,
                },
                {
                  ministryId,
                  startDate,
                }
              )
              .then((response) => {
                setIsMinistryModalShown(false);
                const newMember = getMemberFromServer(response.data.data);
                setPrevMember(newMember);

                const newMembers = members.map((member: Member) => {
                  if (member.id === newMember.id) {
                    return newMember;
                  } else {
                    return member;
                  }
                });

                dispatch(setMembers(newMembers));
              });
          });
      }
    }
  };

  const fetchCurrentMinistryHistory = () => {
    // 직분
    if (targetMinistry.id) {
      ministryHistoryApi
        .getMinistryHistory({
          churchId,
          memberId: prevMember.id,
        })
        .then((response) => {
          const targetHistory = response.data.data.find(
            (history: MinistryHistory) =>
              history.ministrySnapShot === targetMinistry.name
          );
          if (targetHistory) {
            setTargetMinistryHistory(targetHistory);
          }
        });
    } else {
      setTargetMinistryHistory(undefined);
    }
  };

  // 직분 수정 모달 활성화 여부
  const [isOfficerModalShown, setIsOfficerModalShown] =
    useState<boolean>(false);

  // 직분 수정 모달 열기
  const onClickOpenOfficerModal = () => {
    setIsOfficerModalShown(true);
  };

  // 직분 수정 모달 닫기
  const onClickCloseOfficerModal = () => {
    setIsOfficerModalShown(false);
  };

  // 직분 저장
  const onClickSaveNewOfficer = (officerId: string, startDate: string) => {
    // 생성
    if (!targetOfficerHistory) {
      officerHistoryApi
        .createOfficerHistory(
          { churchId, memberId: targetMemberId },
          {
            officerId,
            startDate,
          }
        )
        .then((response) => {
          setIsOfficerModalShown(false);
          const newMember = getMemberFromServer(response.data.data);
          setPrevMember(newMember);

          const newMembers = members.map((member: Member) => {
            if (member.id === newMember.id) {
              return newMember;
            } else {
              return member;
            }
          });

          dispatch(setMembers(newMembers));
        });
    }
    // 수정
    else if (targetOfficerHistory) {
      if (officerId === NONE) {
        officerHistoryApi
          .stopOfficerHistory(
            {
              churchId,
              memberId: targetMemberId,
            },
            {}
          )
          .then((response) => {
            setIsOfficerModalShown(false);
            const newMember = getMemberFromServer(response.data.data);
            setPrevMember(newMember);

            const newMembers = members.map((member: Member) => {
              if (member.id === newMember.id) {
                return newMember;
              } else {
                return member;
              }
            });

            dispatch(setMembers(newMembers));
          });
      }
      // 직분은 안바꾼 경우
      // 그냥 날짜 수정
      else if (officerId === prevMember.officer?.id) {
        officerHistoryApi
          .editOfficerHistory(
            {
              churchId,
              memberId: targetMemberId,
              officerHistoryId: targetOfficerHistory.id,
            },
            {
              startDate,
            }
          )
          .then(() => {
            setIsOfficerModalShown(false);
          });
      } else {
        // 직분까지 바꾼 경우
        // 이전 이력 종료 이후
        // 새로 생성
        officerHistoryApi
          .stopOfficerHistory(
            {
              churchId,
              memberId: targetMemberId,
            },
            {}
          )
          .then(() => {
            officerHistoryApi
              .createOfficerHistory(
                {
                  churchId,
                  memberId: targetMemberId,
                },
                {
                  officerId,
                  startDate,
                }
              )
              .then((response) => {
                setIsOfficerModalShown(false);
                const newMember = getMemberFromServer(response.data.data);
                setPrevMember(newMember);

                const newMembers = members.map((member: Member) => {
                  if (member.id === newMember.id) {
                    return newMember;
                  } else {
                    return member;
                  }
                });

                dispatch(setMembers(newMembers));
              });
          });
      }
    }
  };

  const fetchCurrentOfficerHistory = () => {
    // 직분
    if (prevMember.officer?.id) {
      officerHistoryApi
        .getOfficerHistory({
          churchId,
          memberId: prevMember.id,
        })
        .then((response) => {
          const currentHistory = response.data.data.find(
            (history: OfficerHistory) => history.endDate === null
          );
          if (currentHistory) {
            setTargetOfficerHistory(currentHistory);
          }
        });
    } else {
      setTargetOfficerHistory(undefined);
    }
  };

  useEffect(() => {
    membersApi
      .getMember({ churchId, memberId: targetMemberId })
      .then((response) => {
        const newMember = response.data.data;

        if (newMember) setPrevMember(newMember);
      });
  }, [targetMemberId]);

  // 현재 상태 불러오기
  useEffect(() => {
    fetchCurrentOfficerHistory();
    fetchCurrentGroupHistory();
  }, [prevMember]);

  useEffect(() => {
    fetchCurrentMinistryHistory();
  }, [targetMinistry]);

  const props = {
    prevMember,
    onClickItem,
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
