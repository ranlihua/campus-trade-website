// 用户认证相关功能

// 模拟用户数据
let users = JSON.parse(localStorage.getItem('users')) || [
    {
        id: 1,
        username: 'admin',
        password: '21232f297a57a5a743894a0e4a801fc3', // 'admin'的MD5
        phone: '138****0000'
    }
];

// 当前登录用户
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// MD5加密函数（简化版）
function md5(input) {
    // 在实际项目中应该使用完整的MD5库
    // 这里使用简化版本用于演示
    return btoa(input).substring(0, 32);
}

// 注册功能
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const phone = document.getElementById('phone').value;
            
            // 表单验证
            if (password !== confirmPassword) {
                showError('passwordError', '两次输入的密码不一致');
                return;
            }
            
            if (password.length < 6) {
                showError('passwordError', '密码长度至少6位');
                return;
            }
            
            // 检查用户名是否已存在
            if (users.find(user => user.username === username)) {
                showError('usernameError', '用户名已存在');
                return;
            }
            
            // 注册新用户
            const newUser = {
                id: users.length + 1,
                username: username,
                password: md5(password),
                phone: phone || ''
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('注册成功！请登录');
            window.location.href = 'login.html';
        });
    }
    
    // 登录功能
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const user = users.find(u => u.username === username && u.password === md5(password));
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                alert('登录成功！');
                window.location.href = 'index.html';
            } else {
                alert('用户名或密码错误！');
            }
        });
    }
    
    // 个人中心页面初始化
    if (window.location.pathname.includes('profile.html')) {
        if (!currentUser) {
            alert('请先登录！');
            window.location.href = 'login.html';
            return;
        }
        
        // 显示用户信息
        document.getElementById('userName').textContent = currentUser.username;
        document.getElementById('userPhone').textContent = 
            currentUser.phone ? `手机号：${currentUser.phone}` : '手机号：未设置';
        
        // 显示我的商品
        displayMyProducts();
    }
});

// 显示错误信息
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// 显示我的商品
// 显示我的商品
function displayMyProducts() {
    const myProductsContainer = document.getElementById('myProducts');
    if (!myProductsContainer) return;
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const myProducts = products.filter(product => product.userId === currentUser.id);
    
    if (myProducts.length === 0) {
        myProductsContainer.innerHTML = '<p class="no-data">您还没有发布过商品</p>';
        return;
    }
    
    myProductsContainer.innerHTML = myProducts.map(product => `
        <div class="my-product-item">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjhmOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYflm77niYc8L3RleHQ+PC9zdmc+'"
                     loading="lazy">
            </div>
            <div class="product-item-info">
                <div class="product-item-title">${product.title}</div>
                <div class="product-item-meta">
                    ¥${product.price} • ${product.category} • 
                    ${product.status === 'available' ? '在售' : '已售出'} • 
                    ${product.publishTime}
                </div>
            </div>
            <div class="product-item-actions">
                ${product.status === 'available' ? 
                    `<button class="sold-btn" onclick="markAsSold(${product.id})">标记已售</button>` : 
                    '<span class="sold-badge">已售出</span>'
                }
            </div>
        </div>
    `).join('');
}

// 标记商品为已售
function markAsSold(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex].status = 'sold';
        localStorage.setItem('products', JSON.stringify(products));
        alert('商品已标记为已售出！');
        displayMyProducts(); // 刷新显示
    }
}

// 检查登录状态
function checkLogin() {
    return currentUser !== null;
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}