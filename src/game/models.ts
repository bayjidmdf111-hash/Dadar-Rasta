import * as THREE from 'three';
import {
  createRickshawArtTexture,
  createBusBannerTexture,
  createBillboardTexture,
  createTakaTexture,
  createBatteryTexture,
} from './textures';

/**
 * Procedural 3D Models for Dhaka Traffic Rush.
 * Built with composite 3-12 parts using Three.js Groups.
 * Bottom-center pivots so objects sit flush on the road surface.
 */

// Shared reusable materials to minimize draw calls and optimize for mobile
const matMetalChrome = new THREE.MeshStandardMaterial({
  color: 0xd4d4d8,
  metalness: 0.85,
  roughness: 0.2,
});

const matTireBlack = new THREE.MeshStandardMaterial({
  color: 0x18181b,
  metalness: 0.1,
  roughness: 0.8,
});

const matGlass = new THREE.MeshStandardMaterial({
  color: 0x93c5fd,
  metalness: 0.1,
  roughness: 0.1,
  transparent: true,
  opacity: 0.6,
});

const matHeadlight = new THREE.MeshStandardMaterial({
  color: 0xfef08a,
  emissive: 0xfef08a,
  emissiveIntensity: 0.6,
  roughness: 0.2,
});

const matTailLight = new THREE.MeshStandardMaterial({
  color: 0xef4444,
  emissive: 0xdc2626,
  emissiveIntensity: 0.5,
  roughness: 0.3,
});

/**
 * Creates the Player's Electric Auto-Rickshaw (Tomtom / Easy Bike / Mishuk)
 * Color scheme can be customized ('green', 'yellow', 'blue', 'red')
 */
