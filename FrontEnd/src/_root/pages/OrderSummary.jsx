import React, { useState,useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PaymentModel from './PaymentModel';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const OrderSummary = () => {

  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleOpenModel = () => setIsModelOpen(true);
  const handleCloseModel = () => setIsModelOpen(false);
  const handlePaymentSuccess = () => setPaymentSuccess(true);

  const { orderId } = useParams();
  
  const [orderItems, setOrderItems] = useState([]);

  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  
  const [isSameAddress, setIsSameAddress] = useState(false); 

  const [paymentSuccess, setPaymentSuccess] = useState(false);
   

  const [addressDto, setAddressDto] = useState({
    shippingAddress: {
      fullName: '',
      addressLine: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    billingAddress: {
      fullName: '',
      addressLine: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contacts: {
      email: '',
      phone: ''
    }
  });

  const handleInputChange = (e, addressType) => {
    const { name, value } = e.target;
    setAddressDto(prevState => ({
      ...prevState,
      [addressType]: {
        ...prevState[addressType],
        [name]: value
      }
    }));
  };

 
  const updateAddressWithOrderId = async (addressDto) => {
  
    try {
     
      const response = await apiClient.put(`/orders/updateAddress/${orderId}`, addressDto,{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate(`/order-confirmation/${orderId}`);      
          
    } catch (error) {
      console.error('Error updating address:', error);
    }
   
  };
 
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    // Handle form submission

    console.log("address dto in react:::::"+addressDto);
    updateAddressWithOrderId(addressDto); 
    
  };

  
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    if (checked) {      
      setAddressDto(prevState => ({
        ...prevState,
        billingAddress: { ...prevState.shippingAddress }
      }));
    }
  };
  
const fetchOrderItems = async () => {
  
  try {
    const [response1] = await Promise.all([
      apiClient.get(`orders/${orderId}`), 
    ]);     
    
    setOrderItems(response1.data); 
    
  } catch (error) {
    console.error('Error fetching the products:', error);
  }
 
};


const calculateTotalPrice = () => {
  return orderItems.reduce((total, orderItems) => {
    return total + (orderItems.price * orderItems.quantity);
  }, 0).toFixed(2); // Round to 2 decimal places
};


useEffect(() => { 

  fetchOrderItems();  
  setTotal(calculateTotalPrice());
  
},[orderItems]);



  return (
  <main className="max-w-4xl mx-auto bg-white rounded-lg"> 
    <div className="max-w-4xl mx-auto p-6 pt-0 bg-white rounded-lg">
      <h2 className="text-2xl font-semibold py-6">Order Summary</h2>
      <div className="mb-6 font-semibold">
        <Table className="max-w-full bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="">Product Name</TableHead>
              <TableHead className="">Price</TableHead>
              <TableHead className="">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="py-6 px-4 text-sm md:text-base border-b">{item.productName}</TableCell>
                <TableCell className="py-6 px-4 text-sm md:text-base border-b">${item.price.toFixed(2)}</TableCell>
                <TableCell className="py-6 px-4 text-sm md:text-base border-b">{item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot>
            <TableRow className='border-none'>
              <TableCell colSpan="4" className="pt-4 text-base text-center font-semibold">Total : ${total}</TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </div>
      <form onSubmit={handleSubmitOrder}> 
        <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
        <div>
        
        <input
          type="email"
          name="email"
          value={addressDto.contacts.email}
          onChange={(e) => handleInputChange(e, 'contacts')}
          placeholder= "Email"
          className="w-full p-2 border border-gray-300 rounded mb-4" 
          required
        />
      </div>
      <div>        
        <input
          type="tel"
          name="phone"
          value={addressDto.contacts.phone}         
          onChange={(e) => handleInputChange(e, 'contacts')}
          placeholder="(123) 456-7890"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
      </div>

        <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
        <input
          type="text"
          name="fullName"
          value={addressDto.shippingAddress.fullName}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="addressLine"
          value={addressDto.shippingAddress.addressLine}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="Address"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="city"
          value={addressDto.shippingAddress.city}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="City"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="state"
          value={addressDto.shippingAddress.state}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="State"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="zipCode"
          value={addressDto.shippingAddress.zipCode}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="ZIP Code"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="country"
          value={addressDto.shippingAddress.country}
          onChange={(e) => handleInputChange(e, 'shippingAddress')}
          placeholder="Country"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
    <input
      type="checkbox"
      checked={isSameAddress}
      onChange={handleCheckboxChange}
    />

<label className="text-md md:text-base font-semibold mb-2"> Billing address same as shipping address</label>

{!isSameAddress && (
  <>
    <input
      type="text"
      name="fullName"
      value={addressDto.billingAddress.fullName}
      onChange={(e) => handleInputChange(e, 'billingAddress')}
      placeholder="Name"
      className="w-full p-2 mt-2 border border-gray-300 rounded mb-4"
    />
    <input
      type="text"
      name="addressLine"
      value={addressDto.billingAddress.addressLine}
      onChange={(e) => handleInputChange(e, 'billingAddress')}
      placeholder="Address"
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
    <input
      type="text"
      name="city"
      value={addressDto.billingAddress.city}
      onChange={(e) => handleInputChange(e, 'billingAddress')}
      placeholder="City"
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
    <input
      type="text"
      name="state"
      value={addressDto.billingAddress.state}
      onChange={(e) => handleInputChange(e, 'billingAddress')}
      placeholder="State"
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
    <input
      type="text"
      name="zipCode"
      value={addressDto.billingAddress.zipCode}
      onChange={(e) => handleInputChange(e, 'billingAddress')}
      placeholder="Zip Code"
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />

    <input
          type="text"
          name="country"
          value={addressDto.billingAddress.country}
          onChange={(e) => handleInputChange(e, 'billingAddress')}
          placeholder="Country"
          className="w-full p-2 border border-gray-300 rounded"
          
     />
     
  </>
)}       
        
      </form>
              <div className='flex pb-8'>
                  <Button
                      type="Button"
                      onClick={handleOpenModel}
                      className="w-full rounded-sm py-6 mt-4"
                  >
                      Checkout with Stripe
                  </Button>
              </div>
              {isModelOpen && (
                  <PaymentModel addressDto={addressDto} orderId={orderId} onClose={handleCloseModel} 
                  onSuccess={handlePaymentSuccess}
                  amount={total}
                  />
                  
              )}
             {/*  <div>
                  <button
                      type="button"
                      disabled={!paymentSuccess}
                      className={`px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-colors ${
                          paymentSuccess
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      onClick={handleSubmitOrder}
                  >
                      Submit Order
                  </button>
              </div> */}
            </div>
    </main>
  );
};

export default OrderSummary;
