import { UserVisitContent } from '.';
import { contentApiRequest } from '../../messageApi/contentApiRequest';

// user action time out
const USER_ACTION_TIME_OUT = 5 * 60 * 1000;

export function initUserActionTimeout(this: UserVisitContent) {
  document.addEventListener('mousedown', this.setUserActionTimeout);
  document.addEventListener('mousemove', this.setUserActionTimeout);
  document.addEventListener('wheel', this.setUserActionTimeout);
}
