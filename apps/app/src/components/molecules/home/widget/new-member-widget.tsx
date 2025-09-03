'use client';

import { HomeApi } from '../../../../api/home/home.api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import {
  getInitialNewMemberSummaries,
  NewMemberSummary,
} from '../../../../models/home/widget';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../../utils/date';
import { Member } from '../../../../models/member/member';
import NewMemberWidgetView from './new-member-widget.view';
import { BLANK } from '../../../../constants/constant';
import { useI18n } from '../../../../../locales/client';

const NewMemberWidget = () => {
  const t = useI18n();
  const churchId = useSelector((state: RootState) => state.church.churchId);
  const [memberSummaries, setMemberSummaries] = useState<NewMemberSummary[]>(
    getInitialNewMemberSummaries()
  );

  const [detailTitle, setDetailTitle] = useState<string>(BLANK);
  const [memberDetails, setMemberDetails] = useState<Member[]>([]);

  const [isDetailShown, setIsDetailShown] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  if (thrownError) throw thrownError;

  const homeApi = new HomeApi(false);

  const fetchNewMemberSummary = async () => {
    try {
      const response = await homeApi.getNewMemberSummary({ churchId });
      const incomingSummaries: NewMemberSummary[] = response.data.data;

      const updatedSummaries = memberSummaries.map((prev) => {
        const found = incomingSummaries.find(
          (s) =>
            getDateStringFromDate(getDateFromDateString(s.periodStart)) ===
            getDateStringFromDate(getDateFromDateString(prev.periodStart))
        );
        return found
          ? {
              ...found,
              periodStart: getDateStringFromDate(
                getDateFromDateString(prev.periodStart)
              ),
            }
          : prev;
      });

      setMemberSummaries(updatedSummaries);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickWeek = async (summary: NewMemberSummary) => {
    if (summary.count < 1) return;

    try {
      const response = await homeApi.getNewMemberDetails({
        churchId,
        periodStart: summary.periodStart,
      });

      const newMemberDetails = response.data.data;
      setMemberDetails(newMemberDetails);
      setDetailTitle(
        `${getDateStringFromDate(getDateFromDateString(summary.periodStart))} ${t('newMember')}`
      );
      setIsDetailShown(true);
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onClickDetailClose = () => {
    setIsDetailShown(false);
    setMemberDetails([]);
    setDetailTitle(BLANK);
  };

  useEffect(() => {
    fetchNewMemberSummary();
  }, []);

  const props = {
    memberSummaries,
    detailTitle,
    memberDetails,
    isDetailShown,
    onClickWeek,
    onClickDetailClose,
  };
  return (
    <>
      <NewMemberWidgetView {...props} />
    </>
  );
};

export default NewMemberWidget;
