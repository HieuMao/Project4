import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Lỗi lấy dữ liệu: ' + err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user.user_id);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
  };

  const handleUpdate = async () => {
    try {
     await axios.put(`http://localhost:5000/api/users/${editingUser}`, formData);

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert('Cập nhật thất bại');
    }
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
    setUsers(prev => prev.filter(u => u.user_id !== id));
  } catch (err) {
    console.error(err);
    alert('Xóa người dùng thất bại');
  }
};


  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách Người dùng</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', margin: 'auto' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            editingUser === user.user_id ? (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></td>
                <td><input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></td>
                <td><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={handleUpdate}>Lưu</button>
                  <button onClick={() => setEditingUser(null)}>Hủy</button>
                </td>
              </tr>
            ) : (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Sửa</button>
                  <button onClick={() => handleDelete(user.user_id)}>Xóa</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
