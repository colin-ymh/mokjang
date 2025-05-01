import MainVisitationHeaderView from '@/components/molecules/layout/header/main/main-visitation-header.view';
import { usePageRouter } from '@/utils/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { setTargetVisitation } from '@/redux/reducers/target-visitation';
import { DEFAULT_VISITATION } from '@/models/visitation/visitation';
import { setVisitations } from '@/redux/reducers/visitation-filter-reducer';

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

  const [isAddVisitationOpened, setIsAddVisitationOpened] =
    useState<boolean>(false);

  // 헤더 탭바 이벤트
  const onClickHeaderBar = (id: string) => {
    router.push(`admin/main/visitation/${id}`);
  };

  const onClickAddVisitation = () => {
    setIsAddVisitationOpened(true);
  };

  const onClickCloseModal = () => {
    setIsAddVisitationOpened(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  const onClickSaveVisitation = () => {
    visitationsApi
      .createVisitation(
        { churchId },
        {
          isTest: false,
          visitationStatus: targetVisitation.visitationStatus,
          visitationMethod: targetVisitation.visitationMethod,
          instructorId: targetVisitation.instructorId,
          visitationDate: '2025-11-20',
          visitationDetails: targetVisitation.visitationDetails,
          visitationTitle: targetVisitation.visitationTitle,
          receiverIds: targetVisitation.receiverIds,
        }
      )
      .then((response) => {
        const newVisitation = response.data;

        const newVisitations = [...visitations, newVisitation];
        dispatch(setVisitations(newVisitations));
        dispatch(setTargetVisitation(newVisitation));
      });
    setIsAddVisitationOpened(false);
    dispatch(setTargetVisitation(DEFAULT_VISITATION));
  };

  const props = {
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
