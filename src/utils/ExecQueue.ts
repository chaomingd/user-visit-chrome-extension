// execute queue
// exec one by one

import EventEmitter from './EventEmitter';

type QueueFn<Data extends unknown = any> = (...args: any[]) => Promise<Data>;
export class ExecQueue extends EventEmitter {
  isExecuting = false;
  queueFunctionExecuting = false;
  queueAutoId = 0;
  queue: Array<{
    id: number;
    fn: QueueFn;
  }> = [];
  exec<Data extends unknown = any>(queueFn: QueueFn<Data>): Promise<Data> {
    return new Promise((resolve, reject) => {
      if (this.queueFunctionExecuting) {
        console.warn('push queue function in autoExec probably causing circular dependency');
      }
      const id = ++this.queueAutoId;
      this.queue.push({
        id: id,
        fn: queueFn,
      });
      this.once(`exec-${id}`, (error: Error | null, res: Data) => {
        if (error) {
          reject(error);
        } else {
          resolve(res);
        }
      });
      this.autoExec();
    });
  }
  private async autoExec() {
    if (this.isExecuting) return;
    this.isExecuting = true;
    while (this.queue.length) {
      const { id, fn } = this.queue.shift();
      this.queueFunctionExecuting = true;
      try {
        const res = await fn();
        this.emit(`exec-${id}`, null, res);
      } catch (e) {
        this.emit(`exec-${id}`, e);
        console.error('queue exec error:', e);
      }
      this.queueFunctionExecuting = false;
    }
    this.isExecuting = false;
  }
}
