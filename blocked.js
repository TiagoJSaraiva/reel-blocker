const FALLBACK_DELAY_MS = 500;

// After an SPA block, one step back lands on the blocked route again, so skip it too.
const stepsBack = new URLSearchParams(location.search).has('spa') ? 2 : 1;

function leaveTab() {
  // window.close() only works on a tab with a single history entry.
  if (history.length === 1) {
    window.close();
  } else {
    chrome.tabs.update({ url: 'chrome://newtab/' });
  }
}

document.getElementById('back').addEventListener('click', () => {
  // history.go() is a no-op when there is nothing to go back to, and beforeunload only fires when it navigates.
  const fallback = setTimeout(leaveTab, FALLBACK_DELAY_MS);
  window.addEventListener('beforeunload', () => clearTimeout(fallback));
  history.go(-stepsBack);
});
