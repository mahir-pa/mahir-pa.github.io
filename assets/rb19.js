const stage = document.querySelector('#garage-stage');
const open = document.querySelector('#garage-open');
const status = document.querySelector('#garage-status');
const orbit = document.querySelector('#garage-orbit');
let unavailable = false;

open.addEventListener('click', async event => {
  if (unavailable || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (open.getAttribute('aria-disabled') === 'true') return;
  open.setAttribute('aria-disabled', 'true');
  status.textContent = 'Loading the RB19…';

  try {
    const { showCar } = await import('./rb19/viewer.js');
    await showCar(stage, orbit, () => showFallback('3D view lost. Still image restored.'));
    stage.dataset.mode = 'interactive';
    status.textContent = 'Drag to rotate, or use the controls.';
    orbit.hidden = false;
    if (document.activeElement === open) orbit.querySelector('button').focus();
    open.hidden = true;
  } catch (error) {
    console.warn('RB19 viewer:', error);
    showFallback('3D unavailable on this device. Still image shown.');
  }
});

function showFallback(message) {
  unavailable = true;
  stage.dataset.mode = 'poster';
  status.textContent = message;
  open.removeAttribute('aria-disabled');
  open.textContent = 'Open on Sketchfab ↗';
  if (orbit.contains(document.activeElement)) {
    open.hidden = false;
    open.focus();
  }
  orbit.hidden = true;
  open.hidden = false;
}
