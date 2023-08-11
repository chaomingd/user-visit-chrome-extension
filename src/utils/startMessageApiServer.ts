import { Message } from '../types/message';

export interface BaseAPIFunctions {
  [key: string]: APIFunction;
}

export type APIFunction<Data extends any = any> = (
  message: Message,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => Data | Promise<Data>;


function log(type: string) {
  console.log(`message api url: ${type}`)
}

export function startMessageApiServer<APIFunctions extends BaseAPIFunctions>(
  apiFunctions: APIFunctions
) {
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      const apiFunction = apiFunctions[message.type as keyof APIFunctions];

      if (apiFunction) {
        Promise.resolve(apiFunction(message, sender, sendResponse)).then(resData => {
          log(message.type);
          if (resData !== undefined || resData !== null) {
            sendResponse(resData);
          }
        }).catch(e => {
          console.log(e);
          sendResponse(null);
        })

      } else {
        sendResponse(null);
      }


      return true;
    }
  );

}
