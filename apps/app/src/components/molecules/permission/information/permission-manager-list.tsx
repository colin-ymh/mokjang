import styled from 'styled-components';
import PermissionManagerItem from '../../../atoms/permission/information/permission-manager-item';
import { Member } from '../../../../models/member/member';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type PermissionManagerListProps = {
  managers: Member[];
};

const PermissionManagerList = ({ managers }: PermissionManagerListProps) => {
  return (
    <ListContainer>
      {managers.map((manager) => (
        <PermissionManagerItem key={manager.id} manager={manager} />
      ))}
    </ListContainer>
  );
};

export default PermissionManagerList;
