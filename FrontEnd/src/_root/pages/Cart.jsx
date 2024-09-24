import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import apiClient from '@/services/apiClient';
import { useContext } from 'react';
import { CartContext } from '@/components/shared/CartContext';


const Cart = () => {

  const { products, setProducts, cartTotal, setCartTotal, fetchProducts, removeItemFromCart, clearCartCount } = useContext(CartContext);

  const navigate = useNavigate();
  
  
  const [totalPrice, setTotalPrice] = useState(0);
  

  // useEffect to calculate the total price whenever the products state changes
  useEffect(() => {
    const calculateTotalPrice = () => {
      return products.reduce((total, product) => {
        return total + (product.price * product.quantity);
      }, 0).toFixed(2); // Round to 2 decimal places
    };

    setTotalPrice(calculateTotalPrice());
    
  }, [products]);
  
  const [updateDone, setUpdateDone] = useState(false);  
  
  const handleGoToOrderSummary = async() =>{
    try {
      const [response1] = await Promise.all([
        apiClient.post('orders/create'), 
        apiClient.delete('cart/clear')
      ]);
      const orderId = response1.data;
      clearCartCount();      
      navigate(`/orderSummary/${orderId}`);
               
    } catch (error) {
      console.error('Error fetching the products:', error);
    }
  };

 

  
  const handleMinus = (productId) => {
    
    const newProducts = products.map(item =>
      item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
    );
    
    setProducts(newProducts);
    const updatedItem = newProducts.find(item => item.productId === productId);
    updateQuantity(updatedItem.productId,updatedItem.quantity );
  };
  
  const handlePlus = (productId) => {
    
    const newProducts = products.map(item =>
      item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    
    setProducts(newProducts);
    const updatedItem = newProducts.find(item => item.productId === productId);
    updateQuantity(updatedItem.productId,updatedItem.quantity );

  };
  
  const deleteProduct = async (productId) => {
    try { 
        const [response1, response2] = await Promise.all([
        apiClient.delete(`cart/delete/${productId}`), 
        apiClient.get('cart/total'),  
      ]);  
      
      setProducts((prevProducts) => prevProducts.filter(product => product.productId !== productId));
      setCartTotal(response2.data);     
      setUpdateDone(prev => !prev);
      removeItemFromCart();

    } catch (error) {
      console.error('Error deleting the products:', error);
    }
  };

    
 const updateQuantity = async (productId, quantityToUpdate) => {

      try{
            const [response1, response2] = await Promise.all([
            apiClient.put(`cart/updateQuantity/${productId}`, { quantity: quantityToUpdate }), 
            apiClient.get('cart/total'), 
          ]);       
          setCartTotal(response2.data);
          setUpdateDone(prev => !prev);
              
      } catch (error) {
        console.error('Error updating the products:', error);
      }

 };

  return (
    <main className="grid flex-1 items-start gap-4 md:p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="border-none" x-chunk="dashboard-06-chunk-0">
            <CardHeader className='py-2'>
                <CardTitle>Cart Summary</CardTitle>                
            </CardHeader>
            <CardContent className='p-2'>
              {products.length > 0 ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    
                    <TableHead className="">Product Name</TableHead>                   
                    <TableHead className="">Price</TableHead>
                    <TableHead className=" table-cell">Quantity</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  
                {products.map((item,index) => (
                    <TableRow key={item.productId} className="hover:bg-gray-100 cursor-pointer">

                    <TableCell className="font-medium ine-clamp-2 md:line-clamp-none">
                     {item.productName}
                    </TableCell> 
                    <TableCell className="font-medium">
                     {item.price}
                    </TableCell> 

                    <TableCell className="hidden md:table-cell">                      
                          
                    <div className="relative flex flex-row h-10 w-20 rounded-lg bg-transparent mt-1">

                       <Button onClick={() => handleMinus(item.productId)} 
                       className="p-0 rounded-none bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                         −
                       </Button>
                      <div className="rounded-none px-1 outline-none focus:outline-none text-center w-full bg-gray-200 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center justify-center text-gray-800  outline-none" 
                      name="quantity" 
                       >{item.quantity}</div>
                        <Button onClick={() => handlePlus(item.productId)} className="p-0 rounded-none bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                         +
                         </Button>   
                    </div>                                 
                          
                    </TableCell>

                    <TableCell className="md:hidden font-semibold table-cell">
                    {item.quantity}
                    </TableCell>
                    <TableCell className="px-0 flex items-center font-semibold table-cell">
                      <Button className='text-xs p-1 h-8 rounded-xs md:text-md' onClick={() => deleteProduct(item.productId)}>Remove</Button>                                     
                    </TableCell>
                    </TableRow>
                    
                ))}
                    
                </TableBody>

                </Table>) : (
                <div className='p-8'>
                  <h1 className='text-center text-xl font-semibold'>Cart Empty</h1>
                </div>
                )}    
               
                                                            
                
            </CardContent> 

            <div className="border-t border-gray-200 flex flex-col items-center justify-center py-6">
                  <div className="flex items-center justify-center font-medium text-gray-900" >
                    <p>Total : ${totalPrice}</p>                   
                  </div>
                  <p className="flex items-center justify-center mt-0.5 text-sm text-black-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6 flex justify-center">
                    <a
                      href="#" onClick = {handleGoToOrderSummary}
                      className="w-56 flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white"
                    >
                      Proceed To Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{'  '}
                      <Link
                        to='/results/all'
                        type="button"
                        onClick={() => setOpen(false)}
                        className="font-medium text-blue-500 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </Link>
                    </p>
                  </div>
                </div>
            </Card>
    </main>
  )

  
}



export default Cart