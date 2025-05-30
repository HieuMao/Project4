import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function ActivityList({ mode = 'view' }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const isAdmin = mode === 'admin';
  const isVolunteer = mode === 'volunteer';
  const canRegister = isLoggedIn && (isVolunteer || isAdmin || user?.role === 'staff');

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

  if (isLoggedIn) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesRes = await axios.get('http://localhost:5000/api/activities');
        console.log('Raw Activities Response:', activitiesRes); // Log toàn bộ response
        const data = activitiesRes.data;
        if (Array.isArray(data)) {
          console.log('Activities data:', data);
          setActivities(data);
        } else {
          console.error('Data không phải mảng:', data);
          setActivities([]);
        }

        if (canRegister) {
          const registrationsRes = await axios.get('http://localhost:5000/api/volunteer/user');
          console.log('Registrations data:', registrationsRes.data);
          const registrations = registrationsRes.data;
          if (Array.isArray(registrations)) {
            setRegisteredActivities(registrations.map(reg => reg.activity_id));
          } else {
            console.error('Registrations không phải mảng:', registrations);
            setRegisteredActivities([]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.response ? err.response.data : err.message);
        setError('Lỗi lấy dữ liệu: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    fetchData();
  }, [canRegister]);

  const handleCreateClick = () => {
    if (!isAdmin) {
      setError('Chỉ admin có thể tạo hoạt động');
      return;
    }
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
    if (!isAdmin) {
      setError('Chỉ admin có thể sửa hoạt động');
      return;
    }
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
    if (!isAdmin) {
      setError('Chỉ admin có thể thực hiện hành động này');
      return;
    }
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      if (formMode === 'create') {
        const res = await axios.post('http://localhost:5000/api/activities', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setActivities([...activities, { ...formData, activity_id: res.data.activity_id, image_url: res.data.image_url || null }]);
      } else {
        const res = await axios.put(`http://localhost:5000/api/activities/${editingActivity}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setActivities(activities.map(act =>
          act.activity_id === editingActivity ? { ...act, ...formData, image_url: res.data.image_url || act.image_url } : act
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

  const handleRegister = async (id) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!canRegister) {
      setError('Vai trò không được phép đăng ký');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/volunteer/register', { activity_id: id });
      setRegisteredActivities([...registeredActivities, id]);
      alert(response.data.message || 'Đăng ký thành công! 🎉');
      setError(null);
    } catch (err) {
      setError('Lỗi đăng ký: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCancelRegistration = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký?')) return;
    try {
      const response = await axios.post('http://localhost:5000/api/volunteer/cancel', { activity_id: id });
      setRegisteredActivities(registeredActivities.filter(aid => aid !== id));
      alert(response.data.message || 'Hủy đăng ký thành công! 🎉');
      setError(null);
    } catch (err) {
      setError('Lỗi hủy đăng ký: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      setError('Chỉ admin có thể xóa hoạt động');
      return;
    }
    if (!window.confirm('Xóa hoạt động này?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`);
      setActivities(activities.filter(act => act.activity_id !== id));
      setError(null);
    } catch (err) {
      setError('Lỗi xóa: ' + err.message);
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

  if (loading) return <p className="text-center">Đang tải danh sách hoạt động... ⏳</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section className="content-section">
      <div className="flex justify-between items-center mb-4">
        <h2 className="title">Danh sách hoạt động nhân đạo</h2>
        {isAdmin && (
          <button onClick={handleCreateClick} className="nav-button" style={{ backgroundColor: '#28a745' }}>
            Thêm hoạt động
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <p>Chưa có hoạt động nào để hiển thị! 😅</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map(act => (
            <div key={act.activity_id} className="card">
              {act.image_url ? (
                <img
                  src={`http://localhost:5000/${act.image_url}`}
                  alt={act.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                  Chưa có ảnh
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{act.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{act.description}</p>
                <p className="text-sm"><strong>Loại:</strong> {act.category}</p>
                <p className="text-sm"><strong>Địa điểm:</strong> {act.location}</p>
                <p className="text-sm">
                  <strong>Thời gian:</strong>{' '}
                  {act.start_date ? new Date(act.start_date).toLocaleDateString() : ''} -{' '}
                  {act.end_date ? new Date(act.end_date).toLocaleDateString() : ''}
                </p>
                <p className="text-sm"><strong>Trạng thái:</strong> {act.status}</p>
                <div className="mt-4 flex gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleEditClick(act)}
                        className="nav-button"
                        style={{ backgroundColor: '#007bff' }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(act.activity_id)}
                        className="nav-button"
                        style={{ backgroundColor: '#dc3545' }}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                  {canRegister && (
                    registeredActivities.includes(act.activity_id) ? (
                      <button
                        onClick={() => handleCancelRegistration(act.activity_id)}
                        className="nav-button"
                        style={{ backgroundColor: '#6c757d' }}
                      >
                        Hủy đăng ký
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(act.activity_id)}
                        className="nav-button"
                        style={{ backgroundColor: '#ffc107' }}
                        disabled={act.status === 'completed'}
                      >
                        Đăng ký
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formMode && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{formMode === 'create' ? 'Thêm hoạt động' : 'Sửa hoạt động'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Tên hoạt động</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Loại</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
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
                  className="form-input"
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
                  className="form-input"
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
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
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
                  className="form-input"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="nav-button"
                  style={{ backgroundColor: '#6c757d', marginRight: '10px' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="nav-button"
                  style={{ backgroundColor: '#007bff' }}
                >
                  {formMode === 'create' ? 'Tạo' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ActivityList;