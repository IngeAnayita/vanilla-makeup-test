class ProductViewModel {
    constructor() {
        this.productList = document.getElementById('product-list');
        this.loadProducts();
    }

    async loadProducts() {
        const response = await fetch('../PHP/Product_controller.php?action=getProducts');
        const products = await response.json();
        this.renderProducts(products);
    }

    renderProducts(products) {
        this.productList.innerHTML = products.map(product => `
            <div class="product-item">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
            </div>
        `).join('');
    }
}

new ProductViewModel();