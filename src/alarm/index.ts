type AlarmFunction = (alarm: chrome.alarms.Alarm) => any;

const ALARM_FUNCTIONS: Record<string, AlarmFunction[]> = {};

chrome.alarms.onAlarm.addListener((alarm) => {
  const fns = ALARM_FUNCTIONS[alarm.name];
  if (fns && fns.length) {
    fns.forEach((fn) => fn(alarm));
  }
});

export function createAlarm(
  name: string,
  fn: AlarmFunction,
  options: chrome.alarms.AlarmCreateInfo
) {
  chrome.alarms.create(name, options);

  if (!ALARM_FUNCTIONS[name]) {
    ALARM_FUNCTIONS[name] = [];
  }

  ALARM_FUNCTIONS[name].push(fn);

  return () => {
    ALARM_FUNCTIONS[name] = ALARM_FUNCTIONS[name].filter(f => f !== fn);
  }
}
