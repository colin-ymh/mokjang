import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetMinistryHistory } from '@/redux/reducers/target/target-history-reducer';
import { getDateStringFromDate } from '@/utils/date';
import EditMemberMinistryView from '@/components/molecules/member/information/personal/edit-member-ministry.view';
import { getMinistryGroup } from '@/utils/ministry';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import {
  DEFAULT_MINISTRY,
  Ministry,
  MinistryGroup,
} from '@/models/management/management';
import { BLANK, MINISTRY_GROUP_ROLE } from '@/constants/constant';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';
import { useI18n } from '../../../../../../locales/client';

type EditMemberMinistryProps = {
  onClickDeleteMinistry: (ministryGroupId: string) => void;
};

const EditMemberMinistry = ({
  onClickDeleteMinistry,
}: EditMemberMinistryProps) => {
  const t = useI18n();

  const dispatch = useDispatch<AppDispatch>();

  const ministriesApi = new MinistriesApi(false);

  const { targetMinistryHistory } = useSelector(
    (state: RootState) => state.targetHistory
  );

  const { ministryGroups, churchId } = useSelector(
    (state: RootState) => state.church
  );

  const [isMinistryOpen, setIsMinistryOpen] = useState<boolean>(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [dropdownItems, setDropdownItems] = useState<DropdownValueType[]>([]);

  const onClickMinistryOpen = () => setIsMinistryOpen(true);
  const onClickMinistryClose = () => setIsMinistryOpen(false);

  const NONE_ITEM = {
    value: BLANK,
    title: t('none'),
  };

  const onChangeMinistryGroup = async (ministryGroupId: string | null) => {
    const newMinistryGroup: MinistryGroup = getMinistryGroup(
      ministryGroupId,
      ministryGroups
    );

    dispatch(
      setTargetMinistryHistory({
        ...targetMinistryHistory,
        ministryGroup: newMinistryGroup,
        ministryGroupSnapShot: newMinistryGroup.name,
        ministryGroupDetailHistory: [
          {
            id: BLANK,
            ministry: { ...DEFAULT_MINISTRY, id: BLANK },
            startDate: '',
            role: MINISTRY_GROUP_ROLE.NONE,
          },
        ],
      })
    );
  };

  const onChangeMinistry = async (ministryId: string) => {
    dispatch(
      setTargetMinistryHistory({
        ...targetMinistryHistory,
        ministryGroupDetailHistory: [
          {
            id: BLANK,
            ministry: { ...DEFAULT_MINISTRY, id: ministryId },
            startDate: '',
            role: MINISTRY_GROUP_ROLE.NONE,
          },
        ],
      })
    );
  };

  const onChangeStartDate = (date: Date | null) => {
    if (date) {
      dispatch(
        setTargetMinistryHistory({
          ...targetMinistryHistory,
          startDate: getDateStringFromDate(date),
        })
      );
    }
  };

  const fetchMinistries = async () => {
    try {
      if (!targetMinistryHistory.ministryGroup.id) return;
      const response = await ministriesApi.getMinistries({
        churchId,
        ministryGroupId: targetMinistryHistory.ministryGroup.id,
      });
      const newMinistries: Ministry[] = response.data.data;

      const newDropdownItems = [NONE_ITEM];

      newMinistries?.forEach((ministry) => {
        newDropdownItems.push({
          value: ministry.id,
          title: ministry.name,
        } as DropdownValueType);
      });

      setDropdownItems(newDropdownItems);
    } catch (error) {
      setThrownError(new Error(String(error)));
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, [targetMinistryHistory.ministryGroup.id]);

  const props = {
    isMinistryOpen,
    dropdownItems,
    onClickMinistryOpen,
    onClickMinistryClose,
    onClickDeleteMinistry,
    onChangeMinistryGroup,
    onChangeMinistry,
    onChangeStartDate,
  };

  return (
    <>
      <EditMemberMinistryView {...props} />
    </>
  );
};

export default EditMemberMinistry;
