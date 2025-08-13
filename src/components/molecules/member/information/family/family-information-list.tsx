import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

import { FamilyApi } from '@/api/members/family.api';
import { MembersApi } from '@/api/members/members.api';
import FamilyInformationListView from '@/components/molecules/member/information/family/family-information-list.view';
import { FamilyMember, Member } from '@/models/member/member';

import { useScopedI18n } from '../../../../../../locales/client';
import { setTargetMember } from '@/redux/reducers/target/target-member-reducer';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { BLACK, DESTRUCTIVE } from '@/constants/styles/color';
import { FAMILY } from '@/constants/constant';

type FamilyInformationListProps = {};

const FamilyInformationList = ({}: FamilyInformationListProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );

  const familyApi = new FamilyApi(false);
  const membersApi = new MembersApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 가족 관계 설정 모달 활성화 여부
  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 가족 멤버들
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  // 가족 추가 버튼
  const onClickOpenModal = () => {
    setIsModalShown(true);
  };

  // 가족 추가 완료 버튼
  const onClickAddDone = async () => {
    try {
      for (const member of selectedMembers) {
        await familyApi.createFamily(
          { churchId, memberId: targetMember.id },
          { familyMemberId: member.id, relation: FAMILY.FAMILY }
        );
      }

      const response = await membersApi.getMember({
        churchId,
        memberId: targetMember.id,
      });

      const newTargetMember = response.data.data;

      dispatch(setTargetMember(newTargetMember));

      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
      dispatch(setToastBackgroundColor(BLACK));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DARK));
      } else {
        setThrownError(new Error(String(error)));
      }
    } finally {
      setIsModalShown(false);
      setSelectedMembers([]);
    }
  };

  // 가족 추가 닫기 버튼
  const onClickCloseModal = () => {
    setIsModalShown(false);
    setSelectedMembers([]);
  };

  const onClickConfirmDelete = async (familyMemberId: string) => {
    if (familyMemberId) {
      try {
        await familyApi.deleteFamily({
          churchId,
          familyMemberId,
          memberId: targetMember.id,
        });

        const newFamilyMembers = familyMembers.filter(
          (familyMember) => familyMember.familyMemberId !== familyMemberId
        );
        setFamilyMembers(newFamilyMembers);
      } catch (error) {
        if (error instanceof Error) {
          dispatch(setToastText(error.message));
          dispatch(setIsToastShown(true));
        } else {
          setThrownError(new Error(String(error)));
        }
      }
    }
  };

  const onChangeRelation = async (familyMemberId: string, relation: FAMILY) => {
    try {
      const response = await familyApi.editFamily(
        {
          churchId,
          familyMemberId,
          memberId: targetMember.id,
        },
        { relation }
      );
      const newFamilyMember = familyMembers.map((familyMember) => {
        if (familyMember.familyMemberId === familyMemberId) {
          return {
            ...familyMember,
            relation,
          };
        } else {
          return familyMember;
        }
      });
      setFamilyMembers(newFamilyMember);
    } catch (error) {
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setIsToastShown(true));
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        if (targetMember.id) {
          const response = await familyApi.getFamily({
            churchId,
            memberId: targetMember.id,
          });

          const newFamilyMembers = response.data.map(
            (member: FamilyMember) => ({
              ...member,
              familyMember: member.familyMember,
            })
          );

          setFamilyMembers(newFamilyMembers);
        }
      } catch (error) {
        if (error instanceof Error) {
          dispatch(setToastText(error.message));
          dispatch(setIsToastShown(true));
        } else {
          setThrownError(new Error(String(error)));
        }
      }
    };

    fetchFamilyMembers();
  }, [targetMember]);

  const props = {
    isModalShown,
    familyMembers,
    selectedMembers,
    setSelectedMembers,
    onClickOpenModal,
    onClickCloseModal,
    onClickAddDone,
    onClickConfirmDelete,
    onChangeRelation,
  };

  return (
    <>
      <FamilyInformationListView {...props} />
    </>
  );
};

export default FamilyInformationList;
