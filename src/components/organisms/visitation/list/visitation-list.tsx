import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  fetchVisitations,
  setVisitationPage,
  setVisitations,
} from '@/redux/reducers/filter/visitation-filter-reducer';

import VisitationListView from '@/components/organisms/visitation/list/visitation-list.view';
import { DEFAULT_VISITATION } from '@/models/visitation/visitation';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import { useScopedI18n } from '../../../../../locales/client';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK, HEADER_BAR } from '@/constants/constant';
import { getDateFromDateString, getFullStringFromDate } from '@/utils/date';
import { TASK_STATUS } from '@/constants/status/status';

type VisitationListProps = {
  headerType?: HEADER_BAR;
};

const VisitationList = ({ headerType }: VisitationListProps) => {
  const visitationApi = new VisitationsApi(false);
  const dispatch = useDispatch<AppDispatch>();
  const churchId: string = useSelector(
    (state: RootState) => state.church.churchId
  );
  const {
    visitations,
    visitationPage,
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
  } = useSelector((state: RootState) => state.visitationFilter);
  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );

  const t_popup = useScopedI18n('popup');

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 교인 상세정보 팝업 On/Off
  const [isVisitationInformationShown, setIsVisitationInformationShown] =
    useState<boolean>(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 삭제 확인 팝업
  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  // 개인정보 수정 모달
  const [isEditShown, setIsEditShown] = useState<boolean>(false);

  const onClickConfirmOpen = () => {
    setIsPopupShown(true);
  };

  const onClickConfirmClose = () => {
    setIsPopupShown(false);
  };

  // 무한 스크롤로 데이터 추가 로드
  const loadVisitations = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await dispatch(setVisitationPage(visitationPage + 1));
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
        await dispatch(setVisitationPage(1));
        await dispatch(fetchVisitations({ headerType }));
      } catch (error) {
        setThrownError(
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    fetchInitialVisitations();
  }, [
    visitationFilter,
    visitationOrderBy,
    visitationOrderDirection,
    headerType,
  ]);

  // 목록에서 교인을 선택하여 상세 페이지로 이동
  const onClickVisitationItem = async (visitationId: string) => {
    try {
      const response = await visitationApi.getVisitation({
        churchId,
        visitationId,
      });
      const visitation = response.data.data;

      dispatch(setTargetVisitation(visitation));
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

  // 업무 삭제하기
  const onClickDelete = async () => {
    try {
      await visitationApi.deleteVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });

      // 초기화 후 다시 로드
      dispatch(setVisitationPage(1));
      // 삭제 후 재로딩
      await dispatch(fetchVisitations({ headerType }));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
      setIsVisitationInformationShown(false);
    }
  };

  const onClickEditOpen = () => {
    dispatch(setTargetVisitation(targetVisitation));
    setIsEditShown(true);
  };

  const onClickEditClose = async () => {
    const visitationApi = new VisitationsApi(false);
    setIsEditShown(false);
    const response = await visitationApi.getVisitation({
      churchId,
      visitationId: targetVisitation.id,
    });
    const newVisitation = response.data.data;
    dispatch(setTargetVisitation(newVisitation));
  };

  const onClickEditDone = async () => {
    try {
      await visitationApi.editVisitation(
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

      await visitationApi.editVisitationDetails(
        { churchId, visitationId: targetVisitation.id },
        {
          visitationContent:
            targetVisitation.visitationDetails[0].visitationContent,
          visitationPray: targetVisitation.visitationDetails[0].visitationPray,
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
            (receiverId) => !targetVisitation.receiverIds?.includes(receiverId)
          ) || [];

        if (addReceiverIds?.length > 0) {
          await visitationApi.addReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: addReceiverIds }
          );
        }

        if (deleteReceiverIds?.length > 0) {
          await visitationApi.deleteReceivers(
            { churchId, visitationId: targetVisitation.id },
            { receiverIds: deleteReceiverIds }
          );
        }
      }

      const response = await visitationApi.getVisitation({
        churchId,
        visitationId: targetVisitation.id,
      });

      const newVisitation = response.data.data;
      dispatch(setTargetVisitation(newVisitation));
      dispatch(fetchVisitations({ headerType }));
      setIsEditShown(false);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      dispatch(setIsToastShown(true));
      dispatch(setToastText(t_popup('saveComplete')));
    }
  };

  // ===== status =====

  const onChangeStatus = (status: TASK_STATUS) => {
    try {
      visitationApi
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

          dispatch(setVisitations(newVisitations));
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };
  // ===== status =====

  useEffect(() => {
    setIsPopupShown(false);
  }, [targetVisitation]);

  useEffect(() => {
    dispatch(fetchVisitations({ headerType }));
  }, [visitationPage]);

  useEffect(() => {
    if (!getIsWellFormedTitle(targetVisitation.title)) {
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
    list: {
      visitations,
      onClickVisitationItem,
      loadVisitations,
    },
    information: {
      isSaveEnabled,
      isVisitationInformationShown,
      isLoading,
      isPopupShown,
      isEditShown,
      onClickEditOpen,
      onClickEditClose,
      onClickEditDone,
      onClickClose,
      onClickDelete,
      onClickConfirmOpen,
      onClickConfirmClose,
      onChangeStatus,
    },
  };

  return (
    <>
      <VisitationListView {...props} />
    </>
  );
};

export default VisitationList;
