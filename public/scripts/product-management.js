const deleteProductElements = document.querySelectorAll('#products-grid button');
async function deleteProductHandler(event){
  const buttonElement  = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;
 const response = await fetch('/admin/products/' + productId  + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });
  if(!response.ok){
   alert('Failed to delete product');
   return;
  }
  else{
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  }
}

for( const deleteProductsButtonElemnt of deleteProductButtonElemnts){
    deleteProductsButtonElemnt.addEventListener('click' , deleteProductHandler);
;}