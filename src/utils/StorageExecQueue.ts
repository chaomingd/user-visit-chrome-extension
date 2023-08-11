import { ExecQueue } from './ExecQueue';

export class StorageExecQueue {
  execQueue = new ExecQueue();

  async set(items: { [key: string]: any }) {
    await this.execQueue.exec(() => {
      return chrome.storage.local.set(items);
    });
  }

  async get(
    keys:
      | string
      | string[]
      | {
          [key: string]: any;
        }
  ) {
    return await this.execQueue.exec(() => {
      return chrome.storage.local.get(keys);
    });
  }

  async remove(keys: string | string[]) {
    return await this.execQueue.exec(() => {
      return chrome.storage.local.remove(keys);
    });
  }

  async clear() {
    return await this.execQueue.exec(() => {
      return chrome.storage.local.clear();
    });
  }
}
