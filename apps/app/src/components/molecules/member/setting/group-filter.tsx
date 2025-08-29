import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { setMemberFilter } from '../../../../redux/reducers/filter/member-filter-reducer';
import SelectGroupHierarchy from '../../../organisms/group/select-group-hierarchy';
import { getGroup } from '../../../../utils/group';
import { setTargetGroup } from '../../../../redux/reducers/target/target-group-reducer';
import { DEFAULT_GROUP } from '../../../../models/management/management';
import styled from 'styled-components';
import { ALL } from '../../../../constants/constant';

const GroupFilterContainer = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
`;

type GroupFilterProps = {
  isDefaultOpen?: boolean;
  onChange?: (id: string | null) => void;
};

const GroupFilter = ({ isDefaultOpen = false, onChange }: GroupFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const memberFilter = useSelector(
    (state: RootState) => state.memberFilter.memberFilter
  );
  const groups = useSelector((state: RootState) => state.church.groups);

  // 새로운 그룹을 설정
  const onChangeGroup = (groupId: string | null) => {
    if (groupId) {
      const newGroup = getGroup(groupId, groups);

      if (newGroup) {
        dispatch(setTargetGroup(newGroup));
      }
    } else {
      dispatch(setTargetGroup(DEFAULT_GROUP));
    }

    if (groupId === ALL) {
      dispatch(setMemberFilter({ ...memberFilter, groupIds: [] }));
    } else if (groupId === null) {
      dispatch(setMemberFilter({ ...memberFilter, groupIds: [null] }));
    } else if (groupId) {
      dispatch(
        setMemberFilter({
          ...memberFilter,
          groupIds: [getGroup(groupId, groups).id],
        })
      );
    }

    if (onChange) {
      onChange(groupId);
    }
  };

  const props = {
    isNullable: true,
    isDefaultOpen,
    onChange: onChangeGroup,
    prevSelectedGroupId: memberFilter?.groupIds[0],
  };

  return (
    <>
      <GroupFilterContainer>
        <SelectGroupHierarchy {...props} />
      </GroupFilterContainer>
    </>
  );
};

export default GroupFilter;
