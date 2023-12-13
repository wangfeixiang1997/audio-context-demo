import { useEffect } from 'react'
import { HashRouter, useRoutes } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';
import { routers } from './router'

const color = '#FFC300';

const Router = () => {
  return useRoutes(routers)
}

const App = () => {

  useEffect(() => {

  }, [])
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: color
        }
      }}
      locale={zhCN}
    >
      <HashRouter>
        <Router />
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
