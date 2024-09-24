import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  UserRound
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

export default function AdminLayout() {

    let { logoutUser } = useContext(AuthContext)

    const navigate = useNavigate();

    const handleGoToStore = () => {
        navigate('/');
    };

    const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-grow w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-44 flex-col border-r bg-background sm:flex">
      <nav className="grid items-start gap-4 pt-8 px-2 text-sm font-medium lg:px-4">
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </Link>
              <Link
                to="/admin/all_products"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-5 w-5" />
                Products{" "}
              </Link>
              <Link
                to='/admin/analytics'
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
              >
                <LineChart className="h-5 w-5" />
                Analytics
              </Link>
            </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-44">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-4 text-lg font-medium">
                <Link
                  to="/admin"
                  onClick={() => setIsSheetOpen(!isSheetOpen)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  onClick={() => setIsSheetOpen(!isSheetOpen)}
                  to="/admin/all_products"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
                >
                  <Package className="h-5 w-5" />
                  Products{" "}
                </Link>
                <Link
                  onClick={() => setIsSheetOpen(!isSheetOpen)}
                  to='/admin/analytics'
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base text-muted-foreground transition-all hover:text-primary"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Orders</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recent Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2 flex-1 md:grow-0">
            <Button onClick={handleGoToStore} size='sm' className='text-xs h-8 p-2 rounded-xs' >Go to store</Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
             <UserRound className="h-5 w-5 mr-2 hover:scale-102" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className='font-semibold' onClick={logoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Outlet />
      </div>
    </div>
  )
}