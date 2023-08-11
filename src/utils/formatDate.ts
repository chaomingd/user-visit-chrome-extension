import { paddZero } from './string'

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${paddZero(date.getMonth() + 1)}-${paddZero(date.getDate())} ${paddZero(date.getHours())}:${paddZero(date.getMinutes())}:${paddZero(date.getSeconds())}`;
}