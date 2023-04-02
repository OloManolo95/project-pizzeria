import {settings, classNames, select, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    console.log('new cart', thisCart);
  }
  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
  }
  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(event){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct){
    const thisCart = this;
    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    /* add element to menu */
    thisCart.dom.productList.appendChild(generatedDOM);
    console.log('adding product', menuProduct);
    thisCart.products.push(new CartProduct(menuProduct,generatedDOM));
    console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }
  update(){
    const thisCart = this;
    let deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products){
      thisCart.totalNumber += product.amount;
      thisCart.subtotalPrice += product.price;
    }
    if(thisCart.totalNumber == 0){
      thisCart.totalPrice = 0;
      deliveryFee = 0;
    } else {
      thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
    }
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    for(const totalPrice of thisCart.dom.totalPrice){
      totalPrice.innerHTML = thisCart.totalPrice;
    }
  }
  remove(cartProduct){
    const thisCart = this;
    cartProduct.dom.wrapper.remove();
    const indexOfCartProduct = thisCart.products.indexOf(cartProduct);
    console.log(indexOfCartProduct);
    thisCart.products.splice(indexOfCartProduct, 1);
    thisCart.update();
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;
    const payload = {};
    payload.address = thisCart.dom.wrapper.address.value;
    payload.phone = thisCart.dom.wrapper.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subtotalPrice = thisCart.subtotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = settings.cart.defaultDeliveryFee;
    payload.products = [];
    for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }
    console.log(payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    };
    fetch(url, options);
  }
}

export default Cart;