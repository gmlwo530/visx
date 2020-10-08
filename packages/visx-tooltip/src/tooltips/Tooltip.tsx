import React from 'react';
import cx from 'classnames';

export type TooltipProps = {
  children?: React.ReactNode;
  className?: string;
  left?: number;
  offsetLeft?: number;
  offsetTop?: number;
  /** Styles to apply, unless `unstyled=true`. */
  style?: React.CSSProperties | null;
  top?: number;
  /**
   * Applies position: 'absolute' for tooltips to correctly position themselves
   * when `unstyled=true`. In a future major release this will be the default behavior.
   */
  applyPositionStyle?: boolean;
  /**
   * Whether to omit applying any style, except `left` / `top`.
   * In most cases if this is `true` a developer must do one of the following
   * for positioning to work correctly:
   * - set `applyPositionStyles=true`
   * - create a CSS selector like: `.visx-tooltip { position: 'absolute' }`
   */
  unstyled?: boolean;
};

export const defaultStyles: React.CSSProperties = {
  position: 'absolute',
  backgroundColor: 'white',
  color: '#666666',
  padding: '.3rem .5rem',
  borderRadius: '3px',
  fontSize: '14px',
  boxShadow: '0 1px 2px rgba(33,33,33,0.2)',
  lineHeight: '1em',
  pointerEvents: 'none',
};

export default function Tooltip({
  className,
  top,
  left,
  offsetLeft = 10,
  offsetTop = 10,
  style = defaultStyles,
  children,
  unstyled = false,
  applyPositionStyle = false,
  ...restProps
}: TooltipProps & React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cx('visx-tooltip', className)}
      style={{
        top: top == null || offsetTop == null ? top : top + offsetTop,
        left: left == null || offsetLeft == null ? left : left + offsetLeft,
        ...(applyPositionStyle && { position: 'absolute' }),
        ...(!unstyled && style),
      }}
      {...restProps}
    >
      {children}
    </div>
  );
}
