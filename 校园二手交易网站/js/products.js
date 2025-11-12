// 商品相关功能

// 分类默认图片（本地图片）
const categoryDefaultImages = {
    '书籍': 'images/book1.jpg',
    '电子产品': 'images/phone1.jpg',
    '生活用品': 'images/basketball1.jpg',
    '其他': 'images/default-product.jpg'
};

// 初始化商品数据
function initializeProducts() {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (!savedProducts) {
        // 如果localStorage中没有商品数据，使用默认数据
        const initialProducts = [
            {
                id: 1,
                title: "Java编程思想",
                price: 25.00,
                category: "书籍",
                description: "几乎全新，无任何笔记和划线，适合计算机专业学生学习使用。",
                contact: "138****1234",
                status: "available",
                publishTime: "2024-01-15",
                userId: 1,
                image: "images/book1.jpg"
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
                userId: 1,
                image: "images/phone1.jpg"
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
                userId: 1,
                image: "images/basketball1.jpg"
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
                userId: 1,
                image: "images/book2.jpg"
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
                userId: 1,
                image: "images/laptop1.jpg"
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
                userId: 1,
                image: "images/lamp1.jpg"
            }
        ];
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
}

// 发布商品功能
document.addEventListener('DOMContentLoaded', function() {
    initializeProducts();
    
    const publishForm = document.getElementById('publishForm');
    if (publishForm) {
        // 检查登录状态
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('请先登录！');
            window.location.href = 'login.html';
            return;
        }
        
        publishForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('productTitle').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = document.getElementById('productCategory').value;
            const description = document.getElementById('productDescription').value;
            const contact = document.getElementById('contactInfo').value;
            
            // 获取现有商品
            const products = JSON.parse(localStorage.getItem('products')) || [];
            
            // 创建新商品
            const newProduct = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                title: title,
                price: price,
                category: category,
                description: description,
                contact: contact,
                status: 'available',
                publishTime: new Date().toLocaleDateString(),
                userId: currentUser.id,
                image: categoryDefaultImages[category] || 'images/default-product.jpg'
            };
            
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));
            
            alert('商品发布成功！');
            window.location.href = 'index.html';
        });
    }
    
    // 商品详情页初始化
    if (window.location.pathname.includes('detail.html')) {
        loadProductDetail();
    }
});

// 加载商品详情
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        alert('商品不存在！');
        window.history.back();
        return;
    }
    
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('商品不存在！');
        window.history.back();
        return;
    }
    
    // 更新页面内容
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productPrice').textContent = `¥${product.price.toFixed(2)}`;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productContact').textContent = product.contact;
    document.getElementById('publishTime').textContent = product.publishTime;
    document.getElementById('productStatus').textContent = 
        product.status === 'available' ? '在售' : '已售出';
    
    // 更新图片
    const imageContainer = document.querySelector('.product-image-large');
    if (imageContainer && product.image) {
        imageContainer.innerHTML = `
            <img src="${product.image}" alt="${product.title}" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWbvueJh+WbvueJhzwvdGV4dD48L3N2Zz4='"
                 loading="lazy">
        `;
    }
}

// 联系卖家
function contactSeller() {
    const contact = document.getElementById('productContact').textContent;
    alert(`请联系卖家：${contact}\n\n请通过电话或短信与卖家沟通交易细节。`);
}

// 获取所有商品
function getAllProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// 根据分类筛选商品
function getProductsByCategory(category) {
    const products = getAllProducts();
    if (category === '全部') {
        return products;
    }
    return products.filter(product => product.category === category);
}