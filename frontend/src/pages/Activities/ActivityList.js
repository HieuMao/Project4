import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [registeredActivities, setRegisteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    end_date: '',
    status: '',
    image: null,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  if (isLoggedIn) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesRes = await axios.get('http://localhost:5000/api/activities');
        setActivities(activitiesRes.data);

        if (isLoggedIn) {
          const registrationsRes = await axios.get('http://localhost:5000/api/volunteer/user');
          setRegisteredActivities(registrationsRes.data);
        }

        setLoading(false);
      } catch (err) {
        setError('Lỗi lấy dữ liệu: ' + err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn]);

  const handleCreateClick = () => {
    setFormMode('create');
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      start_date: '',
      end_date: '',
      status: '',
      image: null,
    });
  };

  const handleEditClick = (activity) => {
    setFormMode('edit');
    setEditingActivity(activity.activity_id);
    setFormData({
      name: activity.name,
      description: activity.description,
      category: activity.category,
      location: activity.location,
      start_date: activity.start_date ? new Date(activity.start_date).toISOString().split('T')[0] : '',
      end_date: activity.end_date ? new Date(activity.end_date).toISOString().split('T')[0] : '',
      status: activity.status,
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('status', formData.status);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (formMode === 'create') {
        const response = await axios.post('http://localhost:5000/api/activities', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setActivities([...activities, { ...formData, activity_id: response.data.activity_id, image_url: response.data.image_url || null }]);
      } else if (formMode === 'edit') {
        const response = await axios.put(`http://localhost:5000/api/activities/${editingActivity}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setActivities(activities.map(act =>
          act.activity_id === editingActivity ? { ...act, ...formData, image_url: response.data.image_url || act.image_url } : act
        ));
      }

      setFormMode(null);
      setEditingActivity(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        location: '',
        start_date: '',
        end_date: '',
        status: '',
        image: null,
      });
      setError(null);
    } catch (err) {
      setError(`Lỗi ${formMode === 'create' ? 'tạo' : 'cập nhật'} hoạt động: ${err.message}`);
    }
  };

  const handleRegister = async (activity_id) => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login page
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/volunteer/register', {
        activity_id
      });
      setRegisteredActivities([...registeredActivities, activity_id]);
      alert(response.data.message);
      setError(null);
    } catch (err) {
      setError('Lỗi đăng ký hoạt động: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCancelRegistration = async (activity_id) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký hoạt động này?')) return;
    try {
      const response = await axios.post('http://localhost:5000/api/volunteer/cancel', {
        activity_id
      });
      setRegisteredActivities(registeredActivities.filter(id => id !== activity_id));
      alert(response.data.message);
      setError(null);
    } catch (err) {
      setError('Lỗi hủy đăng ký: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa hoạt động này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`);
      setActivities(activities.filter(act => act.activity_id !== id));
      setError(null);
    } catch (err) {
      setError('Lỗi xóa hoạt động: ' + err.message);
    }
  };

  const handleCancel = () => {
    setFormMode(null);
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      location: '',
      start_date: '',
      end_date: '',
      status: '',
      image: null,
    });
  };

  if (loading) return <p className="text-center text-gray-500">Đang tải danh sách hoạt động...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách hoạt động nhân đạo</h2>
        <button
          onClick={handleCreateClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm hoạt động
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Ảnh</th>
            <th className="border border-gray-300 p-2">Tên hoạt động</th>
            <th className="border border-gray-300 p-2">Mô tả</th>
            <th className="border border-gray-300 p-2">Loại</th>
            <th className="border border-gray-300 p-2">Địa điểm</th>
            <th className="border border-gray-300 p-2">Ngày bắt đầu</th>
            <th className="border border-gray-300 p-2">Ngày kết thúc</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
            <th className="border border-gray-300 p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(act => (
            <tr key={act.activity_id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{act.activity_id}</td>
              <td className="border border-gray-300 p-2">
                {act.image_url ? (
                  <img
                    src={`http://localhost:5000/${act.image_url}`}
                    alt={act.name}
                    className="w-24 h-auto object-cover"
                  />
                ) : (
                  <span>Chưa có ảnh</span>
                )}
              </td>
              <td className="border border-gray-300 p-2">{act.name}</td>
              <td className="border border-gray-300 p-2">{act.description}</td>
              <td className="border border-gray-300 p-2">{act.category}</td>
              <td className="border border-gray-300 p-2">{act.location}</td>
              <td className="border border-gray-300 p-2">
                {act.start_date ? new Date(act.start_date).toLocaleDateString() : ''}
              </td>
              <td className="border border-gray-300 p-2">
                {act.end_date ? new Date(act.end_date).toLocaleDateString() : ''}
              </td>
              <td className="border border-gray-300 p-2">{act.status}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditClick(act)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(act.activity_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                >
                  Xóa
                </button>
                {isLoggedIn && registeredActivities.includes(act.activity_id) ? (
                  <button
                    onClick={() => handleCancelRegistration(act.activity_id)}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Hủy đăng ký
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(act.activity_id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    disabled={act.status === 'completed'}
                  >
                    Đăng ký
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {formMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {formMode === 'create' ? 'Thêm hoạt động' : 'Sửa hoạt động'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tên hoạt động</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Loại</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Chọn loại</option>
                  <option value="cuu_tro">Cứu trợ</option>
                  <option value="giao_duc">Giáo dục</option>
                  <option value="y_te">Y tế</option>
                  <option value="sinh_ke">Sinh kế</option>
                  <option value="khac">Khác</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Địa điểm</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Ngày bắt đầu</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Ngày kết thúc</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="planned">Lên kế hoạch</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Ảnh</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {formMode === 'create' ? 'Tạo' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityList;