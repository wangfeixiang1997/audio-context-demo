import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'

// 切换页面会出现闪屏现象
// 解决思路：公共页面不采用懒加载的方式 并在App.tsx去除Suspense的包裹
import AppLayout from '../Layout';

// 用懒加载实现优化
// const AppLayout = lazy(() => import('../AppLayout'));
const Dashboard = lazy(() => import('../pages/dashboard'));
const Compressor = lazy(() => import('../pages/zone/compressor'));
const Routing = lazy(() => import('../pages/zone/routing'));
const Equalizer = lazy(() => import('../pages/zone/equalizer'));

// 实现懒加载的用Suspense包裹 定义函数
const lazyLoad = (children) => {
  return <Suspense fallback={<></>}>
    {children}
  </Suspense>
}

export const routers = [

  {
    path: '/',
    element: <AppLayout />,
    //路由嵌套，子路由的元素需使用<Outlet />
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: '/dashboard',
        element: lazyLoad(<Dashboard />)
      },
      {
        path: '/zone',
        children: [
            {
              path: '/zone',
              element: <Navigate to="/zone/compressor" />
            },
            {
              path: '/zone/compressor',
              element: lazyLoad(<Compressor />)
            },
            {
              path: '/zone/routing',
              element: lazyLoad(<Routing />)
            },
            {
              path: '/zone/equalizer',
              element: lazyLoad(<Equalizer />)
            },
          ]
      },
    ]
  }
]

