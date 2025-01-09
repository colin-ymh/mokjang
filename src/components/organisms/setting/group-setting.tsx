import { useState } from 'react';

import { GROUP_SETTING_HEADER_ID } from '@/constants/layout/header';
import { useGroupSettingHeaderBarItems } from '@/hooks/layout/header-bar-items';
import GroupSettingView from '@/components/organisms/setting/group-setting.view';
import { DEFAULT_GROUP, Group } from '@/models/setting/group';

type GroupSettingProps = {};

const GroupSetting = ({}: GroupSettingProps) => {
  // 그룹 설정 탭 헤더
  const headerBarItems = useGroupSettingHeaderBarItems();

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 선택된 그룹 정보 탭
  const [headerBarId, setHeaderBarId] = useState<GROUP_SETTING_HEADER_ID>(
    GROUP_SETTING_HEADER_ID.GROUP_INFORMATION
  );

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: GROUP_SETTING_HEADER_ID) => {
    setHeaderBarId(id);
  };

  const props = {
    selectedGroup,
    setSelectedGroup,
    headerBarId,
    headerBarItems,
    onClickHeaderBar,
  };

  return (
    <>
      <GroupSettingView {...props} />
    </>
  );
};

export default GroupSetting;
