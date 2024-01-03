import { useEffect, useState } from 'react'
import {
    BranchesOutlined,
} from '@ant-design/icons';
import { Input, Radio } from 'antd';
import './index.css';

const options = [
    {
        label: 'Default',
        value: 'Default'
    },
    {
        label: 'Manual',
        value: 'Manual'
    },
]

const Compressor = () => {
    const [isFocus, setIsFocus] = useState(false);
    const [radioValue, setRadioValue] = useState('Default');
    const [data, setData] = useState([]);
    const [focusValue, setFocusValue] = useState('');

    useEffect(() => {
        setData([
            {
                name: 'Threshold',
                value: '0.0dB',
            },
            {
                name: 'Attack Time',
                value: '45.0 ms',
            },
            {
                name: 'Release Time',
                value: '750.0 ms',
            },
            {
                name: 'Hold Time',
                value: '0.0 ms',
            },
            {
                name: 'Ratio',
                value: '10.0',
            },
            {
                name: 'Knee',
                value: '4.0 dB',
            },
        ])

    }, [])

    const radioChange = (e) => {
        setRadioValue(e.target.value)
    }

    return (
        <div>
            <div className='compressor-item-box'>
                <div className='compressor-item-title'>
                    <span><BranchesOutlined /></span>
                    <span>Compressor</span>
                </div>
                <div className='compressor-item-content'>
                    <div className='compressor-item-text'>MODE</div>
                    <div className='compressor-radio-div'>
                        <Radio.Group
                            options={options}
                            onChange={radioChange}
                            value={radioValue}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </div>
                    {
                        radioValue === 'Default' && (
                            <div className={isFocus ? 'compressor-input-box compressor-input-box-active' : 'compressor-input-box'}>
                                <span className='compressor-input-text'>Threshold</span>
                                <Input
                                    style={{ cursor: 'not-allowed' }}
                                    placeholder="0.0dB"
                                    defaultValue="0.0dB"
                                    bordered={false}
                                    onFocus={() => {
                                        setIsFocus(true)
                                    }}
                                    onBlur={() => {
                                        setIsFocus(false)
                                    }}
                                />
                            </div>
                        )
                    }
                    {
                        radioValue === 'Manual' && (
                            data && data.map((item) => {
                                return (
                                    <div
                                        className={
                                            focusValue === item.name ?
                                                'compressor-input-box compressor-input-box-active' :
                                                'compressor-input-box'
                                        }
                                    >
                                        <span className='compressor-input-text'>{item.name}</span>
                                        <Input
                                            style={{ cursor: 'not-allowed' }}
                                            placeholder={item.value}
                                            defaultValue={item.value}
                                            bordered={false}
                                            onFocus={() => {
                                                setFocusValue(item.name)
                                            }}
                                            onBlur={() => {
                                                setFocusValue('')
                                            }}
                                        />
                                    </div>
                                )

                            })

                        )
                    }

                </div>
            </div>
        </div>
    )
}

export default Compressor
