import { LOCALE } from '@mokjang/constants';

export const useDenominationDropdownItems = (locale: LOCALE) => {
  const KOREAN_DENOMINATIONS = [
    '대한예수교장로회(통합)',
    '대한예수교장로회(합동)',
    '대한예수교장로회(백석)',
    '한국기독교장로회',
    '대한예수교장로회(고신)',
    '기독교대한하나님의성회',
    '기독교대한성결교회(기성)',
    '예수교대한성결교회(예성)',
    '기독교한국침례회',
    '한국독립교회선교단체연합회',
    '기독교대한감리회',
  ];

  let denominations: string[] = [];

  if (locale === LOCALE.KO) {
    denominations = KOREAN_DENOMINATIONS;
  }

  const items = denominations.map((denomination) => {
    return {
      value: denomination,
      title: denomination,
    };
  });

  return items;
};
