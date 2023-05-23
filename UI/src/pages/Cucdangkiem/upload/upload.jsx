import { Outlet } from 'react-router-dom';
import styles from './upload.module.scss';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import * as API from '~/services/searchService';
const cx = classNames.bind(styles);

function Upload_() {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [JsonObject, setJsonObject] = useState({});
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error('Please select a file to upload');
            return;
        }
        {
            try {
                setUploading(true);
                console.log(JsonObject,'asd');
                const response = await API.post('trungTamDangKiem/admin/databaseManagement/import', { ...JsonObject });
            } catch (error) {
                console.log('Error');
                message.error('File lỗi hoặc chưa đúng format');
            }
            setUploading(false);
        }
    };

    const props = {
        onRemove: (file) => {
            setFileList((prevFileList) => {
                const index = prevFileList.indexOf(file);
                const newFileList = [...prevFileList];
                newFileList.splice(index, 1);
                return newFileList;
            });
        },
        beforeUpload: (file) => {
            setFileList((prevFileList) => [...prevFileList, file]);
            // const formData = new FormData();
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileContent = e.target.result;
                try {
                    const jsonObject = JSON.parse(fileContent);
                    console.log(jsonObject);
                    setJsonObject(jsonObject)
                    // Do something with the JSON object
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
            return false;
        },
        fileList,
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <Upload {...props} style={{ marginTop: 16 }}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
            </div>
            <Outlet />
        </div>
    );
}

export default Upload_;
