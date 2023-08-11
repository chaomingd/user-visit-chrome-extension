import { parseURL } from '../utils/parseURL';
import { formatDate } from '../utils/formatDate';
import { groupBy } from '../utils/array';
import {
  VisitMeta,
  VisitItem,
  VisitType,
  VisitedData,
  ArchivedVisitedData,
} from './types';
import { ExecQueue } from '../utils/ExecQueue';
import { StorageExecQueue } from '../utils/StorageExecQueue';
import { uuid } from '../utils/uuid';

// store current visit info
const CURRENT_VISIT_KEY = 'current_visit';
// store user visit data
const VISIT_DATD_KEY = 'visit_data';

// store archived visit data
const ARCHIVED_VISIT_DATA_KEY = 'archived_visit_data';


// (async () => {
//   await chrome.storage.local.remove([CURRENT_VISIT_KEY, VISIT_DATD_KEY, ARCHIVED_VISIT_DATA_KEY])
// })()

export class UserVisitStore {
  execQueue = new ExecQueue();
  storage = new StorageExecQueue();
  // start new host user visit info
  async setCurrentVisit(tab: chrome.tabs.Tab, currentVisitTime?: string) {
    await this.updateCurrentVisit(tab, false);
    const urlObj = parseURL(tab.url)!;
    let visitTime = currentVisitTime;
    const currentDate = new Date();
    if (!visitTime) {
      visitTime = formatDate(currentDate);
    }
    const visitData: VisitMeta = {
      host: urlObj.host,
      url: tab.url!,
      time: currentDate.getTime(),
      visitTime: visitTime,
      tabId: tab.id,
    };
    await this.storage.set({
      [CURRENT_VISIT_KEY]: visitData,
    });
    return visitData;
  }

  async clearCurrentVisit() {
    await this.storage.remove([CURRENT_VISIT_KEY]);
  }

  async getCurrentVisit(): Promise<VisitMeta | null> {
    return (
      (await this.storage.get([CURRENT_VISIT_KEY]))[CURRENT_VISIT_KEY] || null
    );
  }

  async updateCurrentVisit(tab: chrome.tabs.Tab, setNextCurrentVisit = true) {
    const urlObj = parseURL(tab.url)!;
    const host = urlObj.host;
    const currentVisitMeta = await this.getCurrentVisit();
    if (!currentVisitMeta) {
      return;
    }
    await this.generateVisitedData({
      host,
      currentVisitMeta,
      tabUrlObject: urlObj,
      tab,
    });
    let currentVisitTime =
      host === currentVisitMeta.host ? currentVisitMeta.visitTime : void 0;
    if (setNextCurrentVisit) {
      await this.setCurrentVisit(tab, currentVisitTime);
    }
  }

  async generateVisitedData(config: {
    host: string;
    currentVisitMeta: VisitMeta;
    tabUrlObject: URL;
    tab: chrome.tabs.Tab;
  }) {
    const { host, currentVisitMeta, tab } = config;
    const currentTime = new Date();
    const currentHost = currentVisitMeta.host;
    const visitDuration = currentTime.getTime() - currentVisitMeta.time;

    // generate visited data
    const currentVisitedData: VisitItem = {
      host: currentHost,
      tabId: currentVisitMeta.tabId,
      visitDuration,
      type: host === currentVisitMeta.host ? VisitType.visit : VisitType.leave,
      url: host === currentVisitMeta.host ? tab.url! : currentVisitMeta.url,
      visitTime: currentVisitMeta.visitTime,
      leaveTime: formatDate(currentTime),
    };

    const visitedData = await this.getVisitedData();

    if (!visitedData[currentHost]) {
      visitedData[currentHost] = [];
    }
    visitedData[currentHost].push(currentVisitedData);

    // 合并相同 tabId 的数据
    const { keys: tabIds, map: tabIdGroup } = groupBy(
      visitedData[currentHost],
      (item) => item.tabId!
    );
    visitedData[currentHost] = (tabIds as number[]).map((tabId) => {
      return tabIdGroup[tabId].reduce((prev, item) => {
        prev.visitDuration += item.visitDuration;
        prev.url = item.url;
        prev.leaveTime = item.leaveTime;
        prev.tabId = tabId;
        return prev;
      });
    });

    await this.setVisitedData(visitedData);
  }

  async getVisitedData(): Promise<VisitedData> {
    return (await this.storage.get(VISIT_DATD_KEY))[VISIT_DATD_KEY] || {};
  }

  async setVisitedData(data: VisitedData) {
    await this.storage.set({
      [VISIT_DATD_KEY]: data,
    });
    return data;
  }

  async setArchivedVisitedData(data: VisitedData) {
    await this.storage.set({
      [ARCHIVED_VISIT_DATA_KEY]: {
        id: uuid(),
        data,
      },
    });
  }

  async getArchivedVisitedData(): Promise<VisitedData | null> {
    return (
      (await this.storage.get(ARCHIVED_VISIT_DATA_KEY))[
        ARCHIVED_VISIT_DATA_KEY
      ] || null
    );
  }
}
