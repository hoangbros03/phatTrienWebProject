import { Outlet } from "react-router-dom";
import styles from "./upload.module.scss";
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import React, { useState } from 'react';
import { UploadIcon,Close } from "../../../components/Icons";
const cx = classNames.bind(styles);
function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        console.log('Selected file:', file.name);
        // Do something with the selected file
      };

    const handleFile= () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*'; // Set file types to accept
        fileInput.onchange = handleFileInputChange;
        fileInput.click(); // Trigger the file selection dialog
    };
    return (<div className={cx('wrapper')}>
    <div className={cx('content')}>
    <UploadIcon width="2rem" height="2rem"/>

    <div className={cx("button")} onClick={handleFile} >Select File</div>
    </div>
    <Outlet/>
    </div>
    );
}

export default Upload;