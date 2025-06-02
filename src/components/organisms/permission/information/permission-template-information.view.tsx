import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../locales/client';
import React from 'react';

const InformationContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
`;

type PermissionTemplateInformationViewProps = {
  onChangePermissionUnit: (unitId: string) => void;
};

const PermissionTemplateInformationView = ({
  onChangePermissionUnit,
}: PermissionTemplateInformationViewProps) => {
  const t = useI18n();

  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );

  return <InformationContainer></InformationContainer>;
};

export default PermissionTemplateInformationView;
