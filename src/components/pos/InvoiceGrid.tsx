'use client'
//import { Card, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
//import { Button } from "../ui/button"
import ProductCard from "@/components/pos/ProductCard"
import { getInvoice,getInvoiceByDocno } from "@/app/actions"
import { CartItem, iProduct,iInvoice,iInvoiceSub } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import InvoiceCard from "./InvoiceCard"
import { formatDateTimeEx } from "@/lib/utils"


export function InvoiceGrid() {
  const {setSessionCartData, sessionData} = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [invoices, setInvoices] = useState<iInvoice[]>([])
  const [offset, setOffset] = useState(0)
  

 

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const products: {Data: iProduct[], Message:string, Status:boolean} = await getProducts()
  //     setProducts(products.Data)
  //   }
  //   fetchProducts()
    
  // }, []) 

  useEffect(() => {
    async function fetchInitialInvoice() {
        const settings = sessionData?.settings;
        const data = await getInvoice(settings?.machineNumber || '01');
         
        setInvoices(data.Data);
    }

    fetchInitialInvoice();
}, [sessionData?.settings]);


  const filteredInvoices = invoices && invoices.filter((invoice: iInvoice) => 
    invoice.docno.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.arcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.arname.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addCartx = async (invoice: iInvoice) => {
 
    const invoiceData = await getInvoiceByDocno(invoice.docno)
     
     
    //const product = invoiceData.Data.invoicesub
    //console.log(invoiceData)
    //const cartData = localStorage.getItem('cartData')
    const inv:iInvoice = invoiceData.Data.Invoice
  
    const newItem: CartItem[] = invoiceData.Data.Invoicesub.map((item:iInvoiceSub) =>  {
        return {
            quantity: item.qty,
            code: item.itemcode,
            name: item.itemname,
            whcode: sessionData?.settings?.defaultWhcode || '01',
            shelfcode: sessionData?.settings?.defaultShelfcode || '01',
            price: item.price,
            unit: item.unit,
            unitcode: item.unitcode,
            total: item.amount,
            id: item.docno,
            }})
    //const cartData = { ...inv, quantity: 1, id: inv.docno,code: inv.docno, unit: inv.unit, price: inv.price1, total: inv.price1, whcode: sessionData?.settings?.defaultWhcode || '01', shelfcode: sessionData?.settings?.defaultShelfcode || '01' }
    //items.push(cartData)
    // if(items.find((item: CartItem) => item.id === cartData.docno)){
    //   items.find((item: CartItem) => item.id === cartData.docno)!.quantity++
    //   items.find((item: CartItem) => item.id === cartData.docno)!.total = items.find((item: CartItem) => item.id === cartData.docno)!.quantity * cartData.price1
      
    // }else{
    //   items.push({ ...cartData, quantity: 1, id: cartData.docno,code: cartData.docno, unit: cartData.unit, price: cartData.price1, total: cartData.price1, whcode: sessionData?.settings?.defaultWhcode || '01', shelfcode: sessionData?.settings?.defaultShelfcode || '01' })
    // }
    localStorage.setItem('cartData', JSON.stringify({ newItem, total: newItem.reduce((sum, item) => sum + item.total, 0),isEdit: true,docNo: invoice.docno,docDate: formatDateTimeEx(inv.docdate) }));
    setSessionCartData({ items: newItem, total: newItem.reduce((sum, item) => sum + item.total, 0),isEdit: true,docNo: invoice.docno,docDate: formatDateTimeEx(inv.docdate) });

  }
   

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาบิลขาย..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => e.key === "Enter" && filteredInvoices.length==1 && addCartx(filteredInvoices[0])}
          
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredInvoices && filteredInvoices.slice(offset, offset + 20).map((invoice) => (
          
            <InvoiceCard key={invoice.docno} invoice={invoice} onClick={() => addCartx(invoice)}/>
            
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
