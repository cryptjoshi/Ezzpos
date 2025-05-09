import { zodResolver } from "@hookform/resolvers/zod"
import {  useForm } from "react-hook-form"
//@ts-ignore
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
 
import { DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
 
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { getCustomers, updateSettings } from "@/app/actions"
import { redirect, useRouter } from "next/navigation"
import { getSession } from "@/app/actions"
import { ComboboxDemo } from "@/components/ui/combobox"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { iCustomer } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import { PrinterSettings } from "./PrinterSettings"

export function PosSettings({onSave}: {onSave: () => void}) {
    const [open, setOpen] = useState(false)
    const [comboitem,setComboitem] = useState<{value: string, label: string}[]>([])
    //const [sessionData,setSessionData] = useState<any>({})
    const [customers, setCustomers] = useState<iCustomer[]>([])
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
    //console.log(sessionData)
    const {sessionData,setSessionCartData} = useAuth()
    
    const formSchema = z.object({
        defaultCustomerCode: z.string().min(1, "กรุณากรอกลูกค้าเริ่มต้น"),
        defaultCustomerName: z.string().optional(),
        defaultWhcode: z.string().min(1, "กรุณากรอกคลังสินค้า"),
        defaultShelfcode: z.string().min(1, "กรุณากรอกที่เก็บสินค้า"),
        defaultPrice: z.string().min(1, "กรุณากรอกราคาเริ่มต้น"),
        defaultVAT: z.string().min(1, "กรุณากรอกราคาภาษี"),
        defaultDocno: z.string().min(1, "กรุณากรอกรูปแบบเลขที่เอกสาร"),
        currency: z.string().min(1, "กรุณากรอกสกุลเงิน"),
        machineNumber: z.string().min(1, "กรุณากรอกหมายเลขเครื่อง"),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            defaultCustomerCode: sessionData?.settings?.defaultCustomerCode,
            defaultCustomerName: sessionData?.settings?.defaultCustomerName,
            defaultWhcode: sessionData?.settings?.defaultWhcode,
            defaultShelfcode: sessionData?.settings?.defaultShelfcode,
            defaultPrice: sessionData?.settings?.defaultPrice,
            defaultVAT: sessionData?.settings?.defaultVAT,
            defaultDocno: sessionData?.settings?.defaultDocno,
            currency: sessionData?.settings?.currency,
            machineNumber: sessionData?.settings?.machineNumber,
            },
    })    
    const handleSaveSettings = async(data:z.infer<typeof formSchema>) => {
        
        const posid = sessionData?.settings?.machineNumber
        if(data.defaultCustomerName === undefined){
            data.defaultCustomerName = ""
        }
        //data.defaultCustomerCode =  data.defaultCustomerCode 
        //data.defaultCustomerName = data.defaultCustomerName || ""
        setLoading(true)
        // const posid = sessionData?.settings?.machineNumber
        if (!posid) {
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่พบ posid",
            })
            setLoading(false)
            return
        }
       await updateSettings(posid,{
        defaultCustomerCode: data.defaultCustomerCode,
        defaultCustomerName: data.defaultCustomerName,
        defaultWhcode: data.defaultWhcode,
        defaultShelfcode: data.defaultShelfcode,
        defaultPrice: data.defaultPrice,
        defaultVAT: data.defaultVAT,
        defaultDocno: data.defaultDocno,
        currency: data.currency,
        machineNumber: data.machineNumber,
       }) 
       
         
       toast({
            title: "สำเร็จ",
            description: "ตั้งค่าถูกบันทึก",
        })
        setLoading(false)
        onSave()
        router.refresh()
    }
 
    const getPrice = (price:string) => {
       
        switch (price) {
            case "1":
                return "ราคา 1"
            case "2":
                return "ราคา 2"
            case "3":
                return "ราคา 3"
            case "4":
                return "ราคา 4"
            case "5":
                return "ราคา 5"
            case "6":
                return "ราคา 6"
            case "7":
                return "ราคา 7"
            case "8":
                return "ราคา 8"
            case "9":
                return "ราคา 9"
            case "10":
                return "ราคา 10"
            default:
                return "ราคาเริ่มต้น"
        }
    }
    useEffect(() => {
       const fetchCustomers = async () => {
        const customers: {Data: iCustomer[], Message:string, Status:boolean} = await getCustomers()
        setComboitem(customers.Data.map((customer) => ({
            value: customer.code,
            label: customer.name,
        })))
       }

       fetchCustomers()
       
    }, [])
    return (
        <div>
        <Form {...form}> 
        <form onSubmit={form.handleSubmit(handleSaveSettings)}> 
           
            <Tabs defaultValue="setting" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="setting">ตั้งค่า</TabsTrigger>
                <TabsTrigger value="printing">กระดาษพิมพ์</TabsTrigger>
            </TabsList>
            <TabsContent value="setting">
            <div className="flex flex-col gap-2 py-2">
            <FormField
                control={form.control}
                name="defaultCustomerCode"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>ลูกค้าเริ่มต้น</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value
                                ? comboitem.find(
                                    (customer) => customer.value === field.value
                                )?.label + " - " + comboitem.find(
                                    (customer) => customer.value === field.value
                                )?.value
                                : "เลือกลูกค้าเริ่มต้น"}
                            <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput
                            placeholder="ค้นหาลูกค้า..."
                            className="h-9"
                            />
                            <CommandList>
                            <CommandEmpty>ไม่พบลูกค้า</CommandEmpty>
                            <CommandGroup>
                                {comboitem.map((customer) => (
                                <CommandItem
                                    value={customer.value}
                                    key={customer.value}
                                    onSelect={() => {
                                    form.setValue("defaultCustomerCode", customer.value)
                                    form.setValue("defaultCustomerName", customer.label)
                                    }}
                                >
                                    {customer.value + " - " + customer.label}
                                    <Check
                                    className={cn(
                                        "ml-auto",
                                        customer.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                    />
                                </CommandItem>
                                ))}
                            </CommandGroup>
                            </CommandList>
                            </Command>
                            </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         
                        <FormField control={form.control} name="defaultWhcode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>คลังสินค้า</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                              
                                <FormMessage />
                            </FormItem>
                        )} />
                       <FormField control={form.control} name="defaultShelfcode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>ที่เก็บสินค้า</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="defaultPrice" render={({ field }) => (
                            <FormItem>
                                <FormLabel>ราคาเริ่มต้น</FormLabel>
                                <FormControl>
                                  <Select 
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  {...field}
                                  >
                                    <SelectTrigger>
                                      <SelectValue   placeholder="ราคาเริ่มต้น" />
                                    </SelectTrigger>
                                    <SelectContent>
                                     
                                      <SelectItem value="1">ราคา 1</SelectItem>
                                      <SelectItem value="2">ราคา 2</SelectItem>
                                      <SelectItem value="3">ราคา 3</SelectItem>
                                      <SelectItem value="4">ราคา 4</SelectItem>
                                      <SelectItem value="5">ราคา 5</SelectItem>
                                      <SelectItem value="6">ราคา 6</SelectItem>
                                      <SelectItem value="7">ราคา 7</SelectItem>
                                      <SelectItem value="8">ราคา 8</SelectItem>
                                      <SelectItem value="9">ราคา 9</SelectItem>
                                      <SelectItem value="10">ราคา 10</SelectItem>
                             
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="defaultVAT" render={({ field }) => (
                            <FormItem>
                                <FormLabel>ภาษีเริ่มต้น</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="defaultDocno" render={({ field }) => (
                            <FormItem>
                                <FormLabel>เลขที่เอกสารเริ่มต้น</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="currency" render={({ field }) => (
                            <FormItem>
                                <FormLabel>สกุลเงินเริ่มต้น</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )} />   
                        </div>
            </TabsContent>
            <TabsContent value="printing">
            <div className="flex flex-col gap-2 py-2">
             <PrinterSettings/>
            </div>
            </TabsContent>
            </Tabs>
            <div className="flex flex-col gap-2 py-2">
                <Button type="button" className="bg-orange-500 w-full justify-center" size="lg" onClick={() => onSave()}>ปิด</Button>
                <Button type="submit" disabled={loading} className="bg-green-500 w-full justify-center">
                    {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
                
            </div>
                     
 
        </form>
        </Form>
        </div>
    )
}
