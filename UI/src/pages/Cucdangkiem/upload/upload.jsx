import { Outlet } from 'react-router-dom';
import styles from './upload.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { UploadIcon, Close } from '../../../components/Icons';
const cx = classNames.bind(styles);
function Upload_() {
    // const [selectedFile, setSelectedFile] = useState(null);
    // const handleFileInputChange = (event) => {
    //     const file = event.target.files[0];
    //     setSelectedFile(file);
    //     console.log('Selected file:', file.name);
    //     // Do something with the selected file
    //   };

    // const handleFile= () => {
    //     const fileInput = document.createElement('input');
    //     fileInput.type = 'file';
    //     fileInput.accept = 'image/*'; // Set file types to accept
    //     fileInput.onchange = handleFileInputChange;
    //     fileInput.click(); // Trigger the file selection dialog
    // };
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        setUploading(true);
        // You can use any AJAX library you like
        fetch('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
            method: 'POST',
            body: formData,
        })
            .then((res) => res.json())
            .then(() => {
                setFileList([]);
                message.success('upload successfully.');
            })
            .catch(() => {
                message.error('upload failed.');
            })
            .finally(() => {
                setUploading(false);
            });
    };
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <Upload {...props} 
                style={{
                    marginTop: 16,
                }}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{
                        marginTop: 16,
                        
                    }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </div>
            <Outlet />
        </div>
    );
}

export default Upload_;
