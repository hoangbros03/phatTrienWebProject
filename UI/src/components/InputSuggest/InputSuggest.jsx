import React, { useState,  useEffect } from 'react';

import styles from './InputSuggest.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function InputSuggest({ children,value ,className, data = [], input = false, onClick=false , ChangeData , ...passProps }) {
    const [display , setDisplay] = useState(false);
    const [result, setResult] = useState(value||"");
    const classes = cx('wrapper', {
        [className]: className,
    });
  
    useEffect(()=>{
        setResult(value)
    },[value])
    const _props = { ...passProps };
    const handleDisable = (e) => {
        setTimeout(() => {
            if(onClick==false) ChangeData(e)
            setDisplay(false);
            console.log("KKK")
        }, 500);
    };
    const filteredData = data.filter(
        (item) => typeof item === 'string' && item.toLowerCase().includes(result.toLowerCase()),
    );
    
    const handleClick = (e) => {
        setResult(e.target.innerText);
        if(onClick!=false) 
        {onClick(e.target.innerText);}
        setDisplay(false);
    };
    const handleToggle = (e) => {
        setDisplay(true);
    };
    const handleChange = (e) => {
        setResult(e.target.value);
        ChangeData(e);
    };
    return (
        <div className={classes} onBlur={handleDisable} value={result} > 
            <input
                className={cx('input')}
                value={result}
                placeholder={children}
                onClick={handleToggle}
                onChange={handleChange}
                readOnly={!input}
                {..._props}
            ></input>
            {display && (
                <div className={cx('data')}>
                    {filteredData.length > 0 &&
                        filteredData.map((datas, index) => {
                            return (
                                <p key={index} onClick={handleClick}>
                                    {datas}
                                </p>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default InputSuggest;
