import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { ReceiptMoney } from "@/components/pos/ReceiptMoney"
 

export function ReceiptDialog( {open,setOpen,total}: {open: boolean,setOpen: (open: boolean) => void,total: number} ) {
   
    const handleClose = () => {
        setOpen(false)
    }
    return (
       <div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>รับเงิน</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <ReceiptMoney total={total} onSave={handleClose}/>
                {/* <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" className="bg-red-500 w-full justify-center" size="lg" >ปิด</Button></DialogClose>
                    <DialogClose asChild>
                    <Button type="button" className="bg-green-500 w-full justify-center" size="lg" >บันทึก</Button></DialogClose>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
       </div>
     
    )
}
