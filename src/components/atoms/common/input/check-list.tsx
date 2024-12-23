import styled from "styled-components";
import { useEffect, useState } from "react";
import { MainText } from "@/components/atoms/common/text/main-text";
import CheckButton from "@/components/atoms/common/button/check-button";

const CheckListContainer = styled.div`
  display: flex;
`;

const CheckItem = styled.div`
  display: flex;
  flex-direction: row;
`;

export type CheckListItem = {
  value: any;
  title: string;
};

type CheckListProps = {
  values: any[];
  items: CheckListItem[];
  onChange: (values: any[]) => void;
};

const CheckList = ({ values, items, onChange }: CheckListProps) => {
  const [innerValues, setInnerValues] = useState<any[]>([]);

  // 외부에서 값 변경 시, 내부에도 적용
  useEffect(() => {
    setInnerValues(values);
  }, [values]);

  // 내부에서 값 변경 시, 외부에 전달
  useEffect(() => {
    onChange(items);
  }, [innerValues]);

  const onClickItem = (value: any) => {
    if (innerValues.includes(value)) {
      setInnerValues(innerValues.filter((v) => v !== value));
    } else {
      setInnerValues([...innerValues, value]);
    }
  };

  return (
    <CheckListContainer>
      {items.map((item, index) => (
        <CheckItem key={item.value} onChange={onClickItem}>
          <MainText>{item.title}</MainText>
          <CheckButton value={innerValues.includes(item.value)} />
        </CheckItem>
      ))}
    </CheckListContainer>
  );
};

export default CheckList;
