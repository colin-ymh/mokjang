import styled from 'styled-components';

const MarkContainer = styled.span`
  color: red;
  margin-left: 3px;
`;

export const RequiredMark = () => {
  return <MarkContainer>*</MarkContainer>;
};
