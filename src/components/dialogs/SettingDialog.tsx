import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
//@ts-ignore
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { PosSettings } from "../pos/Settings"
 

export function PosSettingDialog( {open,setOpen}: {open: boolean,setOpen: (open: boolean) => void} ) {
   
    const handleClose = () => {
        setOpen(false)
    }
    return (
       <div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    ตั้งค่า
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ตั้งค่า</DialogTitle>
                    <DialogDescription>ตั้งค่าเริ่มต้น การใช้งาน</DialogDescription>
                </DialogHeader>
                <PosSettings onSave={handleClose}/>
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
