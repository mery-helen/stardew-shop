document.addEventListener('DOMContentLoaded', function() {
    const cartItemsList = document.getElementById('cart-items-list');
    const totalValueSpan = document.getElementById('total-value');
    const finalizePurchaseBtn = document.getElementById('finalize-purchase');
    const deliveryAddressInput = document.getElementById('delivery-address');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    M.updateTextFields();
    M.textareaAutoResize(deliveryAddressInput);

    // renderização dos itens do carrinho
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItemsList.innerHTML = ''; 
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsList.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';
            const collectionDiv = document.createElement('div');
            collectionDiv.classList.add('collection');

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const cartItemHtml = `
                    <a href="#!" class="collection-item cart-item" data-id="${item.id}">
                        <div>
                            <strong>${item.name}</strong>
                            <span class="secondary-content">
                                <span class="quantity-controls">
                                    <button class="btn-flat btn-small remove-one" data-id="${item.id}">-</button>
                                    Quantidade: <span class="quantity">${item.quantity}</span>
                                    <button class="btn-flat btn-small add-one" data-id="${item.id}">+</button>
                                </span>
                                - <span class="price">${item.price}</span> Ouros (Total: <span class="item-total-price">${itemTotal}</span> Ouros)
                                <button class="btn-small red darken-1 remove-item-btn" data-id="${item.id}">Remover</button>
                            </span>
                        </div>
                    </a>
                `;
                collectionDiv.innerHTML += cartItemHtml;
            });
            cartItemsList.appendChild(collectionDiv);
        }
        totalValueSpan.textContent = total;
    }

    
    function updateItemQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cartItems', JSON.stringify(cart));
            renderCart();
        }
    }

    //função para remover itens do carrinho
    function removeItem(productId) {
        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(cart));
        renderCart(); 
    }

    
    cartItemsList.addEventListener('click', function(event) {
        const target = event.target;
        const productId = parseInt(target.dataset.id);

        if (target.classList.contains('remove-one')) {
            updateItemQuantity(productId, -1);
        } else if (target.classList.contains('add-one')) {
            updateItemQuantity(productId, 1);
        } else if (target.classList.contains('remove-item-btn')) {
            removeItem(productId);
        }
    });

    // validação: campo de endereço de entrega
    deliveryAddressInput.addEventListener('input', function() {
        if (deliveryAddressInput.validity.valid) {
            deliveryAddressInput.classList.remove('invalid');
            deliveryAddressInput.classList.add('valid');
        } else {
            deliveryAddressInput.classList.remove('valid');
            deliveryAddressInput.classList.add('invalid');
        }
    });

    finalizePurchaseBtn.addEventListener('click', function() {
        // verifica o formulário antes de finalizar
        if (deliveryAddressInput.checkValidity()) {
            let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            if (cart.length === 0) {
                alert("Seu carrinho está vazio. Adicione itens antes de finalizar a compra!");
                return;
            }
            
            alert("Pedido realizado com sucesso! Seu pedido será enviado para: " + deliveryAddressInput.value);
            localStorage.removeItem('cartItems'); 
            deliveryAddressInput.value = ''; 
            M.updateTextFields(); 
            renderCart(); 
        } else {
            alert("Por favor, preencha o endereço de entrega corretamente para finalizar a compra.");
            
        }
    });

    
    renderCart();
});