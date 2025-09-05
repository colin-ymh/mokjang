import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../redux/store';

import { useScopedI18n } from '../../../../../../locales/client';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '../../../../../redux/reducers/toast-popup-reducer';
import { BLACK, BLANK, DESTRUCTIVE, TASK_STATUS } from '@mokjang/constants';
import { DEFAULT_VISITATION, Visitation } from '@mokjang/models';
import { VisitationsApi } from '../../../../../api/visitations/visitations.api';
import MemberVisitationListView from './member-visitation-list.view';
import { getDateFromDateString, getFullStringFromDate, getIsWellFormedTitle, } from '@mokjang/utils';
import { setTargetVisitation } from '../../../../../redux/reducers/target/target-visitation-reducer';

type MemberVisitationListProps = {};

const MemberVisitationList = ({}: MemberVisitationListProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const { churchId } = useSelector((state: RootState) => state.church);
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const visitationsApi = new VisitationsApi(false);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  // 렌더링 시점(컴포넌트 return)에서 조건부로 에러 발생
  if (thrownError) {
    throw thrownError;
  }

  // 심방 추가 팝업 활성화
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  const [isInformationShown, setIsInformationShown] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 심방 목록
  const [visitations, setVisitations] = useState<Visitation[]>([]);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 심방 추가 버튼
  const onClickOpenModal = (visitation?: Visitation) => {
    setIsModalShown(true);
    if (visitation) {
      dispatch(setTargetVisitation(visitation));
    } else {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
    }
  };

  // 심방 추가 닫기
  const onClickCloseModal = async () => {
    setIsModalShown(false);
    if (!targetVisitation.id) {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
    } else {
      try {
        const response = await visitationsApi.getVisitation({
          churchId,
          visitationId: targetVisitation.id,
        });
        const prevVisitation = response.data.data;
        dispatch(setTargetVisitation(prevVisitation));
      } catch (error) {
        setThrownError(new Error(String(error)));
      }
    }
  };

  // 가족 추가 완료 버튼
  const onClickAddDone = async () => {
    try {
      // 수정
      if (targetVisitation.id) {
        await visitationsApi.editVisitation(
          { churchId, visitationId: targetVisitation.id },
          {
            status: targetVisitation.status || undefined,
            title: targetVisitation.title || undefined,
            inChargeId: targetVisitation.inChargeId || undefined,
            startDate:
              getFullStringFromDate(
                getDateFromDateString(targetVisitation.startDate)
              ) || undefined,
            endDate:
              getFullStringFromDate(
                getDateFromDateString(targetVisitation.endDate)
              ) || undefined,
          }
        );

        await visitationsApi.editVisitationDetails(
          { churchId, visitationId: targetVisitation.id },
          {
            visitationContent:
              targetVisitation.visitationDetails[0].visitationContent,
            visitationPray:
              targetVisitation.visitationDetails[0].visitationPray,
          }
        );

        const reports = visitations.find(
          (visitation) => visitation.id === targetVisitation.id
        )?.reports;

        if (reports) {
          const receiverIds = reports.map((report) => report.receiver.id);

          const addReceiverIds = targetVisitation.receiverIds?.filter(
            (receiverId) => !receiverIds.includes(receiverId)
          );
          const deleteReceiverIds =
            receiverIds?.filter(
              (receiverId) =>
                !targetVisitation.receiverIds?.includes(receiverId)
            ) || [];

          if (addReceiverIds?.length > 0) {
            await visitationsApi.addReceivers(
              { churchId, visitationId: targetVisitation.id },
              { receiverIds: addReceiverIds }
            );
          }

          if (deleteReceiverIds?.length > 0) {
            await visitationsApi.deleteReceivers(
              { churchId, visitationId: targetVisitation.id },
              { receiverIds: deleteReceiverIds }
            );
          }
        }

        const response = await visitationsApi.getVisitation({
          churchId,
          visitationId: targetVisitation.id,
        });

        const newVisitation = response.data.data;

        const newVisitations = visitations.map((visitation) => {
          if (visitation.id === targetVisitation.id) {
            return newVisitation;
          } else {
            return visitation;
          }
        });

        dispatch(setTargetVisitation(newVisitation));
        setVisitations(newVisitations);
      }
      // 추가
      else {
        const response = await visitationsApi.createVisitation(
          {
            churchId,
          },
          {
            status: targetVisitation.status,
            visitationMethod: targetVisitation.visitationMethod,
            inChargeId: targetVisitation.inChargeId,
            startDate: getFullStringFromDate(
              getDateFromDateString(targetVisitation.startDate)
            ),
            endDate: getFullStringFromDate(
              getDateFromDateString(targetVisitation.endDate)
            ),
            visitationDetails: targetVisitation.visitationDetails,
            memberIds: targetVisitation.members.map((member) => member.id),
            title: targetVisitation.title,
            receiverIds: targetVisitation.receiverIds,
          }
        );

        const newVisitation = response.data.data;
        setVisitations([...visitations, newVisitation]);
        dispatch(setTargetVisitation(DEFAULT_VISITATION));
      }

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
    }
  };

  const onClickVisitation = async (visitation: Visitation) => {
    try {
      const response = await visitationsApi.getVisitation({
        churchId,
        visitationId: visitation.id,
      });

      const newVisitation = response.data.data;

      dispatch(setTargetVisitation(newVisitation));
      setIsInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onCloseVisitation = () => {
    setIsInformationShown(false);
    setTargetVisitation(DEFAULT_VISITATION);
  };

  // 업무 삭제하기
  const onClickDelete = async () => {
    try {
      await visitationsApi.deleteVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });

      const newVisitations = visitations.filter(
        (visitation) => visitation.id !== targetVisitation.id
      );
      setVisitations(newVisitations);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
    }
  };

  const LIMIT = 20;
  const fetchVisitations = async () => {
    try {
      if (targetMember.id && hasMore) {
        const response = await visitationsApi.getVisitations({
          churchId,
          memberId: targetMember.id,
          take: LIMIT,
          page,
        });

        const newVisitations = response.data.data;

        // 항상 기존 배열에 추가 (중복 방지)
        setVisitations((prev) => {
          if (!prev || prev.length === 0) {
            return newVisitations;
          }

          const existingIds = new Set(prev.map((m) => m.id));
          const merged = [...prev];
          for (const v of visitations) {
            if (!existingIds.has(v.id)) merged.push(v);
          }
          return merged;
        });

        setHasMore(response.data.hasMore);
        setPage(page + 1);
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

  useEffect(() => {
    fetchVisitations();
  }, [targetMember]);

  // Reset list and page when targetMember changes
  useEffect(() => {
    setVisitations([]);
    setPage(1);
    setHasMore(true);
  }, [targetMember]);

  // Infinite scroll: use onScroll handler instead of event listener
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore) return;
    const div = e.currentTarget;
    if (!div) return;

    // 바닥 근처이면 다음 페이지 로드
    if (div.scrollHeight - div.scrollTop <= div.clientHeight + 10) {
      fetchVisitations();
    }
  };

  const onChangeStatus = (status: TASK_STATUS) => {
    try {
      visitationsApi
        .editVisitation(
          { churchId, visitationId: targetVisitation.id },
          { status }
        )
        .then((response) => {
          const newVisitation = response.data.data;

          dispatch(
            setTargetVisitation({
              ...targetVisitation,
              status,
            })
          );

          const newVisitations = visitations.map((v) => {
            return v.id !== newVisitation.id ? v : { ...v, status };
          });

          setVisitations(newVisitations);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetVisitation.title)) {
      setIsSaveEnabled(false);
      return;
    }
    if (targetVisitation.members.length === 0) {
      setIsSaveEnabled(false);
      return;
    }
    if (targetVisitation.inChargeId === BLANK) {
      setIsSaveEnabled(false);
      return;
    }
    if (!targetVisitation.startDate || !targetVisitation.endDate) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetVisitation]);

  const props = {
    scrollRef,
    isModalShown,
    isInformationShown,
    isSaveEnabled,
    isPopupShown,
    visitations,
    onClickConfirmOpen,
    onClickConfirmClose,
    onClickOpenModal,
    onClickCloseModal,
    onClickAddDone,
    onClickVisitation,
    onCloseVisitation,
    onClickDelete,
    onScroll,
    onChangeStatus,
  };

  return (
    <>
      <MemberVisitationListView {...props} />
    </>
  );
};

export default MemberVisitationList;
