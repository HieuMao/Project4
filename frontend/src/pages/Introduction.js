import React from 'react';
import Header from '../components/Header';
import '../App.css';

const Introduction = () => {
  const introText = `Hoạt động nhân đạo là những hành động thể hiện lòng nhân ái...`;
  const importancePoints = [
    "Giúp đỡ những người yếu thế trong xã hội.",
    "Giảm thiểu thiệt hại do thiên tai, dịch bệnh, xung đột gây ra.",
    "Xây dựng tinh thần đoàn kết, yêu thương giữa con người với nhau.",
    "Góp phần ổn định và phát triển xã hội bền vững."
  ];
  const activities = [
    "Cứu trợ khẩn cấp...",
    "Khám chữa bệnh...",
    "Hỗ trợ giáo dục...",
    "Phát triển sinh kế...",
    "Bảo vệ quyền lợi..."
  ];

  return (
    <div className="page-container">
      <Header />
      <main className="content-container">
        <section className="content-section">
          <h2 className="title">Giới thiệu về hoạt động nhân đạo</h2>
          <p>{introText}</p>
          <h3>Tầm quan trọng:</h3>
          <ul>
            {importancePoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
        <section className="content-section">
          <h2 className="title">Hoạt động nổi bật</h2>
          <ul>
            {activities.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Introduction;