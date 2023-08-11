

import { APIFunction } from '../utils/startMessageApiServer';

export const contentApi: {
  getHTMLContent: APIFunction<string>;
  getPageVisibilityState: APIFunction<'visible' | 'hidden'>;
} = {
  getHTMLContent: async () => {
    return document.body.textContent;
  },
  
  getPageVisibilityState: () => {
    return document.visibilityState;
  }
}