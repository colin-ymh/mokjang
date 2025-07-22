import styled from 'styled-components';

const MarkContainer = styled.span`
  color: red;
  margin-left: 4px;
`;

const RequiredMark = () => {
  return <MarkContainer>*</MarkContainer>;
};

export default RequiredMark;
