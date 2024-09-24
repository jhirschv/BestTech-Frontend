import React, {useState, useEffect, useContext} from 'react'
import { CartContext } from "@/components/shared/CartContext"
import axios from 'axios'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NavLink } from 'react-router-dom'
import { Label } from "@/components/ui/label"
import SideBar from '@/components/shared/Sidebar'
import AuthContext from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useParams } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from '@/components/ui/checkbox'

const ListPage = () => {



const [filteredData, setFilteredData] = useState([]);

const [currentPage, setCurrentPage] = React.useState(1);
const itemsPerPage = 9;

const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

const scrollToTop = () => {
  const scrollableContainer = document.querySelector('.scrollable-container');
  if (scrollableContainer) {
    scrollableContainer.scrollTo({ top: 0});
  }
};

useEffect(() => {
  scrollToTop();
}, [currentPage]);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const handlePageClick = (pageNumber) => {
  setCurrentPage(pageNumber);
};


const renderPaginationItems = () => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          isActive={i === currentPage}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }
  return pages;
};

const [data, setData] = useState([])

const [filters, setFilters] = useState({
  category: [],
  price: [],
  brand: [],
  rating: []
});

useEffect(() => {
  applyFilters();
}, [filters, data]);

const applyFilters = () => {
  let filtered = data;

  if (filters.category.length > 0) {
    filtered = filtered.filter(product => filters.category.includes(product.category));
  }
  if (filters.price.length > 0) {
    filtered = filtered.filter(product => filters.price.some(priceRange => product.price >= parsePriceRange(priceRange)[0] && product.price <= parsePriceRange(priceRange)[1]));
  }
  if (filters.brand.length > 0) {
    filtered = filtered.filter(product => filters.brand.includes(product.brand));
  }
  if (filters.rating.length > 0) {
    filtered = filtered.filter(product => filters.rating.includes(`${product.rating} Star`));
  }

  setFilteredData(filtered);
};

const parsePriceRange = (range) => {
  const [min, max] = range.split('-').map(price => price.replace(/[^0-9]/g, '').trim());
  return [Number(min), Number(max || 1000000)];
};

const { searchTerm } = useParams();

const navigate = useNavigate();

function goToProductDetails(productId) {
  navigate(`/product/${productId}`)
}

let { user } = useContext(AuthContext)


const [quantities, setQuantities] = useState({})

const quantityOptions = Array.from({ length: 10 }, (_, i) => i + 1);

const { toast } = useToast()

function handleAddToCart(product , quantity) {
  if(user) {
    addToCart(product, quantity)
    toast({
      title: "Product Added!",
      description: "The product has been successfully added to your cart."
  });
  } else {
    localStorage.setItem('pendingCartItem', JSON.stringify({ product, quantity }));
    navigate('/user_auth')
  }
}

function fetchData() {
  if(searchTerm == "all") {
    axios.get('http://localhost:8080/product/').then((response) => {
      setData(response.data)
      setFilteredData(response.data);
      console.log(response.data)
    })
  } else {
    axios.post('http://localhost:8080/product/search', {keyword: searchTerm}).then((response) => {
      setData(response.data)
      setFilteredData(response.data);
      console.log(response.data)
    })
  }
}

useEffect(() => {
  fetchData();
}, [])

const handleChange = (productId, value) => {
  console.log(value);
  setQuantities(prevQuantities => ({
    ...prevQuantities,
    [productId]: parseInt(value, 10),
  }));
};

const { addToCart } = useContext(CartContext);

useEffect(() => {
  fetchData();
}, [])

useEffect(() => {
  if (data.length > 0) {
    setQuantities(
      data.reduce((acc, product) => {
        acc[product.productId] = 1; // Initial quantity for each product
        return acc;
      }, {})
    );
  }
}, [data]);

const items = ["Laptops", "Phones", "Cameras", "Computers", "Headphones", "TVs", "Accessories"];
const prices = ["$0 - $99", "$100 - $249", "$250 - $499", "$500 - $1000+"];
const brands = ["HP", "Apple", "Dell", "ASUS", "Sony", "Samsung"];
const ratings = ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"];

