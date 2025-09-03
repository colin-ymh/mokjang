import { Church } from '../../../../models/church/church';
import EditChurchInformationView from './edit-church-information.view';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  getFormattedIdentifyNumber,
  getFormattedName,
  getFormattedPhone,
} from '../../../../utils/format';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import PagePopup from '../../../atoms/common/popup/page-popup';

type EditChurchInformationProps = {
  targetChurch: Church;
  setTargetChurch: Dispatch<SetStateAction<Church>>;
  onClickSave?: () => void;
};

const EditChurchInformation = ({
  targetChurch,
  setTargetChurch,
  onClickSave,
}: EditChurchInformationProps) => {
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setTargetChurch({
      ...targetChurch,
      name: newName,
    });
  };

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = getFormattedPhone(event.target.value);
    setTargetChurch({
      ...targetChurch,
      phone: newPhone,
    });
  };

  const onChangePastorName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setTargetChurch({
      ...targetChurch,
      pastor: newName,
    });
  };

  const onClickAddress = () => {
    setIsAddressOpen(true);
  };

  const onClickAddressClose = () => {
    setIsAddressOpen(false);
  };

  // 도로명주소 검색 api 내 주소 선택 이벤트
  const onCompleteAddress = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setTargetChurch({
      ...targetChurch,
      address: fullAddress,
    });
    setIsAddressOpen(false);
  };

  const onChangeDetailAddress = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDetailAddress = event.target.value;
    setTargetChurch({
      ...targetChurch,
      detailAddress: newDetailAddress,
    });
  };

  const onChangeIdentifyNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newIdentifyNumber = getFormattedIdentifyNumber(event.target.value);
    setTargetChurch({
      ...targetChurch,
      identifyNumber: newIdentifyNumber,
    });
  };

  const onChangeDenomination = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetChurch({
      ...targetChurch,
      denomination: event.target.value,
    });
  };

  // useEffect(() => {
  //   if (targetChurch.mainAdminId) {
  //   }
  // }, [targetChurch.mainAdminId]);

  const props = {
    targetChurch,
    onChangeName,
    onChangePhone,
    onChangePastorName,
    onClickAddress,
    onChangeDetailAddress,
    onChangeIdentifyNumber,
    onChangeDenomination,
    onClickSave,
  };

  return (
    <>
      <EditChurchInformationView {...props} />
      <PagePopup isShow={isAddressOpen} onClickClose={onClickAddressClose}>
        <DaumPostcodeEmbed
          onComplete={onCompleteAddress}
          style={{ width: '100%', height: '100%' }}
        />
      </PagePopup>
    </>
  );
};

export default EditChurchInformation;
