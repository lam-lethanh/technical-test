import './index.css'
import { useState, useEffect } from 'react';


function OrderForm() {

    const [order, setOrder] = useState({
        totalAmount: { currency: 'EUR', amount: '30.00' },
        consumer: {
        phoneNumber: '0400000001',
        givenNames: 'Joe',
        surname: 'Consumer',
        email: 'test@scalapay.com',
        },
        shipping: {
        phoneNumber: '0400000000',
        countryCode: 'IT',
        name: 'Joe Consumer',
        postcode: '50056',
        suburb: 'Montelupo Fiorentino',
        line1: 'Via della Rosa, 58',
        },
        merchant: {
        redirectCancelUrl: 'https://portal.integration.scalapay.com/failure-url',
        redirectConfirmUrl: 'https://portal.integration.scalapay.com/success-url',
        },
        shippingAmount: { currency: 'EUR', amount: '10.00' },
        taxAmount: { currency: 'EUR', amount: '3.70' },
        type: 'online',
        product: 'pay-in-3',
        frequency: { number: 1, frequencyType: 'monthly' },
        orderExpiryMilliseconds: 600000,
        items: [
        {
            price: { currency: 'EUR', amount: '10.00' },
            quantity: 1,
            name: 'T-Shirt',
            category: 'clothes',
            sku: '12341234',
        },
        {
            price: { currency: 'EUR', amount: '20.00' },
            quantity: 1,
            name: 'Jean',
            category: 'clothes',
            sku: '12341222',
        },
        ],
      });
    // Customer name
    const handleFName = (event) => {
        const newName = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, givenNames: newName }  });
    };

    const handleLName = (event) => {
        const newName = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, surname: newName }  });
    };
    // Phone
    const handlePhone = (event) => {
        const newPhone = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, phoneNumber: newPhone }  });
    };
    // Email
    const handleEmail = (event) => {
        const newEmail = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, email: newEmail }  });
    };
    // Shipping
    const handleCCode = (event) => {
        const newCCode = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, countryCode: newCCode }  });
    };
    const handleShipName = (event) => {
        const newShipName = event.target.value;
        setOrder({...order, shipping: {...order.shipping, name: newShipName}});
    };
    const handleSuburb = (event) => {
        const newAddress = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, suburb: newAddress }  });
    };
    const handleLine1 = (event) => {
        const newAddress = event.target.value;
        setOrder({ ...order, consumer:{ ...order.consumer, line1: newAddress }  });
    };

    const handleQuantity =(index,event)=>{
        const newQuantity= event.target.value;
        const updatedItems = [...order.items];
        updatedItems[index].quantity = newQuantity;
        setOrder({...order, items: updatedItems })
    }

    const calculateSubTotalAmount = () => {
        return order.items.reduce((total, item) => {
          const itemPrice = parseFloat(item.price.amount);
          const itemQuantity = parseInt(item.quantity);
          return total + itemPrice * itemQuantity;
        }, 0);
    };
    const calculateTotalAmount = () => {
        const totalAmount = calculateSubTotalAmount() + parseFloat(order.taxAmount.amount) + parseFloat(order.shippingAmount.amount);
    return totalAmount;
    };
    const handleDeleteItem = (index) => {
        
        const updatedItems = [...order.items];
        updatedItems.splice(index, 1);
        const newTotalAmount = calculateTotalAmount();
        setOrder({
        ...order,
        items: updatedItems,
        totalAmount: { currency: 'EUR', amount: newTotalAmount.toFixed(2) },
        });
    };
    function validateAllInputs() {
        const inputs = document.querySelectorAll('input[required]');
      
        for (const input of inputs) {
          if (!input.value) {
            return false; 
          }
        }
        return true; 
      }

    const createOrder =()=>{
        if (validateAllInputs()) {
            fetch('http://localhost:3001/post/v2', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(order), 
              })
                .then((response) => {
                   return response.json(); 
                })
                .then((data) => {
                    if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl;
                    }
                    else {
                        window.location.href=order.merchant.redirectCancelUrl
                    }
                })
                .catch((error) => {
                  alert('There was a problem with the fetch operation:', error);
                });
        }
            else return
    }


    useEffect(() => {
        const newTotalAmount = calculateTotalAmount();
        setOrder({ ...order, totalAmount: { currency: 'EUR', amount: newTotalAmount.toFixed(2) } });
      }, [order.items]);

    return ( 
        <div className='container'>
            <form id='order-form' onSubmit={e => {e.preventDefault();}}>
                <h2>Create Order</h2>
                <div className="input-group">
                <label htmlFor='fname' className="input-group-text">First name<span className='red'>*</span>: </label>
                <input type="text" aria-label="First name" className="form-control" id='fname'defaultValue={order.consumer.givenNames} onInput={handleFName} required/> 
                <label htmlFor='lname' className="input-group-text">Last name<span className='red'>*</span>: </label>
                <input type="text" aria-label="Last name" className="form-control" id='lname'defaultValue={order.consumer.surname} onInput={handleLName} required/>
                </div>

                <div >
                <label htmlFor='phone' className="input-group-text">Phone number:</label>
                <input type="text" aria-label="Phone num" id='phone'defaultValue={order.consumer.phoneNumber} onInput={handlePhone}></input>
                </div>

                <div >
                <label htmlFor="email" className="input-group-text">Email address:</label>
                <input type="email" className="form-control" id="email"defaultValue={order.consumer.email} onInput={handleEmail} placeholder="name@example.com" />
                </div>
                <h4>Shipping information</h4>
                <div>
                    <label htmlFor="ccode" className="input-group-text">Name<span className='red'>*</span>:</label>
                    <input type="text" className="form-control" id="ccode"defaultValue={order.shipping.name} onInput={handleShipName} required />
                </div>
                <div>
                    <label htmlFor="ccode" className="input-group-text">Country Code<span className='red'>*</span>:</label>
                    <input type="text" className="form-control" id="ccode" placeholder='IT'defaultValue={order.shipping.countryCode} onInput={handleCCode} required />
                </div>
                <div>
                    <label htmlFor="suburb" className="input-group-text">Suburb<span className='red'>*</span>:</label>
                    <input type="text" className="form-control" id="suburb" defaultValue={order.shipping.suburb} onInput={handleSuburb} required />
                </div>
                <div>
                    <label htmlFor="line1" className="input-group-text">Line1<span className='red'>*</span>:</label>
                    <input type="text" className="form-control" id="line1" defaultValue={order.shipping.line1} onInput={handleLine1} required />
                </div>
                <h4>Product selection:</h4>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {order.items.map((item, index) => (
                            <tr key={index}>
                            <td> {item.name}</td>
                            <td> {item.category}</td>
                            <input
                                type="number"
                                className="quantity-input"
                               defaultValue={item.quantity}
                               onChange={(event)=>handleQuantity(index,event)}
                                min="1"
                            />
                            <td>
                                {item.price.amount} {item.price.currency}
                            </td>
                            <td><button onClick={() => handleDeleteItem(index)}>Delete</button></td>
                            </tr>
                    ))}
                    </tbody>
                </table>
                <h4>Fee & Tax</h4>
                <div>
                <span>Shipping Fee:</span> <span className='bold'>{order.shippingAmount.amount} {order.shippingAmount.currency}</span>
                </div>
                <span>Tax:</span> <span className='bold'>{order.taxAmount.amount} {order.shippingAmount.currency}</span>
                <hr></hr>
                <h4>Total:</h4>
                <label className='bold'> {order.totalAmount.amount} {order.totalAmount.currency}</label>
                <div className='btn-submit'>
                    <button type='submit' onClick={createOrder}>Create Order!</button>
                </div>
            </form>
        </div>
    )
  }
  export default OrderForm