import { UserVisitServiceWorker } from '.';
import { createAlarm } from '../../alarm';
import { serviceWorkerApiRequest } from '../../messageApi/serviceWorkerApiRequest';
import { getCurrentTab } from '../../utils/getCurrentTab';

const ALARM_NAME = 'alarm-user-visit-update';

export function initAlarm(this: UserVisitServiceWorker, options: chrome.alarms.AlarmCreateInfo) {
  createAlarm(ALARM_NAME, async () => {
    try {
      const currentTab = await getCurrentTab(true);

      if (currentTab) {
        const visibilityState = await serviceWorkerApiRequest(currentTab.id, {
          type: 'getPageVisibilityState'
        })

        if (!visibilityState) return;

        if (visibilityState === 'visible') {
          await this.onTabUpdate(currentTab);
        }
      }
    } catch (error) {
      console.log(error);
    }
    await this.save();
  }, options);
}
