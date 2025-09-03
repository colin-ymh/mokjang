'use client';

import React from 'react';

import Wrap from '../../atoms/layout/wrap';

import PopupHeader from '../../atoms/layout/header/popup-header';
import PopupContent from '../../atoms/layout/content/popup-content';
import PopupContainer from '../../atoms/layout/container/popup-container';
import { useScopedI18n } from '../../../../locales/client';
import PopupFooter from '../../atoms/layout/footer/popup-footer';

export type PopupLayoutProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  isFooterShown?: boolean;
  isHeaderShown?: boolean;
  doneDisabled?: boolean;
  isHeaderBorderShown?: boolean;
  headerHeight?: number;
  children: React.ReactNode;
};

const PopupLayout = ({
  headerTitle,
  headerDescription,
  headerLeft,
  headerRight,
  onClickCancel,
  onClickDone,
  cancelText,
  doneText,
  cancelBackgroundColor,
  doneBackgroundColor,
  isHeaderShown = true,
  isFooterShown = true,
  doneDisabled = false,
  isHeaderBorderShown,
  headerHeight,
  children,
}: PopupLayoutProps): JSX.Element => {
  const t_button = useScopedI18n('button');
  return (
    <Wrap>
      <PopupContainer>
        {isHeaderShown && (
          <PopupHeader
            headerTitle={headerTitle}
            headerDescription={headerDescription}
            headerLeft={headerLeft}
            headerRight={headerRight}
            onClickCancel={onClickCancel}
            onClickDone={onClickDone}
            cancelText={cancelText || t_button('cancel')}
            doneText={doneText || t_button('save')}
            isHeaderBorderShown={isHeaderBorderShown}
            height={headerHeight}
          />
        )}
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
