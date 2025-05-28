import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { SIZE } from '@/constants/styles/style';
import { useMainTaskHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';
import AddTask from '@/components/organisms/task/add/add-task';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import SlidePopup from '@/components/atoms/common/popup/slide-popup';
import Button from '@/components/atoms/common/button/button';
import { MAIN_HEADER_ID } from '@/constants/layout/header';

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
    border-bottom: 0.7px solid ${GRAY.SEMI_LIGHT};
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

type MainTaskHeaderViewProps = {
  isSaveEnabled: boolean;
  isAddTaskOpened: boolean;
  onClickHeaderBar: (id: string) => void;
  onClickAddTask: () => void;
  onClickCloseModal: () => void;
  onClickSaveTask: () => void;
};

const MainTaskHeaderView = ({
  isSaveEnabled,
  isAddTaskOpened,
  onClickHeaderBar,
  onClickAddTask,
  onClickCloseModal,
  onClickSaveTask,
}: MainTaskHeaderViewProps) => {
  const slug = useParams().slug as string[];
  const contentId = slug[2];

  const t_header = useScopedI18n('header');
  const t_title = useScopedI18n('title');
  const t_button = useScopedI18n('button');
  const headerBarItems = useMainTaskHeaderBarItems();

  return (
    <HeaderContainer>
      <HeaderTopContainer>
        <MainText size={SIZE.EXTRA_LARGE}>
          {t_header(MAIN_HEADER_ID.TASK)}
        </MainText>
        <Button
          text={t_button('addTask')}
          onClick={onClickAddTask}
          width={100}
          height={30}
        />
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBar
          value={contentId}
          items={headerBarItems}
          onClick={onClickHeaderBar}
        />
      </HeaderBottomContainer>
      {/* 심방 추가 팝업*/}
      <SlidePopup
        headerTitle={t_title('addTask')}
        isShow={isAddTaskOpened}
        onClickClose={onClickCloseModal}
        onClickDone={onClickSaveTask}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
      >
        <AddTask />
      </SlidePopup>
    </HeaderContainer>
  );
};

export default MainTaskHeaderView;
