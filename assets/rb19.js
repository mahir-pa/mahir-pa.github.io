const stage = document.querySelector('#garage-stage');
const source = document.querySelector('#garage-source');
const status = document.querySelector('#garage-status');
const orbit = document.querySelector('#garage-orbit');

function showFallback(message) {
  stage.dataset.mode = 'poster';
  status.textContent = message;
  source.hidden = false;
  if (orbit.contains(document.activeElement)) source.focus();
  orbit.hidden = true;
}

try {
  const { showCar } = await import('./rb19/viewer.js?v=3');
  await showCar(stage, orbit, () => showFallback('3D view lost. Still image restored.'));
  stage.dataset.mode = 'interactive';
  status.textContent = 'Drag to turn or tilt. Use the tilt buttons on touchscreens.';
  orbit.hidden = false;
} catch (error) {
  console.warn('RB19 viewer:', error);
  showFallback('3D unavailable. Still image shown.');
}
