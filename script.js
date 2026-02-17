// SwiperJS slider configuration
new Swiper(".card-wrapper", {
  loop: true,
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // số slider trên khung nhìn ứng với pc hay mobile
  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

// Danh sách các mệnh giá tiền
const moneyValues = [
  { amount: 1000, image: "image/1k.jpg" },
  { amount: 2000, image: "image/2k.jpg" },
  { amount: 5000, image: "image/5k.jpg" },
  { amount: 10000, image: "image/10k.jpg" },
  { amount: 20000, image: "image/20k.jpg" },
  { amount: 50000, image: "image/50k.jpg" },
  { amount: 100000, image: "image/100k.jpg" },
  { amount: 200000, image: "image/200k.jpg" }
];

// Lời chúc cố định cho tất cả
const fixedMessage = "Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý, tài lộc đầy nhà, phúc lộc dồi dào. Mong rằng năm mới này sẽ mang đến cho bạn và gia đình nhiều niềm vui, hạnh phúc, sức khỏe dồi dào và thành công rực rỡ trong mọi lĩnh vực!";

// Lưu lịch sử để tránh lặp liên tiếp
let recentResults = [];
const maxRecentSize = 3;

// Hàm random thông minh
function getRandomMoney() {
  // Tạo trọng số
  const weights = moneyValues.map(item => {
    let weight = 1;
    if (item.amount <= 5000) weight = 40;      // 40% cho 1k-5k
    else if (item.amount <= 20000) weight = 30; // 30% cho 10k-20k
    else if (item.amount <= 100000) weight = 20; // 20% cho 50k-100k
    else weight = 10;                            // 10% cho 200k
    
    // Giảm trọng số nếu vừa ra gần đây
    if (recentResults.includes(item.amount)) {
      weight = weight / 3;
    }
    
    return weight;
  });
  
  // Random theo trọng số
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < moneyValues.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      const selected = moneyValues[i];
      
      // Cập nhật lịch sử
      recentResults.push(selected.amount);
      if (recentResults.length > maxRecentSize) {
        recentResults.shift();
      }
      
      return selected;
    }
  }
  
  return moneyValues[0];
}

const buttons = document.querySelectorAll(".badge");
const overlays = document.querySelectorAll(".overlay");

// Lắng nghe sự kiện click trên từng nút
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Random mệnh giá tiền
    const selectedMoney = getRandomMoney();
    
    // Ẩn tất cả overlay trước
    overlays.forEach((overlay) => {
      overlay.style.display = "none";
      
      // Xóa thông báo cũ nếu có
      const oldNotice = overlay.querySelector(".screenshot-notice");
      if (oldNotice) {
        oldNotice.remove();
      }
    });

    // Chọn overlay đầu tiên (vì lời chúc giống nhau)
    const selectedOverlay = overlays[0];
    selectedOverlay.style.display = "flex";

    // Cập nhật hình ảnh tiền theo random
    const imgElement = selectedOverlay.querySelector(".img-overlay");
    imgElement.src = selectedMoney.image;

    // Hiệu ứng Typewriter
    const textElement = selectedOverlay.querySelector(".overlay-text");
    if (textElement) {
      const content = fixedMessage;
      textElement.textContent = "";
      let i = 0;

      function typeEffect() {
        if (i < content.length) {
          textElement.textContent += content[i];
          i++;
          setTimeout(typeEffect, 30);
        } else {
          // Hiển thị hình ảnh
          if (imgElement) {
            imgElement.style.display = "block";
            
            // Hiển thị thông báo chụp màn hình
            setTimeout(() => {
              const screenshotNotice = document.createElement("p");
              screenshotNotice.className = "screenshot-notice";
              screenshotNotice.innerHTML = `📸 HÃY CHỤP MÀN HÌNH ĐỂ NHẬN LÌ XÌ ${formatMoney(selectedMoney.amount)}!`;
              selectedOverlay.querySelector(".overlay-content").appendChild(screenshotNotice);
            }, 500);
          }
        }
      }
      typeEffect();

      // Ẩn hình ảnh ban đầu
      if (imgElement) {
        imgElement.style.display = "none";
      }
    }
  });
});

// Đóng overlay khi click nút X
document.querySelectorAll(".close-overlay").forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    closeButton.closest(".overlay").style.display = "none";
  });
});

// Format tiền
function formatMoney(amount) {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
}