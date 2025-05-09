'use client'
//import { Card, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
//import { Button } from "../ui/button"
import ProductCard from "@/components/pos/ProductCard"
import { GetInvoiceNo, getProducts } from "@/app/actions"
import { CartItem, iProduct } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { formatDateTime } from "@/lib/utils"


export function ProductGrid() {
  const {setSessionCartData, sessionData} = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<iProduct[]>([])
  const [offset, setOffset] = useState(0)
  
 

  useEffect(() => {
    async function fetchInitialProducts() {
        const settings = sessionData?.settings;
        const data = await getProducts(settings?.defaultPrice);
        setProducts(data.Data);

    }

    fetchInitialProducts();
}, [sessionData?.settings]);


  const filteredProducts = products && products.filter((product: iProduct) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addCartx = async (product: iProduct) => {
 
    const cartData = localStorage.getItem('cartData')
   // const docno = sessionData?.cartData?.docNo;
    
    cartData && console.log(JSON.parse(cartData))
    if(cartData == "{}")
      localStorage.setItem('cartData', JSON.stringify({ items: [], total: 0 }));
    
    const items: CartItem[] = localStorage.getItem('cartData') ? JSON.parse(localStorage.getItem('cartData')!).items : []
   
    if(items && items.find((item: CartItem) => item.id === product.code)){
      items.find((item: CartItem) => item.id === product.code)!.quantity++
      items.find((item: CartItem) => item.id === product.code)!.total = items.find((item: CartItem) => item.id === product.code)!.quantity * product.price1
      
    }else{
      items && items.push({ ...product, quantity: 1, id: product.code,code: product.code, unit: product.unit, price: product.price1, total: product.price1, whcode: sessionData?.settings?.defaultWhcode || '01', shelfcode: sessionData?.settings?.defaultShelfcode || '01' })
    }
    localStorage.setItem('cartData', JSON.stringify({ items, total: items?.reduce((sum, item) => sum + item.total, 0),isEdit: false,docNo: sessionData?.cartData?.docNo,docDate: formatDateTime(new Date()) }));
    setSessionCartData({ items: items, total: items?.reduce((sum, item) => sum + item.total, 0),isEdit: false,docNo: sessionData?.cartData?.docNo,docDate: formatDateTime(new Date()) });
 
  }
   
  // useEffect(() => {
  //   const cartdataFromStorage = localStorage.getItem('cartData');
  //   //console.log('cartdataFromStorage:', cartdataFromStorage);
  //   //console.log('cartData from context:', cartData);
  //   const getDocumentNumber = async () => {
  //     const docNo = await GetInvoiceNo()
  //     const parsedCartData = JSON.parse(localStorage.getItem('cartData')!);
  //    // console.log(localStorage.getItem('cartData'))
  //    // parsedCartData.docDate = formatDateTime(new Date())
  //     // parsedCartData.docNo = docNo.Data
  //     // parsedCartData.isEdit = false;
  //     // parsedCartData.total = 0;
  //     localStorage.setItem('cartData', JSON.stringify({...parsedCartData,docDate:formatDateTime(new Date()),docNo:docNo.Data,isEdit:false,total:0}));
  //     setTimeout(() => {
  //       setSessionCartData(parsedCartData);
  //     }, 100);
  //     }
  //     getDocumentNumber()
  //   // ดึงข้อมูลจาก localStorage เฉพาะเมื่อ context ยังไม่มี cartData
  //   if (cartdataFromStorage) {
  //     try {
  //       const parsedCartData = JSON.parse(cartdataFromStorage);
        
  //       setTimeout(() => {
  //         setSessionCartData(parsedCartData);
  //       }, 100);
  //       console.log('Cart data loaded from localStorage');
  //     } catch (error) {
  //       console.error('Error loading cart data from localStorage:', error);
  //     }
  //   }
    
  // }, []); 

 
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสินค้า..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && filteredProducts.length==1 && addCartx(filteredProducts[0])}
          
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredProducts && filteredProducts.slice(offset, offset + 20).map((product) => (
          
            <ProductCard key={product.code} product={product} onClick={() => addCartx(product)}/>
            
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
