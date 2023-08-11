import { UserVisitServiceWorker } from '.';

export function initTabEvents(this: UserVisitServiceWorker) {
  chrome.tabs.onActivated.addListener((activeInfo) => {
    this.onTabActive(activeInfo);
  });

  chrome.tabs.onUpdated.addListener((_, __, tab) => {
    this.onTabUpdate(tab);
  });
}
