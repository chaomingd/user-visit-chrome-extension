export interface VisitMeta {
  host: string;
  url: string;
  time: number;
  visitTime: string;
  tabId: number | undefined;
}

export enum VisitType {
  visit = 'visit',
  leave = 'leave',
}

export interface VisitItem {
  host: string;
  visitDuration: number;
  type: VisitType;
  url: string;
  visitTime: string;
  leaveTime: string;
  tabId: number | undefined;
}

export interface VisitedData {
  [key: string]: VisitItem[];
}

export interface ArchivedVisitedData {
  id: string;
  data: VisitedData;
}