import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { GRAY } from '@mokjang/constants';
import FunctionItem, {
  FunctionItemType,
} from '@/components/atoms/main/fuction/fuction-item';
import { useScopedI18n } from '../../../../../locales/client';

import { Svg } from '@mokjang/assets';
import FunctionMemberImage from '../../../../../public/png/function-member.png';
import FunctionScheduleImage from '../../../../../public/png/function-schedule.png';
import FunctionStatisticImage from '../../../../../public/png/function-statistic.png';
import { FUNCTION } from '@/constants/constant';

const FunctionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 950px;
  justify-content: center;
  align-items: center;
  gap: 100px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
`;

const FunctionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;

export type FunctionViewProps = {
  backgroundUrl?: string;
  title?: string;
  description?: string;
};

const FunctionView = ({}: FunctionViewProps) => {
  const t_main = useScopedI18n('main.function');
  const t_function = useScopedI18n('function');

  const functionItems: FunctionItemType[] = [
    {
      id: FUNCTION.MEMBER,
      title: t_function('member.title'),
      description: t_function('member.description'),
      image: FunctionMemberImage,
      icon: Svg.Users,
    },
    {
      id: FUNCTION.SCHEDULE,
      title: t_function('schedule.title'),
      description: t_function('schedule.description'),
      image: FunctionScheduleImage,
      icon: Svg.Calendar,
    },
    {
      id: FUNCTION.STATISTIC,
      title: t_function('statistic.title'),
      description: t_function('statistic.description'),
      image: FunctionStatisticImage,
      icon: Svg.ChartBar,
    },
  ];

  return (
    <FunctionContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700}>
          {t_main('title')}
        </MainText>
        <MainText fontSize={20} color={GRAY.DARK}>
          {t_main('description')}
        </MainText>
      </HeaderContainer>
      <FunctionList>
        {functionItems.map((item) => (
          <FunctionItem key={item.id} item={item} />
        ))}
      </FunctionList>
    </FunctionContainer>
  );
};

export default FunctionView;
