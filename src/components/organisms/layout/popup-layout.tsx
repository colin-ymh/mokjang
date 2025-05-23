'use client';

import React from 'react';

import Wrap from '@/components/atoms/layout/wrap';

import PopupHeader from '@/components/atoms/layout/header/popup-header';
import PopupContent from '@/components/atoms/layout/content/popup-content';
import PopupContainer from '@/components/atoms/layout/container/popup-container';
import { useScopedI18n } from '../../../../locales/client';
import PopupFooter from '@/components/atoms/layout/footer/popup-footer';

export type PopupLayoutProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerRight?: React.ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  isFooterShown?: boolean;
  doneDisabled?: boolean;
  children: React.ReactNode;
};

const PopupLayout = ({
  headerTitle,
  headerRight,
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  isFooterShown = true,
  doneDisabled = false,
  children,
}: PopupLayoutProps): JSX.Element => {
  const t_button = useScopedI18n('button');
  return (
    <Wrap>
      <PopupContainer>
        <PopupHeader
          headerTitle={headerTitle}
          headerRight={headerRight}
          onClickCancel={onClickCancel}
          onClickDone={onClickDone}
          cancelText={cancelText || t_button('cancel')}
          doneText={doneText || t_button('save')}
        />
        <PopupContent>{children}</PopupContent>
        {isFooterShown && (
          <PopupFooter
            onClickCancel={onClickCancel}
            onClickDone={onClickDone}
            cancelText={cancelText || t_button('cancel')}
            doneText={doneText || t_button('save')}
            cancelBackgroundColor={cancelBackgroundColor}
            doneBackgroundColor={doneBackgroundColor}
            doneDisabled={doneDisabled}
          />
        )}
      </PopupContainer>
    </Wrap>
  );
};

export default PopupLayout;
