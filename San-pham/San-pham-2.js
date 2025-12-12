function addToCart(name, price) {
    // Lấy giỏ hàng từ Local Storage (nếu chưa có thì tạo mảng rỗng)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1; // tăng số lượng nếu đã có
    } else {
      cart.push({ name, price, quantity: 1 }); // thêm mới nếu chưa có
    }

    // Lưu lại vào Local Storage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${name} đã được thêm vào giỏ hàng!`);
}
