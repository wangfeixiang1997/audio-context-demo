import { useEffect, useState } from 'react'
import {
    NodeCollapseOutlined,
} from '@ant-design/icons';
import { Radio, Space } from 'antd';
import './index.css';

const Routing = () => {
    const [value, setValue] = useState(1);

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
                    <div className='routing-item-text'>Select Zone Signal source for Speaker</div>
                    <div className='radio-box'>
                        <Radio.Group onChange={(e) => { setValue(e.target.value); }} value={value}>
                            <Space direction="vertical">
                                <Radio value={1}><div className='radio-item'>Zone A</div></Radio>
                                <Radio value={2}><div className='radio-item'>Zone B</div></Radio>
                                <Radio value={3}><div className='radio-item'>Zone C</div></Radio>
                                <Radio value={4}><div className='radio-item'>Zone D</div></Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Routing
