import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import BorderInput from '@/components/atoms/common/input/border-input';
import { BLACK, DESTRUCTIVE, GRAY, WHITE } from '@/constants/styles/color';
import Button from '@/components/atoms/common/button/button';
import OfficerList from '@/components/molecules/management/officer/list/officer-list';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { Officer } from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import { getIsWellFormedTitle } from '@/utils/check';
import { fetchOfficers } from '@/redux/reducers/church-reducer';
import { getFormattedTitle } from '@/utils/format';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { OfficersApi } from '@/api/management/officer/officers.api';

const OfficerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 300px;
  flex-shrink: 0;
  background-color: ${WHITE};
`;

const AddContainer = styled.div`
  display: flex;
  gap: 5px;
`;

type OfficerSideBarProps = {
  selectedOfficer: Officer;
  onClickOfficer: (id: string) => void;
};

const OfficerSideBar = ({
  selectedOfficer,
  onClickOfficer,
}: OfficerSideBarProps) => {
  const t = useI18n();
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();
  const officersApi = new OfficersApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);
  // 새로 추가할 그룹명
  const [newOfficerName, setNewOfficerName] = useState<string>(BLANK);

  const onChangeNewOfficerName = (event: ChangeEvent<HTMLInputElement>) => {
    setNewOfficerName(getFormattedTitle(event.target.value));
  };

  const onClickSaveNewOfficer = async () => {
    if (!getIsWellFormedTitle(newOfficerName)) return;

    try {
      await officersApi.createOfficer({ churchId }, { name: newOfficerName });
      await dispatch(fetchOfficers());
      setNewOfficerName(BLANK);
      setToastText(t_popup('saveComplete'));
      setIsToastShown(true);
      setToastColor(BLACK);
    } catch (error) {
      if (error instanceof Error) {
        setToastText(error.message);
        setToastColor(DESTRUCTIVE.LIGHT);
        setIsToastShown(true);
      } else {
        setThrownError(new Error(String(error)));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      if (e.key === 'Enter') {
        onClickSaveNewOfficer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newOfficerName]);

  return (
    <OfficerListContainer>
      {/* 타이틀 */}
      <MainText size={SIZE.LARGE} fontWeight={600}>
        {t('officerList')}
      </MainText>
      {/* 새 그룹 추가 창*/}
      <AddContainer>
        <BorderInput
          value={newOfficerName}
          onChange={onChangeNewOfficerName}
          borderColor={GRAY.SEMI_LIGHT}
        />
        <Button
          width={80}
          text={t('button.add')}
          onClick={onClickSaveNewOfficer}
          borderColor={GRAY.SEMI_LIGHT}
          backgroundColor={WHITE}
          color={GRAY.DARK}
        />
      </AddContainer>
      {/* 그룹 목록 */}
      <OfficerList
        selectedOfficerId={selectedOfficer.id}
        onClickOfficer={onClickOfficer}
      />
    </OfficerListContainer>
  );
};

export default OfficerSideBar;
