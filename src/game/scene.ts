import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createPlayerAutoRickshaw,
  createDhakaBus,
  createCycleRickshaw,
  createCngTaxi,
  createCowObstacle,
  createPotholeObstacle,
  createDividerSegment,
  createDhakaBuilding,
  createBillboardMesh,
  createTeaStall,
  createTakaPickup,
  createBatteryPickup,
} from './models';
import { createRoadTexture } from './textures';
import { sound } from './audio';

export interface GameState {
  score: number; // meters driven
  fare: number; // ৳ collected
  speedKmh: number;
  battery: number; // 0-100%
  combo: number;
  gameOver: boolean;
  paused: boolean;
  nearMissCount: number;
  lastComment: string;
  crashCause?: { headline: string; sub: string; advice: string };
}

export interface GameOptions {
  difficulty: 'mirpur' | 'farmgate' | 'gulshan';
  rickshawColor: 'green' | 'yellow' | 'blue' | 'red';
  graphicsQuality: 'low' | 'med' | 'high';
}

// Reusable math objects outside loop to prevent Garbage Collection pauses
const _playerBox = new THREE.Box3();
const _trafficBox = new THREE.Box3();
const _itemBox = new THREE.Box3();

export class DhakaGameEngine {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDestroyed = false;

  // Quality & Detection
  private isSoftwareGl = false;
  private options: GameOptions;

  // Player Entity
  private playerGroup!: THREE.Group;
  private playerX = 0; // -3.6 to +3.6
  private playerTargetX = 0;
  private playerSpeed = 0; // current speed units
  private maxSpeed = 38; // base max speed km/h
  private playerSteerTilt = 0;
  private playerPitchTilt = 0;
  private isInvincible = false;
  private invincibleTimer = 0;

  // Road Chunks (Endless road system)
  private roadChunks: THREE.Group[] = [];
  private readonly CHUNK_LENGTH = 80;
  private readonly CHUNK_COUNT = 4;
  private roadTex!: THREE.CanvasTexture;

  // Active Traffic and Items
  private traffic: {
    mesh: THREE.Group;
    type: 'bus' | 'rickshaw' | 'cng' | 'cow' | 'pothole' | 'stall';
    speed: number;
    lane: number;
    swerveTimer: number;
    swerveDir: number;
    nearMissTriggered: boolean;
  }[] = [];

  private collectibles: {
    mesh: THREE.Group;
    type: 'taka' | 'battery';
    rotSpeed: number;
  }[] = [];

  // Scenery props (Buildings & Billboards on roadside)
  private sceneryProps: THREE.Group[] = [];

  // State
  public state: GameState = {
    score: 0,
    fare: 0,
    speedKmh: 0,
    battery: 100,
    combo: 0,
    gameOver: false,
    paused: false,
    nearMissCount: 0,
    lastComment: '',
  };

  // Input states
  public input = {
    left: false,
    right: false,
    accelerate: false,
    brake: false,
  };

  private onStateUpdate?: (state: GameState) => void;
  private onComment?: (text: string) => void;

  constructor(
    container: HTMLElement,
    options: GameOptions,
    onStateUpdate?: (state: GameState) => void,
    onComment?: (text: string) => void
  ) {
    this.container = container;
    this.options = options;
    this.onStateUpdate = onStateUpdate;
    this.onComment = onComment;

    this.detectHardware();
    this.initScene();
    this.initLights();
    this.initRoads();
    this.initPlayer();
    this.initScenery();
    this.bindEvents();
    this.startLoop();
  }

