'use client';

import Wrap from './wrap';
import { PopupContainer } from './popup-container';
import { PopupHeader } from './popup-header';
import { PopupContent } from './popup-content';
import { PopupFooter } from './popup-footer';
import { BLANK } from '@mokjang/constants';
import { ReactNode } from 'react';

export type PopupLayoutProps = {
  onClickClose: () => void;
  onClickCancel?: () => void;
  onClickDone?: () => void;
  headerTitle?: string;
  headerDescription?: string;
  headerRight?: ReactNode;
  headerLeft?: ReactNode;
  cancelText?: string;
  doneText?: string;
  cancelBackgroundColor?: string;
  doneBackgroundColor?: string;
  isFooterShown?: boolean;
  isHeaderShown?: boolean;
  doneDisabled?: boolean;
  isHeaderBorderShown?: boolean;
  headerHeight?: number;
  children: ReactNode;
};

export const PopupLayout = ({
  headerTitle,
  headerDescription,
  headerRight,
  headerLeft,
  onClickClose,
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
            headerLeft={headerLeft}
            headerRight={headerRight}
            onClickClose={onClickClose}
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
