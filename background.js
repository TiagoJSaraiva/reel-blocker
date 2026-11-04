// Same patterns as the regexFilter entries in rules.json. Keep both in sync.
const BLOCKED_URL_PATTERNS = [
  /^https?:\/\/((www|m)\.)?youtube\.com\/shorts([/?#]|$)/i,
  /^https?:\/\/(www\.)?instagram\.com\/(reels([/?#]|$)|([^/?#]+\/)?reel\/)/i,
];

// The "spa" flag tells blocked.js that the blocked route has its own history entry.
const BLOCKED_PAGE_PATH = 'blocked.html?spa';

// SPA route changes use history.pushState and never reach the rules in rules.json.
chrome.webNavigation.onHistoryStateUpdated.addListener(
  ({ frameId, tabId, url }) => {
    if (frameId !== 0 || !BLOCKED_URL_PATTERNS.some((pattern) => pattern.test(url))) {
      return;
    }
    chrome.tabs
      .update(tabId, { url: chrome.runtime.getURL(BLOCKED_PAGE_PATH) })
      .catch((error) => console.warn('Could not redirect tab', tabId, error));
  },
  { url: [{ hostSuffix: 'youtube.com' }, { hostSuffix: 'instagram.com' }] },
);
