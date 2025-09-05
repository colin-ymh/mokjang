import React from 'react';
import styled from 'styled-components';
import { useParams } from 'next/navigation';

import { GRAY, MAIN, MEDIA_MIN_WIDTH, SIZE, WHITE } from '@mokjang/constants';
import { Button, MainText, SvgIcon } from '@mokjang/components';
import HeaderBar from '../../../../../atoms/layout/header/header-bar';
import { useMainTaskHeaderBarItems } from '@/hooks/layout/header-bar-items';

import { useScopedI18n } from '../../../../../../../locales/client';
import AddTask from '../../../../../organisms/task/add/add-task';
import { MAIN_HEADER_ID } from '@/constants/layout/header';

import { Svg } from '@mokjang/assets';
import ScrollSlidePopup from '@/components/atoms/common/popup/scroll-slide-popup';

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

type MainTaskHeaderViewProps = {
  isAddTaskOpened: boolean;
  isSaveEnabled: boolean;
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
    <>
      <HeaderContainer>
        <HeaderTopContainer>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={24}>
            {t_header(MAIN_HEADER_ID.TASK)}
          </MainText>
          <Button
            text={t_button('addTask')}
            onClick={onClickAddTask}
            width={'auto'}
            fontWeight={500}
            fontSize={16}
            height={35}
            icon={<SvgIcon svg={Svg.Plus} color={WHITE} width={2} size={20} />}
          />
        </HeaderTopContainer>
        <HeaderBottomContainer>
          <HeaderBar
            value={contentId}
            items={headerBarItems}
            onClick={onClickHeaderBar}
          />
        </HeaderBottomContainer>
      </HeaderContainer>

      {/* 심방 추가 팝업*/}
      <ScrollSlidePopup
        isShow={isAddTaskOpened}
        onClickClose={onClickCloseModal}
        onClickCancel={onClickCloseModal}
        onClickDone={onClickSaveTask}
        headerTitle={t_title('addTask')}
        doneBackgroundColor={isSaveEnabled ? MAIN.DEFAULT : MAIN.LIGHT}
        doneDisabled={!isSaveEnabled}
        isAnimation={false}
      >
        <AddTask />
      </ScrollSlidePopup>
    </>
  );
};

export default MainTaskHeaderView;
