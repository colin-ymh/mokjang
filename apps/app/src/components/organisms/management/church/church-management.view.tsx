import React, { Dispatch, SetStateAction } from 'react';
import { Church } from '@mokjang/models';
import ChurchInformation from '../../../molecules/management/church/church-information';
import styled from 'styled-components';
import { Button, CustomPopup, MainText, SvgIcon } from '@mokjang/components';
import { GRAY, MAIN, SIZE, WHITE } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import EditChurchInformation from '../../../molecules/management/church/edit-church-information';
import { Svg } from '@mokjang/assets';
import ChurchState from '../../../molecules/management/church/church-state';

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
  const t_button = useScopedI18n('button');
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
              icon={<SvgIcon svg={Svg.Pencil} color={WHITE} width={2} />}
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
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
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
