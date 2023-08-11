import { parseURL } from '../../utils/parseURL';
import { isWebsite } from '../../utils/isWebsite';
import { UserVisitStore } from '../UserVisitStore';
import { initTabEvents } from './initTabEvents';
import { initAlarm } from './initAlarm';
import { ExecQueue } from '../../utils/ExecQueue';

export class UserVisitServiceWorker {
  execQueue = new ExecQueue();
  currentDomain = '';
  userVisitStore = new UserVisitStore();
  init() {
    // init tab events (onActivate, onUpdated)
    initTabEvents.call(this);

    // init alarms task
    initAlarm.call(this, {
      periodInMinutes: 0.1
    });
  }

  async onTabActive(activeInfo: chrome.tabs.TabActiveInfo) {
    await this.execQueue.exec(async () => {
      const currentTab = await chrome.tabs.get(activeInfo.tabId);
      const urlObj = parseURL(currentTab.url);
      if (!isWebsite(urlObj)) return;
      if (currentTab.status === 'complete') {
        await this.userVisitStore.setCurrentVisit(currentTab);
      }
    });
  }

  async onTabUpdate(tab: chrome.tabs.Tab) {
    await this.execQueue.exec(async () => {
      const urlObj = parseURL(tab.url);
      if (!isWebsite(urlObj)) return;
      if (tab.status === 'complete') {
        await this.userVisitStore.updateCurrentVisit(tab);
      }
    });
  }

  async save() {
    console.log('--save----');
    const visitedData = await this.userVisitStore.getVisitedData();

    // 保存
    console.log(visitedData);

    // 保存后清除记录
  }
}

const userVisitServiceWorker = new UserVisitServiceWorker();

export default userVisitServiceWorker;
