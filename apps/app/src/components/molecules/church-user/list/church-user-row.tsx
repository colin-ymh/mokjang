import ChurchUserRowView, {
  ChurchUserRowViewProps,
} from './church-user-row.view';
import { BLACK, PERMISSION_ACTIVE } from '@mokjang/constants';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useScopedI18n } from '../../../../../locales/client';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

export type ChurchUserRowProps = {
  permissionActive: PERMISSION_ACTIVE | undefined;
  onChangePermissionActive: (value: PERMISSION_ACTIVE | undefined) => void;
};
const ChurchUserRow = ({
  permissionActive,
  onChangePermissionActive,
}: ChurchUserRowProps) => {
  const t_popup = useScopedI18n('popup');
  const dispatch = useDispatch<AppDispatch>();

  const onClickCopyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode).then(() => {
      dispatch(setToastText(t_popup('clipboard')));
      dispatch(setIsToastShown(true));
      dispatch(setToastBackgroundColor(BLACK));
    });
  };

  const props = {
    permissionActive,
    onChangePermissionActive,
    onClickCopyJoinCode,
  } as ChurchUserRowViewProps;

  return (
    <>
      <ChurchUserRowView {...props} />
    </>
  );
};

export default ChurchUserRow;