export function createPlayerAutoRickshaw(colorTheme: string = 'green'): THREE.Group {
  const rickshaw = new THREE.Group();

  let bodyColor = 0x15803d; // Emerald green (Dhaka CNG style)
  let roofColor = 0xf59e0b; // Amber / Golden yellow
  if (colorTheme === 'yellow') {
    bodyColor = 0xeab308;
    roofColor = 0xdc2626;
  } else if (colorTheme === 'blue') {
    bodyColor = 0x0284c7;
    roofColor = 0x38bdf8;
  } else if (colorTheme === 'red') {
    bodyColor = 0xb91c1c;
    roofColor = 0xf59e0b;
  }

  const matBody = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.35,
    metalness: 0.3,
  });

  const matRoof = new THREE.MeshStandardMaterial({
    color: roofColor,
    roughness: 0.5,
    metalness: 0.15,
  });

  const matSeat = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Brown rexine seat
    roughness: 0.7,
  });

  // 1. Lower Chassis Frame
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.2, 2.4);
  const chassis = new THREE.Mesh(chassisGeo, matBody);
  chassis.position.set(0, 0.4, 0);
  rickshaw.add(chassis);

  // 2. Battery Bank underneath passenger seat
  const batteryGeo = new THREE.BoxGeometry(1.0, 0.25, 0.8);
  const matBatBox = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 });
  const battery = new THREE.Mesh(batteryGeo, matBatBox);
  battery.position.set(0, 0.22, 0.2);
  rickshaw.add(battery);

  // 3. Driver & Passenger Seats
  const seatGeo = new THREE.BoxGeometry(1.2, 0.25, 0.7);
  const passSeat = new THREE.Mesh(seatGeo, matSeat);
  passSeat.position.set(0, 0.65, 0.4);
  rickshaw.add(passSeat);

  const driverSeatGeo = new THREE.BoxGeometry(0.6, 0.25, 0.5);
  const driverSeat = new THREE.Mesh(driverSeatGeo, matSeat);
  driverSeat.position.set(0, 0.65, -0.45);
  rickshaw.add(driverSeat);

  // 4. Wheels (3-wheeler: 1 front center, 2 rear)
  const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.18, 14);
  wheelGeo.rotateZ(Math.PI / 2);

  const frontWheel = new THREE.Mesh(wheelGeo, matTireBlack);
  frontWheel.position.set(0, 0.3, -1.05);
  frontWheel.name = 'frontWheel';
  rickshaw.add(frontWheel);

  const rearLeftWheel = new THREE.Mesh(wheelGeo, matTireBlack);
  rearLeftWheel.position.set(-0.72, 0.3, 0.7);
  rearLeftWheel.name = 'rearLeftWheel';
  rickshaw.add(rearLeftWheel);

  const rearRightWheel = new THREE.Mesh(wheelGeo, matTireBlack);
  rearRightWheel.position.set(0.72, 0.3, 0.7);
  rearRightWheel.name = 'rearRightWheel';
  rickshaw.add(rearRightWheel);

  // 5. Front Fork & Handlebar
  const forkGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
  const fork = new THREE.Mesh(forkGeo, matMetalChrome);
  fork.position.set(0, 0.7, -1.0);
  fork.rotation.x = -0.15;
  rickshaw.add(fork);

  const barGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
  barGeo.rotateZ(Math.PI / 2);
  const handleBar = new THREE.Mesh(barGeo, matMetalChrome);
  handleBar.position.set(0, 1.05, -0.92);
  rickshaw.add(handleBar);

  // 6. Front Windshield & Nose fairing
  const noseGeo = new THREE.BoxGeometry(0.9, 0.45, 0.35);
  const nose = new THREE.Mesh(noseGeo, matBody);
  nose.position.set(0, 0.7, -0.85);
  rickshaw.add(nose);

  const shieldGeo = new THREE.PlaneGeometry(0.85, 0.55);
  const windshield = new THREE.Mesh(shieldGeo, matGlass);
  windshield.position.set(0, 1.25, -0.75);
  windshield.rotation.x = -0.15;
  rickshaw.add(windshield);

  // 7. Canopy Metal Pillars (4 vertical tubes)
  const pillarGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.2);
  const pillarOffsets = [
    [-0.65, 0.95, -0.6],
    [0.65, 0.95, -0.6],
    [-0.65, 0.95, 0.9],
    [0.65, 0.95, 0.9],
  ];
  pillarOffsets.forEach(([x, y, z]) => {
    const pillar = new THREE.Mesh(pillarGeo, matMetalChrome);
    pillar.position.set(x, y, z);
    rickshaw.add(pillar);
  });

  // 8. Canopy Roof (Curved top with overhang)
  const roofGeo = new THREE.BoxGeometry(1.45, 0.1, 2.3);
  const roof = new THREE.Mesh(roofGeo, matRoof);
  roof.position.set(0, 1.55, 0.1);
  rickshaw.add(roof);

  // 9. Back Decorative Rickshaw Art Banner
  const artTex = createRickshawArtTexture('দূরত্ব বজায় রাখুন');
  const matArt = new THREE.MeshBasicMaterial({ map: artTex });
  const bannerGeo = new THREE.PlaneGeometry(1.2, 0.5);
  const banner = new THREE.Mesh(bannerGeo, matArt);
  banner.position.set(0, 0.7, 1.21);
  banner.rotation.y = Math.PI; // Face backwards
  rickshaw.add(banner);

  // 10. Headlight (Front center)
  const headlightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12);
  headlightGeo.rotateX(Math.PI / 2);
  const headlight = new THREE.Mesh(headlightGeo, matHeadlight);
  headlight.position.set(0, 0.85, -1.05);
  rickshaw.add(headlight);

  // 11. Dual Tail lights
  const tailGeo = new THREE.BoxGeometry(0.12, 0.1, 0.05);
  const tailL = new THREE.Mesh(tailGeo, matTailLight);
  tailL.position.set(-0.55, 0.45, 1.21);
  rickshaw.add(tailL);

  const tailR = new THREE.Mesh(tailGeo, matTailLight);
  tailR.position.set(0.55, 0.45, 1.21);
  rickshaw.add(tailR);

  rickshaw.scale.set(1.1, 1.1, 1.1);
  return rickshaw;
}

/**
 * Creates the famous colorful Dhaka Local Bus ("Murir Tin" style)
 */
