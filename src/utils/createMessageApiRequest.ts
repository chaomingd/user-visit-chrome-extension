import { Message } from '../types/message'
import { BaseAPIFunctions } from './startMessageApiServer'

type Unpacked<T> = T extends Promise<infer R> ? Unpacked<R> : T;
export function createContentMessageApiRequest<APIFunctions extends BaseAPIFunctions>() {
  return function<T extends keyof APIFunctions>(message: Message<T>): Promise<Unpacked<ReturnType<APIFunctions[T]>>> {
    return chrome.runtime.sendMessage(message)
  }
}

export function createServiceWorkerMessageApiRequest<APIFunctions extends BaseAPIFunctions>() {
  return function<T extends keyof APIFunctions>(tabId: number, message: Message<T>): Promise<Unpacked<ReturnType<APIFunctions[T]>>> {
    return chrome.tabs.sendMessage(tabId, message)
  }
}
