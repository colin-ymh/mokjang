import styled from 'styled-components';

import TermInformationHeader, {
  TermInformationHeaderProps,
} from '@/components/atoms/management/education/term-information-header';
import TermInformationContent, {
  TermInformationContentProps,
} from '@/components/atoms/management/education/term-information-content';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

type TermInformationViewProps = {
  header: TermInformationHeaderProps;
  content: TermInformationContentProps;
};

const TermInformationView = ({ ...props }: TermInformationViewProps) => {
  return (
    <InformationContainer>
      <TermInformationHeader {...props.header} />
      <TermInformationContent {...props.content} />
    </InformationContainer>
  );
};

export default TermInformationView;
