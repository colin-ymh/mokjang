import { Church } from '@/models/church/church';
import EditChurchInformationView from '@/components/molecules/management/church/edit-church-information.view';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getFormattedMobilePhone, getFormattedName } from '@/utils/format';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import PagePopup from '@/components/atoms/common/popup/page-popup';
import { MemberDropdownType } from '@/components/atoms/common/dropdown/member-dropdown-item';

type EditChurchInformationProps = {
  targetChurch: Church;
  setTargetChurch: Dispatch<SetStateAction<Church>>;
};

const EditChurchInformation = ({
  targetChurch,
  setTargetChurch,
}: EditChurchInformationProps) => {
  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  const [mainAdmins, setMainAdmins] = useState<MemberDropdownType[]>([]);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = getFormattedName(event.target.value);
    setTargetChurch({
      ...targetChurch,
      name: newName,
    });
  };

  const onChangePhone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = getFormattedMobilePhone(event.target.value);
    setTargetChurch({
      ...targetChurch,
      phone: newPhone,
    });
  };

  const onChaneLeaderItem = (members: MemberDropdownType[]) => {
    setMainAdmins(members);
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
    const newIdentifyNumber = event.target.value.replace(/\D/g, '');
    setTargetChurch({
      ...targetChurch,
      identifyNumber: newIdentifyNumber,
    });
  };

  useEffect(() => {
    if (mainAdmins.length > 0) {
      setTargetChurch({ ...targetChurch, mainAdminId: mainAdmins[0].value });
    }
  }, [mainAdmins]);

  useEffect(() => {
    if (targetChurch.mainAdminId) {
    }
  }, [targetChurch.mainAdminId]);

  const props = {
    targetChurch,
    mainAdmins,
    onChangeName,
    onChangePhone,
    onChaneLeaderItem,
    onClickAddress,
    onChangeDetailAddress,
    onChangeIdentifyNumber,
  };

  return (
    <>
      <EditChurchInformationView {...props} />
      <PagePopup isShow={isAddressOpen} onClickCancel={onClickAddressClose}>
        <DaumPostcodeEmbed
          onComplete={onCompleteAddress}
          style={{ width: '100%', height: '100%' }}
        />
      </PagePopup>
    </>
  );
};

export default EditChurchInformation;
