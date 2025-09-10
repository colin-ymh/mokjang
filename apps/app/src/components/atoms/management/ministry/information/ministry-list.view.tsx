import styled from 'styled-components';
import { GRAY, WHITE } from '@mokjang/constants';
import { Button, CustomPopup, MainText } from '@mokjang/components';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import { Ministry } from '@mokjang/models';
import MinistryCountTag from '../../../common/tag/ministry-count-tag';
import React, { ChangeEvent } from 'react';
import { Svg } from '@mokjang/assets';
import EditMinistry from '../edit/edit-ministry';

const MinistryListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
  padding: 20px;
  gap: 20px;
  background-color: ${WHITE};
  min-height: 90px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PlusIcon = styled(Svg.Plus)`
  width: 18px;
  height: 18px;
  stroke: ${GRAY.SEMI_DARK};
  stroke-width: 2px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

type MinistryListViewProps = {
  ministries: Ministry[];
  fetchMinistries: () => void;
  isAddShown: boolean;
  isEditShown: boolean;
  editName: string;
  onClickAddModalOpen: () => void;
  onClickAddModalClose: () => void;
  onClickSaveNewMinistry: () => void;
  onChangeEditMinistryName: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickMinistryItem: (item: Ministry) => void;
  onClickEditModalClose: () => void;
  onClickSaveEditMinistry: () => void;
  selectedMinistry: Ministry;
};

const MinistryListView = ({
  ministries,
  fetchMinistries,
  isAddShown,
  isEditShown,
  editName,
  onClickAddModalOpen,
  onClickAddModalClose,
  onClickSaveNewMinistry,
  onChangeEditMinistryName,
  onClickMinistryItem,
  onClickEditModalClose,
  onClickSaveEditMinistry,
  selectedMinistry,
}: MinistryListViewProps) => {
  const t = useI18n();
  const t_button = useScopedI18n('button');

  return (
    <>
      <MinistryListViewContainer>
        <HeaderContainer>
          <MainText fontSize={18} fontWeight={600}>
            {t('ministry')}
          </MainText>
          <Button
            text={t('button.add')}
            onClick={onClickAddModalOpen}
            color={GRAY.SEMI_DARK}
            width={'auto'}
            height={30}
            icon={<PlusIcon />}
            backgroundColor={GRAY.EXTRA_LIGHT}
          />
        </HeaderContainer>
        <ListContainer>
          {ministries
            .sort((a, b) => parseInt(a.id) - parseInt(b.id))
            .map((ministry) => (
              <MinistryCountTag
                key={ministry.id}
                ministry={ministry}
                onClick={() => onClickMinistryItem(ministry)}
              />
            ))}
        </ListContainer>
      </MinistryListViewContainer>

      {/* 사역 추가 */}
      <CustomPopup
        isShow={isAddShown}
        width={450}
        height={350}
        onClickClose={onClickAddModalClose}
        onClickCancel={onClickAddModalClose}
        onClickDone={onClickSaveNewMinistry}
        headerTitle={t('title.addMinistry')}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <EditMinistry
          editName={editName}
          ministries={ministries}
          onChangeEditMinistryName={onChangeEditMinistryName}
        />
      </CustomPopup>

      {/* 사역 수정 */}
      <CustomPopup
        isShow={isEditShown}
        width={450}
        height={500}
        onClickClose={onClickEditModalClose}
        onClickCancel={onClickEditModalClose}
        onClickDone={onClickSaveEditMinistry}
        headerTitle={t('title.editMinistry')}
        cancelText={t_button('cancel')}
        doneText={t_button('save')}
      >
        <EditMinistry
          editName={editName}
          ministries={ministries}
          onChangeEditMinistryName={onChangeEditMinistryName}
          selectedMinistry={selectedMinistry}
          fetchMinistries={fetchMinistries}
          onClickClose={onClickEditModalClose}
        />
      </CustomPopup>
    </>
  );
};

export default MinistryListView;
