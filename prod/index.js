document.addEventListener('DOMContentLoaded', function () {
    const sidenavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenavElems, {});

    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search') || document.getElementById('search-mobile');
    const noProductsMessage = document.getElementById('no-products-message');
    const categoryButtons = document.querySelectorAll('.categories button');
    const allCategoriesButton = document.querySelector('.categories li:first-child');

    let allProducts = []; // armazena os dados dentro da api fake
    let currentDisplayedProducts = []; // rastreio dos produtos atualmente exibidos

    // função para buscar produtos da api fake
    async function fetchProducts() {
        try {
            const response = await fetch('../assets/data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = await response.json();
            currentDisplayedProducts = [...allProducts];
            displayProducts(currentDisplayedProducts);
            M.updateTextFields();

        } catch (error) {
            console.error('Erro ao carregar os produtos:', error);
            const rowDiv = productsGrid.querySelector('.row');
            rowDiv.innerHTML = '<p style="text-align: center; color: red; width: 100%;">Erro ao carregar produtos. Verifique o caminho do products.json e a conexão.</p>';
            noProductsMessage.style.display = 'none'; 
        }
    }

    function displayProducts(productsToDisplay) {
        const rowDiv = productsGrid.querySelector('.row');
        rowDiv.innerHTML = '';
        noProductsMessage.style.display = 'none';

        if (productsToDisplay.length === 0) {
            noProductsMessage.style.display = 'block';
            rowDiv.appendChild(noProductsMessage);
            return;
        }

        productsToDisplay.forEach(product => {
            const productCardHtml = `
                <div class="col s12 m4 l2-4 product-card-item" data-id="${product.id}">
                    <div class="card blue-grey lighten-5">
                        <div class="card-image">
                            <img src="../assets/resources/images/crops/${product.image}" alt="${product.name}" />
                        </div>
                        <div class="card-content">
                            <p><strong>${product.name}</strong></p>
                            <p class="price-tag"><i class="material-icons">monetization_on</i>${product.price} ouros</p>
                            <div class="input-field quantity-input">
                                <input type="number" id="qty-${product.id}" value="1" min="1" class="validate" />
                                <label for="qty-${product.id}">Quantidade</label>
                            </div>
                        </div>
                        <div class="card-action center-align">
                            <button class="btn-small blue darken-1 add-to-cart-btn truncate" data-product-id="${product.id}">
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            `;
            rowDiv.innerHTML += productCardHtml;
        });
        M.updateTextFields();
        currentDisplayedProducts = [...productsToDisplay];
    }

    function addToCart(productId, quantity) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) {
            console.error('Produto não encontrado:', productId);
            M.toast({html: 'Erro: Produto não encontrado!', classes: 'red darken-1'});
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            const imageUrl = `../assets/resources/images/crops/${product.image}`;
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: imageUrl,
                quantity: quantity
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cart));
        M.toast({html: `${quantity}x ${product.name} adicionado(s) ao carrinho!`, classes: 'green darken-1'});
        console.log('Carrinho atualizado:', cart);
    }

    productsGrid.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.productId);
            const quantityInput = document.getElementById(`qty-${productId}`);
            const quantity = parseInt(quantityInput.value) || 1;

            if (quantity > 0) {
                addToCart(productId, quantity);
            } else {
                M.toast({html: 'A quantidade deve ser pelo menos 1.', classes: 'red darken-1'});
                quantityInput.value = 1; 
                quantityInput.classList.remove('valid');
                quantityInput.classList.add('invalid');
            }
        }
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let filteredProducts = [];

        if (searchTerm === '') {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
        }
        displayProducts(filteredProducts);
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');


            let filteredProducts = [];

            if (category === 'all' || category === '') {
                filteredProducts = allProducts;
            } else {
                filteredProducts = allProducts.filter(product =>
                    product.category.toLowerCase() === category
                );
            }
            displayProducts(filteredProducts);
            searchInput.value = '';
            M.updateTextFields();
        });
    });

    allCategoriesButton.addEventListener('click', function() {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        displayProducts(allProducts);
        searchInput.value = '';
        M.updateTextFields();
    });

    fetchProducts();
});