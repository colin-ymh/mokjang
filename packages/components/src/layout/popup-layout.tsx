'use client';

import React from 'react';
import Wrap from './wrap';
import PopupContainer from './popup-container';
import { PopupHeader } from './popup-header';
import { PopupContent } from './popup-content';
import { PopupFooter } from './popup-footer';
import { BLANK } from '@mokjang/constants';

export type PopupLayoutProps = {
  onClickCancel: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
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

export const PopupLayout = ({
  headerTitle,
  headerDescription,
  headerRight,
  onClickCancel,
  onClickDone,
  cancelText = BLANK,
  doneText = BLANK,
  cancelBackgroundColor,
  doneBackgroundColor,
  isHeaderShown = true,
  isFooterShown = true,
  doneDisabled = false,
  isHeaderBorderShown,
  headerHeight,
  children,
}: PopupLayoutProps): JSX.Element => {
  return (
    <Wrap>
      <PopupContainer>
        {isHeaderShown && (
          <PopupHeader
            headerTitle={headerTitle}
            headerDescription={headerDescription}
            headerRight={headerRight}
            onClickCancel={onClickCancel}
            onClickDone={onClickDone}
            cancelText={cancelText}
            doneText={doneText}
            isHeaderBorderShown={isHeaderBorderShown}
            height={headerHeight}
          />
        )}
        <PopupContent>{children}</PopupContent>
        {isFooterShown && (
          <PopupFooter
            onClickCancel={onClickCancel}
            onClickDone={onClickDone}
            cancelText={cancelText}
            doneText={doneText}
            cancelBackgroundColor={cancelBackgroundColor}
            doneBackgroundColor={doneBackgroundColor}
            doneDisabled={doneDisabled}
          />
        )}
      </PopupContainer>
    </Wrap>
  );
};
