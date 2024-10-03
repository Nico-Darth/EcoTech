document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const links = document.querySelectorAll(".navbar nav ul li a");
    const sections = document.querySelectorAll(".section");

    // Change link color on scroll
    window.addEventListener("scroll", function () {
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });

        links.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    });

    // Cart management
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    document.querySelectorAll('.product-card').forEach(card => {
        const productId = card.querySelector('h2').textContent;
        const productName = productId;
        const productPrice = parseFloat(card.querySelector('.price').textContent.replace('$', ''));
        const quantityElement = card.querySelector('.quantity');

        card.querySelector('.plus').addEventListener('click', function () {
            let currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;
        });

        card.querySelector('.minus').addEventListener('click', function () {
            let currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
            }
        });

        card.querySelector('.add-to-cart').addEventListener('click', function () {
            const quantity = parseInt(quantityElement.textContent);

            if (!cart[productId]) {
                cart[productId] = { name: productName, price: productPrice, quantity: 0, timestamp: Date.now() };
            }
            cart[productId].quantity += quantity;

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${quantity} ${productName}(s) added to cart`);
        });
    });

    // Update cart display on cart page
    const cartItemsContainer = document.querySelector('.cart-items');
    const sortOptions = document.querySelector('.sort-options');
    const sortSelect = document.getElementById('sort');

    if (cartItemsContainer) {
        function updateCartDisplay() {
            cartItemsContainer.innerHTML = '';
            const cartIsEmpty = Object.keys(cart).length === 0;

            if (cartIsEmpty) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No products in cart';
                emptyMessage.style.fontSize = '18px';
                emptyMessage.style.color = '#555';
                cartItemsContainer.appendChild(emptyMessage);

                // Hide sort options if the cart is empty
                if (sortOptions) {
                    sortOptions.style.display = 'none';
                }
            } else {
                // Show sort options if the cart is not empty
                if (sortOptions) {
                    sortOptions.style.display = 'block';
                }

                // Convert cart object to an array for sorting
                const cartArray = Object.entries(cart).map(([id, item]) => ({ id, ...item }));

                // Sort based on selected criteria
                const sortCriteria = sortSelect ? sortSelect.value : 'price';
                if (sortCriteria === 'price') {
                    cartArray.sort((a, b) => a.price - b.price);
                } else if (sortCriteria === 'newest') {
                    cartArray.sort((a, b) => b.timestamp - a.timestamp);
                } else if (sortCriteria === 'oldest') {
                    cartArray.sort((a, b) => a.timestamp - b.timestamp);
                }

                // Display sorted items
                cartArray.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'product-card';
                    itemElement.innerHTML = `
                        <img src="assets/dummy-image.jpeg" alt="${item.name}" style="width: 100px; height: auto;">
                        <h2>${item.name}</h2>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });

                // Add event listeners for remove buttons
                // Add event listeners for remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function () {
                        const productId = button.getAttribute('data-id');
                        delete cart[productId]; // Remove the product from the cart
                        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
                        updateCartDisplay(); // Refresh the cart display
                    });
                });
            }
        }

        // Update display on sort change
        if (sortSelect) {
            sortSelect.addEventListener('change', updateCartDisplay);
        }

        updateCartDisplay();
    }

    // Form validation for contact form with shake animation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission

            let isFormValid = true;
            const formElements = this.elements;

            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.type !== 'submit') {
                    const errorMessage = element.nextElementSibling;
                    if (element.value.trim() === '') {
                        element.classList.add('error');
                        element.classList.remove('success');
                        errorMessage.textContent = "Oops! Missed something there.";
                        errorMessage.style.display = 'block';
                        isFormValid = false;
                    } else {
                        element.classList.remove('error');
                        element.classList.add('success');
                        errorMessage.style.display = 'none';
                    }
                }
            }

            if (isFormValid) {
                // Form is valid, display a thank you message
                alert('Form submitted successfully!');

                // Create a thank you message element
                const thankYouMessage = document.createElement('p');
                thankYouMessage.textContent = "Thank you for contacting us! We will get back to you shortly.";
                thankYouMessage.style.color = '#2E8B57'; // Set the text color to a green shade
                thankYouMessage.style.marginTop = '20px'; // Add margin to the top

                // Append the thank you message to the form
                contactForm.appendChild(thankYouMessage);
            }
        });
    }
});