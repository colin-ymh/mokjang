import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import OfficerManagementView from '@/components/organisms/management/officer/officer-management.view';
import { DEFAULT_OFFICER, Officer } from '@/models/management/management';
import { BLANK } from '@/constants/constant';

type OfficerManagementProps = {};

const OfficerManagement = ({}: OfficerManagementProps) => {
  const { officers } = useSelector((state: RootState) => state.church);

  // 선택된 그룹
  const [selectedOfficer, setSelectedOfficer] =
    useState<Officer>(DEFAULT_OFFICER);

  // 직분 클릭 이벤트
  const onClickOfficer = (officer: Officer) => {
    setSelectedOfficer(officer);
  };

  // 직분 불러오기
  const fetchOfficer = () => {
    if (selectedOfficer.id) {
      const newOfficer = officers.find(
        (officer) => officer.id === selectedOfficer.id
      );
      if (newOfficer) {
        setSelectedOfficer(newOfficer);
      }
    } else {
      setSelectedOfficer(DEFAULT_OFFICER);
    }
  };

  useEffect(() => {
    if (officers) {
      if (selectedOfficer.id !== BLANK && selectedOfficer.id !== null) {
        fetchOfficer();
      } else if (officers.length > 0) {
        setSelectedOfficer(officers[0]);
      }
    }
  }, [officers]);

  const props = {
    selectedOfficer,
    onClickOfficer,
  };

  return (
    <>
      <OfficerManagementView {...props} />
    </>
  );
};

export default OfficerManagement;
