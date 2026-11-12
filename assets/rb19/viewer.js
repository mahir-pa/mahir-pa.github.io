import * as Three from '../vendor/three.module.js';
import { GLTFLoader } from '../vendor/loaders/GLTFLoader.js';
import { MeshoptDecoder } from '../vendor/meshopt_decoder.module.js';
import { RoomEnvironment } from '../vendor/environments/RoomEnvironment.js';

export async function showCar(stage, controls, onContextLost) {
  const renderer = new Three.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  renderer.toneMapping = Three.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new Three.Scene();
  const camera = new Three.PerspectiveCamera(36, 1, .1, 50);
  const turntable = new Three.Group();
  const carPivot = new Three.Group();
  turntable.add(carPivot);
  scene.add(turntable);
  scene.add(new Three.HemisphereLight(0xf3f6ff, 0x596476, 1.35));
  const key = new Three.DirectionalLight(0xfff4e3, 1.9);
  key.position.set(-3, 7, 5);
  scene.add(key);
  const rim = new Three.DirectionalLight(0xd1e1ff, 1.8);
  rim.position.set(4, 4, -5);
  scene.add(rim);

  const room = new RoomEnvironment();
  const pmrem = new Three.PMREMGenerator(renderer);
  const lighting = pmrem.fromScene(room, .05);
  scene.environment = lighting.texture;
  room.dispose();
  pmrem.dispose();

  try {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const { scene: car } = await loader.loadAsync(new URL('./rb19.glb', import.meta.url).href);
    const bounds = new Three.Box3().setFromObject(car);
    const center = bounds.getCenter(new Three.Vector3());
    const size = bounds.getSize(new Three.Vector3());
    const scale = 4.8 / Math.max(size.x, size.y, size.z);
    car.scale.multiplyScalar(scale);
    car.position.sub(center.multiplyScalar(scale));
    carPivot.add(car);

    const shadow = new Three.Mesh(new Three.PlaneGeometry(size.x * scale * 1.55, size.z * scale * 1.15),
      new Three.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: `varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `varying vec2 vUv;
          void main() {
            float alpha = 1.0 - smoothstep(0.12, 0.5, distance(vUv, vec2(0.5)));
            gl_FragColor = vec4(0.03, 0.04, 0.07, alpha * 0.65);
          }`
      }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -size.y * scale / 2 - .03;
    turntable.add(shadow);
  } catch (error) {
    lighting.dispose();
    renderer.dispose();
    throw error;
  }

  const canvas = renderer.domElement;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Interactive 3D model of the Red Bull RB19');
  stage.append(canvas);
  const initialAngle = 1.02;
  let angle = initialAngle;
  let tilt = 0;
  const tiltLimit = Math.PI / 6;
  let zoom = 1;
  let pointer = null;
  let previousX;
  let previousY;
  let renderWidth = 0;
  let renderHeight = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const spinButton = controls.querySelector('[data-view="spin"]');
  const spinRate = 2 * Math.PI / 45;
  let spinning = !reducedMotion.matches;
  let inView = false;
  let frame = 0;
  let previousTime = 0;

  function syncSpin() {
    spinButton.textContent = spinning ? 'Pause spin' : 'Resume spin';
    if (spinning && inView && !document.hidden && pointer === null) {
      if (!frame) frame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }
  }

  function animate(time) {
    if (!previousTime) previousTime = time;
    const elapsed = time - previousTime;
    if (elapsed >= 30) {
      angle = (angle + spinRate * Math.min(elapsed, 80) / 1000) % (2 * Math.PI);
      previousTime = time;
      render();
    }
    frame = requestAnimationFrame(animate);
  }

  function updateMotionPreference(event) {
    spinning = !event.matches;
    syncSpin();
  }

  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncSpin();
  });
  visibility.observe(stage);
  document.addEventListener('visibilitychange', syncSpin);
  reducedMotion.addEventListener('change', updateMotionPreference);
  syncSpin();

  function render() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    const distance = Math.max(1, 1.67 / camera.aspect) / zoom;
    camera.position.set(0, 2.72 * distance, 5.45 * distance);
    camera.lookAt(0, -.1, 0);
    camera.updateProjectionMatrix();
    turntable.rotation.y = angle;
    carPivot.rotation.z = tilt;
    if (width !== renderWidth || height !== renderHeight) {
      renderer.setSize(width, height, false);
      renderWidth = width;
      renderHeight = height;
    }
    renderer.render(scene, camera);
  }

  const resize = new ResizeObserver(render);
  resize.observe(stage);
  function tiltBy(delta) {
    tilt = Three.MathUtils.clamp(tilt + delta, -tiltLimit, tiltLimit);
  }

  function changeView(event) {
    switch (event.target.closest('button')?.dataset.view) {
      case 'left': angle -= .28; break;
      case 'right': angle += .28; break;
      case 'in': zoom = Math.min(1.65, zoom * 1.16); break;
      case 'out': zoom = Math.max(.72, zoom / 1.16); break;
      case 'tilt-left': tiltBy(.14); break;
      case 'tilt-right': tiltBy(-.14); break;
      case 'reset': angle = initialAngle; tilt = 0; zoom = 1; break;
      case 'spin': spinning = !spinning; syncSpin(); return;
      default: return;
    }
    render();
  }
  controls.addEventListener('click', changeView);
  canvas.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = event.pointerId;
    previousX = event.clientX;
    previousY = event.clientY;
    canvas.setPointerCapture(pointer);
    syncSpin();
  });
  canvas.addEventListener('pointermove', event => {
    if (pointer !== event.pointerId) return;
    angle += (event.clientX - previousX) * .011;
    if (event.pointerType !== 'touch') tiltBy((event.clientY - previousY) * .009);
    previousX = event.clientX;
    previousY = event.clientY;
    render();
  });
  canvas.addEventListener('lostpointercapture', () => {
    pointer = null;
    syncSpin();
  });
  canvas.addEventListener('webglcontextlost', () => {
    spinning = false;
    syncSpin();
    visibility.disconnect();
    document.removeEventListener('visibilitychange', syncSpin);
    reducedMotion.removeEventListener('change', updateMotionPreference);
    resize.disconnect();
    controls.removeEventListener('click', changeView);
    lighting.dispose();
    renderer.dispose();
    canvas.remove();
    onContextLost();
  }, { once: true });
  render();
}
