import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { GRAY, MEDIA_MAX_WIDTH } from '@mokjang/constants';
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

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    padding: 0 20px;
    width: auto;
    height: 2300px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const FunctionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;

  @media (max-width: ${MEDIA_MAX_WIDTH.MOBILE}) {
    flex-direction: column;
  }
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
      descriptions: [
        t_function('member.description.1'),
        t_function('member.description.2'),
      ],
      image: FunctionMemberImage,
      icon: Svg.Users,
    },
    {
      id: FUNCTION.SCHEDULE,
      title: t_function('schedule.title'),
      descriptions: [
        t_function('schedule.description.1'),
        t_function('schedule.description.2'),
      ],
      image: FunctionScheduleImage,
      icon: Svg.Calendar,
    },
    {
      id: FUNCTION.STATISTIC,
      title: t_function('statistic.title'),
      descriptions: [t_function('statistic.description.1')],
      image: FunctionStatisticImage,
      icon: Svg.ChartBar,
    },
  ];

  return (
    <FunctionContainer>
      <HeaderContainer>
        <MainText fontSize={36} fontWeight={700} whiteSpace={'normal'}>
          {t_main('title')}
        </MainText>
        <MainText fontSize={20} color={GRAY.DARK} whiteSpace={'normal'}>
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
