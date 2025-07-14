import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import styled from 'styled-components';
import { HOME_WIDGET } from '@/constants/constant';
import { MainText } from '@/components/atoms/common/text/main-text';
import Button from '@/components/atoms/common/button/button';
import { GRAY, MAIN } from '@/constants/styles/color';
import { useI18n } from '../../../../../locales/client';

const WidgetContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const ListContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const WidgetItem = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${GRAY.EXTRA_LIGHT};
  border-radius: 10px;
`;

type AddHomeWidgetViewProps = {
  onClickAdd: (widget: HOME_WIDGET) => void;
};

const AddHomeWidgetView = ({ onClickAdd }: AddHomeWidgetViewProps) => {
  const t = useI18n();
  const { homeWidgets } = useSelector(
    (state: RootState) => state.homeWidgetFilter
  );

  return (
    <WidgetContainer>
      <ListContainer>
        {Object.values(HOME_WIDGET).map((widget: HOME_WIDGET) => {
          return (
            <WidgetItem key={widget}>
              <MainText>{widget}</MainText>
              <Button
                text={t('button.add')}
                disabled={homeWidgets.includes(widget)}
                width={80}
                height={30}
                backgroundColor={
                  homeWidgets.includes(widget) ? GRAY.DEFAULT : MAIN.DEFAULT
                }
                onClick={() => onClickAdd(widget)}
              />
            </WidgetItem>
          );
        })}
      </ListContainer>
    </WidgetContainer>
  );
};

export default AddHomeWidgetView;
