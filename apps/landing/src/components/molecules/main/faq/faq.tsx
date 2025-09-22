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
    // router.push('/contact');
    //   https://forms.gle/ABc2SPpYkdpAn5k96 로 이동
    window.open(
      'https://forms.gle/ABc2SPpYkdpAn5k96',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const onClickDonate = () => {
    window.open(
      'https://horn-skipjack-ebf.notion.site/2769d70a6ddf80c3a134c80922fa49a3',
      '_blank',
      'noopener,noreferrer'
    );
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