export function createDhakaBus(variant: number = 0): THREE.Group {
  const bus = new THREE.Group();

  const busStyles = [
    { name: 'মিরপুর সুপার লিংক', plate: 'ঢাকা মেট্রো-ব ১১-৪২০', color: 0x1e40af, stripe: 0xfacc15 },
    { name: 'বিকল্প অটো সার্ভিস', plate: 'ঢাকা মেট্রো-ব ১৩-৭৮৬', color: 0xb91c1c, stripe: 0xffffff },
    { name: 'স্বাধীন এক্সপ্রেস', plate: 'ঢাকা মেট্রো-ব ১৫-৯৯৯', color: 0x047857, stripe: 0xf59e0b },
  ];
  const style = busStyles[variant % busStyles.length];

  const matBusBody = new THREE.MeshStandardMaterial({
    color: style.color,
    roughness: 0.4,
    metalness: 0.2,
  });

  const matStripe = new THREE.MeshStandardMaterial({
    color: style.stripe,
    roughness: 0.4,
  });

  // 1. Main Bus Body (box with rounded top corners)
  const bodyGeo = new THREE.BoxGeometry(2.3, 2.4, 6.8);
  const busBody = new THREE.Mesh(bodyGeo, matBusBody);
  busBody.position.set(0, 1.5, 0);
  bus.add(busBody);

  // 2. Decorative Side Stripe
  const stripeGeo = new THREE.BoxGeometry(2.34, 0.35, 6.6);
  const stripeMesh = new THREE.Mesh(stripeGeo, matStripe);
  stripeMesh.position.set(0, 1.4, 0);
  bus.add(stripeMesh);

  // 3. Front Windshield & Windows
  const frontWindshieldGeo = new THREE.PlaneGeometry(2.0, 0.85);
  const windshield = new THREE.Mesh(frontWindshieldGeo, matGlass);
  windshield.position.set(0, 1.85, -3.41);
  windshield.rotation.y = Math.PI;
  bus.add(windshield);

  // Rear Window
  const rearWindow = new THREE.Mesh(frontWindshieldGeo, matGlass);
  rearWindow.position.set(0, 1.85, 3.41);
  bus.add(rearWindow);

  // 4. Roof Luggage Rack with suitcases & sacks (quintessential Dhaka bus!)
  const rackFrameGeo = new THREE.BoxGeometry(1.9, 0.15, 4.5);
  const rack = new THREE.Mesh(rackFrameGeo, matMetalChrome);
  rack.position.set(0, 2.75, -0.2);
  bus.add(rack);

  // Luggage parcels
  const parcelColors = [0xb45309, 0x0284c7, 0x4b5563, 0x15803d];
  for (let i = 0; i < 5; i++) {
    const pGeo = new THREE.BoxGeometry(0.6 + Math.random() * 0.3, 0.35, 0.6 + Math.random() * 0.3);
    const pMat = new THREE.MeshStandardMaterial({ color: parcelColors[i % parcelColors.length], roughness: 0.8 });
    const parcel = new THREE.Mesh(pGeo, pMat);
    parcel.position.set((Math.random() - 0.5) * 1.2, 2.95, -1.8 + i * 0.8);
    bus.add(parcel);
  }

  // 5. Wheels (4 large dual wheels)
  const busWheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 14);
  busWheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    [-1.15, 0.48, -2.1],
    [1.15, 0.48, -2.1],
    [-1.15, 0.48, 2.1],
    [1.15, 0.48, 2.1],
  ];

  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(busWheelGeo, matTireBlack);
    wheel.position.set(x, y, z);
    bus.add(wheel);
  });

  // 6. Side & Rear Route Banners
  const busBannerTex = createBusBannerTexture(style.name, style.plate);
  const bannerMat = new THREE.MeshBasicMaterial({ map: busBannerTex });

  const rearBannerGeo = new THREE.PlaneGeometry(1.8, 0.9);
  const rearBanner = new THREE.Mesh(rearBannerGeo, bannerMat);
  rearBanner.position.set(0, 1.1, 3.42);
  bus.add(rearBanner);

  // 7. Headlights & Grille
  const grilleGeo = new THREE.BoxGeometry(1.6, 0.5, 0.1);
  const grille = new THREE.Mesh(grilleGeo, matMetalChrome);
  grille.position.set(0, 0.7, -3.41);
  bus.add(grille);

  const hlGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 12);
  hlGeo.rotateX(Math.PI / 2);
  const hlL = new THREE.Mesh(hlGeo, matHeadlight);
  hlL.position.set(-0.85, 0.7, -3.42);
  bus.add(hlL);

  const hlR = new THREE.Mesh(hlGeo, matHeadlight);
  hlR.position.set(0.85, 0.7, -3.42);
  bus.add(hlR);

  // Tail lights
  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.05), matTailLight);
  tailL.position.set(-1.0, 1.0, 3.42);
  bus.add(tailL);

  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.05), matTailLight);
  tailR.position.set(1.0, 1.0, 3.42);
  bus.add(tailR);

  return bus;
}

