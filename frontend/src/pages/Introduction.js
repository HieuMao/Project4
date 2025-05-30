import React from 'react';
import '../App.css';

const Introduction = () => {
  const introText = `Hoạt động nhân đạo là những hành động thể hiện lòng nhân ái, hỗ trợ những người yếu thế trong xã hội, giảm thiểu thiệt hại do thiên tai, dịch bệnh, xung đột gây ra, và góp phần xây dựng một cộng đồng đoàn kết, bền vững.`;
  const importancePoints = [
    "Giúp đỡ những người yếu thế trong xã hội.",
    "Giảm thiểu thiệt hại do thiên tai, dịch bệnh, xung đột gây ra.",
    "Xây dựng tinh thần đoàn kết, yêu thương giữa con người với nhau.",
    "Góp phần ổn định và phát triển xã hội bền vững."
  ];
  const activities = [
    { name: "Cứu trợ khẩn cấp", description: "Lực lượng cứu hộ giúp đỡ người dân trong vùng lũ lụt.", image: "/cuu-tro.jpg" },
    { name: "Khám chữa bệnh", description: "Nhân viên y tế khám bệnh cho người dân tại khu vực khó khăn.", image: "/kham-chua-benh.jpg" },
    { name: "Hỗ trợ giáo dục", description: "Tình nguyện viên giảng dạy cho trẻ em ở vùng sâu vùng xa.", image: "/ho-tro-giao-duc.jpg" },
    { name: "Phát triển sinh kế", description: "Người dân được hỗ trợ công cụ và kỹ năng để phát triển kinh tế.", image: "/phat-trien-sinh-ke.jpg" },
    { name: "Bảo vệ quyền lợi", description: "Hoạt động tuyên truyền và bảo vệ quyền con người.", image: "/bao-ve-quyen-loi.jpg" },
    { name: "Hỗ trợ môi trường", description: "Tình nguyện viên tham gia trồng cây và làm sạch môi trường.", image: "/ho-tro-moi-truong.jpg" }
  ];

  return (
    <div className="page-container">
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
          <div className="activities-list">
            {activities.map((activity, i) => (
              <div key={i} className="activity-item">
                <img src={activity.image} alt={activity.name} className="activity-image" />
                <div className="activity-content">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Introduction;