import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui/button';


const OrderConfirmation = () => {
    const { orderId } = useParams();

    const [orderTrackingId, setOrderTrackingId] = useState(0);   

     const fetchOrderTracking = async () => {
      try { 
          const [response1] = await Promise.all([
            apiClient.get(`orders/${orderId}`),
          ]);
          
           const trackingId = response1.data.map(item => item.orderId);           
           setOrderTrackingId(trackingId[0]);           
                 
       } catch (error) {
        console.error('Error fetching the order details:', error);
      }
    };


    useEffect(() => {
          fetchOrderTracking();
      }, []);


   
  return (
    <div className="max-w-md flex justify-center mx-auto text-white rounded-lg p-6 mt-16">
      <div className="relative py-3 w-11/12 max-w-xl sm:w-full sm:mx-auto">
        <div className=""></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-lg sm:p-20">
          <div className="w-full">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Order Confirmed! Your Tracking Id: {orderTrackingId}</h1>
              <p className="mt-2 text-gray-500 font-semibold ">Thank you for your purchase!! Your order has been successfully placed.</p>
              
              <div className="mt-6">
                <Link to='/'>
                  <Button>
                    Back to Home
                  </Button>
                </Link>
                
              </div>
              <div className="mt-6">
                <Link to={`/order-details/${orderTrackingId}`} className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                        View Order Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
