import FaqView, {
  FaqViewProps,
} from '@/components/molecules/main/faq/faq.view';
import { useState } from 'react';
import { usePageRouter } from '@mokjang/utils';
import { FAQ } from '@/constants/constant';

const Faq = () => {
  const router = usePageRouter();

  const [openedQuestion, setOpenedQuestion] = useState<FAQ | undefined>();

  const onClickQuestion = (id: FAQ) => {
    if (id === openedQuestion) {
      setOpenedQuestion(undefined);
    } else {
      setOpenedQuestion(id);
    }
  };

  const onClickContact = () => {
    router.push('/contact');
  };

  const onClickDonate = () => {
    router.push('/donate');
  };

  const props = {
    openedQuestion,
    onClickQuestion,
    onClickContact,
    onClickDonate,
  } as FaqViewProps;

  return (
    <>
      <FaqView {...props} />
    </>
  );
};

export default Faq;
