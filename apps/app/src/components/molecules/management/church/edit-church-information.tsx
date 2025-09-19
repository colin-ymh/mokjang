import { Church } from '@mokjang/models';
import EditChurchInformationView from './edit-church-information.view';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  getFormattedContent,
  getFormattedIdentifyNumber,
  getFormattedName,
  getFormattedPhone,
  getIsWellFormedIdentifyNumber,
  getIsWellFormedName,
  getIsWellFormedPhone,
  getIsWellFormedTitle,
} from '@mokjang/utils';
import DaumPostcodeEmbed, { Address } from 'react-daum-postcode';
import PagePopup from '../../../atoms/common/popup/page-popup';
import { BLANK } from '@mokjang/constants';
import { CustomPopup } from '@mokjang/components';
import { useScopedI18n } from '../../../../../locales/client';
import DeleteChurch from '@/components/molecules/church/delete-church';

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
  const t_button = useScopedI18n('button');
  const t_title = useScopedI18n('title');

  const [isSaveEnabled, setIsSaveEnabled] = useState<boolean>(false);

  const [isAddressOpen, setIsAddressOpen] = useState<boolean>(false);

  const [isDeleteChurchOpen, setIsDeleteChurchOpen] = useState<boolean>(false);

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

  const onChangeDenomination = (event: ChangeEvent<HTMLInputElement>) => {
    const newDenomination = getFormattedContent(event.target.value);
    setTargetChurch({
      ...targetChurch,
      denomination: newDenomination,
    });
  };
  const onChangeDenominationItem = (value: string) => {
    setTargetChurch({
      ...targetChurch,
      denomination: value,
    });
  };

  useEffect(() => {
    if (!getIsWellFormedTitle(targetChurch.name)) {
      setIsSaveEnabled(false);
      return;
    }

    if (!getIsWellFormedPhone(targetChurch.phone)) {
      setIsSaveEnabled(false);
      return;
    }

    if (!getIsWellFormedName(targetChurch.pastor)) {
      setIsSaveEnabled(false);
      return;
    }

    if (targetChurch.address === BLANK) {
      setIsSaveEnabled(false);
      return;
    }

    if (!getIsWellFormedTitle(targetChurch.detailAddress)) {
      setIsSaveEnabled(false);
      return;
    }

    if (!getIsWellFormedIdentifyNumber(targetChurch.identifyNumber)) {
      setIsSaveEnabled(false);
      return;
    }

    if (targetChurch.denomination === BLANK) {
      setIsSaveEnabled(false);
      return;
    }
    setIsSaveEnabled(true);
  }, [targetChurch]);

  const onClickDeleteChurchOpen = () => {
    setIsDeleteChurchOpen(true);
  };

  const onClickDeleteChurchClose = () => {
    setIsDeleteChurchOpen(false);
  };

  const props = {
    targetChurch,
    isSaveEnabled,
    onChangeName,
    onChangePhone,
    onChangePastorName,
    onClickAddress,
    onChangeDetailAddress,
    onChangeIdentifyNumber,
    onChangeDenomination,
    onChangeDenominationItem,
    onClickSave,
    onClickDeleteChurchOpen,
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

      {/* 교회 삭제 */}
      <CustomPopup
        isShow={isDeleteChurchOpen}
        onClickClose={onClickDeleteChurchClose}
        onClickCancel={onClickDeleteChurchClose}
        width={400}
        height={500}
        headerTitle={t_title('deleteChurch')}
        cancelText={t_button('cancel')}
        doneDisabled={!isSaveEnabled}
        blur={false}
      >
        <DeleteChurch />
      </CustomPopup>
    </>
  );
};

export default EditChurchInformation;
