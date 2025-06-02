import styled from 'styled-components';

const MarkContainer = styled.span`
  color: red;
  margin-right: 4px;
`;

const RequiredMark = () => {
  return <MarkContainer>*</MarkContainer>;
};

export default RequiredMark;
