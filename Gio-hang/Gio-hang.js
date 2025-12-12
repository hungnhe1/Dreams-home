let currentDiscount = 0;
let appliedPromoCode = '';

function formatVND(amount){
    const finalAmount = Math.max(0, amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(finalAmount)
        .replace(/\s/g, '');
}

// ✅ Cập nhật tổng tiền
function updateCartTotal(){
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let totalItems = 0;

    cartItems.forEach(item => {
        const unitPrice = parseInt(item.getAttribute('data-unit-price'));
        const quantityInput = item.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value) || 0;
        const itemTotalElement = item.querySelector('.subtotal-display');
        const itemTotal = unitPrice * quantity;

        subtotal += itemTotal;
        totalItems += quantity;
        itemTotalElement.textContent = formatVND(itemTotal);
    });

    const discountAmount = Math.min(subtotal, currentDiscount);
    const finalTotal = subtotal - discountAmount;

    document.getElementById('total-items-count').textContent = totalItems;
    document.getElementById('subtotal-display-summary').textContent = formatVND(subtotal);
    document.getElementById('discount-display').textContent = '- ' + formatVND(discountAmount);
    document.getElementById('final-total-display').textContent = formatVND(finalTotal);
    document.getElementById('promo-code-used').textContent = appliedPromoCode ? `(Mã ${appliedPromoCode})` : '';
}

// ✅ Áp dụng mã giảm giá
function applyPromoCode(){
    const inputElement = document.getElementById('promo-input');
    const promoCode = inputElement.value.toUpperCase().trim();

    const validPromoCodes = {
        'SIEUGIAMGIA500K': { type: 'fixed', value: 500000, name: 'Giảm cố định 500.000₫' },
        'GIAM18%': { type: 'percent', value: 0.18, name: 'Giảm 18% trên tổng tạm tính' },
    };

    const subtotalText = document.getElementById('subtotal-display-summary').textContent;
    const currentSubtotal = parseInt(subtotalText.replace(/[.₫]/g, '').trim()) || 0;

    if(validPromoCodes[promoCode]){
        const promo = validPromoCodes[promoCode];
        let calculatedDiscount = promo.type === 'percent' ? currentSubtotal * promo.value : promo.value;

        currentDiscount = calculatedDiscount;
        appliedPromoCode = promoCode;
        updateCartTotal();
        alert(`🎉 Áp dụng mã ${promoCode} thành công! Bạn được ${promo.name}.`);
    }else{
        currentDiscount = 0;
        appliedPromoCode = '';
        updateCartTotal();
        alert(`Mã giảm giá "${promoCode}" không hợp lệ hoặc đã hết hạn.`);
    }
}

// ✅ Thanh toán
function handleCheckout(){
    const totalItems = document.getElementById('total-items-count').textContent;
    const finalTotalText = document.getElementById('final-total-display').textContent;
    const discountText = document.getElementById('discount-display').textContent;
    const appliedCodeText = document.getElementById('promo-code-used').textContent;
    const shippingAddress = document.getElementById('shipping-address-input').value.trim(); 

    if(parseInt(totalItems) === 0){
        alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
    }
    if(!shippingAddress){
        alert("Vui lòng nhập địa chỉ giao hàng trước khi thanh toán.");
        document.getElementById('shipping-address-input').focus();
        return;
    }

    const confirmationMessage =
        `ĐẶT HÀNG THÀNH CÔNG \n\n` +
        `Số lượng : ${totalItems}\n` +
        `Giảm giá ${appliedCodeText}: ${discountText}\n` +
        `Tổng cộng : ${finalTotalText}\n\n` +
        `Đơn hàng của bạn sẽ được giao tới địa chỉ ${shippingAddress} trong vòng 3-5 ngày làm việc.`;

    alert(confirmationMessage);

    // Clear giỏ hàng cả DOM và localStorage
    localStorage.removeItem("cart");
    const cartList = document.querySelector('.cart-items-list');
    cartList.innerHTML = '<p style="text-align:center">Giỏ hàng của bạn đang trống.</p>';

    currentDiscount = 0;
    appliedPromoCode = '';
    document.getElementById('shipping-address-input').value = ''; 
    updateCartTotal();
}

// ✅ Cập nhật số lượng trong localStorage
function updateLocalStorage(item, quantity){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const name = item.querySelector('.item-info a').textContent.trim();
    cart = cart.map(c => c.name === name ? {...c, quantity: quantity} : c);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ✅ Xóa sản phẩm khỏi localStorage
function removeFromLocalStorage(name){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(c => c.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ✅ Gắn sự kiện cho các nút
function initCartEvents(){
    document.querySelectorAll('.cart-item').forEach(item => {
        const quantityInput = item.querySelector('.quantity-input');

        quantityInput.addEventListener('change', () => {
            let quantity = parseInt(quantityInput.value) || 1;
            if(quantity < 1 || isNaN(quantity)) quantity = 1;
            quantityInput.value = quantity;

            updateLocalStorage(item, quantity);
            updateCartTotal();
        });

        item.querySelectorAll('.quantity-btn').forEach(button =>{
            button.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                let quantity = parseInt(quantityInput.value) || 1;
                if(action === 'plus'){ quantity += 1; }
                else if(action === 'minus' && quantity > 1){ quantity -= 1; }
                quantityInput.value = quantity;

                updateLocalStorage(item, quantity);
                updateCartTotal();
            });
        });

        item.querySelector('.remove-btn').addEventListener('click', () => {
            const name = item.querySelector('.item-info a').textContent.trim();
            if(confirm(`Bạn có chắc chắn muốn xóa ${name} khỏi giỏ hàng?`)){
                removeFromLocalStorage(name);
                item.remove();
                updateCartTotal();

                if(document.querySelectorAll('.cart-item').length === 0){
                    const cartList = document.querySelector('.cart-items-list');
                    cartList.innerHTML = '<p style="text-align:center">Giỏ hàng của bạn đang trống.</p>';
                }
            }
        });
    });

    document.getElementById('apply-promo-btn').addEventListener('click', applyPromoCode);
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
    updateCartTotal();
}

// ✅ Hiển thị giỏ hàng từ localStorage (có hình ảnh)
function displayCart(){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.querySelector('.cart-items-list');
    cartList.innerHTML = '';

    if(cart.length === 0){
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Giỏ hàng của bạn đang trống.';
        emptyMessage.style.textAlign = 'center';
        cartList.appendChild(emptyMessage);
    }else{
        cart.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.setAttribute('data-unit-price', item.price);

            li.innerHTML = `
                <div class="item-details">
                    <div class="item-image" style="background-image:url('${item.image}'); background-size:cover; width:60px; height:60px; border-radius:6px;"></div>
                    <div class="item-info">
                        <a href="#">${item.name}</a>
                        <p>Giá đơn vị: ${item.price.toLocaleString()}₫</p>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="quantity-btn" data-action="minus">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity || 1}">
                    <button class="quantity-btn" data-action="plus">+</button>
                    <span class="subtotal-display"></span>
                    <button class="remove-btn">Xóa</button>
                </div>
            `;
            cartList.appendChild(li);
        });
    }

    updateCartTotal();
    initCartEvents();
}

// ✅ Gọi khi load trang
document.addEventListener('DOMContentLoaded', displayCart);