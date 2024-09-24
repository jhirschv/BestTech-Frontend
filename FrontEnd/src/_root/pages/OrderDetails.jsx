import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const OrderDetails = () => {

    const { orderTrackingId } = useParams();
    const [orderDetails ,setOrderDetails] = useState([]);
    const [shippingAddress ,setShippingAddress] = useState([]);
    const [orderDate, setOrderDate] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);


   const fetchOrderDetails = async () => {
    try { 
        const [response1] = await Promise.all([
        apiClient.get(`orders/track/${orderTrackingId}`),        
      ]); 
      setShippingAddress(response1.data.addressDto.shippingAddress);
      setOrderDetails(response1.data.orderDto);
      const formattedDate = format(new Date(response1.data.orderDate), 'MM/dd/yyyy');
      setOrderDate(formattedDate);
      setOrderStatus(response1.data.status);
     } catch (error) {
      console.error('Error fetching the order details:', error);
    }
  };
  
  
    useEffect(() => {
        fetchOrderDetails();
        const calculateTotalPrice = () => {
          return orderDetails.reduce((total, orderDto) => {
            return total + (orderDto.price * orderDto.quantity);
          }, 0).toFixed(2); // Round to 2 decimal places
        };
    
        setTotalPrice(calculateTotalPrice());
    }, [orderDetails]);

  return (
    <Card className="mx-auto p-6 rounded-none md:rounded-md shadow-none border-none md:mt-12">
      <div className="rounded-lg md:border p-8 md:shadow-sm">
        <h2 className="text-3xl font-semibold mb-2">Order Details</h2>
        
        <div className="">
          <span className="font-semibold">Order ID:  {orderTrackingId}</span> 
        </div>
        
        <div className="">
          <span className="font-semibold">Order Date: {orderDate}</span> 
        </div>
        <div className="">
          <span className="font-semibold">Order Status: {orderStatus}</span> 
        </div>
        
        <div className="mb-2">
          <h3 className="font-semibold text-2xl">Items:</h3>
          <ul>
            {orderDetails.map((item) => (
              <li key={item.orderId} className="w-full md:w-3/4 lg:w-1/2 flex justify-between border-b border-white py-2 text-sm">
                <span>{item.productName} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="font-semibold text-2xl">
          <span>Total:</span> ${totalPrice}
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Shipping Address:</h3>
          <div className="bg-white text-semibold text-sm rounded-lg">
            <div>{shippingAddress.fullName}</div>
            <div>{shippingAddress.addressLine}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</div>            
            <div>
              
            </div>
            <div>{shippingAddress.country}</div>
          </div>            
          </div>
        <div className="mt-4">
          <Link to="/" className="font-semibold text-sm text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default OrderDetails;
