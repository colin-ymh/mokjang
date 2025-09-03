import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { SIZE } from '@mokjang/constants';

import { useScopedI18n } from '../../../../../../../locales/client';

import { MEDIA_MIN_WIDTH } from '@mokjang/constants';
import { Button } from '@mokjang/components';
import { MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import SlidePopup from '../../../../../atoms/common/popup/slide-popup';
import AddPermissionTemplate from '../../../../../organisms/permission/add/add-permission-template';

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    height: 40px;
    padding: 0 20px;
    justify-content: center;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    height: 120px;
    justify-content: space-between;
    padding: 0;
    border-bottom: 0.7px solid ${GRAY.LIGHT};
  }
`;

const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0 20px;
`;

const HeaderBottomContainer = styled.div`
  display: none;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
`;

type ManagementPermissionHeaderViewProps = {
  isSaveEnabled: boolean;
  isAddPermissionTemplateOpened: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddPermissionTemplate: () => void;
  onClickCloseModal: () => void;
  onClickSavePermissionTemplate: () => void;
};

const ManagementPermissionHeaderView = ({
  isSaveEnabled,
  isAddPermissionTemplateOpened,
  onClickHeaderBar,
  onClickAddPermissionTemplate,
  onClickCloseModal,
  onClickSavePermissionTemplate,
}: ManagementPermissionHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
          {t_header(MANAGEMENT_HEADER_ID.PERMISSION)}
        </MainText>
        <Button
          text={t_button('addPermissionTemplate')}
          onClick={onClickAddPermissionTemplate}
          width={140}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer></HeaderBottomContainer>
      {/* 심방 추가 팝업*/}
      <SlidePopup
        headerTitle={t_title('addPermissionTemplate')}
        isShow={isAddPermissionTemplateOpened}
        onClickClose={onClickCloseModal}
        onClickDone={onClickSavePermissionTemplate}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddPermissionTemplate />
      </SlidePopup>
    </HeaderContainer>
  );
};

export default ManagementPermissionHeaderView;