  private detectHardware() {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) {
        this.isSoftwareGl = true;
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      this.isSoftwareGl = false;
    }
  }

  private initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: !this.isSoftwareGl && this.options.graphicsQuality !== 'low',
    });

    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Mobile / Low-end friendly pixel ratio
    const dpr = this.options.graphicsQuality === 'low' || this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5);
    this.renderer.setPixelRatio(dpr);

    if (this.options.graphicsQuality === 'high' && !this.isSoftwareGl) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    // Warm Dhaka hazy afternoon sky / horizon fog
    const skyColor = 0xfde047; // Sunny Dhaka haze
    const fogColor = 0xfef08a;
    this.scene.background = new THREE.Color(skyColor);
    this.scene.fog = new THREE.FogExp2(fogColor, 0.009);

    // Studio Environment map using PMREMGenerator
    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // Fallback
    }

    this.camera = new THREE.PerspectiveCamera(56, width / height, 0.5, 300);
    this.camera.position.set(0, 4.2, 7.8);
    this.camera.lookAt(0, 1.2, -6);
  }

  private initLights() {
    // Warm directional key light
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
    keyLight.position.set(20, 40, 20);
    this.scene.add(keyLight);

    // Cool sky/ground hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0xd97706, 0.9);
    this.scene.add(hemiLight);

    // Ambient light
    const amb = new THREE.AmbientLight(0xffedd5, 0.5);
    this.scene.add(amb);
  }

  private initRoads() {
    this.roadTex = createRoadTexture();
    this.roadTex.wrapS = THREE.RepeatWrapping;
    this.roadTex.wrapT = THREE.RepeatWrapping;
    this.roadTex.repeat.set(1, 4);

    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTex,
      roughness: 0.8,
      metalness: 0.1,
    });

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Dusty roadside soil / Dhaka pavement
      roughness: 0.9,
    });

    for (let i = 0; i < this.CHUNK_COUNT; i++) {
      const chunk = new THREE.Group();
      const zPos = -i * this.CHUNK_LENGTH;

      // Asphalt Road
      const roadGeo = new THREE.PlaneGeometry(10.5, this.CHUNK_LENGTH);
      roadGeo.rotateX(-Math.PI / 2);
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.position.set(0, 0, 0);
      chunk.add(roadMesh);

      // Roadside soil / sidewalk
      const soilGeo = new THREE.PlaneGeometry(60, this.CHUNK_LENGTH);
      soilGeo.rotateX(-Math.PI / 2);
      const soilMesh = new THREE.Mesh(soilGeo, groundMat);
      soilMesh.position.set(0, -0.02, 0);
      chunk.add(soilMesh);

      // Concrete dividers in the middle
      for (let d = -this.CHUNK_LENGTH / 2 + 3; d < this.CHUNK_LENGTH / 2; d += 8) {
        const div = createDividerSegment();
        div.position.set(0, 0, d);
        chunk.add(div);
      }

      chunk.position.set(0, 0, zPos);
      this.scene.add(chunk);
      this.roadChunks.push(chunk);
    }
  }

  private initPlayer() {
    this.playerGroup = createPlayerAutoRickshaw(this.options.rickshawColor);
    this.playerGroup.position.set(0, 0, 0);
    this.scene.add(this.playerGroup);

    // Initial speed
    this.playerSpeed = 15;
    this.state.battery = 100;
  }

  private initScenery() {
    // Generate Dhaka buildings, billboards and tea stalls alongside road
    for (let i = 0; i < 18; i++) {
      const z = -i * 18 - 10;
      const isLeft = i % 2 === 0;
      const x = isLeft ? -9 - Math.random() * 4 : 9 + Math.random() * 4;

      if (i % 3 === 0) {
        // Billboard
        const bb = createBillboardMesh(i);
        bb.position.set(x, 0, z);
        bb.rotation.y = isLeft ? 0.3 : -0.3;
        this.scene.add(bb);
        this.sceneryProps.push(bb);
      } else if (i % 4 === 1) {
        // Tea stall
        const stall = createTeaStall();
        stall.position.set(isLeft ? -6.2 : 6.2, 0, z);
        stall.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        this.scene.add(stall);
        this.sceneryProps.push(stall);
      } else {
        // Multi-story Dhaka building
        const bldg = createDhakaBuilding(i);
        bldg.position.set(x, 0, z);
        this.scene.add(bldg);
        this.sceneryProps.push(bldg);
      }
    }
  }

  private bindEvents() {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (this.state.gameOver) return;

      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.input.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.input.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.input.accelerate = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 'Space':
          this.input.brake = true;
          sound.playBrake();
          break;
        case 'KeyH':
        case 'KeyE':
        case 'ShiftLeft':
        case 'ShiftRight':
        case 'Enter':
          this.triggerHorn();
          break;
        case 'KeyP':
          this.togglePause();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.input.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.input.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.input.accelerate = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
        case 'Space':
          this.input.brake = false;
          break;
      }
    };

    const handleResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    // Save cleanup references
    (this as unknown as { _cleanup: () => void })._cleanup = () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }

  /**
   * Dhaka Rickshaw Musical Horn feature:
   * Plays the loud melodic electric horn and makes nearby traffic clear way!
   */
  public triggerHorn() {
    if (this.state.gameOver || this.state.paused) return;
    sound.playRickshawHorn();

    // Funny visual/audio reaction: Rickshaw or Cow ahead will swerve away
    this.traffic.forEach((t) => {
      const distZ = t.mesh.position.z - this.playerGroup.position.z;
      if (distZ < 0 && distZ > -25) {
        // Honk startled them!
        t.swerveDir = t.mesh.position.x > 0 ? 1 : -1;
        t.swerveTimer = 1.2;
      }
    });

    if (Math.random() > 0.6) {
      const hornComments = [
        'প্যাঁ-প্যাঁ-প্যাঁ! পথ ছাড়েন ভাই!',
        'হর্ন শুনেও নড়ে না! ঢাকাইয়া পাবলিক!',
        'ওস্তাদ, হর্ন তো বাজাইলেন পুরা গানের মতো!',
      ];
      this.postComment(hornComments[Math.floor(Math.random() * hornComments.length)]);
    }
  }

  public togglePause() {
    this.state.paused = !this.state.paused;
    if (this.state.paused) {
      sound.stopMotor();
    } else {
      sound.startMotor();
    }
    this.onStateUpdate?.({ ...this.state });
  }

  public setOptions(opts: Partial<GameOptions>) {
    this.options = { ...this.options, ...opts };
    if (opts.rickshawColor) {
      // Re-create player auto-rickshaw with new color
      this.scene.remove(this.playerGroup);
      this.playerGroup = createPlayerAutoRickshaw(this.options.rickshawColor);
      this.playerGroup.position.set(this.playerX, 0, 0);
      this.scene.add(this.playerGroup);
    }
  }

  private postComment(text: string) {
    this.state.lastComment = text;
    this.onComment?.(text);
  }

  private spawnTraffic() {
    // Lane positions on Dhaka road: -3.4 (left), -1.8 (inner left), 1.8 (inner right), 3.4 (right)
    const lanes = [-3.4, -1.8, 1.8, 3.4];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    // Target spawn position ahead of player
    const spawnZ = this.playerGroup.position.z - 110 - Math.random() * 40;

    // Check if spawn lane is clear
    const tooClose = this.traffic.some(
      (t) => Math.abs(t.mesh.position.z - spawnZ) < 18 && Math.abs(t.mesh.position.x - lane) < 1.2
    );
    if (tooClose) return;

    const roll = Math.random();
    let mesh: THREE.Group;
    let type: 'bus' | 'rickshaw' | 'cng' | 'cow' | 'pothole' | 'stall';
    let speed = 0;

    if (roll < 0.38) {
      // Famous Dhaka "Murir Tin" Bus
      mesh = createDhakaBus(Math.floor(Math.random() * 3));
      type = 'bus';
      speed = 18 + Math.random() * 12; // Drives forward
      // Occasionally honk bus horn
      if (Math.random() > 0.7) {
        sound.playBusHorn();
      }
    } else if (roll < 0.6) {
      // Traditional Cycle Rickshaw (Slow moving!)
      mesh = createCycleRickshaw();
      type = 'rickshaw';
      speed = 6 + Math.random() * 4;
    } else if (roll < 0.8) {
      // Green CNG Baby Taxi (Erratic speed)
      mesh = createCngTaxi();
      type = 'cng';
      speed = 22 + Math.random() * 8;
    } else if (roll < 0.92) {
      // Stray Cow / Goat on road
      mesh = createCowObstacle();
      type = 'cow';
      speed = 0; // Stationary
    } else {
      // WASA Pothole / Trench
      mesh = createPotholeObstacle();
      type = 'pothole';
      speed = 0; // Stationary
    }

    mesh.position.set(lane, 0, spawnZ);
    this.scene.add(mesh);
    this.traffic.push({
      mesh,
      type,
      speed,
      lane,
      swerveTimer: 0,
      swerveDir: 0,
      nearMissTriggered: false,
    });
  }

  private spawnCollectibles() {
    const lanes = [-3.4, -1.8, 0, 1.8, 3.4];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const spawnZ = this.playerGroup.position.z - 90 - Math.random() * 50;

    const isBattery = Math.random() < 0.25; // 25% chance of battery boost, 75% Taka coin
    const mesh = isBattery ? createBatteryPickup() : createTakaPickup();
    mesh.position.set(lane, 0.7, spawnZ);

    this.scene.add(mesh);
    this.collectibles.push({
      mesh,
      type: isBattery ? 'battery' : 'taka',
      rotSpeed: 1.5 + Math.random() * 2,
    });
  }

  private startLoop() {
    sound.startMotor();

    const tick = () => {
      if (this.isDestroyed) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);

      if (!this.state.paused && !this.state.gameOver) {
        this.updateGame(delta);
      }

      this.renderer.render(this.scene, this.camera);

      // Software WebGL pacing guard from Three.js skill
      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.frameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      this.afterDraw(tick);
    } else {
      this.frameId = requestAnimationFrame(tick);
    }
  }

  private afterDraw(cb: () => void) {
    try {
      const gl = this.renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (this.isDestroyed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          this.frameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          this.frameId = window.setTimeout(cb, 60);
        }
      };
      this.frameId = window.setTimeout(poll, 6);
    } catch {
      this.frameId = requestAnimationFrame(cb);
    }
  }

  private updateGame(delta: number) {
    // 1. Player Input & Steering Physics
    const steerSpeed = 6.2;
    if (this.input.left) {
      this.playerTargetX = Math.max(-4.2, this.playerTargetX - steerSpeed * delta);
    }
    if (this.input.right) {
      this.playerTargetX = Math.min(4.2, this.playerTargetX + steerSpeed * delta);
    }

    // Smooth horizontal position interpolation
    this.playerX = THREE.MathUtils.damp(this.playerX, this.playerTargetX, 9, delta);

    // Dynamic 3-wheeler body tilt / roll (classic rickshaw lean!)
    const targetRoll = (this.playerTargetX - this.playerX) * -0.22;
    this.playerSteerTilt = THREE.MathUtils.damp(this.playerSteerTilt, targetRoll, 7, delta);

    // Acceleration & Braking
    const accelRate = 18;
    const brakeRate = 28;
    const naturalDecel = 6;

    if (this.input.accelerate) {
      this.playerSpeed = Math.min(this.maxSpeed, this.playerSpeed + accelRate * delta);
      this.playerPitchTilt = THREE.MathUtils.damp(this.playerPitchTilt, -0.04, 5, delta);
    } else if (this.input.brake) {
      this.playerSpeed = Math.max(5, this.playerSpeed - brakeRate * delta);
      this.playerPitchTilt = THREE.MathUtils.damp(this.playerPitchTilt, 0.06, 8, delta);
    } else {
      this.playerSpeed = Math.max(12, this.playerSpeed - naturalDecel * delta);
      this.playerPitchTilt = THREE.MathUtils.damp(this.playerPitchTilt, 0, 5, delta);
    }

    // Battery Drain (drains proportional to speed; empty battery limits speed to 10 km/h)
    const drainMultiplier = this.options.difficulty === 'farmgate' ? 1.3 : 1.0;
    this.state.battery = Math.max(0, this.state.battery - (this.playerSpeed / 40) * 0.4 * drainMultiplier * delta);
    if (this.state.battery <= 0 && this.playerSpeed > 14) {
      this.playerSpeed = Math.max(10, this.playerSpeed - 12 * delta);
    }

    // Move player forward in world (negative Z)
    const forwardDistance = this.playerSpeed * delta;
    this.playerGroup.position.z -= forwardDistance;
    this.playerGroup.position.x = this.playerX;
    this.playerGroup.rotation.z = this.playerSteerTilt;
    this.playerGroup.rotation.x = this.playerPitchTilt;

    // Rotate player wheels based on forward travel
    const frontWheel = this.playerGroup.getObjectByName('frontWheel');
    const rwl = this.playerGroup.getObjectByName('rearLeftWheel');
    const rwr = this.playerGroup.getObjectByName('rearRightWheel');
    if (frontWheel) frontWheel.rotation.x -= forwardDistance * 3.5;
    if (rwl) rwl.rotation.x -= forwardDistance * 3.5;
    if (rwr) rwr.rotation.x -= forwardDistance * 3.5;

    // Update sound frequency with speed
    sound.updateMotorSpeed(this.playerSpeed / this.maxSpeed);

    // Update Camera (Third-person chase camera with slight lagging elasticity)
    const camTargetZ = this.playerGroup.position.z + 6.8;
    const camTargetX = this.playerGroup.position.x * 0.45;
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, camTargetZ, 8, delta);
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, camTargetX, 6, delta);
    this.camera.position.y = 3.6 + (this.playerSpeed / this.maxSpeed) * 0.4;
    this.camera.lookAt(this.playerGroup.position.x * 0.6, 1.4, this.playerGroup.position.z - 9);

    // 2. Endless Road Chunks recycling
    const playerZ = this.playerGroup.position.z;
    this.roadChunks.forEach((chunk) => {
      // If chunk is far behind camera, move it ahead
      if (chunk.position.z > playerZ + this.CHUNK_LENGTH) {
        chunk.position.z -= this.CHUNK_COUNT * this.CHUNK_LENGTH;
      }
    });

    // Recycle scenery props (buildings and billboards)
    this.sceneryProps.forEach((prop) => {
      if (prop.position.z > playerZ + 30) {
        prop.position.z -= 18 * 18; // Wrap ahead
      }
    });

    // 3. Traffic Spawning & AI Movement
    if (this.traffic.length < (this.options.difficulty === 'farmgate' ? 14 : 9)) {
      this.spawnTraffic();
    }

    if (this.collectibles.length < 5) {
      this.spawnCollectibles();
    }

    // Update Traffic Vehicles
    for (let i = this.traffic.length - 1; i >= 0; i--) {
      const t = this.traffic[i];

      // Traffic moves in negative Z at their own speed
      t.mesh.position.z -= t.speed * delta;

      // Swerve behavior (honk reaction or chaotic lane shifting)
      if (t.swerveTimer > 0) {
        t.swerveTimer -= delta;
        t.mesh.position.x += t.swerveDir * 2.8 * delta;
        t.mesh.position.x = Math.max(-4.4, Math.min(4.4, t.mesh.position.x));
      }

      // Check Near-Miss (reward player for daring overtakes!)
      const dx = Math.abs(t.mesh.position.x - this.playerGroup.position.x);
      const dz = Math.abs(t.mesh.position.z - this.playerGroup.position.z);
      if (!t.nearMissTriggered && dz < 2.8 && dx < 2.2 && dx > 1.3) {
        t.nearMissTriggered = true;
        this.triggerNearMiss();
      }

      // Check Collision with Player
      _playerBox.setFromObject(this.playerGroup);
      _trafficBox.setFromObject(t.mesh);

      // Tighten collision box by 15% for forgiving, fun arcade gameplay
      _playerBox.expandByScalar(-0.25);
      _trafficBox.expandByScalar(-0.25);

      if (!this.isInvincible && _playerBox.intersectsBox(_trafficBox)) {
        this.triggerGameOver(t.type);
        return;
      }

      // Despawn traffic when far behind or far ahead
      if (t.mesh.position.z > playerZ + 30 || t.mesh.position.z < playerZ - 200) {
        this.scene.remove(t.mesh);
        this.traffic.splice(i, 1);
      }
    }

    // 4. Update Collectibles (Taka coins & Battery packs)
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const c = this.collectibles[i];
      c.mesh.rotation.y += c.rotSpeed * delta;

      // Bobbing motion
      c.mesh.position.y = 0.7 + Math.sin(Date.now() * 0.005 + i) * 0.15;

      _playerBox.setFromObject(this.playerGroup);
      _itemBox.setFromObject(c.mesh);

      if (_playerBox.intersectsBox(_itemBox)) {
        if (c.type === 'taka') {
          this.state.fare += 50;
          sound.playFareCoin();
          this.postComment('ক্যাঁস! ৫০ টাকা ভাড়া পাইছি!');
        } else {
          // Battery recharge
          this.state.battery = Math.min(100, this.state.battery + 40);
          sound.playBatteryBoost();
          this.isInvincible = true;
          this.invincibleTimer = 3.5;
          this.postComment('ফুল চার্জ! দেশি টার্বো বুস্ট!');
        }

        this.scene.remove(c.mesh);
        this.collectibles.splice(i, 1);
        continue;
      }

      // Despawn if behind
      if (c.mesh.position.z > playerZ + 25) {
        this.scene.remove(c.mesh);
        this.collectibles.splice(i, 1);
      }
    }

    // Invincibility timer
    if (this.isInvincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
      }
    }

    // Update Distance / Score
    this.state.score = Math.floor(Math.abs(this.playerGroup.position.z));
    this.state.speedKmh = Math.floor(this.playerSpeed * 1.4);

    this.onStateUpdate?.({ ...this.state });
  }

  private triggerNearMiss() {
    this.state.combo += 1;
    this.state.nearMissCount += 1;
    this.state.score += 150;
    sound.playNearMiss();

    const quips = [
      'উফফ! মিলিমিটারের জন্য বাঁচলেন!',
      'আলহামদুলিল্লাহ! চুল পরিমাণ লাইগা বাঁইচা গেলেন!',
      'ওস্তাদ আপনার রিফ্লেক্স তো বিমান চালকের মতো!',
      'বাসের গায়ে দাগ লাইগা গেল প্রায়!',
    ];
    this.postComment(quips[Math.floor(Math.random() * quips.length)]);
  }

  private triggerGameOver(hitType: 'bus' | 'rickshaw' | 'cng' | 'cow' | 'pothole' | 'stall') {
    this.state.gameOver = true;
    sound.stopMotor();
    sound.playCrash();

    // Funny Dhakaiya accident newspaper headline
    const headlines = {
      bus: {
        headline: 'মিরপুর এক্সপ্রেসের লগে অটো-রিকশার রক্তক্ষয়ী সংঘর্ষ!',
        sub: 'বাস ড্রাইভার বলিলেন: "আমার গাড়ির ব্রেক আছিল না মামা!"',
        advice: 'টিপস: বাসের সামনে ওভারটেক করার আগে দুইবার হর্ন দেন।',
      },
      rickshaw: {
        headline: 'সাইকেল রিকশায় গুঁতা মারিয়া অটোর হুড উল্টাইয়া গেল!',
        sub: 'রিকশাওয়ালার দাবি: "আমার ঘণ্টার শব্দ শুনেন নাই?!"',
        advice: 'টিপস: ধীরগতির রিকশা দেখলে পাশ কাটাইয়া যান।',
      },
      cng: {
        headline: 'সিএনজি ও অটোর খাঁচায় খাঁচায় মারামারি!',
        sub: 'যাত্রী বলিলেন: "মিটার ছাড়াই ভাড়া দিয়া পলাইলাম!"',
        advice: 'টিপস: সবুজ সিএনজিকে জায়গা দিন, উহাদের কোনো ডিরেকশন নাই!',
      },
      cow: {
        headline: 'সড়কের মাঝখানে বসা গরুর লগে অটো-রিকশার টক্কর!',
        sub: 'গরু মহাশয় অক্ষত, অটো-রিকশার ব্যাটারি খসিয়া পতন!',
        advice: 'টিপস: রাস্তায় গরু বা ছাগল দেখলে হর্ন বাজাইয়া দূর দিয়া যান।',
      },
      pothole: {
        headline: 'ওয়াসার উন্মুক্ত ম্যানহোলে ডুব দিল ইজি বাইক!',
        sub: 'যাত্রী সাঁতার কাটিয়া উঠিয়া বলিলেন: "ভাড়া ফেরত চাই!"',
        advice: 'টিপস: ভাঙা রাস্তা ও ম্যানহোল দেখলে ব্রেক চাপুন।',
      },
      stall: {
        headline: 'চায়ের টং দোকানে ঢুকিয়া পড়িল বেপরোয়া অটো!',
        sub: 'দোকানদার বলিলেন: "১০ কাপ গরম লাল চা মাগনা হইয়া গেল!"',
        advice: 'টিপস: রাস্তার পাশে অতিরিক্ত চাপাচাপি করিবেন না।',
      },
    };

    this.state.crashCause = headlines[hitType] || headlines.bus;
    this.onStateUpdate?.({ ...this.state });
  }

  public restart() {
    // Reset positions
    this.playerX = 0;
    this.playerTargetX = 0;
    this.playerSpeed = 15;
    this.playerGroup.position.set(0, 0, 0);
    this.playerGroup.rotation.set(0, 0, 0);

    // Clear traffic and items
    this.traffic.forEach((t) => this.scene.remove(t.mesh));
    this.traffic = [];

    this.collectibles.forEach((c) => this.scene.remove(c.mesh));
    this.collectibles = [];

    // Reset road chunks
    for (let i = 0; i < this.CHUNK_COUNT; i++) {
      this.roadChunks[i].position.set(0, 0, -i * this.CHUNK_LENGTH);
    }

    // Reset state
    this.state = {
      score: 0,
      fare: 0,
      speedKmh: 0,
      battery: 100,
      combo: 0,
      gameOver: false,
      paused: false,
      nearMissCount: 0,
      lastComment: 'বিসমিল্লাহ! আবার শুরু হইল ঢাকা সাফারি!',
    };

    sound.startMotor();
    this.onStateUpdate?.({ ...this.state });
  }

  public destroy() {
    this.isDestroyed = true;
    sound.stopMotor();
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);

    const cleanup = (this as unknown as { _cleanup?: () => void })._cleanup;
    if (cleanup) cleanup();

    this.traffic.forEach((t) => this.scene.remove(t.mesh));
    this.collectibles.forEach((c) => this.scene.remove(c.mesh));
    this.sceneryProps.forEach((p) => this.scene.remove(p));

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
