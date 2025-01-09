import { ChangeEvent, Dispatch, ForwardedRef, SetStateAction } from 'react';
import styled from 'styled-components';

import OfficerList from '@/components/molecules/setting/officer/officer-list';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import AddOfficer from '@/components/atoms/setting/officer/add-officer';
import { Officer } from '@/models/setting/setting';

import { useI18n } from '../../../../../locales/client';
import Plus from '../../../../../public/svg/plus.svg';

const OfficerSettingContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const OfficerListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  border-right: 1px solid ${GRAY.LIGHT};
  width: 250px;
  flex-shrink: 0;
`;

const ListHeader = styled.div`
  display: flex;
  position: relative;
`;

const PlusButton = styled(Plus)`
  stroke: ${GRAY.DARK};
  stroke-width: 2px;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 0;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const OfficerInformationContainer = styled.div<{ $isOfficer: boolean }>`
  display: ${({ $isOfficer }) => ($isOfficer ? 'flex' : 'none')};
  flex-direction: column;
  width: 100%;
`;

const OfficerInformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid ${GRAY.LIGHT};
  gap: 10px;
  padding: 20px 20px 0 20px;
`;

type OfficerSettingViewProps = {
  officers: Officer[];
  fetchOfficers: () => void;
  selectedOfficer: Officer;
  setSelectedOfficer: Dispatch<SetStateAction<Officer>>;
  isAddModalShown: boolean;
  nameInputRef: ForwardedRef<HTMLInputElement>;
  newOfficerName: string;
  onClickModalOpen: () => void;
  onChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickSaveOfficer: () => void;
};

const OfficerSettingView = ({
  officers,
  fetchOfficers,
  selectedOfficer,
  setSelectedOfficer,
  isAddModalShown,
  nameInputRef,
  newOfficerName,
  onClickModalOpen,
  onChangeName,
  onClickSaveOfficer,
}: OfficerSettingViewProps) => {
  const t = useI18n();
  return (
    <OfficerSettingContainer>
      {/* 직분 목록 */}
      <OfficerListContainer>
        {/* 헤더 */}
        <ListHeader>
          <MainText size={SIZE.LARGE} fontWeight={600}>
            {t('officerList')}
          </MainText>
          {/* 추가 버튼 */}
          <PlusButton onClick={onClickModalOpen} />
        </ListHeader>
        {/* 추가창 */}
        <AddOfficer
          ref={nameInputRef}
          isShown={isAddModalShown}
          name={newOfficerName}
          onChangeName={onChangeName}
          onClickSaveOfficer={onClickSaveOfficer}
        />
        {/* 직분 목록 */}
        <OfficerList
          officers={officers}
          fetchOfficers={fetchOfficers}
          selectedOfficerId={selectedOfficer.id}
          setSelectedOfficer={setSelectedOfficer}
        />
      </OfficerListContainer>
      {/* 직분 정보 */}
      <OfficerInformationContainer $isOfficer={!!selectedOfficer.id}>
        {/* 헤더 */}
        <OfficerInformationHeader></OfficerInformationHeader>
        {/* 컨텐츠 */}
      </OfficerInformationContainer>
    </OfficerSettingContainer>
  );
};

export default OfficerSettingView;
