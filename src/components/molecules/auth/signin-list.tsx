import styled from "styled-components";
import LabelInput from "@/components/atoms/common/input/label-input";
import { useI18n, useScopedI18n } from "../../../../locales/client";
import Button from "@/components/atoms/common/button/button";
import { MainText } from "@/components/atoms/common/text/main-text";
import { BLUE } from "@/constants/styles/color";
import CheckButton from "@/components/atoms/common/button/check-button";
import { useState } from "react";

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

const ConsentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const SignInList = () => {
  const t = useI18n();
  const t_button = useScopedI18n("button");
  const [isConsent, setIsConsent] = useState<boolean>(false);

  // 개인정보 처리 동의 버튼
  const onChangeConsent = (value: boolean) => {
    setIsConsent(value);
  };

  return (
    <ListContainer>
      <InputContainer>
        <LabelInput label={t("name")} />
        <LabelInput label={t("mobilePhone")} />
        <LabelInput label={t("verifyNumber")} />
        <ConsentContainer>
          <MainText color={BLUE.DEFAULT}>개인정보 수집 및 이용 동의</MainText>
          <CheckButton value={isConsent} onChange={onChangeConsent} />
        </ConsentContainer>
      </InputContainer>
      <Button text={t_button("signIn")} height={50} />
    </ListContainer>
  );
};

export default SignInList;
