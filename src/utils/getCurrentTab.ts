export async function getCurrentTab(lastFocusedWindow = false) {
  let queryOptions = { active: true, lastFocusedWindow };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
