import React, { Dispatch, SetStateAction } from 'react';
import { Church } from '@/models/church/church';
import ChurchInformation from '@/components/molecules/management/church/church-information';
import styled from 'styled-components';
import Button from '@/components/atoms/common/button/button';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { useI18n } from '../../../../../locales/client';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import EditChurchInformation from '@/components/molecules/management/church/edit-church-information';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import Pencil from '../../../../../public/svg/pencil.svg';
import ChurchState from '@/components/molecules/management/church/church-state';
import SvgIcon from '@/components/atoms/common/icon/svg-icon';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const CardContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  width: 900px;
  background-color: ${WHITE};
  border-radius: 10px;
  box-shadow: 0px 1px 2px 0px #0000000d;
  border: 1px solid ${GRAY.SUPER_LIGHT};
  padding: 25px;
  gap: 30px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

type ChurchManagementViewProps = {
  targetChurch: Church;
  setTargetChurch: Dispatch<SetStateAction<Church>>;
  isEditShown: boolean;
  onClickEditOpen: () => void;
  onClickEditClose: () => void;
  onClickEditSave: () => void;
};

const ChurchManagementView = ({
  targetChurch,
  setTargetChurch,
  isEditShown,
  onClickEditOpen,
  onClickEditClose,
  onClickEditSave,
}: ChurchManagementViewProps) => {
  const t = useI18n();
  return (
    <>
      <InformationContainer>
        {/* 교회 정보 */}
        <CardContainer>
          <HeaderContainer>
            <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
              {t('title.churchInformation')}
            </MainText>
            <Button
              width={'auto'}
              height={30}
              onClick={onClickEditOpen}
              backgroundColor={MAIN.DEFAULT}
              icon={<SvgIcon svg={Pencil} color={WHITE} width={2} />}
              color={WHITE}
              text={t('button.editChurch')}
            />
          </HeaderContainer>
          <ChurchInformation />
        </CardContainer>
        {/* 교회 현황 */}
        <CardContainer>
          <HeaderContainer>
            <MainText size={SIZE.EXTRA_LARGE} fontSize={22}>
              {t('title.churchState')}
            </MainText>
          </HeaderContainer>
          <ChurchState />
        </CardContainer>
      </InformationContainer>

      <CustomPopup
        isShow={isEditShown}
        onClickCancel={onClickEditClose}
        onClickDone={onClickEditSave}
        width={500}
        height={700}
        headerTitle={t('title.editChurch')}
      >
        <EditChurchInformation
          targetChurch={targetChurch}
          setTargetChurch={setTargetChurch}
        />
      </CustomPopup>
    </>
  );
};

export default ChurchManagementView;
