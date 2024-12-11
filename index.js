let products = [];
let cart = JSON.parse(window.localStorage.getItem('cart')) || [];


const getProducts = async () => {
   try {
      const res = await fetch('https://lucas-caceres-w.github.io/Pre-entrega-talento-tech/db.json');
      const json = await res.json();
      products = json.productos;
   } catch (error) {
      console.error('Error al obtener los productos:', error);
   }
};

const addProduct = (id) => {
   const product = products.find((product) => product.id == id);
   if (!product) return;

   const existingProduct = cart?.find((item) => item.id === product.id);
   if (existingProduct) {
      existingProduct.quantity += 1;
   } else {
      swal({
         title: "Exito",
         text: "Producto agregado al carrito",
         icon: "success",
      })
      cart.push({ ...product, quantity: 1 });
   }

   updateCart();
   displayCart();
};

const removeProduct = (id) => {
   const productIndex = cart.findIndex((item) => item.id == id);
   if (productIndex !== -1) {
      const product = cart[productIndex];
      if (product.quantity > 1) {
         product.quantity -= 1;
      } else {
         cart.splice(productIndex, 1);
      }
   }

   updateCart();
   displayCart();
};

const updateCart = () => {
   window.localStorage.setItem('cart', JSON.stringify(cart));
   const cartLength = document.querySelector('.quantity');

   const totalQuantity = cart.reduce(
      (total, product) => total + product.quantity,
      0
   );
   if (cartLength) cartLength.innerHTML = totalQuantity;
   console.log('Carrito actualizado:', cart);
};

const displayProducts = () => {
   const mens = document.getElementById('container_men');
   const womens = document.getElementById('container_women');
   const kids = document.getElementById('container_kid');
   const cartLength = document.querySelector('.quantity');
   const totalQuantity = cart.reduce(
      (total, product) => total + product.quantity,
      0
   );
   if (cartLength) cartLength.innerHTML = totalQuantity;

   if (products.length > 0) {
      products.forEach((product) => {
         const productHTML = `
            <div class="card_product" id=${product.id}>
               <div class="add">
                  <button class="btn_add">Agregar al carro</button>
               </div>
               <img src="${product.image}" alt="remera" />
               <p class="m-0">${product.title}</p>
               <p class="m-0 fw-bolder">$ ${product.price}</p>
            </div>
         `;

         if (product.categoria === 'men') {
            mens.innerHTML += productHTML;
         } else if (product.categoria === 'women') {
            womens.innerHTML += productHTML;
         } else if (product.categoria === 'kids') {
            kids.innerHTML += productHTML;
         }
      });
   }
};

const displayCart = () => {
   const cartContainer = document.getElementById('cart');

   cartContainer.innerHTML = '';

   if (cart.length > 0) {
      cart.forEach((product) => {
         const productHTML = `
                     <div class="cart_product" id=${product.id}>
                        <img class="img_cart" src="${product.image}" alt="remera" />
                        <div>
                           <p class="m-0">${product.title}</p>
                           <p class="m-0 fw-bolder">$ ${product.price}</p>
                           <p class="m-0 fw-bolder">Cantidad: ${product.quantity}</p>
                        </div>
                        <div class="buttons">
                           <span class="btn btn-danger remove">
                              <span class="material-symbols-outlined material-cart">
                                 remove
                              </span>
                           </span>
                           <span class="btn btn-success added">
                              <span class="material-symbols-outlined material-cart">
                                 add
                              </span>
                           </span>
                        </div>
                     </div>
                  `;
         cartContainer.innerHTML += productHTML;
      });
   } else {
      cartContainer.innerHTML =
         '<p class="cart_vacio">El carrito está vacío</p>';
   }
};

const showCart = () => {
   const cartContainer = document.querySelector('.aside_cart');

   cartContainer.classList.toggle('show_cart');
};

const FormCheck = () => {
   const form = document.querySelector('.form_input');
   const inputs = document.querySelectorAll('.inputs_form');
   const allFieldsFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ''
   );

   if (!allFieldsFilled) {
      swal({
         title: "Error",
         text: "Faltan campos que llenar",
         icon: "error",
      })
   } else {
      form.action = 'https://formspree.io/f/xqakpjkv';
      form.submit();
   }
};

document.addEventListener('DOMContentLoaded', async (e) => {
   await getProducts();
   displayProducts();
   displayCart();
});

document.addEventListener('click', (e) => {
   if (e.target.matches('.btn_add')) {
      e.preventDefault();
      const id = e.target.parentNode.parentNode.id;
      addProduct(id);
   }
   if (e.target.closest('.cart')) {
      e.preventDefault();
      const cartContainer = document.querySelector('.aside_cart');
      cartContainer.classList.toggle('show_cart');
   }
   if (e.target.closest('.close_cart')) {
      e.preventDefault();
      const cartContainer = document.querySelector('.aside_cart');
      cartContainer.classList.remove('show_cart');
   }
   if (e.target.closest('.remove')) {
      e.preventDefault();
      const id = e.target.parentNode.parentNode.id;
      removeProduct(id);
   }
   if (e.target.closest('.added')) {
      e.preventDefault();
      const id = e.target.parentNode.parentNode.id;
      addProduct(id);
   }
   if (e.target.matches('.submit_btn')) {
      e.preventDefault();
      FormCheck();
   }
});
