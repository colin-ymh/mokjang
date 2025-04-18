import React, { useState } from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useTermInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import {
  Education,
  EducationSession,
  EducationTerm,
} from '@/models/management/management';
import KebabDropdown from '@/components/atoms/common/dropdown/kebab-dropdown';
import { useScopedI18n } from '../../../../../../locales/client';
import ConfirmPopup from '@/components/atoms/common/popup/error-popup';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  gap: 30px;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
`;

export type TermInformationHeaderProps = {
  education: Education;
  term: EducationTerm;
  selectedSessionId: string;
  sessions: EducationSession[];
  onClickHeaderItem: (id: string) => void;
  onClickConfirmDelete: (id: string) => void;
};

const TermInformationHeader = ({
  education,
  term,
  selectedSessionId,
  sessions,
  onClickHeaderItem,
  onClickConfirmDelete,
}: TermInformationHeaderProps) => {
  const t_button = useScopedI18n('button');
  const t_popup = useScopedI18n('popup');
  const headerBarItems = useTermInformationHeaderBarItems(sessions);

  const [isPopupShown, setIsPopupShown] = useState<boolean>(false);

  const onClickOpen = () => {
    setIsPopupShown(true);
  };

  const onClickClose = () => {
    setIsPopupShown(false);
  };

  return (
    <InformationHeader>
      <Information>
        <TextContainer>
          <MainText
            size={SIZE.EXTRA_LARGE}
          >{`${education.name} ${term?.term}기`}</MainText>
          <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
            {term?.instructor?.name}
          </MainText>
        </TextContainer>

        <KebabDropdown
          buttonSize={30}
          top={0}
          right={-10}
          onClickDelete={onClickOpen}
        />

        <ConfirmPopup
          title={t_popup('deleteTermTitle')}
          body={t_popup('deleteTermBody')}
          buttonNum={2}
          isShow={isPopupShown}
          onClickLeftButton={onClickClose}
          onClickRightButton={() => onClickConfirmDelete(term.id)}
          leftButtonText={t_button('cancel')}
          rightButtonText={t_button('delete')}
        />
      </Information>

      <HeaderBarView
        value={selectedSessionId}
        items={headerBarItems}
        onClick={onClickHeaderItem}
      />
    </InformationHeader>
  );
};

export default TermInformationHeader;
