const clocks = [
  ['clock-boston', 'America/New_York'],
  ['clock-surat', 'Asia/Kolkata'],
].map(([id, timeZone]) => ({
  display: document.getElementById(id),
  format: new Intl.DateTimeFormat('en-US', {
    timeZone, hour: 'numeric', minute: '2-digit', hour12: true,
  }),
}));

let timer;
function updateClocks() {
  clearTimeout(timer);
  if (document.hidden) return;
  const now = new Date();
  for (const { display, format } of clocks) {
    display.textContent = format.format(now);
    display.dateTime = now.toISOString();
  }
  timer = setTimeout(updateClocks, 60_000 - Date.now() % 60_000);
}

document.addEventListener('visibilitychange', updateClocks);
updateClocks();
