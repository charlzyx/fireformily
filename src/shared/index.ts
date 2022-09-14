import { BadgeProps } from "antd";
import React from "react";

export type PickArrayItem<T> = T extends Array<infer P> ? P : unknown;

const statusColors = {
  // status
  success: 'green',
  processing: 'blue',
  error: 'red',
  warning: 'gold',
  default: '#fafafa',
} as const

export const colors = {
  length: 11,
  0: 'magenta',
  1: 'green',
  2: 'cyan',
  3: 'geekblue',
  4: 'purple',
  5: 'red',
  6: 'orange',
  7: 'lime',
  8: 'blue',
  9: 'volcano',
  10: 'gold',
  magenta: 'magenta',
  green: 'green',
  cyan: 'cyan',
  geekblue: 'geekblue',
  purple: 'purple',
  red: 'red',
  orange: 'orange',
  lime: 'lime',
  blue: 'blue',
  volcano: 'volcano',
  gold: 'gold',
  ...statusColors,
} as const;

export const isColorStatus = (x = ''): x is Required<BadgeProps>['status'] => {
  return Boolean((statusColors as any)[x])
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type CSSColor = RGB | RGBA | HEX;

export type ColorsKey<T = typeof colors, K = keyof T> = K extends number
  ? never
  : K extends 'length'
  ? never
  : K | CSSColor;

export type TDictShape = {
  emap: {
    [x: string]: string | number;
    [x: number]: string | number;
  };
  colors: {
    [x: string]: string;
    [x: number]: string;
  };
  options: {
    key: string | number;
    label: string;
    value: number | string;
    color?: ColorsKey;
  }[];
};
