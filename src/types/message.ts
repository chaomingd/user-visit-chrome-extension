
export interface Message<T extends any = string, Data extends any = any> {
  type: T;
  data?: Data;
}
