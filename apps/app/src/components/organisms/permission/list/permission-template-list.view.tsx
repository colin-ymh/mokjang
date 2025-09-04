import styled from 'styled-components';
import { Loading } from '@mokjang/components';
import React from 'react';
import { Svg } from '@mokjang/assets';
import { BLACK, DESTRUCTIVE, GRAY } from '@mokjang/constants';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';
import PermissionTemplateTable, {
  PermissionTemplateTableProps,
} from '../../../molecules/permission/list/permission-template-table';
import SlidePopup from '../../../atoms/common/popup/slide-popup';
import PermissionTemplateInformation from '../information/permission-template-information';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

const PermissionTemplateListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  cursor: pointer;
`;

const Trash = styled(Svg.Trash)`
  width: 25px;
  height: 25px;
  stroke: ${DESTRUCTIVE.LIGHT};
  stroke-width: 1px;
`;

const Cancel = styled(Svg.Cancel)`
  width: 30px;
  height: 30px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

type PermissionTemplateListViewProps = {
  list: PermissionTemplateTableProps;
  information: {
    isPermissionTemplateInformationShown: boolean;
    isLoading: boolean;
    onClickClose: () => void;
    onClickDelete: () => void;
  };
};

const PermissionTemplateListView = (props: PermissionTemplateListViewProps) => {
  const { targetPermissionTemplate } = useSelector(
    (state: RootState) => state.targetPermissionTemplate
  );
  const {
    isPermissionTemplateInformationShown,
    isLoading,
    onClickClose,
    onClickDelete,
  } = props.information;

  return (
    <PermissionTemplateListContainer>
      {/* 모바일에서 보일 목록형 UI */}
      {/*<MobileView>*/}
      {/*  <PermissionTemplateItemList {...props.list} />*/}
      {/*</MobileView>*/}
      {/* 데스크탑에서 보일 테이블형 UI */}
      <DesktopView>
        <TableContainer>
          <PermissionTemplateTable {...props.list} />
        </TableContainer>
      </DesktopView>
      {/* 상세정보 팝업*/}
      <SlidePopup
        isShow={isPermissionTemplateInformationShown}
        headerTitle={targetPermissionTemplate.title}
        headerRight={
          <ButtonContainer onClick={onClickClose}>
            <Cancel />
          </ButtonContainer>
        }
        onClickClose={onClickClose}
      >
        <PermissionTemplateInformation onClickDelete={onClickDelete} />
      </SlidePopup>
      <Loading isShow={isLoading} />
    </PermissionTemplateListContainer>
  );
};

export default PermissionTemplateListView;
