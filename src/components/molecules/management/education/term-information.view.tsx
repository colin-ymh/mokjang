import styled from 'styled-components';
import TermInformationHeader, {
  TermInformationHeaderProps,
} from '@/components/molecules/management/education/term-information-header';

const InformationContainer = styled.div`
  display: flex;
`;

type TermInformationViewProps = {
  header: TermInformationHeaderProps;
};

const TermInformationView = ({ ...props }: TermInformationViewProps) => {
  return (
    <InformationContainer>
      <TermInformationHeader {...props.header} />
    </InformationContainer>
  );
};

export default TermInformationView;
