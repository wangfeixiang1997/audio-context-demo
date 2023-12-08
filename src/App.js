import { useRef, useState } from 'react'
import './App.css';
import mp3 from './assets/demo.mp3'

// 浮动的小块
let floats = [];
// 高度
const FLOAT_HEIGHT = 4;
// 下落高度
const DROP_DISTANCE = 1;

const App = () => {
  const getAudioRef = useRef();
  const getCanvasRef = useRef();
  const audioCtxRef = useRef();
  const analyserRef = useRef();
  const requestAnimateFrameIdRef = useRef();
  const [volumeChangeValue, setVolumeChangeValue] = useState('1')

  const createAudioContext = async () => {
    //从音频源获取数据
    audioCtxRef.current = new (window.AudioContext || window.AudioContext)();
    analyserRef.current = audioCtxRef.current.createAnalyser();
    await getAudioRef.current.play();
    const stream = getAudioRef.current.captureStream();
    const source = audioCtxRef.current.createMediaStreamSource(stream);
    //连接到你的声源
    source.connect(analyserRef.current);
    // 获取音频数据点
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    drawEachFrame(getCanvasRef.current, dataArray);
  }

  // 每个动画帧都画图
  const drawEachFrame = (canvasEl, dataArray) => {
    // 递归调用
    requestAnimateFrameIdRef.current = requestAnimationFrame(() => drawEachFrame(canvasEl, dataArray));

    if (analyserRef.current) {
      // 读取当前帧新的数据
      analyserRef.current.getByteFrequencyData(dataArray);
      // 更新长度
      const bars = dataArray.slice(0, Math.min(1, dataArray.length));
      // 画图
      clearCanvas(canvasEl);
      // 绘制小浮块
      drawFloats(canvasEl, bars);
      // 绘制条状图
      drawBars(canvasEl, bars);
    }
  }

  const clearCanvas = (canvasEl) => {
    const canvasWidth = canvasEl.width;
    const canvasHeight = canvasEl.height;
    const canvasCtx = canvasEl.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    // 绘制图形
    canvasCtx.fillStyle = 'rgb(246,243,240)';
    canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const drawBars = (canvasEl, dataArray) => {
    const canvasWidth = canvasEl.width;
    const canvasCtx = canvasEl.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    const barHeight = canvasWidth / dataArray.length

    dataArray.forEach((dataItem) => {
      const barWidth = dataItem;
      // 画 bar
      canvasCtx.fillStyle = '#75fb4d';
      canvasCtx.fillRect(0, 0, barWidth, barHeight);

    })
  }

  const drawFloats = (canvasEl, dataArray) => {
    const canvasCtx = canvasEl.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    // 找到最大值，以及初始化高度
    dataArray.forEach((item, index) => {
      // 默认值
      floats[index] = floats[index] || FLOAT_HEIGHT;
      // 处理当前值
      const pushHeight = item + FLOAT_HEIGHT;
      const dropHeight = floats[index] - DROP_DISTANCE;
      // 取最大值
      floats[index] = Math.max(dropHeight, pushHeight);
    })

    floats.forEach((floatItem) => {
      const floatHeight = floatItem;
      canvasCtx.fillStyle = '#75fb4d';
      canvasCtx.fillRect(floatHeight, 0, FLOAT_HEIGHT, 10);
    })
  }

  // 重置 canvas
  const resetCanvas = () => {
    const canvasEl = getCanvasRef.current;
    if (canvasEl) {
      clearCanvas(canvasEl);
    }
  }

  // 停止
  const stopCanvas = () => {
    if (requestAnimateFrameIdRef.current) {
      getAudioRef.current.pause();
      window.cancelAnimationFrame(requestAnimateFrameIdRef.current);
      resetCanvas();
    }
  };

  const handleClickPlay = () => {
    createAudioContext()
  }

  const inputRangeChange = (value) => {
    setVolumeChangeValue(value)
    const gainNode = audioCtxRef.current?.createGain();
    if (gainNode) {
      gainNode.gain.value = value;
    }
  }

  return (
    <div>
      <audio ref={getAudioRef} crossOrigin="anonymous" id="audio" src={mp3}></audio>
      <canvas width={300} height={10} ref={getCanvasRef} id="canvas"></canvas>
      <div>
        <input
          onChange={(e) => { inputRangeChange(e.target.value) }}
          type="range"
          id="volume"
          min="-12"
          max="12"
          value={volumeChangeValue}
          step="1"
          list="tickmarks"
        />
        <datalist id="tickmarks">
          <option value="-12" label="-12"></option>
          <option value="-6" label="-6"></option>
          <option value="0" label="0"></option>
          <option value="6" label="6"></option>
          <option value="12" label="12"></option>
        </datalist>
      </div>

      <button style={{ cursor: 'pointer' }} onClick={handleClickPlay}>播放</button>
      <button style={{ cursor: 'pointer' }} onClick={stopCanvas}>停止</button>
    </div>
  );
}

export default App;
