import MainVisitationHeaderView from '@/components/molecules/layout/header/main/visitation/main-visitation-header.view';
import { usePageRouter } from '@/utils/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { setTargetVisitation } from '@/redux/reducers/target-visitation';
import { DEFAULT_VISITATION } from '@/models/visitation/visitation';
import { setVisitations } from '@/redux/reducers/visitation-filter-reducer';
import { getIsWellFormedTitle } from '@/utils/check';
import { BLANK } from '@/constants/constant';

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
    router.push(`admin/main/visitation/${id}`);
  };

  const onClickAddVisitation = () => {
    setIsAddVisitationOpened(true);
    dispatch(setTargetVisitation({ ...DEFAULT_VISITATION, id: 'TEMP' }));
  };

  const onClickCloseModal = () => {
    setIsAddVisitationOpened(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  const onClickSaveVisitation = () => {
    try {
      visitationsApi
        .createVisitation(
          { churchId },
          {
            visitationStatus: targetVisitation.visitationStatus,
            visitationMethod: targetVisitation.visitationMethod,
            instructorId: targetVisitation.instructorId,
            visitationStartDate: targetVisitation.visitationStartDate,
            visitationEndDate: targetVisitation.visitationEndDate,
            visitationDetails: targetVisitation.visitationDetails.map(
              (detail) => {
                return {
                  visitationContent: detail.visitationContent,
                  visitationPray: detail.visitationPray,
                  memberId: detail.memberId,
                };
              }
            ),
            visitationTitle: targetVisitation.visitationTitle,
            receiverIds: targetVisitation.receiverIds,
          }
        )
        .then((response) => {
          const newVisitation = response.data;

          const newVisitations = [...visitations, newVisitation];
          dispatch(setVisitations(newVisitations));
        });
      setIsAddVisitationOpened(false);
      dispatch(setTargetVisitation(DEFAULT_VISITATION));
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

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
