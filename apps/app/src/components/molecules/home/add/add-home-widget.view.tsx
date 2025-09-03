import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import styled from 'styled-components';
import { HOME_WIDGET } from '@mokjang/constants';
import { MainText } from '@mokjang/components';
import { Button } from '@mokjang/components';
import { GRAY, MAIN } from '@mokjang/constants';
import { useI18n, useScopedI18n } from '../../../../../locales/client';
import { SvgIcon } from '@mokjang/components';

import { Svg } from '@mokjang/assets';
import { SIZE } from '@mokjang/constants';

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
        return Svg.DocumentCheck;
      case HOME_WIDGET.MY_SCHEDULE:
        return Svg.Calendar;
      case HOME_WIDGET.WORSHIP_ATTENDANCE:
        return Svg.Heart;
      case HOME_WIDGET.CHURCH_SCHEDULE_SUMMARY:
        return Svg.ChartBar;
      case HOME_WIDGET.MY_SCHEDULE_SUMMARY:
        return Svg.ChartPie;
      case HOME_WIDGET.NEW_MEMBER:
        return Svg.UserPlus;
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
