import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useI18n } from '../../../../../../locales/client';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, WHITE } from '@/constants/styles/color';
import React, { Dispatch, SetStateAction } from 'react';
import { SIZE } from '@/constants/styles/style';
import { usePathname } from 'next/navigation';
import { LOCALE } from '@/constants/state/locale';
import { EDUCATION_TERM_STATUS } from '@/constants/status/status';
import MemberProfilePopupButton from '@/components/molecules/common/button/member-profile-popup-button';
import {
  getTranslatedAddMemberTitle,
  getTranslatedDateFromDateString,
} from '@/utils/translate';
import { useEducationTermStatusDropdownItems } from '@/hooks/dropdown/dropdown-items';
import StatusDropdown from '@/components/atoms/common/dropdown/status-dropdown';
import { useEducationTermHeaderBarItems } from '@/hooks/layout/header-bar-items';
import HeaderBar from '@/components/atoms/layout/header/header-bar';
import { EDUCATION_TERM_CONTENT_ID } from '@/constants/layout/content';
import EducationEnrollmentTable from '@/components/molecules/education/education-enrollment/education-enrollment-table';
import Button from '@/components/atoms/common/button/button';
import CustomPopup from '@/components/atoms/common/popup/custom-popup';
import AddEnrollmentMemberModal from '@/components/atoms/education/education-term/add-enrollment-member-modal';
import { Member } from '@/models/member/member';

const InformationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const CardContainer = styled.div<{ $minHeight?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  background-color: ${WHITE};
  min-height: ${({ $minHeight }) => $minHeight && $minHeight}px;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const TableContainer = styled.div`
  display: flex;
  border: 1px solid ${GRAY.LIGHT};
  border-radius: 10px;
  overflow: hidden;
`;

const HeaderBarContainer = styled.div`
  display: flex;
  padding: 5px 10px 0 10px;
  border-bottom: 1px solid ${GRAY.LIGHT};
`;

type EducationTermInformationViewProps = {
  isAddModalShown: boolean;
  headerBar: EDUCATION_TERM_CONTENT_ID;
  onChangeStatus: (status: EDUCATION_TERM_STATUS) => void;
  onChangeHeaderBar: (headerBar: EDUCATION_TERM_CONTENT_ID) => void;
  onClickAddEnrollmentsOpen: () => void;
  onClickAddEnrollmentsClose: () => void;
  onClickSaveNewEnrollments: () => void;
  selectedMembers: Member[];
  setSelectedMembers: Dispatch<SetStateAction<Member[]>>;
};

const EducationTermInformationView = ({
  isAddModalShown,
  headerBar,
  onChangeStatus,
  onChangeHeaderBar,
  onClickAddEnrollmentsOpen,
  onClickAddEnrollmentsClose,
  onClickSaveNewEnrollments,
  selectedMembers,
  setSelectedMembers,
}: EducationTermInformationViewProps) => {
  const t = useI18n();
  const { targetEducationTerm } = useSelector(
    (state: RootState) => state.targetEducationTerm
  );
  const pathname = usePathname();
  const locale = pathname.split('/')[1] as LOCALE;

  const statusDropdownItems = useEducationTermStatusDropdownItems();

  const headerBarItems = useEducationTermHeaderBarItems();

  return (
    <>
      <InformationContainer>
        <RowContainer>
          {/* 담당자 */}
          <CardContainer $minHeight={100}>
            <ContentContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{t('inCharge')}</MainText>
              <MemberProfilePopupButton member={targetEducationTerm.inCharge} />
            </ContentContainer>
          </CardContainer>
          {/* 장소 */}
          <CardContainer $minHeight={100}>
            <ContentContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{t('location')}</MainText>
              <MainText>{'본당'}</MainText>
            </ContentContainer>
          </CardContainer>
          {/* 기간 */}
          <CardContainer $minHeight={100}>
            <ContentContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{t('period')}</MainText>
              <MainText>
                {`${getTranslatedDateFromDateString(locale, targetEducationTerm.startDate)} - ${getTranslatedDateFromDateString(locale, targetEducationTerm.endDate)}`}
              </MainText>
            </ContentContainer>
          </CardContainer>
          {/* 상태 */}
          <CardContainer $minHeight={100}>
            <ContentContainer>
              <MainText size={SIZE.EXTRA_LARGE}>{t('status')}</MainText>
              <StatusDropdown
                value={targetEducationTerm.status}
                items={statusDropdownItems}
                onChangeItem={onChangeStatus}
              />
            </ContentContainer>
          </CardContainer>
        </RowContainer>
        {/* 회차목록 / 수강교인 */}
        <CardContainer $minHeight={200}>
          <HeaderBarContainer>
            <HeaderBar
              value={headerBar}
              items={headerBarItems}
              onClick={onChangeHeaderBar}
            />
          </HeaderBarContainer>
          <ContentContainer>
            <RowContainer>
              <MainText size={SIZE.EXTRA_LARGE}>
                {t('educationEnrollment')}
              </MainText>
              <Button
                text={t('button.addMember')}
                height={30}
                width={'auto'}
                onClick={onClickAddEnrollmentsOpen}
              />
            </RowContainer>
            <TableContainer>
              {headerBar === EDUCATION_TERM_CONTENT_ID.ENROLLMENTS && (
                <EducationEnrollmentTable />
              )}
            </TableContainer>
          </ContentContainer>
        </CardContainer>
      </InformationContainer>

      {/* 교인 추가 팝업 */}
      <CustomPopup
        isShow={isAddModalShown}
        onClickCancel={onClickAddEnrollmentsClose}
        width={800}
        height={700}
        headerHeight={100}
        headerTitle={getTranslatedAddMemberTitle(
          locale,
          targetEducationTerm.term
        )}
        headerDescription={t('description.addMemberHeader')}
        doneText={t('button.add')}
        onClickDone={onClickSaveNewEnrollments}
      >
        <AddEnrollmentMemberModal
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
        />
      </CustomPopup>
    </>
  );
};

export default EducationTermInformationView;
