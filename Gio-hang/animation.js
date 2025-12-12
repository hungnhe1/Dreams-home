document.addEventListener('DOMContentLoaded', function() {
    // 1. Tìm các phần tử HTML
    const dropBtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdown = document.querySelector('.dropdown');
    
    // 2. KIỂM TRA LỖI: Nếu không tìm thấy, báo lỗi rõ ràng
    if (!dropBtn) {
        console.error("LỖI KHÔNG TÌM THẤY: 'dropbtn'. Vui lòng kiểm tra Class trong index.html.");
        return;
    }
    if (!dropdownContent) {
        console.error("LỖI KHÔNG TÌM THẤY: 'dropdown-content'. Vui lòng kiểm tra Class trong index.html.");
        return;
    }

    // --- Hàm xử lý chính ---
    
    // Hàm mở/đóng dropdown
    function toggleDropdown() {
        if (dropdownContent.style.maxHeight && dropdownContent.style.maxHeight !== '0px') {
            // Đóng menu
            dropdownContent.style.maxHeight = null;
            console.log("Dropdown ĐÃ ĐÓNG.");
        } else {
            // Mở menu: Đặt max-height bằng chiều cao nội dung thực tế
            dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
            console.log("Dropdown ĐÃ MỞ. Chiều cao tính toán:", dropdownContent.scrollHeight, "px");
        }
    }

    // 3. Gán sự kiện click cho nút Dropdown
    dropBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Ngăn chặn liên kết chuyển trang
        event.stopPropagation(); // Ngăn chặn sự kiện lan ra cửa sổ
        toggleDropdown();
    });

    // 4. Đóng dropdown khi click ra ngoài
    window.addEventListener('click', function(event) {
        // Kiểm tra xem click có phải bên trong .dropdown không
        if (dropdownContent.style.maxHeight && dropdownContent.style.maxHeight !== '0px') {
             if (!dropdown || !dropdown.contains(event.target)) {
                 dropdownContent.style.maxHeight = null;
             }
        }
    });
    
    console.log("Tệp animation.js đã tải và chạy thành công.");
});