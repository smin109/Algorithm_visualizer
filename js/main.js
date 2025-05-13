const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let array = [];
const barWidth = 10;
let selectedAlgorithm = "kmp"; // default

function selectAlgorithm(name, element) {
  selectedAlgorithm = name;

  document.querySelectorAll(".menu a").forEach(a => {
    a.classList.remove("active");
  })

  element.classList.add("active");

  console.log("Selected:", selectedAlgorithm);
}

function generateArray(size = 80) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * (canvas.height - 10)) + 10);
}

function drawArray(highlight = []) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  array.forEach((val, i) => {
    ctx.fillStyle = highlight.includes(i) ? "#EEE8AA" : "#00FFFF";
    ctx.fillRect(i * barWidth, canvas.height - val, barWidth - 1, val);
  });
}

const nodeTs = [
  { id: 1, x: 400, y: 100 },
  { id: 2, x: 266, y: 200 },
  { id: 3, x: 533, y: 200 },
  { id: 4, x: 160, y: 300 },
  { id: 5, x: 320, y: 300 },
  { id: 6, x: 480, y: 300 },
  { id: 7, x: 640, y: 300 },
  { id: 8, x: 88, y: 400 },
  { id: 9, x: 177, y: 400 },
  { id: 10, x: 266, y: 400 },
  { id: 11, x: 355, y: 400 },
  { id: 12, x: 444, y: 400 },
  { id: 13, x: 533, y: 400 },
  { id: 14, x: 622, y: 400 },
  { id: 15, x: 711, y: 400 }
];

const edgeTs = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 2, to: 5 },
  { from: 3, to: 6 },
  { from: 3, to: 7 },
  { from: 4, to: 8 },
  { from: 4, to: 9 },
  { from: 5, to: 10 },
  { from: 5, to: 11 },
  { from: 6, to: 12 },
  { from: 6, to: 13 },
  { from: 7, to: 14 },
  { from: 7, to: 15 }
];


function drawTree() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ▶ 엣지 그리기
  edgeTs.forEach(edgeT => {
    const from = nodeTs.find(n => n.id === edgeT.from);
    const to = nodeTs.find(n => n.id === edgeT.to);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // ▶ 노드 그리기
  nodeTs.forEach(nodeT => {
    ctx.beginPath();
    ctx.arc(nodeT.x, nodeT.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'steelblue';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // ▶ 노드 라벨
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nodeT.id, nodeT.x, nodeT.y);
  });
}

const adjacencyList = {};
nodeTs.forEach(nodeT => adjacencyList[nodeT.id] = []);
edgeTs.forEach(edgeT => {
  adjacencyList[edgeT.from].push(edgeT.to);
  adjacencyList[edgeT.to].push(edgeT.from); // 무방향 그래프
});

async function animateVisit(order) {
  drawTree(); // 전체 초기화
  for (let i = 0; i < order.length; i++) {
    const nodeT = nodeTs.find(n => n.id === order[i]);

    ctx.beginPath();
    ctx.arc(nodeT.x, nodeT.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nodeT.id, nodeT.x, nodeT.y);

    await sleep(500); // 0.5초 간격
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      drawArray([j, j + 1]);
      await sleep(30);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        drawArray([j, j + 1]);
        await sleep(30);
      }
    }
  }
  drawArray([]);
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      drawArray([i, j, minIdx]);
      await sleep(30);
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      drawArray([i, minIdx]);
      await sleep(30);
    }
  }
  drawArray([]);
}

async function quickSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  let index = await partition(start, end);
  await Promise.all([
    quickSort(start, index - 1),
    quickSort(index + 1, end),
  ]);
}

