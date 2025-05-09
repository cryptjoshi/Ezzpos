import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { Printer } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function InvoicePreview() {

    const {sessionData,setSessionCartData} = useAuth()

    useEffect(() => {
        console.log(sessionData)
    },[sessionData])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!sessionData?.cartData?.isEdit} className="justify-start"  ><Printer className="mr-2 h-4 w-4" />แสดงตัวอย่าง</Button>
            </DialogTrigger>
            <DialogContent className="w-[600px]">
                <DialogHeader>
                    <DialogTitle>ตัวอย่างบิลขาย</DialogTitle>
                </DialogHeader>
                <div className="grid grid-rows-2 gap-2 p-2 justify-center">
                <div className="font-semibold text-center">วันที่: {sessionData?.cartData?.docDate}</div>
                <div className="font-semibold text-center">เลขที่เอกสาร: {sessionData?.cartData?.docNo}</div>
                <div className="font-semibold text-center">ชื่อลูกค้า: {sessionData?.settings?.defaultCustomerName}</div>
                 <Separator className="mt-2" />
                    {sessionData?.cartData?.items.map((item:any,index:any) => (
                        <div key={index} className="flex justify-between">
                        <div>
                            <div className="font-semibold">{item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name  }</div>
                            <div className="text-sm text-muted-foreground">
                                ราคา: {item.price} x จำนวน:{item.quantity}
                            </div>
                        </div>
                         <div className="font-medium">{item.price * item.quantity}</div>
                        </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="font-semibold justify-center">ยอดรวมสินค้า:{sessionData?.cartData?.total}</div>
                    <div className="font-semibold justify-center">ภาษี:{sessionData?.cartData?.total}</div>
                    <div className="font-semibold justify-center">ยอดรวม:{sessionData?.cartData?.total}</div>
                    <div className="font-semibold justify-center">เงินสด:{sessionData?.cartData?.total}</div>
                    <div className="font-semibold justify-center">เงินทอน:{sessionData?.cartData?.total}</div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <div className="flex gap-2 justify-center items-center w-full">
                        <Button variant="outline" className="bg-green-500 w-full justify-center items-center"  size="sm">พิมพ์</Button>
                        <Button variant="outline" className="bg-red-500 w-full justify-center items-center" size="sm">ปิด</Button>
                        </div>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}