/**
 * Traditional Dhaka Cycle Rickshaw
 */
export function createCycleRickshaw(): THREE.Group {
  const rickshaw = new THREE.Group();

  const matFrame = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
  const matHood = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 });
  const matArtFlap = new THREE.MeshBasicMaterial({ map: createRickshawArtTexture('আল্লাহ ভরসা') });

  // Wheels: 1 front, 2 rear
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 14);
  wheelGeo.rotateZ(Math.PI / 2);

  const fWheel = new THREE.Mesh(wheelGeo, matTireBlack);
  fWheel.position.set(0, 0.4, -0.9);
  rickshaw.add(fWheel);

  const rWheelL = new THREE.Mesh(wheelGeo, matTireBlack);
  rWheelL.position.set(-0.6, 0.4, 0.6);
  rickshaw.add(rWheelL);

  const rWheelR = new THREE.Mesh(wheelGeo, matTireBlack);
  rWheelR.position.set(0.6, 0.4, 0.6);
  rickshaw.add(rWheelR);

  // Seat Carriage
  const seatGeo = new THREE.BoxGeometry(1.0, 0.3, 0.6);
  const seat = new THREE.Mesh(seatGeo, matFrame);
  seat.position.set(0, 0.75, 0.4);
  rickshaw.add(seat);

  // Folding Hood Canopy
  const hoodGeo = new THREE.BoxGeometry(1.05, 0.65, 0.7);
  const hood = new THREE.Mesh(hoodGeo, matHood);
  hood.position.set(0, 1.25, 0.45);
  rickshaw.add(hood);

  // Rickshaw Backplate Art Tin Flap
  const flapGeo = new THREE.PlaneGeometry(0.85, 0.45);
  const flap = new THREE.Mesh(flapGeo, matArtFlap);
  flap.position.set(0, 0.6, 0.81);
  rickshaw.add(flap);

  // Frame rods
  const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4);
  rodGeo.rotateX(Math.PI / 3);
  const rod = new THREE.Mesh(rodGeo, matMetalChrome);
  rod.position.set(0, 0.6, -0.2);
  rickshaw.add(rod);

  return rickshaw;
}

/**
 * Green CNG Auto-Rickshaw (Baby Taxi)
 */
export function createCngTaxi(): THREE.Group {
  const cng = new THREE.Group();

  const matCngGreen = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.35, metalness: 0.2 });
  const matCage = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8, wireframe: true });

  // Body
  const bodyGeo = new THREE.BoxGeometry(1.3, 1.2, 2.2);
  const body = new THREE.Mesh(bodyGeo, matCngGreen);
  body.position.set(0, 0.85, 0);
  cng.add(body);

  // Side Wire Mesh Cage
  const cageGeo = new THREE.BoxGeometry(1.32, 0.5, 1.4);
  const cage = new THREE.Mesh(cageGeo, matCage);
  cage.position.set(0, 1.0, 0.2);
  cng.add(cage);

  // Curved Roof
  const roofGeo = new THREE.BoxGeometry(1.32, 0.1, 2.1);
  const roof = new THREE.Mesh(roofGeo, matCngGreen);
  roof.position.set(0, 1.5, 0);
  cng.add(roof);

  // Windshield
  const wGeo = new THREE.PlaneGeometry(1.1, 0.5);
  const windshield = new THREE.Mesh(wGeo, matGlass);
  windshield.position.set(0, 1.15, -1.11);
  windshield.rotation.y = Math.PI;
  cng.add(windshield);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 12);
  wheelGeo.rotateZ(Math.PI / 2);

  const fw = new THREE.Mesh(wheelGeo, matTireBlack);
  fw.position.set(0, 0.28, -0.85);
  cng.add(fw);

  const rwl = new THREE.Mesh(wheelGeo, matTireBlack);
  rwl.position.set(-0.65, 0.28, 0.6);
  cng.add(rwl);

  const rwr = new THREE.Mesh(wheelGeo, matTireBlack);
  rwr.position.set(0.65, 0.28, 0.6);
  cng.add(rwr);

  return cng;
}