const handleCheckboxChange = (category, value) => {
  setFilters((prevFilters) => {
    // Ensure that the category is always an array
    const updatedCategory = prevFilters[category] || [];

    return {
      ...prevFilters,
      [category]: updatedCategory.includes(value)
        ? updatedCategory.filter(item => item !== value)
        : [...updatedCategory, value]
    };
  });
};

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='w-full h-14 flex items-center pl-6 py-4'>
        <Toaster />
        <h1 className='text-xl font-semibold'><span className='text-muted-foreground'>Search results for </span>"{searchTerm}" <span className='text-muted-foreground'>({filteredData.length})</span></h1>
        <Sheet>
          <SheetTrigger asChild><Button className='ml-auto mr-4 sm:hidden'><SlidersHorizontal className='w-4 h-4 mr-1'/>Filters</Button></SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
              <div className="w-full flex-col bg-background">
                <nav className="grid items-start gap-4 pt-8 px-2 text-sm font-medium lg:px-4">
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className='text-base pl-6'>Category</AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-2'>
                        {items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 pl-6">
                            <Checkbox
                              id={`category-${index}`}
                              className="rounded-xs"
                              checked={filters.category.includes(item)}
                              onCheckedChange={() => handleCheckboxChange("category", item)}
                            />
                            <label htmlFor={`category-${index}`} className="text-base font-medium">
                              {item}
                            </label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  </div>
                  <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className='text-base pl-6'>Shop by price</AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-2'>
                        {prices.map((price, index) => (
                          <div key={index} className="flex items-center space-x-2 pl-6">
                            <Checkbox
                              id={`price-${index}`}
                              className="rounded-xs"
                              checked={filters.price.includes(price)}
                              onCheckedChange={() => handleCheckboxChange("price", price)}
                            />
                            <label htmlFor={`price-${index}`} className="text-base font-medium">
                              {price}
                            </label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  </div>
                  <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className='text-base pl-6'>Brand</AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-2'>
                          {brands.map((brand, index) => (
                            <div key={index} className="flex items-center space-x-2 pl-6">
                              <Checkbox
                                id={`brand-${index}`}
                                checked={filters.brand?.includes(brand) || false}
                                onCheckedChange={() => handleCheckboxChange('brand', brand)}
                                className="rounded-xs"
                              />
                              <label
                                htmlFor={`brand-${index}`}
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  </div>
                  <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className='text-base pl-6'>Rating</AccordionTrigger>
                      <AccordionContent className='flex flex-col gap-2'>
                          {ratings.map((rating, index) => (
                            <div key={index} className="flex items-center space-x-2 pl-6">
                              <Checkbox
                                id={`rating-${index}`}
                                /* checked={filters.ratings?.includes(rating) || false}
                                onCheckedChange={() => handleCheckboxChange('ratings', rating)} */
                                className="rounded-xs"
                              />
                              <label
                                htmlFor={`rating-${index}`}
                                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {rating}
                              </label>
                            </div>
                          ))}
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  </div>
                </nav>
              </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className='flex w-full'>
        <SideBar filters={filters} setFilters={setFilters}/>

        <div className='h-full w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 pt-0'>
        {currentItems.length > 0 ? (
          currentItems.map(product => (
            <Card key={product.productId} className="flex flex-col rounded-xs">
              <CardContent className='pb-2'>
                <img 
                  src={product.imageUrl} 
                  alt={product.productName} 
                  className="w-full h-36 object-contain my-4"
                />
                <p className='text-xl font-semibold'>{product.productName}</p>
                <p className='text-lg font-semibold'>${product.price}</p>
                <div key={product.productId} style={{ marginBottom: '1rem' }}>
                  <Select onValueChange={(value) => handleChange(product.productId, value)}>
                    <SelectTrigger className="w-[120px] h-8 ml-auto">
                      <SelectValue placeholder="Quantity: 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {quantityOptions.map(quantity => (
                        <SelectItem key={quantity} value={quantity}>{quantity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>                 
              </CardContent>
              <Button className='mb-2 w-3/4 mx-auto h-8' onClick={() => handleAddToCart(product, quantities[product.productId])}>Add to cart</Button>
              <Button variant="secondary" className='border border-2 mb-2 w-3/4 mx-auto h-8' onClick={() => goToProductDetails(product.productId)}>View item</Button>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center mt-[25%] text-2xl font-semibold">
            No results found
          </div>
        )}
      </div>
      </div>
      {currentItems.length > 0 &&
      <Pagination>
        <PaginationContent className='py-6'>
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousPage} />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      }
    </div>
    
  )
}

export default ListPage