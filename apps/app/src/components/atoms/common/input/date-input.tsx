// 'use client';
//
// import React, { ChangeEvent } from 'react';
// import styled from 'styled-components';
//
// import 'react-datepicker/dist/react-datepicker.css';
// import CustomDatePicker from '@/vendor/date-picker/custom-date-picker';
//
// const StyledWrapper = styled.div``;
//
// type DateInputProps = {
//   value: string;
//   selected: Date | null;
//   onChange: (date: Date | null) => void;
//   onChangeRaw?: (church-church-event: ChangeEvent<HTMLInputElement>) => void;
//   borderColor?: string;
//   height?: number;
//   width?: number;
//   backgroundColor?: string;
//   disabled?: boolean;
//   placeholder?: string;
// };
//
// const DateInput = ({
//   value,
//   selected,
//   onChange,
//   onChangeRaw,
//   borderColor,
//   height,
//   width,
//   backgroundColor,
//   disabled,
//   placeholder = 'YYYY-MM-DD',
// }: DateInputProps) => {
//   return (
//     <StyledWrapper>
//       <CustomDatePicker
//         value={value}
//         selected={selected}
//         onChange={(date) => onChange(date as Date | null)}
//         onChangeRaw={(church-church-event) => {
//           if (onChangeRaw && church-church-event?.target instanceof HTMLInputElement) {
//             onChangeRaw(church-church-event as unknown as ChangeEvent<HTMLInputElement>);
//           }
//         }}
//         dateFormat="yyyy-MM-dd"
//         placeholderText={placeholder}
//         showYearDropdown={true}
//         scrollableYearDropdown
//         yearDropdownItemNumber={50}
//         locale={ko}
//         customInput={
//           <BorderInput
//             borderColor={borderColor}
//             height={height}
//             width={width}
//             backgroundColor={backgroundColor}
//             disabled={disabled}
//             readOnly
//           />
//         }
//       />
//     </StyledWrapper>
//   );
// };
//
// export default DateInput;
