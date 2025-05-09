import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
//@ts-ignore
import { z } from "zod"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addInvoice } from "@/app/actions"
import { useAuth } from "@/contexts/AuthContext"
import { defaultSession } from "@/lib/session"

export function ReceiptMoney({total,onSave}: {total: number,onSave: () => void}) {
    const {sessionData,setSessionCartData} = useAuth()
    const router = useRouter()
    const schema = z.object({
        cash: z.string().min(1, "กรุณากรอกจำนวนเงิน"),
        change: z.string().optional()

    }) 
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            cash: "",
            change: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
      
        form.setValue("change", (Number(data.cash) - total).toString())
        
        const saveHandler = async ()=>{
            if(sessionData?.cartData){
            setSessionCartData({
                ...sessionData?.cartData,
                cash: Number(form.getValues("cash")),
                change: total - Number(form.getValues("cash"))
            })
           const res = await addInvoice(sessionData?.cartData)
           if(res){
            localStorage.removeItem('cartData');
            setSessionCartData({items: [], total: 0}) 
            onSave()
            router.refresh()
               }
            }
        }
        saveHandler()
        
    }

    // const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = Number(e.target.value)
        
    //     form.setValue("change", value - total)
    // }

    
    return (
        <div className="flex flex-col gap-2 p-4 bg-gray-200 rounded-lg shadow-md"> 
         <Form {...form}> 
         <form onSubmit={form.handleSubmit(onSubmit)}> 
           
            <Label htmlFor="total" className="text-sm font-bold text-blue-500 py-2">ยอดรวม:</Label>
            <Input id="total" className="w-full text-right text-[30px] mt-2 mb-2 font-bold" type="number" value={total} disabled />
            <Separator />
            <FormField control={form.control} name="cash" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-sm font-bold text-green-500 py-2">เงินสด</FormLabel>
                    <FormControl>
                        <Input type="number" className="w-full text-right text-[30px] mt-2 mb-2 font-bold"  {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <Separator />
            <FormField control={form.control} name="change" render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-sm font-bold text-red-500 py-2">เงินทอน</FormLabel>
                    <FormControl>
                        <Input {...field} className="w-full text-right text-[30px] mt-2 mb-2 font-bold text-red-500" value={Number(form.watch("cash")) - total} readOnly/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )} />
           
           <div className="flex justify-end gap-2 mt-2" >
           {/* <Button type="button" className="bg-green-500" disabled={change < 0 || loading} onClick={()=>{
            form.trigger()
            form.handleSubmit(onSubmit)
           }}>ชำระเงิน</Button> */}
             <Button type="submit" onClick={async () => {
                    const result = await form.trigger();
                    if (!result) {
                      const errors = form.formState.errors;
                      let errorMessage = "กรุณากรอกจำนวนเงิน";
                      Object.keys(errors).forEach((key) => {
                        errorMessage += `\n${key}: ${errors[key as keyof typeof errors]?.message}`;
                      });
                      toast(errorMessage)
                      
                    }
                    
                  }} disabled={Number(form.watch("cash")) - total < 0}>{'บันทึก'}</Button>
           <Button type="button" className="bg-red-500" onClick={onSave}>ยกเลิก</Button>
           </div>
           </form>
         </Form>
        </div>
    )
}
