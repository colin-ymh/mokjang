import styled from "styled-components";

import LabelInput from "@/components/atoms/common/input/label-input";
import Button from "@/components/atoms/common/button/button";
import { useI18n, useScopedI18n } from "../../../../locales/client";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 30px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChurchRegisterList = () => {
  const t = useI18n();
  const t_button = useScopedI18n("button");
  return (
    <ListContainer>
      <InputContainer>
        <LabelInput label={"교회명"} />
        <LabelInput label={"교단명"} />
        <LabelInput label={"고유번호"} />
        <LabelInput label={"교회주소"} />
        <LabelInput label={"대표번호"} />
        <LabelInput label={"교인 수"} />
      </InputContainer>
      <Button text={t_button("signIn")} height={50} />
    </ListContainer>
  );
};

export default ChurchRegisterList;
