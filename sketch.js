// 設定角色1的JUMP精靈圖片路徑。
const spritePath = "1/JUMP/JUMP.png";

// 設定JUMP精靈圖片包含五張水平排列的影格。
const frameCount = 5;

// 設定每一張動畫影格的播放間隔時間，單位為毫秒。
const frameInterval = 100;

// 設定角色移動速度。
const moveSpeed = 6;

// 宣告JUMP精靈圖片物件。
let spriteSheet = null;

// 宣告圖片目前的載入狀態。
let spriteState = "loading";

// 宣告目前播放的動畫影格編號。
let currentFrame = 0;

// 宣告上一次切換影格的時間。
let lastFrameTime = 0;

// 宣告角色左上角的水平座標。
let characterX = 0;

// 宣告角色左上角的垂直座標。
let characterY = 0;

// 宣告角色顯示寬度。
let characterWidth = 0;

// 宣告角色顯示高度。
let characterHeight = 0;

// 宣告角色是否面向右方。
let facingRight = true;

// preload函式會在setup函式之前執行。
function preload() {
  // 載入JUMP精靈圖片。
  spriteSheet = loadImage(
    // 指定JUMP精靈圖片路徑。
    spritePath,

    // 圖片成功載入時執行此函式。
    function () {
      // 將圖片載入狀態設定為完成。
      spriteState = "loaded";
    },

    // 圖片載入失敗時執行此函式。
    function () {
      // 將圖片載入狀態設定為失敗。
      spriteState = "error";
    }
  );
}

// setup函式只會在程式開始時執行一次。
function setup() {
  // 建立符合瀏覽器視窗大小的全螢幕畫布。
  createCanvas(windowWidth, windowHeight);

  // 將畫布像素密度設定為一。
  pixelDensity(1);

  // 設定圖片繪製位置從左上角開始。
  imageMode(CORNER);

  // 開啟圖片平滑縮放功能。
  smooth();

  // 開啟畫布圖片平滑處理功能。
  drawingContext.imageSmoothingEnabled = true;

  // 設定文字水平對齊方式為置中。
  textAlign(CENTER, CENTER);

  // 記錄動畫開始的時間。
  lastFrameTime = millis();

  // 設定角色初始大小與位置。
  updateCharacterSizeAndPosition();
}

// draw函式會持續重複執行。
function draw() {
  // 使用天空色繪製整個畫布背景。
  background(135, 206, 235);

  // 判斷圖片是否仍然載入中。
  if (spriteState === "loading") {
    // 顯示圖片載入中的提示訊息。
    showMessage("圖片載入中……");

    // 結束本次繪圖。
    return;
  }

  // 判斷圖片是否載入失敗。
  if (spriteState === "error") {
    // 顯示圖片載入失敗的提示訊息。
    showMessage("圖片載入失敗，請確認：1/JUMP/JUMP.png");

    // 結束本次繪圖。
    return;
  }

  // 判斷精靈圖片物件是否不存在。
  if (!spriteSheet) {
    // 顯示找不到圖片的提示訊息。
    showMessage("找不到JUMP精靈圖片。");

    // 結束本次繪圖。
    return;
  }

  // 更新角色目前的顯示尺寸。
  updateCharacterSize();

  // 更新角色目前的移動位置。
  updateCharacterMovement();

  // 更新角色目前的動畫影格。
  updateAnimation();

  // 繪製角色目前的動畫影格。
  drawCharacter();
}

// 更新角色大小的函式。
function updateCharacterSize() {
  // 取得精靈圖片的實際寬度。
  const spriteWidth = max(1, spriteSheet.width);

  // 取得精靈圖片的實際高度。
  const spriteHeight = max(1, spriteSheet.height);

  // 依照圖片實際寬度除以五，計算單格影格寬度。
  const frameWidth = spriteWidth / frameCount;

  // 設定角色高度為畫布高度的三分之一。
  const targetHeight = max(1, height / 3);

  // 根據單格圖片比例計算角色顯示寬度。
  const targetWidth = targetHeight * (frameWidth / spriteHeight);

  // 將計算出的高度指定給角色高度。
  characterHeight = targetHeight;

  // 將計算出的寬度指定給角色寬度。
  characterWidth = targetWidth;

  // 判斷角色寬度是否大於畫布寬度。
  if (characterWidth > width) {
    // 計算角色需要縮小的比例。
    const scaleRatio = width / characterWidth;

    // 將角色寬度縮小至畫布寬度。
    characterWidth = width;

    // 依照相同比例縮小角色高度。
    characterHeight = characterHeight * scaleRatio;
  }

  // 確保角色高度至少為一個像素。
  characterHeight = max(1, characterHeight);

  // 確保角色寬度至少為一個像素。
  characterWidth = max(1, characterWidth);
}

