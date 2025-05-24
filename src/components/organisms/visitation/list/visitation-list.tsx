import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchVisitations,
  setVisitations,
} from '@/redux/reducers/visitation-filter-reducer';

import { VisitationsApi } from '@/api/visitations/visitations.api';
import VisitationListView from '@/components/organisms/visitation/list/visitation-list.view';
import {
  DEFAULT_VISITATION,
  Visitation,
  VisitationDetail,
} from '@/models/visitation/visitation';
import { setTargetVisitation } from '@/redux/reducers/target-visitation-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';

type VisitationListProps = {
  isMy?: boolean;
};

const VisitationList = ({ isMy = false }: VisitationListProps) => {
  const visitationsApi = new VisitationsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    visitations,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
  } = useSelector((state: RootState) => state.visitationFilter);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [prevMemberIds, setPrevMemberIds] = useState<string[]>([]);
  const [prevReceiverIds, setReceiverIds] = useState<string[]>([]);

  useEffect(() => {
    if (targetVisitation.members) {
      const memberIds = targetVisitation.visitationDetails.map((detail) => {
        return detail.memberId;
      });

      setPrevMemberIds(memberIds);

      const receiverIds = targetVisitation.reports.map((report) => {
        return report.receiver.id;
      });
      setReceiverIds(receiverIds);
    }
  }, [targetVisitation.id]);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 상세정보 팝업 On/Off
  const [isVisitationInformationShown, setIsVisitationInformationShown] =
    useState<boolean>(false);

  // 수정 팝업 On/Off
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  // 서버에서 불러오는 교인 목록 페이지
  const [page, setPage] = useState<number>(1);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadVisitations = async () => {
    if (isLoading) return; // 로딩 중에는 추가 요청 방지
    setIsLoading(true);

    try {
      const result = await dispatch(
        fetchVisitations({
          churchId,
          currentPage: page + 1,
          instructorId: isMy ? user.member.id : undefined,
        })
      );
      if (fetchVisitations.fulfilled.match(result)) {
        const newVisitations: Visitation[] = result.payload;
        if (newVisitations.length > 0) {
          // 기존 데이터와 합치면서 중복 제거
          const existingIds = new Set(
            visitations.map((visitation) => visitation.id)
          );
          const filteredNewVisitations = newVisitations.filter(
            (visitation) => !existingIds.has(visitation.id)
          );
          dispatch(setVisitations([...visitations, ...filteredNewVisitations]));
          setPage((prev) => prev + 1); // 다음 페이지로 이동
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 정보가 변경될 때, 교인들을 다시 불러오는 부분
  useEffect(() => {
    const fetchInitialVisitations = async () => {
      try {
        const result = await dispatch(
          fetchVisitations({
            churchId,
            currentPage: 1,
            instructorId: isMy ? user.member.id : undefined,
          })
        );
        if (fetchVisitations.fulfilled.match(result)) {
          dispatch(setVisitations(result.payload));
          setPage(1);
        }
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };

    fetchInitialVisitations();
  }, [
    churchId,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
    isMy,
  ]);

  const onClickEditDone = async () => {
    try {
      const newMemberIds = targetVisitation.visitationDetails.map((detail) => {
        return detail.memberId;
      });

      const addMemberIds = newMemberIds.filter(
        (id) => !prevMemberIds.includes(id)
      );
      const deleteMemberIds = prevMemberIds.filter(
        (id) => !newMemberIds.includes(id)
      );

      // 1. 메인 심방 정보 수정
      await visitationsApi.editVisitation(
        { churchId, visitationId: targetVisitation.id },
        {
          visitationStatus: targetVisitation.visitationStatus || undefined,
          visitationMethod: targetVisitation.visitationMethod || undefined,
          instructorId: targetVisitation.instructorId || undefined,
          visitationStartDate: targetVisitation.visitationStartDate,
          visitationEndDate: targetVisitation.visitationEndDate,
          visitationTitle: targetVisitation.visitationTitle || undefined,
          addMemberIds: addMemberIds.length !== 0 ? addMemberIds : undefined,
          deleteMemberIds:
            deleteMemberIds.length !== 0 ? deleteMemberIds : undefined,
        }
      );

      if (targetVisitation?.receiverIds) {
        const addReceiverIds = targetVisitation.receiverIds?.filter(
          (id) => !prevReceiverIds.includes(id)
        );
        const deleteReceiverIds = prevReceiverIds.filter(
          (id) => !targetVisitation.receiverIds?.includes(id)
        );

        if (addReceiverIds.length > 0) {
          await visitationsApi.addReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: addReceiverIds }
          );
        }
        if (deleteReceiverIds.length > 0) {
          await visitationsApi.deleteReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: deleteReceiverIds }
          );
        }
      }

      // 2. 심방 상세 정보 수정
      await visitationsApi
        .getVisitation({ churchId, visitationId: targetVisitation.id })
        .then(async (response) => {
          const newVisitation: Visitation = response.data;

          // 2-1. id 할당
          const newVisitationDetails = targetVisitation.visitationDetails.map(
            (visitation): VisitationDetail => {
              const matchedDetail = newVisitation.visitationDetails.find(
                (detail) => detail.memberId === visitation.memberId
              );

              return {
                ...visitation,
                id: matchedDetail?.id,
              };
            }
          );

          // 2-2 업데이트
          for (const detail of newVisitationDetails) {
            await visitationsApi.editVisitationDetails(
              {
                churchId,
                visitationId: targetVisitation.id,
                detailId: detail.id as string,
              },
              {
                visitationContent: detail.visitationContent,
                visitationPray: detail.visitationPray,
              }
            );
          }
        });

      // 2. 심방 상세 정보 수정
      await visitationsApi
        .getVisitation({ churchId, visitationId: targetVisitation.id })
        .then(async (response) => {
          const newVisitation: Visitation = response.data;

          const newVisitations = visitations.map((v) => {
            return v.id !== newVisitation.id ? v : newVisitation;
          });

          dispatch(setVisitations(newVisitations));
          dispatch(setTargetVisitation(newVisitation));

          setIsEditShown(false);
          setTimeout(() => {
            setIsVisitationInformationShown(true);
          }, 500);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickVisitationItem = async (visitationId: string) => {
    try {
      const response = await visitationsApi.getVisitation({
        churchId,
        visitationId,
      });
      const visitation = response.data;

      dispatch(setTargetVisitation(visitation));
      setIsVisitationInformationShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 상세 페이지 종료
  const onClickClose = () => {
    setIsVisitationInformationShown(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  // 교인 삭제하기
  const onClickDelete = async () => {
    try {
      const response = await visitationsApi.deleteVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });
      if (response.status === 200) {
        // 초기화 후 다시 로드
        setPage(1);
        const result = await dispatch(
          fetchVisitations({
            churchId,
            currentPage: 1,
            instructorId: isMy ? user.member.id : undefined,
          })
        );
        if (fetchVisitations.fulfilled.match(result)) {
          dispatch(setVisitations(result.payload));
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
      setIsVisitationInformationShown(false);
    }
  };

  // 수정 페이지 종료
  const onClickEditClose = () => {
    setIsEditShown(false);
    setTimeout(() => {
      setIsVisitationInformationShown(true);
    }, 500);
  };

  // 수정 페이지 열기
  const onClickEditOpen = () => {
    setIsVisitationInformationShown(false);
    setTimeout(() => {
      setIsEditShown(true);
    }, 500);
  };

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetVisitation]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetVisitation.visitationTitle)) {
      setIsSaveEnabled(false);
      return;
    }
    if (targetVisitation.members.length === 0) {
      setIsSaveEnabled(false);
      return;
    }
    if (targetVisitation.instructorId === BLANK) {
      setIsSaveEnabled(false);
      return;
    }
    if (
      !targetVisitation.visitationStartDate ||
      !targetVisitation.visitationEndDate
    ) {
      setIsSaveEnabled(false);
      return;
    }

    setIsSaveEnabled(true);
  }, [targetVisitation]);

  const props = {
    list: {
      onClickVisitationItem,
      loadVisitations,
    },
    information: {
      isSaveEnabled,
      isVisitationInformationShown,
      isEditShown,
      isLoading,
      isPopupShown,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onClickEditDone,
      onClickEditOpen,
      onClickEditClose,
    },
  };

  return (
    <>
      <VisitationListView {...props} />
    </>
  );
};

export default VisitationList;
