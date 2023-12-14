import { useEffect } from 'react'
import {
    NodeCollapseOutlined,
} from '@ant-design/icons';
import './index.css';

const Routing = () => {

    useEffect(() => {

    }, [])


    return (
        <div>
            <div className='routing-item-box'>
                <div className='routing-item-title'>
                    <span><NodeCollapseOutlined /></span>
                    <span>Routing</span>
                </div>
                <div className='routing-item-content'>
                    <div>Select Zone Signal source for Speaker</div>
                </div>
            </div>
        </div>
    )
}

export default Routing