async function partition(start, end) {
  let pivot = array[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    drawArray([i, pivotIndex, end]);
    await sleep(30);
    if (array[i] < pivot) {
      [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
      pivotIndex++;
      drawArray([i, pivotIndex]);
      await sleep(30);
    }
  }
  [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
  drawArray([pivotIndex, end]);
  await sleep(30);
  return pivotIndex;
}

async function mergeSort(start = 0, end = array.length - 1) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0, j = 0, k = start;

  while (i < left.length && j < right.length) {
    drawArray([k]);
    await sleep(30);
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
  }
  while (i < left.length) {
    array[k++] = left[i++];
    drawArray([k]);
    await sleep(30);
  }
  while (j < right.length) {
    array[k++] = right[j++];
    drawArray([k]);
    await sleep(30);
  }
}

async function bfs(startId = 1) {
  const visited = new Set();
  const queue = [startId];
  const order = [];
  visited.add(startId);

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);
    for (let neighbor of adjacencyList[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  await animateVisit(order);
}

async function dfs(startId = 1) {
  const visited = new Set();
  const order = [];

  function dfsVisit(nodeT) {
    visited.add(nodeT);
    order.push(nodeT);
    for (let neighbor of adjacencyList[nodeT]) {
      if (!visited.has(neighbor)) {
        dfsVisit(neighbor);
      }
    }
  }

  dfsVisit(startId);
  await animateVisit(order);
}

const binsList = [1, 3, 7, 12, 15, 21, 34, 59, 63, 68, 80, 84, 87, 91];

async function bins() {
  const toSearch = 68;

  let left = 0;
  let right = binsList.length - 1;
  while(left <= right){
    await sleep(500);
    let mid = Math.floor((left + right) / 2);
    drawChart({left, mid, right});
    if(binsList[mid] < toSearch) left = mid + 1;
    else if(binsList[mid] > toSearch) right = mid - 1;
    else break;
  }
}

async function drawChart({ left = -1, mid = -1, right = -1 } = {}) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  binsList.forEach((val, i) => {
    const x = 50 * i + 50;
    const y = 265;
    const width = 40;
    const height = 40;

    // 색상 결정
    if (i === mid) ctx.fillStyle = "#FF6347";        // 빨간색: mid
    else if (i === left || i === right) ctx.fillStyle = "#EEE8AA"; // 연노랑: left/right
    else ctx.fillStyle = "#00FFFF";                  // 기본색

    // 사각형
    ctx.fillRect(x, y, width, height);

    // 텍스트
    ctx.fillStyle = "#000000";
    ctx.fillText(val, x + width / 2, y + height / 2);
  });
}

const text = "ababcababcabc";
const pattern = "ababc";

let lps = [];
let curIndex = 0;
let patIndex = 0;

function kmp(pattern) {
  const lps = Array(pattern.length).fill(0);
  let len = 0;

  for(let i = 1; i < pattern.length; i++){
    while(len > 0 && pattern[i] !== pattern[len]) {
      len = lps[len - 1];
    }
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
    }
  }
  return lps;
}

function drawTextandPattern(text, pattern, textIndex, patternIndex, matchedSet = new Set()) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < text.length; i++) {
    if (i === textIndex) {
      ctx.fillStyle = "gray";
    } else if (matchedSet.has(i)) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.fillText(text[i], 50 + i * 40, 200);
    ctx.strokeRect(30 + i * 40, 180, 40, 40);
  }

  for (let i = 0; i < pattern.length; i++) {
    const x = 50 + (textIndex - patternIndex + i) * 40;
    ctx.fillStyle = (i === patternIndex) ? "blue" : "black";
    ctx.fillText(pattern[i], x, 270);
    ctx.strokeRect(x - 20, 250, 40, 40);
  }
}


async function animateKMP(text, pattern) {
  const lps = kmp(pattern);
  let i = 0, j = 0;
  const matchedSet = new Set();

  while (i < text.length) {
    drawTextandPattern(text, pattern, i, j, matchedSet);
    await sleep(1000);

    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        // 패턴 매칭된 위치 하이라이팅
        for (let k = i - j; k < i; k++) {
          matchedSet.add(k);
        }
        j = lps[j - 1];
      }
    } else {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  drawTextandPattern(text, pattern, -1, -1, matchedSet);
}


function start() {
  if (selectedAlgorithm === "bubble") {
    generateArray();
    drawArray();
    bubbleSort();
  } else if (selectedAlgorithm === "selection") {
    generateArray();
    drawArray();
    selectionSort();
  } else if (selectedAlgorithm === "quick") {
    generateArray();
    drawArray();
    quickSort();
  } else if (selectedAlgorithm === "merge") {
    generateArray();
    drawArray();
    mergeSort();
  } else if (selectedAlgorithm === "bfs") {
    drawTree();
    bfs(1); // 시작 노드 ID는 1
  } else if (selectedAlgorithm === "dfs") {
    drawTree();
    dfs(1);
  } else if (selectedAlgorithm === "bins") {
    drawChart();
    bins();
  } else if (selectedAlgorithm === "kmp") {
    animateKMP(text, pattern);
  }
}
