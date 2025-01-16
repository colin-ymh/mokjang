// import { ChangeEvent, useEffect, useState } from 'react';
//
// import { BLANK, EDUCATION_STATUS, NULL } from '@/constants/constant';
// import { useEducationDropdownItems } from '@/hooks/dropdown/dropdown-items';
// import EducationModalView from '@/components/atoms/modal/education-modal.view';
// import { EducationHistory } from '@/models/member/history';
// import { getFormattedDate } from '@/utils/format';
// import { getIsWellFormedDate } from '@/utils/check';
//
// type EducationModalProps = {
//   prevEducation: EducationHistory;
//   onClickClose: () => void;
//   onClickSaveNewEducation: (
//     educationId: string,
//     startDate: string,
//     status: EDUCATION_STATUS,
//     endDate?: string
//   ) => void;
//   onClickSaveEditEducation: (
//     educationId?: string,
//     startDate?: string,
//     endDate?: string,
//     status?: EDUCATION_STATUS
//   ) => void;
// };
//
// const EducationModal = ({
//   prevEducation,
//   onClickClose,
//   onClickSaveNewEducation,
//   onClickSaveEditEducation,
// }: EducationModalProps) => {
//   const isEdit = prevEducation.id !== BLANK;
//
//   const educationItems = useEducationDropdownItems().filter(
//     (item) => item.value !== NULL
//   );
//
//   // 선택된 교육 id
//   const [educationId, setEducationId] = useState<string>(
//     prevEducation. || educationItems[0].value
//   );
//
//   // 교육 상태
//   const [educationStatus, setEducationStatus] = useState<EDUCATION_STATUS>(
//     prevEducation.status || EDUCATION_STATUS.IN_PROGRESS
//   );
//
//   // 시작 날짜
//   const [startDate, setStartDate] = useState<string>(
//     prevEducation.startDate ? getFormattedDate(prevEducation.startDate) : BLANK
//   );
//
//   // 종료 날짜
//   const [endDate, setEndDate] = useState<string>(
//     prevEducation.endDate ? getFormattedDate(prevEducation.endDate) : BLANK
//   );
//
//   // 저장 가능 여부
//   const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
//
//   // 시작 날짜 변경
//   const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
//     const newStartDate = getFormattedDate(event.target.value);
//     setStartDate(newStartDate);
//   };
//
//   // 종료 날짜 변경
//   const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
//     const newEndDate = getFormattedDate(event.target.value);
//     setEndDate(newEndDate);
//   };
//
//   // 교육 드롭다운 변경
//   const onChangeEducation = (id: string) => {
//     setEducationId(id);
//   };
//
//   // 상태 드롭다운 변경
//   const onChangeStatus = (value: EDUCATION_STATUS) => {
//     setEducationStatus(value);
//   };
//
//   // 저장 가능 여부 확인
//   useEffect(() => {
//     if (isEdit) {
//       console.log(endDate);
//       if (
//         getIsWellFormedDate(startDate) &&
//         (getIsWellFormedDate(endDate) || endDate === BLANK)
//       ) {
//         setIsButtonEnabled(true);
//       } else {
//         setIsButtonEnabled(false);
//       }
//     } else {
//       if (getIsWellFormedDate(startDate)) {
//         setIsButtonEnabled(true);
//       } else {
//         setIsButtonEnabled(false);
//       }
//     }
//   }, [isEdit, startDate, endDate]);
//
//   const props = {
//     isEdit,
//     educationId,
//     educationStatus,
//     educationItems,
//     onClickClose,
//     startDate,
//     endDate,
//     isButtonEnabled,
//     onChangeEducation,
//     onChangeStatus,
//     onChangeStartDate,
//     onChangeEndDate,
//     onClickSaveNewEducation,
//     onClickSaveEditEducation,
//   };
//
//   return (
//     <>
//       <EducationModalView {...props} />
//     </>
//   );
// };
//
// export default EducationModal;
