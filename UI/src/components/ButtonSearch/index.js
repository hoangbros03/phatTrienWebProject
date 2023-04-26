import classNames from 'classnames/bind';
import styles from './ButtonSearch.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';

const cx = classNames.bind(styles);

function ButtonSearch({
    to,
    href,
    primary = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    active = false,
    large = false,
    bar = false,
    children,
    className,
    data = [],
    onClick,
    type_,
    ...passProps
}) {
    const [display, setDisplay] = useState(false);
    const [value, setValue] = useState(children);
    let Comp = 'button';
    const _props = { ...passProps };
    

    if (disabled) {
        Object.keys(_props).forEach((key) => {
            if (key.startsWith('on') && typeof _props[key] === 'function') {
                delete _props[key];
            }
        });
    }
    if (to) {
        _props.to = to;
        Comp = Link;
    } else if (href) {
        _props.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        [className]: className,
        primary,
        outline,
        small,
        text,
        bar,
        large,
        active,
    });
    const handleDisable=()=>{
        setTimeout(() => {
            setDisplay(false);
          }, 500);
    }
    const filteredData = data.filter(
        (item) => typeof item === 'string' && item.toLowerCase().includes(value.toLowerCase()),
    );
    const handleClick = (e) => {
        setValue(e.target.innerText);
        console.log(e.target.innerText);
        console.log(type_)
        onClick(e, type_);
        setDisplay(false);
    };
    const handleToggle = (e) => {
      
        setValue('');
        setDisplay(true);
    };
    const handleChange = (e) => {
        setValue(e.target.value);
        
    };
    // const test=(e)=>{
    //     console.log(_props)
    //     console.log(onClick)
    //     console.log("e.target.value")
    //     onClick(e, type_);
    // }
    return (
        <Comp className={classes}  {..._props} >
            <input className={cx('title')} value={value} onClick={handleToggle} onChange={handleChange} onBlur={handleDisable} ></input>
            {display && (
                <div className={cx('data')}>
                    {filteredData.length > 0 &&
                        filteredData.map((datas, index) => {
                            return (
                                <p key={index} onClick={handleClick}  >
                                    {datas}
                                </p>
                            );
                        })}
                </div>
            )}
        </Comp>
    );
}
ButtonSearch.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default ButtonSearch;
