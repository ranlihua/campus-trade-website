// 模拟商品数据（使用本地图片）- 6个商品
const products = [
    {
        id: 1,
        title: "Java编程思想",
        price: 25.00,
        category: "书籍",
        description: "几乎全新，无任何笔记和划线，适合计算机专业学生学习使用。",
        contact: "138****1234",
        status: "available",
        publishTime: "2024-01-15",
        image: "images/books1.jpg",
        userId: 1
    },
    {
        id: 2,
        title: "iPhone 12 128GB",
        price: 2800.00,
        category: "电子产品",
        description: "95新，功能完好，无拆无修，原装充电器，电池健康度92%。",
        contact: "139****5678",
        status: "available",
        publishTime: "2024-01-10",
        image: "images/phone1.jpg",
        userId: 1
    },
    {
        id: 3,
        title: "斯伯丁篮球",
        price: 60.00,
        category: "生活用品",
        description: "使用一个学期，磨损正常，气密性良好。",
        contact: "137****9012",
        status: "available",
        publishTime: "2024-01-08",
        image: "images/basketball1.jpg",
        userId: 1
    },
    {
        id: 4,
        title: "考研数学复习全书",
        price: 30.00,
        category: "书籍",
        description: "李永乐复习全书，有少量铅笔笔记，不影响使用。",
        contact: "136****3456",
        status: "sold",
        publishTime: "2024-01-05",
        image: "images/books2.jpg",
        userId: 1
    },
    {
        id: 5,
        title: "笔记本电脑散热器",
        price: 45.00,
        category: "电子产品",
        description: "USB接口，双风扇散热，可调节高度，几乎全新。",
        contact: "135****7890",
        status: "available",
        publishTime: "2024-01-12",
        image: "images/laptop1.jpg",
        userId: 1
    },
    {
        id: 6,
        title: "LED护眼台灯",
        price: 35.00,
        category: "生活用品",
        description: "三档调光，使用一年，功能正常。",
        contact: "134****2345",
        status: "available",
        publishTime: "2024-01-03",
        image: "images/lamp1.jpg",
        userId: 1
    }
];

// 分类图标映射
const categoryIcons = {
    '书籍': 'fas fa-book',
    '电子产品': 'fas fa-laptop',
    '生活用品': 'fas fa-tshirt',
    '其他': 'fas fa-cube'
};

// 渲染商品列表
function renderProducts(productList = products) {
    const container = document.getElementById('productList');
    
    if (!container) return;
    
    container.innerHTML = productList.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" 
                     onerror="handleImageError(this)"
                     loading="lazy">
            </div>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">¥${product.price.toFixed(2)}</div>
            <span class="product-category">${product.category}</span>
            <div class="product-contact">联系方式: ${product.contact}</div>
            <a href="detail.html?id=${product.id}" class="product-link">查看详情</a>
            ${product.status === 'sold' ? '<div class="sold-badge">已售出</div>' : ''}
        </div>
    `).join('');
}

// 图片加载错误处理函数
function handleImageError(img) {
    // 移除错误的src，避免重复触发onerror
    img.onerror = null;
    // 设置一个空的src，这样CSS的占位符就会显示
    img.src = '';
    // 添加错误样式
    img.style.display = 'none';
}

// 分类筛选功能
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的active类
            filterBtns.forEach(b => b.classList.remove('active'));
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            const category = this.textContent;
            let filteredProducts;
            
            if (category === '全部') {
                filteredProducts = products;
            } else {
                filteredProducts = products.filter(product => 
                    product.category === category && product.status === 'available'
                );
            }
            
            renderProducts(filteredProducts);
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化商品数据到localStorage（如果还没有的话）
    initializeProductsData();
    
    renderProducts();
    setupFilters();
    
    console.log('校园二手交易平台首页加载完成');
});

// 初始化商品数据
function initializeProductsData() {
    const savedProducts = localStorage.getItem('products');
    if (!savedProducts) {
        localStorage.setItem('products', JSON.stringify(products));
    }
}