// 更新角色大小與初始位置的函式。
function updateCharacterSizeAndPosition() {
  // 更新角色的顯示大小。
  updateCharacterSize();

  // 將角色中心放在畫布寬度的三分之二位置。
  const characterCenterX = width * (2 / 3);

  // 根據角色中心計算左上角水平位置。
  characterX = characterCenterX - characterWidth / 2;

  // 計算角色左上角的垂直位置，使角色底端貼齊畫布底端。
  characterY = height - characterHeight;

  // 限制角色不超出畫布左右邊界。
  characterX = constrain(
    characterX,
    0,
    max(0, width - characterWidth)
  );
}

// 更新角色移動位置的函式。
function updateCharacterMovement() {
  // 宣告角色本次水平移動距離。
  let moveAmount = 0;

  // 判斷是否按下鍵盤右方向鍵。
  if (keyIsDown(RIGHT_ARROW)) {
    // 設定角色向右移動。
    moveAmount = moveSpeed;

    // 設定角色面向右方。
    facingRight = true;
  }

  // 判斷是否按下鍵盤左方向鍵。
  if (keyIsDown(LEFT_ARROW)) {
    // 設定角色向左移動。
    moveAmount = -moveSpeed;

    // 設定角色面向左方。
    facingRight = false;
  }

  // 根據移動距離更新角色水平位置。
  characterX = characterX + moveAmount;

  // 限制角色左端不得超出畫布左端。
  characterX = max(0, characterX);

  // 限制角色右端不得超出畫布右端。
  characterX = min(width - characterWidth, characterX);

  // 讓角色底端持續貼齊畫布底端。
  characterY = height - characterHeight;
}

// 更新角色動畫影格的函式。
function updateAnimation() {
  // 取得目前時間。
  const currentTime = millis();

  // 判斷是否達到下一張動畫影格的時間。
  if (currentTime - lastFrameTime >= frameInterval) {
    // 計算經過了幾個動畫播放間隔。
    const passedFrames = floor(
      (currentTime - lastFrameTime) / frameInterval
    );

    // 更新目前動畫影格並循環播放。
    currentFrame = (currentFrame + passedFrames) % frameCount;

    // 記錄本次影格切換時間。
    lastFrameTime = currentTime;
  }
}

// 繪製角色目前動畫影格的函式。
function drawCharacter() {
  // 取得精靈圖片實際寬度。
  const spriteWidth = max(1, spriteSheet.width);

  // 取得精靈圖片實際高度。
  const spriteHeight = max(1, spriteSheet.height);

  // 計算單格影格實際裁切寬度。
  const sourceFrameWidth = spriteWidth / frameCount;

  // 計算目前影格的裁切起始水平位置。
  const sourceX = currentFrame * sourceFrameWidth;

  // 儲存目前的繪圖狀態。
  push();

  // 開啟圖片平滑縮放功能。
  drawingContext.imageSmoothingEnabled = true;

  // 判斷角色目前是否面向左方。
  if (!facingRight) {
    // 將座標原點移動至角色右側。
    translate(characterX + characterWidth, characterY);

    // 將圖片沿著水平軸翻轉。
    scale(-1, 1);

    // 裁切並繪製目前的JUMP動畫影格。
    image(
      spriteSheet,
      0,
      0,
      characterWidth,
      characterHeight,
      sourceX,
      0,
      sourceFrameWidth,
      spriteHeight
    );
  } else {
    // 裁切並繪製目前的JUMP動畫影格。
    image(
      spriteSheet,
      characterX,
      characterY,
      characterWidth,
      characterHeight,
      sourceX,
      0,
      sourceFrameWidth,
      spriteHeight
    );
  }

  // 還原繪圖狀態。
  pop();
}

// 顯示提示訊息的函式。
function showMessage(message) {
  // 設定提示文字顏色。
  fill(40);

  // 設定提示文字大小。
  textSize(20);

  // 將提示文字顯示在畫布中央。
  text(message, width / 2, height / 2);
}

// 當瀏覽器視窗大小改變時執行此函式。
function windowResized() {
  // 重新調整畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新設定畫布像素密度。
  pixelDensity(1);

  // 重新開啟圖片平滑縮放功能。
  smooth();

  // 重新開啟畫布圖片平滑處理功能。
  drawingContext.imageSmoothingEnabled = true;

  // 更新角色顯示大小。
  updateCharacterSize();

  // 重新設定角色底端位置。
  characterY = height - characterHeight;

  // 限制角色不超出畫布左右邊界。
  characterX = constrain(
    characterX,
    0,
    max(0, width - characterWidth)
  );
}