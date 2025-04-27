import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ktpm-backend.onrender.com';


const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
    const [error, setError] = useState(null); 

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/users`);
                if (res.data && Array.isArray(res.data.data)) {
                    setUsers(res.data.data); // Trích xuất danh sách người dùng từ res.data.data
                } else {
                    console.error('Dữ liệu trả về không hợp lệ:', res.data);
                    setError('Dữ liệu trả về không hợp lệ.');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                setError('Không thể tải danh sách người dùng.');
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };
        getAllUsers();
    }, []);

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const deleteUser = async (id) => {
        const res = await axios.delete(`${API_URL}/api/v1/users/${id}`);
        if (res.data.success) {
            setUsers(users.filter(user => user._id !== id)); // Cập nhật danh sách người dùng sau khi xóa
            toast.success('Xóa người dùng thành công!'); // Hiển thị thông báo thành công
        } else {
            console.error('Lỗi khi xóa người dùng:', res.data.message);
        }
    }

    return (
        <div>
            <h1>Quản lý người dùng</h1>
            <table className="table table-bordered" style={{ zIndex: '100', marginTop: '15px' }}>
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Họ và tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số DT</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope='col'>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <FaPencilAlt style={{cursor:'pointer'}}/>
                               <div style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '21px' }} >
                               <MdDeleteOutline  style={{color:'red'}} onClick={() => deleteUser(user._id)}/>
                               </div>

                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                Không có người dùng nào.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserManagement;