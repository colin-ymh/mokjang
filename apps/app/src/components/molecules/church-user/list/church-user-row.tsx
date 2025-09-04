import ChurchUserRowView, {
  ChurchUserRowViewProps,
} from './church-user-row.view';
import { PERMISSION_ACTIVE } from '@mokjang/constants';

export type ChurchUserRowProps = {
  permissionActive: PERMISSION_ACTIVE | undefined;
  onChangePermissionActive: (value: PERMISSION_ACTIVE | undefined) => void;
};
const ChurchUserRow = ({
  permissionActive,
  onChangePermissionActive,
}: ChurchUserRowProps) => {
  const props = {
    permissionActive,
    onChangePermissionActive,
  } as ChurchUserRowViewProps;

  return (
    <>
      <ChurchUserRowView {...props} />
    </>
  );
};

export default ChurchUserRow;
