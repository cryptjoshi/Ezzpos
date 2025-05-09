
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReceiptProps {
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  date: Date
  orderNumber: string
}

export function Receipt({ items, total, date, orderNumber }: ReceiptProps) {
  const { toast } = useToast()

  const handlePrint = async () => {
    try {
      // Get printer settings from localStorage
      const printerConfig = JSON.parse(localStorage.getItem("printerConfig") || "{}")
      
      // Apply printer settings to receipt content
      const receiptElement = document.getElementById("receipt")
      if (receiptElement) {
        const style = document.createElement("style")
        style.textContent = `
          @media print {
            @page {
              size: ${printerConfig.paperWidth || 80}mm ${printerConfig.paperHeight || 297}mm;
              margin: ${printerConfig.margins || 5}mm;
            }
            body {
              font-family: ${printerConfig.fontFamily || "monospace"};
              font-size: ${printerConfig.fontSize || 12}pt;
            }
          }
        `
        document.head.appendChild(style)
        
        window.print()
        document.head.removeChild(style)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Print Error",
        description: "There was an error while trying to print",
      })
    }
  }

  return (
    <Card className="p-4 max-w-[300px] mx-auto font-mono text-sm" id="receipt">
      <div className="text-center mb-4">
        <div className="font-bold">Your Business Name</div>
        <div className="text-xs text-muted-foreground">
          123 Street Name, City, Country
        </div>
      </div>

      <div className="mb-4">
        <div>Order: #{orderNumber}</div>
        <div>{date.toLocaleString()}</div>
      </div>

      <div className="border-t border-b py-2 mb-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <div>
              {item.quantity}x {item.name}
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between font-bold">
        <div>Total</div>
        <div>${total.toFixed(2)}</div>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        Thank you for your purchase!
      </div>
      
      <div className="mt-4 print:hidden">
        <Button onClick={handlePrint} className="w-full">
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </div>
    </Card>
  )
}
