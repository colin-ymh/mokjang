import FaqView, {
  FaqViewProps,
} from '@/components/molecules/main/faq/faq.view';
import { useState } from 'react';
import { FAQ } from '@/constants/constant';
import { usePageRouter } from '@mokjang/app/src/utils/router';

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

  const props = {
    openedQuestion,
    onClickQuestion,
    onClickContact,
  } as FaqViewProps;

  return (
    <>
      <FaqView {...props} />
    </>
  );
};

export default Faq;
