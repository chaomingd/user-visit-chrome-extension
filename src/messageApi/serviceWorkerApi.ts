import { getCurrentTab } from '../utils/getCurrentTab';
import { APIFunction } from '../utils/startMessageApiServer';
import userVisitServiceWorker from '../userVisit/UserVisitServiceWorker';

export const serviceWorkerApi: {
  getCurrentTabId: APIFunction<number>;
  updateCurrentVisit: APIFunction;
  updateCurrentVisitWhenPageHide: APIFunction;
  updateCurrentVisitWhenPageShow: APIFunction;
} = {
  getCurrentTabId: async () => {
    return (await getCurrentTab()).id;
  },

  updateCurrentVisit: async (_, sender) => {
    const currentTab = await getCurrentTab();
    if (sender.tab?.id === currentTab.id) {
      userVisitServiceWorker.userVisitStore.updateCurrentVisit(currentTab);
    }
  },

  updateCurrentVisitWhenPageHide: async (_, sender) => {
    const currentTab = await getCurrentTab();

    console.log('page hide currentTab', currentTab.id)
    if (sender.tab?.id === currentTab.id) {
      await userVisitServiceWorker.userVisitStore.updateCurrentVisit(currentTab, false);
      await userVisitServiceWorker.userVisitStore.clearCurrentVisit();
    }
  },

  updateCurrentVisitWhenPageShow: async (_, sender) => {
    const currentTab = await getCurrentTab();
    console.log('page show currentTab', currentTab.id)
    if (sender.tab?.id === currentTab.id) {
      userVisitServiceWorker.userVisitStore.setCurrentVisit(currentTab);
    }
  }
}