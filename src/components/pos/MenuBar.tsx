
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
 
import { InvoiceGrid } from "@/components/pos/InvoiceGrid"
import { ProductGrid } from "@/components/pos/ProductGrid"
import { cn } from "@/lib/utils"
import { InvoicePreview } from "./InvoicePreview"


const categories = [
  {id:1,label:"ค้นหาสินค้า",Component: <ProductGrid />},
  {id:2,label:"ค้นหาบิลขาย",Component: <InvoiceGrid />},
  {id:3,label:"พักบิลขาย",Component: <InvoiceGrid />},
  {id:4,label:"พิมพ์บิลขาย",Component: <InvoicePreview />},
]


export function MenuBar({onSelect,setComponent,selectedMenu}: {onSelect: (id: number) => void,setComponent: (id:number,component: React.ReactNode) => void,selectedMenu: number}) {

  

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-2 p-2 bg-gray-200">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className={cn("whitespace-nowrap ", selectedMenu === category.id ? "bg-primary text-primary-foreground" : "")}
            onClick={() => {onSelect(category.id);setComponent(category.id,category.Component)}}
          >
            {category.label}
          </Button>
        ))}
        
      </div>
    </ScrollArea>
  )
}
