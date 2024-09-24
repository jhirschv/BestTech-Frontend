import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const stripePromise = loadStripe('pk_test_51PZlxZBrshT9nmy8PLGjy8kQ7fOFb2LsYSXIPT9wxenEK4uhenHxbFfhHQrnYg1F9dJLbv0AcsgdA7Ad3kHpo3R00043Fd4Pmn');

const PaymentModel = ({ onClose, onSuccess, amount, addressDto, orderId}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(''); 
    
    const navigate = useNavigate();

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
        console.log("address dto in react:::::"+addressDto);
        updateAddressWithOrderId(addressDto); 
        
      };

    React.useEffect(() => {

        const longValue = Math.round(amount);

         apiClient.post('/api/payment/create-payment-intent', {            
                amount: longValue,  
                currency: 'usd',
                paymentMethod: 'card' 
            
         }) 
            .then(res => {
                setClientSecret(res.data.clientSecret);
            })
            .catch(error => console.log(error));
    }, []);


    const handleSubmit = async (event) => {        
        event.preventDefault(); 
        setProcessing(true);

        
        if (!stripe || !elements) {
            console.log("Stripe.js has not loaded yet.");
            return;
        }

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });


        if (payload.error) {
            setError(error.message);
            setProcessing(false);
        } else {  
            setProcessing(false);
            onSuccess(); 
            handleSubmitOrder();         
        }
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className='flex flex-col'>
                    <h2 className="text-xl font-bold">Enter Card Details</h2>
                    <h3 className='text-sm font-semibold'>Card Number: 4242 4242 4242 4242</h3>
                    <h3 className='text-sm font-semibold'>MM/YY/CVC: 1234567</h3>
                    <h3 className='text-sm font-semibold mb-2'>Zip: 12345</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <Button
                        type="submit"
                        disabled={!stripe || processing}
                        className={`w-full ${
                            stripe && !processing
                                ? 'bg-blue-600 hover:bg-blue-600'
                                : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {processing ? 'Processing…' : 'Pay'}
                    </Button>
                </form>
                <Button
                    onClick={onClose}
                    className="mt-1 w-full"
                >
                    Close
                </Button>
            </div>
        </div>,
        document.body
    );
};

const PaymentModelWrapper = (props) => (
    <Elements stripe={stripePromise}>
        <PaymentModel {...props} />
    </Elements>
);

export default PaymentModelWrapper;
