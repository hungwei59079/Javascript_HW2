export async function loadAllAssets() {
  const [dinoImages, obstacleImage] = await Promise.all([
    loadDinoImage(),
    loadObstacleImage()
  ]);
  return {
    dinoImages,
    obstacleImage
  };
}

// ------------ Asset loading utilities -----------
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function loadDinoImage(): Promise<[HTMLImageElement | null, HTMLImageElement | null, HTMLImageElement | null]> {
  const paths = ['/assets/dino_normal.png', '/assets/dino_left_foot.png', '/assets/dino_right_foot.png'];
  return Promise.all(paths.map((p) => loadImage(p).catch(() => null))) as Promise<[HTMLImageElement | null, HTMLImageElement | null, HTMLImageElement | null]>;
}

function loadObstacleImage(): Promise<HTMLImageElement> {
  return loadImage('/assets/cactus.png');
}