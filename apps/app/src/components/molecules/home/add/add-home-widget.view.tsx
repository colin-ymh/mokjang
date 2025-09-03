import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import styled from 'styled-components';
import { HOME_WIDGET } from '../../../../constants/constant';
import { MainText } from '../../../atoms/common/text/main-text';
import Button from '../../../atoms/common/button/button';
import { GRAY, MAIN } from '../../../../constants/styles/color';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import SvgIcon from '../../../atoms/common/icon/svg-icon';

import Calendar from '../../../../../public/svg/calendar.svg';
import DocumentCheck from '../../../../../public/svg/document-check.svg';
import ChartBar from '../../../../../public/svg/chart-bar.svg';
import ChartPie from '../../../../../public/svg/chart-pie.svg';
import UserPlus from '../../../../../public/svg/user-plus.svg';
import Heart from '../../../../../public/svg/heart.svg';
import { SIZE } from '../../../../constants/styles/style';

const WidgetContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 10px;
`;

const WidgetItem = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  border: 1px solid ${GRAY.EXTRA_LIGHT};
  border-radius: 10px;
`;

const IconContainer = styled.div<{ $isEnable: boolean }>`
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: ${({ $isEnable }) => ($isEnable ? MAIN.LIGHT : GRAY.LIGHT)};
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type AddHomeWidgetViewProps = {
  onClickAdd: (widget: HOME_WIDGET) => void;
};

const AddHomeWidgetView = ({ onClickAdd }: AddHomeWidgetViewProps) => {
  const t = useI18n();
  const t_title = useScopedI18n('title');
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  const getWidgetIcon = (widget: HOME_WIDGET) => {
    switch (widget) {
      case HOME_WIDGET.REPORTED_SCHEDULE:
        return DocumentCheck;
      case HOME_WIDGET.MY_SCHEDULE:
        return Calendar;
      case HOME_WIDGET.WORSHIP_ATTENDANCE:
        return Heart;
      case HOME_WIDGET.CHURCH_SCHEDULE_SUMMARY:
        return ChartBar;
      case HOME_WIDGET.MY_SCHEDULE_SUMMARY:
        return ChartPie;
      case HOME_WIDGET.NEW_MEMBER:
        return UserPlus;
    }
  };

  return (
    <WidgetContainer>
      <ListContainer>
        {Object.values(HOME_WIDGET).map((widget: HOME_WIDGET) => {
          const isEnable = !homeWidgets.includes(widget);
          return (
            <WidgetItem key={widget}>
              <IconContainer $isEnable={isEnable}>
                <SvgIcon
                  svg={getWidgetIcon(widget)}
                  color={isEnable ? MAIN.DEFAULT : GRAY.DEFAULT}
                  size={20}
                  width={2}
                />
              </IconContainer>
              <ColumnContainer>
                <MainText size={SIZE.LARGE}>{t_title(widget)}</MainText>
                <Button
                  text={t('button.add')}
                  disabled={homeWidgets.includes(widget)}
                  width={80}
                  height={30}
                  backgroundColor={isEnable ? MAIN.DEFAULT : GRAY.DEFAULT}
                  onClick={() => onClickAdd(widget)}
                />
              </ColumnContainer>
            </WidgetItem>
          );
        })}
      </ListContainer>
    </WidgetContainer>
  );
};

export default AddHomeWidgetView;
