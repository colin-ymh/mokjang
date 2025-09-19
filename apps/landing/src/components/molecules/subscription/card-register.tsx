import styled from 'styled-components';
import { useScopedI18n } from '../../../../locales/client';
import {
  BorderInput,
  Button,
  CheckButton,
  LabelInput,
  MainText,
} from '../../../../../../packages/components/src';
import { ChangeEvent, useEffect, useState } from 'react';
import { DEFAULT_ENC_DATA, encData } from '@mokjang/models';
import {
  BLANK,
  CURSOR,
  GRAY,
  MAIN,
  SIZE,
} from '../../../../../../packages/constants/src';
import { usePageRouter } from '@mokjang/utils';

const CardRegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardNoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

type CardRegisterProps = {};

const CardRegister = ({}: CardRegisterProps) => {
  const router = usePageRouter();

  const t_card = useScopedI18n('card');
  const t_button = useScopedI18n('button');

  const [isDoneEnable, setIsDoneEnable] = useState<boolean>(false);

  const [enc, setEnc] = useState<encData>(DEFAULT_ENC_DATA);

  const [cardNo1, setCardNo1] = useState<string>(BLANK);
  const [cardNo2, setCardNo2] = useState<string>(BLANK);
  const [cardNo3, setCardNo3] = useState<string>(BLANK);
  const [cardNo4, setCardNo4] = useState<string>(BLANK);

  const [exp, setExp] = useState<string>(BLANK);

  const [isConsent, setIsConsent] = useState<boolean>(false);

  const onChangeCardNo1 = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    setCardNo1(limited);
  };

  const onChangeCardNo2 = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    setCardNo2(limited);
  };

  const onChangeCardNo3 = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    setCardNo3(limited);
  };

  const onChangeCardNo4 = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 4);
    setCardNo4(limited);
  };

  const onChangeExp = (event: ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // 1) 숫자만 허용
    value = value.replace(/\D/g, '');

    // 2) MM/YY 형식으로 변환
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    // 3) 최대 5글자 (MM/YY)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    setExp(value);
  };

  const onChangeIdNo = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 6);
    setEnc({ ...enc, idNo: limited });
  };

  const onChangePw = (event: ChangeEvent<HTMLInputElement>) => {
    const cleaned = event.target.value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 2);
    setEnc({ ...enc, cardPw: limited });
  };

  const onChangeConsent = (value: boolean) => {
    setIsConsent(value);
  };

  const onClickDone = () => {
    const random = new Date().getTime();

    if (random % 2 === 0) {
      router.push('/subscription/fail');
    } else {
      router.push('/subscription/complete');
    }
  };

  useEffect(() => {
    const isValid =
      isConsent && // 동의 체크
      /^\d{16}$/.test(enc.cardNo) && // 카드번호 16자리(숫자만)
      /^(0[1-9]|1[0-2])$/.test(enc.expMonth) && // 월: 01~12
      /^\d{2}$/.test(enc.expYear) && // 연: 2자리 (예: 29 -> 2029로 해석)
      /^\d{6}$/.test(enc.idNo) && // 생년월일/식별 6자리
      /^\d{2}$/.test(enc.cardPw); // 카드 비밀번호 앞 2자리

    setIsDoneEnable(isValid);
  }, [enc, isConsent]);

  useEffect(() => {
    // 0000 0000 0000 0000 → "0000000000000000"
    const parts = [cardNo1, cardNo2, cardNo3, cardNo4].map((p) =>
      (p ?? '').replace(/\D/g, '').slice(0, 4)
    );
    const joined = parts.join(''); // 최대 16자리

    setEnc((prev) =>
      prev.cardNo === joined ? prev : { ...prev, cardNo: joined }
    );
  }, [cardNo1, cardNo2, cardNo3, cardNo4]);

  useEffect(() => {
    // "MM/YY" → { expMonth: "MM", expYear: "YY" }
    const [mmRaw = '', yyRaw = ''] = (exp ?? '').split('/');
    const mm = mmRaw.replace(/\D/g, '').slice(0, 2);
    const yy = yyRaw.replace(/\D/g, '').slice(0, 2);

    setEnc((prev) =>
      prev.expMonth === mm && prev.expYear === yy
        ? prev
        : { ...prev, expMonth: mm, expYear: yy }
    );
  }, [exp]);

  return (
    <>
      <CardRegisterContainer>
        <InputContainer>
          <CardNoContainer>
            <MainText color={GRAY.DARK} size={SIZE.SMALL}>
              {t_card('cardNo.title')}
            </MainText>
            <RowContainer>
              <BorderInput
                value={cardNo1}
                placeholder={t_card('cardNo.placeholder')}
                onChange={onChangeCardNo1}
              />
              <BorderInput
                value={cardNo2}
                placeholder={t_card('cardNo.placeholder')}
                onChange={onChangeCardNo2}
              />
              <BorderInput
                value={cardNo3}
                placeholder={t_card('cardNo.placeholder')}
                onChange={onChangeCardNo3}
              />
              <BorderInput
                value={cardNo4}
                placeholder={t_card('cardNo.placeholder')}
                onChange={onChangeCardNo4}
              />
            </RowContainer>
          </CardNoContainer>
          <RowContainer>
            <LabelInput
              label={t_card('exp.title')}
              value={exp}
              placeholder={t_card('exp.placeholder')}
              onChange={onChangeExp}
            />
            <LabelInput
              label={t_card('idNo.title')}
              value={enc.idNo}
              placeholder={t_card('idNo.placeholder')}
              onChange={onChangeIdNo}
            />
          </RowContainer>
          <LabelInput
            label={t_card('cardPw.title')}
            value={enc.cardPw}
            placeholder={t_card('cardPw.placeholder')}
            onChange={onChangePw}
          />
        </InputContainer>
        <RowContainer onClick={() => onChangeConsent(!isConsent)}>
          <CheckButton value={isConsent} onChange={onChangeConsent} />
          <MainText cursor={CURSOR.POINTER}>{t_card('consent')}</MainText>
        </RowContainer>
        <Button
          text={t_button('confirm')}
          onClick={onClickDone}
          height={40}
          disabled={!isDoneEnable}
          backgroundColor={isDoneEnable ? MAIN.DEFAULT : GRAY.DEFAULT}
        />
      </CardRegisterContainer>
    </>
  );
};

export default CardRegister;
