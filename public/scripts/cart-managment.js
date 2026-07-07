const addToCartButtonElement = document.querySelector('#product-detail button');
const cartBadgeElement = document.querySelector('.nav-item .badge');
const productId = addToCartButtonElement.dataset.productId;
async  function addToCart(){
    const productId = addToCartButtonElement.dataset.productid;
    const csrfToken = addToCartButtonElement.dataset.csrf;
    let response
try{
   response = await fetch('/cart/items',{
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                _csrf: csrfToken // <-- You must add this here!
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
}
catch(error){
    alert('Failed to add product to cart');
    return;
}
if(!response.ok){
    alert('Failed to add product to cart');
    return;
}
const  responseData = await response.json();
const newTotalItems = responseData.newTotalItems;
cartBadgeElement.textContent = newTotalItems;
}
addToCartButtonElement.addEventListener('click', addToCart);    