
import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
    DashboardOutlined,
    BranchesOutlined,
    SoundOutlined,
    NodeCollapseOutlined,
    StrikethroughOutlined,
} from '@ant-design/icons';
import './index.css'

const { Content, Sider } = Layout;

const adminMenuList = [
    {
        key: '/dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlined />
    },
    {
        key: '/zone',
        label: 'Zone',
        icon: <SoundOutlined />,
        children: [
            {
                key: '/zone/compressor',
                label: 'Compressor',
                icon: <BranchesOutlined />
            },
            {
                key: '/zone/routing',
                label: 'Routing',
                icon: <NodeCollapseOutlined />
            },
            {
                key: '/zone/equalizer',
                label: 'Equalizer',
                icon: <StrikethroughOutlined />
            },
        ]
    },

]

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState('')

    const setActiveMenu = () => {
        //拿到当前浏览器的hash路径
        const pathname = window.location.hash;
        // 定义一个数据,判断用户是否有权限访问
        for (let node of adminMenuList) {
            if (node.children) {
                for (let childrenNode of node.children) {
                    //使用正则判断当前浏览器path是否与菜单项中的key相匹配，避免路由传参
                    const isActivePath = new RegExp(`^#${childrenNode.key}`).test(pathname) || (pathname === '' || pathname === '#/');
                    if (isActivePath) {
                        const selectedKeys = [childrenNode.key];
                        setDefaultSelectedKeys(selectedKeys)
                        return;
                    }
                }
            }
            //使用正则判断当前浏览器path是否与菜单项中的key相匹配，避免路由传参
            const isActivePath = new RegExp(`^#${node.key}`).test(pathname) || (pathname === '' || pathname === '#/');
            if (isActivePath) {
                const selectedKeys = [node.key];
                setDefaultSelectedKeys(selectedKeys)
                return;
            }
        }
    }

    useEffect(() => {
        setActiveMenu()
    }, [location])

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width='330px' style={{
                backgroundColor: '#eee',
                height: '100vh',
                position: 'relative'
            }}>
                <div
                    style={{
                        height: '87px',
                        fontSize: '26px',
                        color: '#133060',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    ——MENU——
                </div>
                <Menu
                    className='menu-class'
                    mode="inline"
                    theme="light"
                    selectedKeys={defaultSelectedKeys}
                    style={{ padding: '8px', marginTop: '-24px', borderRight: 0, backgroundColor: '#eee' }}
                    onClick={(item) => {
                        navigate(item.key)
                        setActiveMenu()
                    }}
                    items={adminMenuList}
                />

            </Sider>
            <Content
                style={{
                    backgroundColor: '#fff'
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    )
}

export default AppLayout
