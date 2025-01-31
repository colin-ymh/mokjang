import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { MinistriesApi } from '@/api/management/ministry/ministries.api';
import { EducationsApi } from '@/api/management/education/educations.api';
import { OfficersApi } from '@/api/management/officer/officers.api';
import {
  setChurchId,
  setEducations,
  setGroups,
  setMinistries,
  setMinistryGroups,
  setOfficers,
} from '@/redux/reducers/church-reducer';
import { GroupsApi } from '@/api/management/group/groups.api';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';

export const useInitializeChurch = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const ministriesApi = new MinistriesApi(false);
  const officersApi = new OfficersApi(false);
  const educationsApi = new EducationsApi(false);
  const groupsApi = new GroupsApi(false);

  const initialize = () => {
    dispatch(setChurchId(id));

    ministryGroupsApi
      .getMinistryGroups({ churchId: id })
      .then((response) => dispatch(setMinistryGroups(response.data)));

    ministriesApi
      .getMinistries({ churchId: id })
      .then((response) => dispatch(setMinistries(response.data)));

    officersApi
      .getOfficers({ churchId: id })
      .then((response) => dispatch(setOfficers(response.data)));

    educationsApi
      .getEducations({ churchId: id })
      .then((response) => dispatch(setEducations(response.data.data)));

    groupsApi
      .getGroups({ churchId: id })
      .then((response) => dispatch(setGroups(response.data)));
  };

  return initialize;
};
