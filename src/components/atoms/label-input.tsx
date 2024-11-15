import React from "react";
import styled from "styled-components";

import { MainText } from "@/common/components/text/main-text";
import BorderInput, {
  BorderInputProps,
} from "@/common/components/input/border-input";

const LabelInputContainer = styled.div``;

type LabelInputProps = BorderInputProps & {
  label: string;
};

const LabelInput = ({ label, value, onChange }: LabelInputProps) => {
  return (
    <LabelInputContainer>
      <MainText>{label}</MainText>
      <BorderInput value={value} onChange={onChange} />
    </LabelInputContainer>
  );
};

export default LabelInput;
