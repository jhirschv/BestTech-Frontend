import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Search, ShoppingCart, UserRound } from 'lucide-react'; // replace with actual imports
import NavDropdown from '../ui/navbar-dropdown'; // import the Dropdown component
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import CartIcon from '../ui/CartIcon';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { CartContext } from './CartContext';
import {
  Truck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  AlignJustify
} from "lucide-react"
import { Link } from 'react-router-dom';
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

const Topbar = () => {

  
  const navigate = useNavigate();

  const { fetchProducts, clearCartCount } = useContext(CartContext);

  let { user, logoutUser } = useContext(AuthContext);

  const userId = user ? user.userId : null;

  const handleGoToCart = () => {
    
    if(user) {
      navigate('/cart');
    } else {
      navigate('/user_auth')
    }
  }
    

  const handleGoToResults = () => {
    navigate('/results');
  };

  const handleGoToHero = () => {
    navigate('/');
  };
  const handleGoToAdmin = () => {
    navigate('/admin');
  };

  const handleGoToUser = () => {
    navigate ('/user_auth');
  }

  const handleTrackOrder = () => {     
    navigate(`/order-tracking/${userId}`); 
 };


  function handleLogoutUser() {
    logoutUser();
    clearCartCount();
    fetchProducts();
    
  }

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownItems, setDropdownItems] = useState([])
  const timeoutRef = useRef(null);

  

  const handleMouseEnter = (items) => {
    clearTimeout(timeoutRef.current);
    setDropdownItems(items);
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownVisible(false);
    }, 300); // Adjust the delay as needed
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const laptopItems = [
    'MacBook Air',
    'MacBook Pro',
    'HP Spectre x360',
    'HP Envy 13',
    'Chromebook Pixelbook',
    'Dell XPS 13',
  ];
  
  const phoneItems = [
    'iPhone 13',
    'iPhone 13 Pro',
    'Samsung Galaxy S21',
    'Samsung Galaxy Note 20',
    'Google Pixel 6',
    'OnePlus 9',
  ];
  
  const cameraItems = [
    'Sony Alpha a7 III',
    'Canon EOS R5',
    'Nikon Z6 II',
    'Fujifilm X-T4',
    'Panasonic Lumix GH5',
    'Olympus OM-D E-M10 Mark IV'
  ];
  
  const computerItems = [
    'Dell Inspiron',
    'HP Pavilion',
    'Lenovo IdeaCentre',
    'Asus ROG Strix',
    'Apple iMac',
  ];
  
  const headphoneItems = [
    'Bose QuietComfort 35 II',
    'Beats Studio3',
    'Apple AirPods Pro',
    'Sony WH-1000XM4',
    'Sennheiser HD 450BT',
  ];
  
  const accessoryItems = [
    'USB-C Chargers',
    'HDMI Cables',
    'Wireless Mice',
    'Laptop Stands',
    'Bluetooth Keyboards',
  ];

  const searchItemsNull = []

  const placeholders = [
    'Apple - MacBook"',
    "Canon - EOS",
    "Headphones",
    "Sony - Alpha",
    "iPhone 15 Pro",
  ];

  const [searchTerm, setSearchTerm] = useState("")

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function handleSearch() {
    navigate(`/results/${searchTerm}`)
    window.location.reload();
  }

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="fixed z-50 top-0 bg-background flex items-center justify-between lg:justify-center w-full h-14 px-4 bg-secondary">
      <div className='lg:hidden flex items-center gap-1'>
        <Store onClick={handleGoToHero} className="h-5 w-5 hover:text-foreground hover:scale-102 transition-transform" />
      </div>
      <div className='lg:hidden flex gap-6 items-center'>
      <Button onClick={() => navigate('/admin')} className='text-xs h-8 p-2 rounded-xs'>View Admin Dashboard</Button>
      <Search onClick={() => setIsSheetOpen(!isSheetOpen)} className="h-4 w-4 hover:scale-102" />
      {user &&
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            {user &&      
              <UserRound className="h-4 w-4 hover:scale-102" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
        {!user &&      
        <UserRound onClick={handleGoToUser} className="h-4 w-4 hover:scale-102" />}
        <CartIcon handleGoToCart={handleGoToCart} className="h-4 w-4 hover:scale-102" />  
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="lg:hidden">
              <AlignJustify className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs pt-10">
            <nav className="grid gap-6 text-lg font-medium">
              <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleSearchChange}
                onSubmit={handleSearch}
              />
              <Link
                to='/results/all'
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSheetOpen(!isSheetOpen)}
              >
                <Package className="h-5 w-5" />
                All Products
              </Link>
              <Link
                to='/'
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSheetOpen(!isSheetOpen)}
              >
                <Home className="h-5 w-5" />
                Home
              </Link>
              <Link
                to='/cart'
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setIsSheetOpen(!isSheetOpen)}
              >
                <ShoppingCart handleGoToCart={handleGoToCart} className="h-5 w-5" />
                Cart
              </Link>
              <div
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  handleTrackOrder();
                  setIsSheetOpen(!isSheetOpen);
                }}
              >
                <Truck className="h-5 w-5" />
                Track Order
              </div>
              {!user &&      
              <Link to='/user_auth' className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                <div className='flex items-center gap-4'>
                  <UserRound className="h-5 w-5 hover:scale-102" />
                  Login
                </div>
              </Link>}
              {user &&
              (
                <div className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <div onClick={() => {
                    handleLogoutUser();
                    setIsSheetOpen(!isSheetOpen);
                    }} className='flex items-center gap-4'>
                    <UserRound className="h-5 w-5 hover:scale-102" />
                    Logout
                  </div>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden lg:flex items-center gap-6 lg:gap-8">
        <Store onClick={handleGoToHero} className="h-4 w-4 hover:text-foreground hover:scale-102 transition-transform" />
        <ul className="flex gap-6 text-xs lg:text-sm font-semibold">
          <li onClick={() => {
              navigate('/results/all');
              window.location.reload();
            }}>
            All
          </li>

          <li onClick={() => {
              navigate('/results/laptops');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(laptopItems)}>
            Laptops
          </li>

          <li onClick={() => {
              navigate('/results/phones');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(phoneItems)}>
            Phones
          </li>

          <li onClick={() => {
              navigate('/results/cameras');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(cameraItems)}>
            Cameras
          </li>

          <li onClick={() => {
              navigate('/results/computers');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(computerItems)}>
            Computers
          </li>

          <li onClick={() => {
              navigate('/results/headphones');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(headphoneItems)}>
            Headphones
          </li>

          <li onClick={() => {
              navigate('/results/accessories');
              window.location.reload();
            }} 
            onMouseEnter={() => handleMouseEnter(accessoryItems)}>
            Accessories
          </li>
        </ul>
        <Search onMouseEnter={() => handleMouseEnter(searchItemsNull)} className="h-4 w-4 hover:scale-102" />
        <CartIcon handleGoToCart={handleGoToCart} className="h-4 w-4 hover:scale-102" />  
        {!user &&      
        <UserRound onClick={handleGoToUser} className="h-4 w-4 hover:scale-102" />}
        {user && (
          <Truck onClick={handleTrackOrder} className="h-4 w-4" />
            )}
        {user &&
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <UserRound onClick={handleGoToUser} className="h-4 w-4 hover:scale-102" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          }
          <Button onClick={() => navigate('/admin')} className='text-xs h-8 p-2 rounded-xs'>View Admin Dashboard</Button>
      </div>
      <AnimatePresence>
        {dropdownVisible && (
          <>
            <motion.div
              className="fixed inset-0 top-12 bg-black bg-opacity-50 backdrop-blur-md z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
            <div onMouseLeave={handleMouseLeave}>
              <NavDropdown menuItems={dropdownItems} isOpen={dropdownVisible} setIsOpen={setDropdownItems}/>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Topbar;