import { Form, InputNumber, Popconfirm, Input, Table, Button, Space, Typography } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { SearchOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import * as API from '~/services/searchService';
// import classNames from 'classnames/bind';
// const cx = classNames.bind(styles);
function ChangeInformation() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [passwordVisible, setPasswordVisible] = useState([]);
    const searchInput = useRef(null);
    useEffect(() => {
        const fetchData = (async () => {
            const response = await API.get('/cucDangKiem/admin/centers');
            const result = JSON.parse(response);
            console.log(result);
            setData([...result]);
        })();
    }, []);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (searchedColumn === dataIndex ? text : text),
    });
    const changeVisible1 = (record) => {
       
        setPasswordVisible([...passwordVisible,record.key]);
    };
    const changeVisible2 = (record) => {
        console.log(passwordVisible)
        
        setPasswordVisible(passwordVisible.filter(function(number) {
            return number!== record.key;
          }));
        
    };
    const EditableCell = ({ editing, visible, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        return (
            <td {...restProps}>
                {dataIndex == 'user' && !passwordVisible.includes(record.key) ? (
                    // <Form.Item
                    //     name={dataIndex}
                    //     style={{
                    //         margin: 0,
                    //     }}
                    //     rules={[
                    //         {
                    //             required: true,
                    //             message: `Please Input ${title}!`,
                    //         },
                    //     ]}
                    // >
                    //     {inputNode}
                    // </Form.Item>

                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        ****** <span onClick={()=>changeVisible1(record)}> { passwordVisible.includes(record.key) ? <EyeTwoTone /> : <EyeInvisibleOutlined />}</span>
                    </p>
                ) : dataIndex == 'user' ? (
                    <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {children} <span onClick={()=>changeVisible2(record)}> { passwordVisible.includes(record.key) ? <EyeTwoTone /> : <EyeInvisibleOutlined />}</span>
                    </p>
                ) : (
                    children
                )}
            </td>
        );
    };
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            regionName: '',
            user: '',
            ...record,
        });

        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (record) => {
        try {
            console.log(record);
            const response = await API.post('cucdangkiem/admin/center/changemodecenters', { ...record });
            const fetchData = (async () => {
                const response = await API.get('/cucDangKiem/admin/centers');
                const result = JSON.parse(response);
                console.log(result);
                setData([...result]);
            })();

            setEditingKey('');
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: 'Tên Trung Tâm',
            dataIndex: 'name',
            width: '30%',
            visible: true,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Tỉnh',
            dataIndex: 'regionName',
            width: '15%',
            visible: true,
            ...getColumnSearchProps('regionName'),
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'user',
            width: '15%',
            editable: true,
            visible: false,
            ...getColumnSearchProps('user'),
        },
        {
            title: 'Trạng thái hoạt động',
            dataIndex: 'active',
            width: '10%',
            visible: true,
            ...getColumnSearchProps('active'),
            render: (_, record) => {
                return record.active ? <span>Hoạt Động</span> : <span>Ngừng</span>;
            },
        },
        {
            title: 'Cấp Quyền',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
                            Xác Nhận
                        </Typography.Link>
                        <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={cancel}>
                            <a>Hủy Bỏ</a>
                        </Popconfirm>
                    </span>
                ) : record.active ? (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Ngừng hoạt động
                    </Typography.Link>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Tiếp tục hoạt động
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                visible: col.visible,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                    onChange: cancel,
                }}
            />
        </Form>
    );
}

export default ChangeInformation;
