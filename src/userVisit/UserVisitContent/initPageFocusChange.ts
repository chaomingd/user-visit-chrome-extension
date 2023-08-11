import { UserVisitContent } from '.'
import { contentApiRequest } from '../../messageApi/contentApiRequest'

export function initPageFocusChange(this: UserVisitContent) {
  window.addEventListener('focus', () => {
    console.log('window focus')
    this.setUserActionTimeout();
    contentApiRequest({
      type: 'updateCurrentVisitWhenPageShow'
    })
  })
  window.addEventListener('blur', () => {
    console.log('window blur')
    this.clearUserActionTimeout();
    contentApiRequest({
      type: 'updateCurrentVisitWhenPageHide',
    })
  })
}
