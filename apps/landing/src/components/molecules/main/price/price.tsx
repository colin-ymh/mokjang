import PriceView, {
  PriceViewProps,
} from '@/components/molecules/main/price/price.view';

const Price = () => {
  const props = {} as PriceViewProps;

  return (
    <>
      <PriceView {...props} />
    </>
  );
};

export default Price;
