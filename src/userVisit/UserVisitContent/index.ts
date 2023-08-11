import { contentApiRequest } from '../../messageApi/contentApiRequest';
import { initPageFocusChange } from './initPageFocusChange';
import { initUserActionTimeout } from './initUserActionTimeout';

// user action time out
const USER_ACTION_TIME_OUT = 5 * 60 * 1000;

export class UserVisitContent {
  userActionTimer: NodeJS.Timeout;
  init() {
    // page focus
    initPageFocusChange.call(this);

    // user action (mousedown, mousemove, wheel) time out
    initUserActionTimeout.call(this);
  }

  clearUserActionTimeout() {
    clearTimeout(this.userActionTimer);
  }

  setUserActionTimeout = () => {
    clearTimeout(this.userActionTimer);
    this.userActionTimer = setTimeout(() => {
      contentApiRequest({
        type: 'updateCurrentVisitWhenPageHide'
      })
    }, USER_ACTION_TIME_OUT);
  }
}

const userVisitContent = new UserVisitContent();

export default userVisitContent;

