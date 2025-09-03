import React, { RefObject } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import {
  GRAY,
  MAIN,
  PURPLE,
  WHITE,
} from '../../../../../constants/styles/color';
import { MainText } from '../../../../atoms/common/text/main-text';
import { SIZE } from '../../../../../constants/styles/style';
import MainTag from '../../../../atoms/common/tag/main-tag';
import { useI18n } from '../../../../../../locales/client';
import Calendar from '../../../../../../public/svg/calendar.svg';
import Plus from '../../../../../../public/svg/plus.svg';
import SvgIcon from '../../../../atoms/common/icon/svg-icon';
import { getTranslatedDateFromDateString } from '../../../../../utils/translate';
import { usePathname } from 'next/navigation';
import { LOCALE } from '../../../../../constants/state/locale';
import Button from '../../../../atoms/common/button/button';
import Pencil from '../../../../../../public/svg/pencil.svg';
import { MinistryHistory } from '../../../../../models/member/history';
import {
  getDateFromDateString,
  getDateStringFromDate,
} from '../../../../../utils/date';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  gap: 10px;
  width: 100%;
`;

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  width: 100%;
`;

const MinistryGroupItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid ${GRAY.LIGHT};
  background-color: ${GRAY.SUPER_LIGHT};
  gap: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const EditButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

type MemberMinistryListViewProps = {
  scrollRef: RefObject<HTMLDivElement>;
  onScroll: () => void;
  onClickAddOpen: (history?: MinistryHistory) => void;
};

const MemberMinistryListView = ({
  scrollRef,
  onScroll,
  onClickAddOpen,
}: MemberMinistryListViewProps) => {
  const pathname = usePathname();
  const basePath = pathname.split('/')[1] as LOCALE;

  const t = useI18n();
  const { targetMember } = useSelector(
    (state: RootState) => state.targetMember
  );
  return (
    <ListContainer>
      <RowContainer>
        <div />
        <Button
          text={t('button.addMinistry')}
          icon={<SvgIcon svg={Plus} color={MAIN.DEFAULT} />}
          backgroundColor={WHITE}
          color={MAIN.DEFAULT}
          width={'auto'}
          onClick={() => onClickAddOpen()}
        />
      </RowContainer>
      <ScrollWrapper ref={scrollRef} onScroll={onScroll}>
        {targetMember.ministryGroupHistory?.map((ministryHistory) => (
          <MinistryGroupItem key={ministryHistory.id}>
            <RowContainer>
              <ContentContainer>
                <MainText size={SIZE.EXTRA_LARGE}>
                  {ministryHistory.ministryGroup.name}
                </MainText>
                {ministryHistory.ministryGroupDetailHistory &&
                  ministryHistory.ministryGroupDetailHistory.length > 1 && (
                    <MainTag
                      title={t('ministryGroupLeader')}
                      color={PURPLE.DARK}
                      backgroundColor={PURPLE.LIGHT}
                    />
                  )}
              </ContentContainer>
              <EditButtonContainer
                onClick={() => onClickAddOpen(ministryHistory)}
              >
                <SvgIcon
                  svg={Pencil}
                  size={18}
                  width={2}
                  color={GRAY.DARK}
                  onClick={() => onClickAddOpen(ministryHistory)}
                />
              </EditButtonContainer>
            </RowContainer>
            <RowContainer>
              <ContentContainer>
                <SvgIcon svg={Calendar} color={GRAY.DEFAULT} />
                <MainText color={GRAY.DEFAULT}>{`${t('startDate')}:`}</MainText>
                <MainText color={GRAY.DEFAULT}>
                  {getTranslatedDateFromDateString(
                    basePath,
                    getDateStringFromDate(
                      getDateFromDateString(ministryHistory.startDate)
                    )
                  )}
                </MainText>
              </ContentContainer>
            </RowContainer>
          </MinistryGroupItem>
        ))}
      </ScrollWrapper>
    </ListContainer>
  );
};

export default MemberMinistryListView;
