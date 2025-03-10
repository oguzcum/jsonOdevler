$(document).ready(function() {
    let allProducts = []; 

    loadCart();

    $.getJSON('https://fakestoreapi.com/products?limit=8', function(data) {
        allProducts = data; 
        renderProducts(data); 
        renderSliderProducts(data); 
        $('#productSlider').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
        });
    });

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    $('#searchInput').on('input', debounce(function() {
        const searchTerm = $(this).val().trim();
        if (searchTerm === "") {
            renderProducts(allProducts); 
        } else {
            const filteredProducts = allProducts.filter(product => product.id.toString() === searchTerm);
            renderProducts(filteredProducts); 
        }
    }, 300));

    function renderProducts(products) {
        $('#productContainer').empty(); 
        products.forEach(product => {
            const $product = $('#productTemplate').contents().clone();
            $product.find('.product-image').attr('src', product.image);
            $product.find('.product-title').text(product.title);
            $product.find('.product-description').text(product.description.substring(0, 100) + '...');
            $product.find('.product-rating').text(product.rating.rate + ' ⭐');
            $product.find('.add-to-cart').data('product', JSON.stringify(product));
            $product.find('.view-details').data('product', JSON.stringify(product));

            $('#productContainer').append($('<div class="col-md-4 mb-4"></div>').append($product));
        });
    }

    function renderSliderProducts(products) {
        $('#productSlider').empty(); 
        products.forEach(product => {
            const $sliderProduct = $('#sliderProductTemplate').contents().clone();
            $sliderProduct.find('.product-image').attr('src', product.image);
            $sliderProduct.find('.product-title').text(product.title);
            $sliderProduct.find('.product-description').text(product.description.substring(0, 100) + '...');
            $sliderProduct.find('.product-rating').text(product.rating.rate + ' ⭐');

            $('#productSlider').append($('<div class="slick-item"></div>').append($sliderProduct));
        });
    }

    $(document).on('click', '.add-to-cart', function() {
        const product = JSON.parse($(this).data('product'));
        const products = JSON.parse(localStorage.getItem('cart')) || [];
        products.push(product);
        localStorage.setItem('cart', JSON.stringify(products));
        addProductToCart(product);
        $(this).text('Eklendi').prop('disabled', true).fadeOut(500, function() {
            $(this).fadeIn(500).text('Sepete Ekle').prop('disabled', false);
        });
    });

    $(document).on('click', '.remove-from-cart', function() {
        const $productCard = $(this).closest('.product-card');
        const productTitle = $productCard.find('.product-title').text();
        removeProductFromCart(productTitle);
        $productCard.fadeOut(500, function() {
            $(this).remove();
        });
    });

    $(document).on('click', '#remove', function() {
        localStorage.clear();
        $('#cartItems').empty().fadeOut(500).fadeIn(500);
    });

    function loadCart() {
        const products = JSON.parse(localStorage.getItem('cart')) || [];
        products.forEach(product => addProductToCart(product));
    }

    function addProductToCart(product) {
        const cartItemHTML = 
            `<div class="cart-item">
                <img src="${product.image}" alt="${product.title}">
                <span>${product.title}</span>
            </div>`;
        $('#cartItems').append(cartItemHTML);
    }

    function removeProductFromCart(productTitle) {
        let products = JSON.parse(localStorage.getItem('cart')) || [];
        products = products.filter(p => p.title !== productTitle);
        localStorage.setItem('cart', JSON.stringify(products));
        $('#cartItems').empty();
        loadCart();
    }

    $(document).on('mouseenter', '.product-card', function() {
        $(this).fadeTo(300, 0.4);
    }).on('mouseleave', '.product-card', function() {
        $(this).fadeTo(300, 1);
    });

    $(document).on('click', '.view-details', function() {
        const product = JSON.parse($(this).data('product'));
        $('#productModal .modal-image').attr('src', product.image);
        $('#productModal .modal-title').text(product.title);
        $('#productModal .modal-description').text(product.description);
        $('#productModal .modal-rating').text(product.rating.rate + ' ⭐');
        $('#productModal').modal('show');
    });
});