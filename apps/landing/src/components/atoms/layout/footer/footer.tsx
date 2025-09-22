import FooterView, {
  FooterViewProps,
} from '@/components/atoms/layout/footer/footer.view';

const Footer = () => {
  const onClickCollectionLink = () => {
    window.open(
      'https://horn-skipjack-ebf.notion.site/2739d70a6ddf80b6b398ccb767305a59?pvs=74',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const onClickTermLink = () => {
    window.open(
      'https://horn-skipjack-ebf.notion.site/2749d70a6ddf8027b794dc21341d92ac?pvs=74',
      '_blank',
      'noopener,noreferrer'
    );
  };
  const props = {
    onClickCollectionLink,
    onClickTermLink,
  } as FooterViewProps;

  return (
    <>
      <FooterView {...props} />
    </>
  );
};

export default Footer;
