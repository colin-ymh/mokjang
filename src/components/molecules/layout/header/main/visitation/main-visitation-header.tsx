import MainVisitationHeaderView from '@/components/molecules/layout/header/main/visitation/main-visitation-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { setTargetVisitation } from '@/redux/reducers/target/target-visitation-reducer';
import { DEFAULT_VISITATION } from '@/models/visitation/visitation';
import { setVisitations } from '@/redux/reducers/filter/visitation-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';
import {
  setIsToastShown,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

type MainVisitationHeaderProps = {};

const MainVisitationHeader = ({}: MainVisitationHeaderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = usePageRouter();
  const { visitations } = useSelector(
    (state: RootState) => state.visitationFilter
  );

  const { targetVisitation } = useSelector(
    (state: RootState) => state.targetVisitation
  );
  const churchId = useSelector((state: RootState) => state.church.churchId);

  const visitationsApi = new VisitationsApi(false);

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isAddVisitationOpened, setIsAddVisitationOpened] =
    useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`/main/visitation/${id}`);
  };

  const onClickAddVisitation = () => {
    setIsAddVisitationOpened(true);
    dispatch(setTargetVisitation({ ...DEFAULT_VISITATION, id: 'TEMP' }));
  };

  const onClickCloseModal = () => {
    setIsAddVisitationOpened(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  const onClickSaveVisitation = async () => {
    try {
      await visitationsApi
        .createVisitation(
          { churchId },
          {
            status: targetVisitation.status,
            visitationMethod: targetVisitation.visitationMethod,
            inChargeId: targetVisitation.inChargeId,
            startDate: targetVisitation.startDate,
            endDate: targetVisitation.endDate,
            visitationDetails: targetVisitation.visitationDetails.map(
              (detail) => {
                return {
                  visitationContent: detail.visitationContent,
                  visitationPray: detail.visitationPray,
                  memberId: detail.memberId,
                };
              }
            ),
            title: targetVisitation.title,
            receiverIds: targetVisitation.receiverIds,
          }
        )
        .then((response) => {
          const newVisitation = response.data.data;

          const newVisitations = [...visitations, newVisitation];
          dispatch(setVisitations(newVisitations));
        });
      setIsAddVisitationOpened(false);
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
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
    isSaveEnabled,
    isAddVisitationOpened,
    onClickHeaderBar,
    onClickAddVisitation,
    onClickCloseModal,
    onClickSaveVisitation,
  };

  return (
    <>
      <MainVisitationHeaderView {...props} />
    </>
  );
};
export default MainVisitationHeader;
