import React, { useEffect, useState } from 'react';

function DonorsList() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/donate/list')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải danh sách người ủng hộ...</p>;

  return (
    <div>
      <h2>Danh sách người đã ủng hộ</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Tên người ủng hộ</th>
            <th>Loại người ủng hộ</th>
            <th>Số tiền</th>
            <th>Mô tả món ủng hộ</th>
            <th>Phương thức thanh toán</th>
            <th>ID hoạt động</th>
            <th>Ngày ủng hộ</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor, index) => (
            <tr key={index}>
              <td>{donor.donor_name}</td>
              <td>{donor.donor_type}</td>
              <td>{donor.amount}</td>
              <td>{donor.item_description}</td>
              <td>{donor.payment_method}</td>
              <td>{donor.activity_id}</td>
              <td>{new Date(donor.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DonorsList;
