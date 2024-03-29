import {select} from '../settings.js';
import amountWidget from './AmountWidget.js';

class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id,
    thisCartProduct.name = menuProduct.name,
    thisCartProduct.amount = menuProduct.amount,
    thisCartProduct.params = menuProduct.params,
    thisCartProduct.price = menuProduct.price,
    thisCartProduct.priceSingle = menuProduct.priceSingle,
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();

    console.log(menuProduct);
    console.log('thisCartProduct', thisCartProduct);
    console.log('productAmount', thisCartProduct.amount);
  }
  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;

    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    console.log(thisCartProduct.dom.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
  }
  initAmountWidget(){
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new amountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(event){
      event.preventDefault();
      thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amountWidget.value;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }
  remove(){
    const thisCartProduct = this;
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(event){
      event.preventDefault();
    });
    thisCartProduct.dom.remove.addEventListener('click', function(event){
      event.preventDefault();
      console.log('remove');
      thisCartProduct.remove();
    });
  }
  getData(){
    const thisCartProduct = this;
    const productData = {};
    productData.id = thisCartProduct.id;
    productData.amount = thisCartProduct.amount;
    productData.price = thisCartProduct.price;
    productData.priceSingle = thisCartProduct.priceSingle;
    productData.name = thisCartProduct.name;
    productData.params = thisCartProduct.params;
    return productData;
  }

}


export default CartProduct;