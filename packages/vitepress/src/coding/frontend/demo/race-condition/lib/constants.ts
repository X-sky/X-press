import { requestA, requestB } from './request';

export const TAB_LIST = [
  {
    id: '0',
    name: 'Tab0'
  },
  {
    id: '1',
    name: 'Tab1'
  }
] as const;
export type TabItem = typeof TAB_LIST[number];
export type TabIds = TabItem['id'];
export type TabNames = TabItem['name'];

type UnstableReqMap = Record<TabNames, (str: string) => Promise<string>>;
export const UNSTABLE_REQ_MAP: UnstableReqMap = {
  Tab0: requestA,
  Tab1: requestB
};
