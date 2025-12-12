auth.onAuthStateChanged(user => {
    const link = document.getElementById("login-link");

    if (user) {
        // Đã đăng nhập
        link.innerHTML = `<i class="fas fa-user me-1"></i> ${user.email}`;
        link.href = "#"; // Không dẫn tới trang đăng nhập

        // Thêm nút đăng xuất
        link.insertAdjacentHTML("afterend", `
            <a class="nav-link text-uppercase" href="#" id="logout-btn">
                <i class="fas fa-sign-out-alt me-1"></i> Đăng xuất
            </a>
        `);

        document.getElementById("logout-btn").onclick = () => {
            auth.signOut().then(() => {
                alert("Đã đăng xuất");
                location.reload();
            });
        };

    } else {
        // Chưa đăng nhập
        link.innerHTML = `<i class="fas fa-user me-1"></i> Đăng nhập`;
        link.href = "/login-main/index_login.html";
    }
});