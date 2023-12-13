import { useRef, useState, useEffect } from 'react'
import {
  InfoCircleOutlined,
  PoweroffOutlined,
  LoginOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  WifiOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import './index.css';
import mp3 from '../../assets/demo.mp3'

const item = [
  {
    icon: <PoweroffOutlined />,
    name: 'Power',
    value: 'On'
  },
  {
    icon: <LoginOutlined />,
    name: 'Input',
    value: 'Signal'
  },
  {
    icon: <LogoutOutlined />,
    name: 'Output',
    value: 'Signal'
  },
  {
    icon: <ApartmentOutlined />,
    name: 'LAN',
    value: '10.10.1.1'
  },
  {
    icon: <WifiOutlined />,
    name: 'WiFi',
    value: '192.168.4.1'
  },
]

// 浮动的小块
let floats = [];
// 高度
const FLOAT_HEIGHT = 4;
// 下落高度
const DROP_DISTANCE = 1;

const Dashboard = () => {
  const getAudioRef = useRef();
  const getCanvasRef = useRef();
  const audioCtxRef = useRef();
  const analyserRef = useRef();
  const requestAnimateFrameIdRef = useRef();
  const [volumeChangeValue, setVolumeChangeValue] = useState('1')
  const [canvasValue, setCanvasValue] = useState(0)

  useEffect(() => {
    if (getCanvasRef.current) {
      clearCanvas(getCanvasRef.current);
    }
  }, [])

  const createAudioContext = async () => {
    if (getAudioRef.current) {
      return
    }
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    analyserRef.current = audioCtxRef.current.createAnalyser();
    // Make a audio node
    getAudioRef.current = new Audio();
    getAudioRef.current.loop = false;
    getAudioRef.current.autoplay = false;
    getAudioRef.current.controlsList = "nodownload";
    getAudioRef.current.crossOrigin = "anonymous";
    getAudioRef.current.preload = "none";

    getAudioRef.current.addEventListener("canplay", function () {
      //从音频源获取数据
      var source = audioCtxRef.current.createMediaElementSource(getAudioRef.current);
      //连接到你的声源
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    });
    getAudioRef.current.src = mp3
    getAudioRef.current.play();
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
      setCanvasValue(bars[0])
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
    const canvasHeight = canvasEl.height;
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
      canvasCtx.fillRect(floatHeight, 0, FLOAT_HEIGHT, canvasHeight);
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
      if (getAudioRef.current) {
        getAudioRef.current.pause();
        getAudioRef.current = null
      }

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
      <div className='item-box'>
        <div className='item-title'>
          <span><InfoCircleOutlined /></span>
          <span>Status</span>
        </div>
        <div className='item-content'>
          {
            item.map((item) => {
              return (
                <div className='content-item'>
                  <div className='content-item-box'>
                    <div className='item-box-icon'>{item.icon}</div>
                    <div className='item-box-right'>
                      <div className='item-box-name'>{item.name}</div>
                      <div className='item-box-value'>{item.value}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className='item-box'>
        <div className='item-title'>
          <span><InfoCircleOutlined /></span>
          <span>Zone A</span>
        </div>
        <div className='item-canvas'>
          <div className='item-canvas-box'>
            <canvas width={680} height={13} ref={getCanvasRef} id="canvas"></canvas>
            <span>{`${canvasValue} db`}</span>
          </div>
          <div className='canvas-number'>
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
            <span>600</span>
          </div>
        </div>
        <div className='volume-input'>
          <div style={{ display: 'flex' }}>
            <div className='volume-menu'>
              <SoundOutlined />
            </div>
            <div style={{ marginLeft: '16px', marginTop: '14px' }}>
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
          </div>
          <div className='volume-value'>{`${volumeChangeValue} db`}</div>
        </div>

        <div className='item-play'>
          <span onClick={handleClickPlay}>播放</span>
          <span>请先点击播放按钮</span>
          <span onClick={stopCanvas}>停止</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