/**
 * Roadside Tea Stall ("টং দোকান" - Tong er dokan)
 */
export function createTeaStall(): THREE.Group {
  const stall = new THREE.Group();

  const matWood = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
  const matTin = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.6, metalness: 0.4 });

  // Wooden Table
  const tableGeo = new THREE.BoxGeometry(2.0, 0.9, 1.4);
  const table = new THREE.Mesh(tableGeo, matWood);
  table.position.set(0, 0.45, 0);
  stall.add(table);

  // Tin Roof
  const roofGeo = new THREE.BoxGeometry(2.4, 0.08, 1.8);
  const roof = new THREE.Mesh(roofGeo, matTin);
  roof.position.set(0, 2.1, 0);
  roof.rotation.z = -0.1;
  stall.add(roof);

  // 4 Bamboo posts
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0);
  const postOffsets = [
    [-1.0, 1.0, -0.7],
    [1.0, 1.0, -0.7],
    [-1.0, 1.0, 0.7],
    [1.0, 1.0, 0.7],
  ];
  postOffsets.forEach(([x, y, z]) => {
    const post = new THREE.Mesh(postGeo, matWood);
    post.position.set(x, y, z);
    stall.add(post);
  });

  // Tea Kettle
  const kettleGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.4, 10);
  const kettle = new THREE.Mesh(kettleGeo, matMetalChrome);
  kettle.position.set(-0.3, 1.1, 0);
  stall.add(kettle);

  // Gas cylinder (red)
  const cylGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.6, 10);
  const matCyl = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 });
  const cyl = new THREE.Mesh(cylGeo, matCyl);
  cyl.position.set(0.6, 0.5, 0.3);
  stall.add(cyl);

  return stall;
}

/**
 * Open Pothole / WASA Construction Barrier
 */
export function createPotholeObstacle(): THREE.Group {
  const obs = new THREE.Group();

  // Dark broken asphalt hole
  const holeGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.04, 14);
  const matHole = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 1.0 });
  const hole = new THREE.Mesh(holeGeo, matHole);
  hole.position.set(0, 0.02, 0);
  obs.add(hole);

  // Red & White WASA warning barrier
  const standGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.8);
  const matStand = new THREE.MeshStandardMaterial({ color: 0x1f2937 });
  const standL = new THREE.Mesh(standGeo, matStand);
  standL.position.set(-0.6, 0.4, 0);
  obs.add(standL);

  const standR = new THREE.Mesh(standGeo, matStand);
  standR.position.set(0.6, 0.4, 0);
  obs.add(standR);

  const boardGeo = new THREE.BoxGeometry(1.4, 0.3, 0.06);
  const matBoard = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
  const board = new THREE.Mesh(boardGeo, matBoard);
  board.position.set(0, 0.6, 0);
  obs.add(board);

  return obs;
}

/**
 * Wandering Bangladeshi Cow / Goat obstacle
 */
export function createCowObstacle(): THREE.Group {
  const cow = new THREE.Group();

  const matCow = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.8 }); // White deshi cow
  const matSpot = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }); // Brown patches

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.4);
  const body = new THREE.Mesh(bodyGeo, matCow);
  body.position.set(0, 0.8, 0);
  cow.add(body);

  // Spot on side
  const spotGeo = new THREE.BoxGeometry(0.82, 0.4, 0.5);
  const spot = new THREE.Mesh(spotGeo, matSpot);
  spot.position.set(0, 0.8, 0.1);
  cow.add(spot);

  // Head & Snout
  const headGeo = new THREE.BoxGeometry(0.4, 0.45, 0.5);
  const head = new THREE.Mesh(headGeo, matCow);
  head.position.set(0, 1.05, -0.8);
  cow.add(head);

  // Horns
  const hornGeo = new THREE.ConeGeometry(0.05, 0.25, 6);
  const matHorn = new THREE.MeshStandardMaterial({ color: 0x27272a });
  const hornL = new THREE.Mesh(hornGeo, matHorn);
  hornL.position.set(-0.16, 1.35, -0.75);
  hornL.rotation.z = -0.3;
  cow.add(hornL);

  const hornR = new THREE.Mesh(hornGeo, matHorn);
  hornR.position.set(0.16, 1.35, -0.75);
  hornR.rotation.z = 0.3;
  cow.add(hornR);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
  const legPositions = [
    [-0.3, 0.3, -0.5],
    [0.3, 0.3, -0.5],
    [-0.3, 0.3, 0.5],
    [0.3, 0.3, 0.5],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, matCow);
    leg.position.set(x, y, z);
    cow.add(leg);
  });

  return cow;
}

