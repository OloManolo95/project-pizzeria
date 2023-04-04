import {templates, select} from '../settings.js';
import amountWidget from './AmountWidget.js';

class Booking {
  constructor(widgetContainer){

    const thisBooking = this;

    thisBooking.render(widgetContainer);
    thisBooking.initWidgets();
  }

  render(widgetContainer){
    const thisBooking = this;

    thisBooking.dom = {};

    thisBooking.dom.wrapper = widgetContainer;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom.wrapper.innerHTML = generatedHTML;


  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function(){

    });
    thisBooking.hoursAmount = new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function(){

    });
  }
}

export default Booking;