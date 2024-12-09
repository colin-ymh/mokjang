import { useEffect, useState } from "react";

import Button, { ButtonProps } from "@/components/atoms/common/button/button";

type ToggleButtonItem = {
  value: any;
  title: string;
  backgroundColor?: string;
};

type ToggleButtonProps = ButtonProps & {
  value: any;
  items: ToggleButtonItem[];
  onClick: (value: any) => void;
};

const ToggleButton = ({ value, items, onClick }: ToggleButtonProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const newIndex = items.findIndex((item) => item.value === value);
    setSelectedIndex(newIndex);
  }, [value]);

  return (
    <>
      <Button
        text={items[selectedIndex].title}
        onClick={() => onClick(items[(selectedIndex + 1) % items.length].value)}
        backgroundColor={items[selectedIndex].backgroundColor}
      />
    </>
  );
};

export default ToggleButton;
