import { MainText, ProfileImage } from '@mokjang/components';
import { Schedule } from '@mokjang/models';
import styled from 'styled-components';
import { GRAY } from '@mokjang/constants';

const EventContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌측 텍스트 / 우측 이미지 분리 */
  width: 100%;
  height: 100%;
  padding: 2px 6px;
  box-sizing: border-box;
`;

type CustomEventProps = {
  event: Schedule;
};

const CustomEvent = ({ event }: CustomEventProps) => {
  return (
    <EventContainer>
      <MainText color={GRAY.EXTRA_DARK}>{event.title}</MainText>
      {event.inCharge && (
        <ProfileImage
          value={event.inCharge?.profileImageUrl}
          width={20}
          height={20}
        />
      )}
    </EventContainer>
  );
};

export default CustomEvent;
