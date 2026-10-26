import * as THREE from 'three';

/**
 * Procedural texture generator for Dhaka Traffic Rush.
 * All textures are 100% generated in 2D HTML5 canvas. Zero external image files.
 */

// Helper to create and setup a CanvasTexture with SRGBColorSpace
function createProceduralTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    draw(ctx, width, height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Road asphalt texture with lanes and patches
 */
export function createRoadTexture(): THREE.CanvasTexture {
  return createProceduralTexture(512, 1024, (ctx, w, h) => {
    // Asphalt base
    ctx.fillStyle = '#22252a';
    ctx.fillRect(0, 0, w, h);

    // Subtle noise / rough patch marks
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      const rw = 20 + Math.random() * 40;
      const rh = 10 + Math.random() * 30;
      ctx.fillStyle = Math.random() > 0.5 ? '#1a1d21' : '#2b2f36';
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer edge curbs
    ctx.fillStyle = '#f59e0b'; // Yellow caution curb edge
    ctx.fillRect(0, 0, 8, h);
    ctx.fillRect(w - 8, 0, 8, h);

    // Road White/Yellow dashed divider lanes (3 lanes)
    const laneX1 = w * 0.33;
    const laneX2 = w * 0.66;
    const dashLength = 40;
    const dashGap = 35;

    ctx.fillStyle = '#facc15'; // Yellow center dashes
    for (let y = 0; y < h; y += dashLength + dashGap) {
      ctx.fillRect(laneX1 - 3, y, 6, dashLength);
      ctx.fillRect(laneX2 - 3, y, 6, dashLength);
    }
  });
}

/**
 * Bangladeshi Rickshaw Art Texture for back flap and hood
 * Famous colorful folk art of Dhaka rickshaws
 */
export function createRickshawArtTexture(text: string = 'দাদার রাস্তা'): THREE.CanvasTexture {
  return createProceduralTexture(512, 256, (ctx, w, h) => {
    // Radiant colorful background (peacock blues, fiery reds, yellow borders)
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#e11d48');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(1, '#059669');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Floral decorative border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(8, 8, w - 16, h - 16);

    // Corner decorative flower petals
    const corners = [
      [24, 24],
      [w - 24, 24],
      [24, h - 24],
      [w - 24, h - 24],
    ];
    ctx.fillStyle = '#fef08a';
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center Bangla Text Banner
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(30, h * 0.32, w - 60, h * 0.36, 12);
    ctx.fill();

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 32px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);

    // Decorative subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('★ DADAR RASTA 3D ★', w / 2, h * 0.82);
    ctx.fillText('দূরত্ব বজায় রাখুন', w / 2, h * 0.18);
  });
}

/**
 * Dhaka Bus Side / Back Plate Texture with famous bus names and dents
 */
export function createBusBannerTexture(busName: string, plateNo: string): THREE.CanvasTexture {
  return createProceduralTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1e3a8a'; // Deep blue base
    ctx.fillRect(0, 0, w, h);

    // Racing stripe
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, h * 0.45, w, 28);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, h * 0.56, w, 16);

    // Bus Route / Service Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(busName, w / 2, h * 0.25);

    // License Plate
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(w * 0.2, h * 0.72, w * 0.6, 44);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.2, h * 0.72, w * 0.6, 44);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(plateNo, w / 2, h * 0.81);
  });
}

/**
 * Roadside Billboards with funny Dhaka Advertisements
 */
export function createBillboardTexture(variant: number): THREE.CanvasTexture {
  return createProceduralTexture(512, 256, (ctx, w, h) => {
    const ads = [
      {
        bg: '#7c2d12',
        accent: '#facc15',
        title: 'দাদার রাস্তা',
        sub: 'রাস্তা কি বাপের পাইছেন?!',
        brand: 'DADAR RASTA 3D GAME',
      },
      {
        bg: '#064e3b',
        accent: '#34d399',
        title: 'কাচ্চি ভাই বিরিয়ানি',
        sub: 'আনলিমিটেড আলু ও বোরহানি!',
        brand: 'ধানমন্ডি ২ নম্বর রোড',
      },
      {
        bg: '#1e1b4b',
        accent: '#38bdf8',
        title: 'দাদার রাস্তায় অটো চালান',
        sub: 'এক চার্জে পুরো ঢাকা সাফারি!',
        brand: 'দেশি শক্তি অটো',
      },
      {
        bg: '#831843',
        accent: '#f472b6',
        title: 'ডাক্তার জাকির ক্লিনিক',
        sub: 'বিনা অপারেশনে পাইলস মুক্তি!',
        brand: 'ফার্মগেট ওভারব্রিজ সংলগ্ন',
      },
    ];

    const ad = ads[variant % ads.length];

    ctx.fillStyle = ad.bg;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = ad.accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Title
    ctx.fillStyle = ad.accent;
    ctx.font = 'bold 38px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ad.title, w / 2, h * 0.32);

    // Tagline
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillText(ad.sub, w / 2, h * 0.58);

    // Subtitle
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 18px sans-serif';
    ctx.fillText(ad.brand, w / 2, h * 0.82);
  });
}

/**
 * Taka Coin / Note Texture
 */
export function createTakaTexture(): THREE.CanvasTexture {
  return createProceduralTexture(128, 128, (ctx, w, h) => {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ca8a04';
    ctx.stroke();

    ctx.fillStyle = '#713f12';
    ctx.font = 'bold 54px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('৳', w / 2, h / 2);
  });
}

/**
 * Battery Power-up Texture
 */
export function createBatteryTexture(): THREE.CanvasTexture {
  return createProceduralTexture(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(14, 14, w - 28, h - 28, 16);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', w / 2, h / 2);
  });
}
