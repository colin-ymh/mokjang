import { useState } from 'react';

import VisitationListView from '@/components/organisms/visitation/list/visitation-list.view';

type VisitationListProps = {};

const VisitationList = ({}: VisitationListProps) => {
  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const props = {};

  return (
    <>
      <VisitationListView {...props} />
    </>
  );
};

export default VisitationList;
