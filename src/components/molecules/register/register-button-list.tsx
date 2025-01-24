import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  DEFAULT_MEMBER,
  setMember,
  setStage,
} from '@/redux/reducers/member-register-reducer';

import { MembersApi } from '@/api/churches/members.api';
import { MemberManagementsApi } from '@/api/churches/member-managements.api';
import { RequestInfoApi } from '@/api/churches/request-info.api';
import {
  BLANK,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
  NONE,
  NULL,
} from '@/constants/constant';
import RegisterButtonListView from '@/components/molecules/register/register-button-list.view';

import { getCreateMemberBody, getEditMemberBody } from '@/utils/member';

import { useScopedI18n } from '../../../../locales/client';
import {
  fetchMembers,
  setMembers,
} from '@/redux/reducers/member-filter-reducer';

type RegisterButtonListProps = {
  setIsShown?: Dispatch<SetStateAction<boolean>>;
};

const RegisterButtonList = ({ setIsShown }: RegisterButtonListProps) => {
  const membersApi = new MembersApi(false);
  const memberManagementsApi = new MemberManagementsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const requestInfoApi = new RequestInfoApi(false);
  const { type, stage, member } = useSelector(
    (state: RootState) => state.memberRegister
  );
  const t_button = useScopedI18n('button');

  const [isToastShow, setIsToastShow] = useState<boolean>(false);

  const onClickLeft = () => {
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      requestInfoApi
        .inviteMember({ churchId, isTest: true }, getCreateMemberBody(member))
        .then((response) => {
          // 등록 성공 시
          if (response.status === 201) {
            // 교인 Id 할당
            const memberId = response.data.id;
            dispatch(setMember({ ...member, id: memberId }));
            dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
              (result) => {
                if (fetchMembers.fulfilled.match(result)) {
                  dispatch(setMembers(result.payload));
                }
              }
            );
            // 성공 팝업
            setIsToastShow(true);
          }
        });
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      dispatch(setMember(DEFAULT_MEMBER));
      dispatch(setStage(MEMBER_REGISTER_STAGE.REQUIRED));
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
    }
  };

  const onClickRight = () => {
    // 최초 화면
    if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
      // 최초 교인 등록
      membersApi
        .createMember({ churchId }, getCreateMemberBody(member))
        .then((response) => {
          // 등록 성공 시
          if (response.status === 201) {
            // 교인 Id 할당
            const memberId = response.data.id;
            dispatch(setMember({ ...member, id: memberId }));
            dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
              (result) => {
                if (fetchMembers.fulfilled.match(result)) {
                  dispatch(setMembers(result.payload));
                }
              }
            );
            // 성공 팝업
            setIsToastShow(true);
            // 다음 단계로 이동
            dispatch(setStage(MEMBER_REGISTER_STAGE.PERSONAL));
          }
        });
    } else if (stage === MEMBER_REGISTER_STAGE.PERSONAL) {
      if (type === MEMBER_REGISTER_TYPE.NEW) {
        if (member?.id) {
          membersApi
            .editMember(
              { churchId, memberId: member.id },
              getEditMemberBody(member)
            )
            .then(() => {
              dispatch(setMember(DEFAULT_MEMBER));
              dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
                (result) => {
                  if (fetchMembers.fulfilled.match(result)) {
                    dispatch(setMembers(result.payload));
                  }
                }
              );
              if (setIsShown) setIsShown(false);
            });
        }
      } else {
        dispatch(setStage(MEMBER_REGISTER_STAGE.RELIGIOUS));
      }
    } else if (stage === MEMBER_REGISTER_STAGE.RELIGIOUS) {
      if (member?.id) {
        // 교인 업데이트
        membersApi
          .editMember(
            { churchId, memberId: member.id },
            getEditMemberBody(member)
          )
          .then(() => {
            dispatch(setMember(DEFAULT_MEMBER));
            dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
              (result) => {
                if (fetchMembers.fulfilled.match(result)) {
                  dispatch(setMembers(result.payload));
                }
              }
            );
            if (setIsShown) setIsShown(false);
          });

        // 직분 업데이트
        if (member?.officer?.id !== NULL) {
          memberManagementsApi
            .editMemberOfficer(
              { churchId, memberId: member.id },
              {
                isDeleteOfficer: false,
                officerId:
                  member.officer?.id !== NONE ? member?.officer?.id : undefined,
                officerStartChurch:
                  member?.officerStartChurch === BLANK
                    ? undefined
                    : member.officerStartChurch,
                officerStartDate:
                  member.officerStartDate === BLANK
                    ? undefined
                    : member.officerStartDate,
              }
            )
            .then(() => {
              dispatch(fetchMembers({ churchId, currentPage: 1 })).then(
                (result) => {
                  if (fetchMembers.fulfilled.match(result)) {
                    dispatch(setMembers(result.payload));
                  }
                }
              );
            });
        }
      }
    }
  };

  const getRightButtonTitle = () => {
    if (type === MEMBER_REGISTER_TYPE.NEW) {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.REQUIRED:
          return t_button('register');
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button('save');
        default:
          return t_button('register');
      }
    } else {
      switch (stage) {
        case MEMBER_REGISTER_STAGE.REQUIRED:
          return t_button('register');
        case MEMBER_REGISTER_STAGE.PERSONAL:
          return t_button('extra');
        case MEMBER_REGISTER_STAGE.RELIGIOUS:
          return t_button('save');
        default:
          return t_button('register');
      }
    }
  };

  const props = {
    onClickLeft,
    onClickRight,
    getRightButtonTitle,
    isToastShow,
    setIsToastShow,
  };

  return (
    <>
      <RegisterButtonListView {...props} />
    </>
  );
};

export default RegisterButtonList;