/**
 * Concrete Road Divider segment
 */
export function createDividerSegment(): THREE.Group {
  const div = new THREE.Group();

  const divGeo = new THREE.BoxGeometry(0.5, 0.45, 4.0);
  const matDiv = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.9 });
  const mesh = new THREE.Mesh(divGeo, matDiv);
  mesh.position.set(0, 0.22, 0);
  div.add(mesh);

  // Green bush or plant on top of divider
  const bushGeo = new THREE.DodecahedronGeometry(0.28);
  const matBush = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const bush = new THREE.Mesh(bushGeo, matBush);
  bush.position.set(0, 0.55, 0);
  div.add(bush);

  return div;
}

/**
 * Dhaka Urban Apartment Building (Colorful balconies, water tanks, AC units)
 */
export function createDhakaBuilding(variant: number): THREE.Group {
  const bldg = new THREE.Group();

  const colors = [0xd97706, 0x0284c7, 0x059669, 0xb45309, 0x7c3aed, 0x64748b];
  const color = colors[variant % colors.length];

  const floors = 4 + (variant % 4);
  const height = floors * 2.8;
  const width = 6.0;
  const depth = 6.0;

  // Main Building Block
  const bodyGeo = new THREE.BoxGeometry(width, height, depth);
  const matBldg = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const body = new THREE.Mesh(bodyGeo, matBldg);
  body.position.set(0, height / 2, 0);
  bldg.add(body);

  // Balconies facing road
  const matBalcony = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  for (let f = 1; f < floors; f++) {
    const balGeo = new THREE.BoxGeometry(width * 0.7, 0.5, 0.8);
    const bal = new THREE.Mesh(balGeo, matBalcony);
    bal.position.set(0, f * 2.8, -depth / 2 - 0.4);
    bldg.add(bal);
  }

  // Roof Water Tank (black plastic tank)
  const tankGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 10);
  const matTank = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
  const tank = new THREE.Mesh(tankGeo, matTank);
  tank.position.set(1.2, height + 0.6, 0);
  bldg.add(tank);

  return bldg;
}

/**
 * Roadside Billboard with funny ads
 */
export function createBillboardMesh(variant: number): THREE.Group {
  const bb = new THREE.Group();

  const tex = createBillboardTexture(variant);
  const matAd = new THREE.MeshBasicMaterial({ map: tex });

  // Board
  const boardGeo = new THREE.BoxGeometry(5.0, 2.5, 0.15);
  const board = new THREE.Mesh(boardGeo, matAd);
  board.position.set(0, 4.2, 0);
  bb.add(board);

  // Two support pillars
  const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.5);
  const matPillar = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });

  const p1 = new THREE.Mesh(pillarGeo, matPillar);
  p1.position.set(-1.8, 2.25, 0);
  bb.add(p1);

  const p2 = new THREE.Mesh(pillarGeo, matPillar);
  p2.position.set(1.8, 2.25, 0);
  bb.add(p2);

  return bb;
}

/**
 * Taka Coin Pickup (৳ 50 Taka)
 */
export function createTakaPickup(): THREE.Group {
  const coinGroup = new THREE.Group();

  const tex = createTakaTexture();
  const matCoin = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0xca8a04,
    emissiveIntensity: 0.25,
  });

  const geo = new THREE.CylinderGeometry(0.45, 0.45, 0.08, 16);
  geo.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(geo, matCoin);
  coinGroup.add(mesh);

  return coinGroup;
}

/**
 * Battery Power-up Pickup (⚡)
 */
export function createBatteryPickup(): THREE.Group {
  const batGroup = new THREE.Group();

  const tex = createBatteryTexture();
  const matBat = new THREE.MeshStandardMaterial({
    map: tex,
    metalness: 0.4,
    roughness: 0.3,
    emissive: 0x10b981,
    emissiveIntensity: 0.3,
  });

  const geo = new THREE.BoxGeometry(0.65, 0.8, 0.3);
  const mesh = new THREE.Mesh(geo, matBat);
  batGroup.add(mesh);

  return batGroup;
}
