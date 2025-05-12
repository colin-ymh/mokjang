import styled from 'styled-components';
import { getFormattedTitle } from '@/utils/format';
import { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setTargetEducation } from '@/redux/reducers/target-education-reducer';
import LabelInput from '@/components/atoms/common/input/label-input';
import { useI18n, useScopedI18n } from '../../../../../../locales/client';
import LabelTextarea from '@/components/atoms/common/input/label-textarea';

const AddEducationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
`;

type AddEducationProps = {};

const AddEducation = ({}: AddEducationProps) => {
  const t = useI18n();
  const t_placeholder = useScopedI18n('placeholder');
  const dispatch = useDispatch<AppDispatch>();

  const { targetEducation } = useSelector(
    (state: RootState) => state.targetEducation
  );

  const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedTitle(event.target.value);
    dispatch(setTargetEducation({ ...targetEducation, name: newName }));
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;
    dispatch(
      setTargetEducation({ ...targetEducation, description: newDescription })
    );
  };

  return (
    <AddEducationContainer>
      <LabelInput
        label={t('educationName')}
        placeholder={t_placeholder('educationName')}
        value={targetEducation.name}
        onChange={onChangeName}
      />
      <LabelTextarea
        label={t('educationDescription')}
        placeholder={t_placeholder('educationDescription')}
        value={targetEducation.description}
        onChange={onChangeDescription}
      />
    </AddEducationContainer>
  );
};

export default AddEducation;
