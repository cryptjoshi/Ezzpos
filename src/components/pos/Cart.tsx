'use client'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
 
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "../ui/input"
import { setTimeout } from "timers"
import { ConfirmDialog } from "@/components/dialogs/ConfirmDialog"
import { GetInvoiceNo, getSession } from "@/app/actions"
import { formatDateTime } from "@/lib/utils"
 

export function Cart({setReceiptDialog}: {setReceiptDialog: (receiptDialog: boolean) => void}) {
  const { cartData, setSessionCartData } = useAuth()
  const [clearCartDialog, setClearCartDialog] = useState(false);
 //const [cartData, setCartData] = useState<any>({})
  //const [total, setTotal] = useState(total)
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuantity, setEditedQuantity] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); 

const handleCancel = () => {
    setClearCartDialog(false)
}
  const handleItemClick = (index:any) => {
    setEditingIndex(index);
    setEditedQuantity(cartData?.items[index]?.quantity); // Initialize edited quantity
  };

  const handleQuantityInputChange = (value:any) => {
   
    setEditedQuantity(value);
  };

  const handleConfirmEdit = (index:any) => {
    if (editedQuantity && editedQuantity <= 0) {
      //cartData.items[index].quantity = editedQuantity;
      //cartData.total = cartData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
      cartData.items.splice(index, 1);
      cartData.total = cartData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
      localStorage.setItem('cartData', JSON.stringify(cartData));
      setSessionCartData(cartData);
      setTimeout(() => {
        setEditingIndex(null);
      }, 0);
  } else {
    cartData.items[index].quantity = Number(editedQuantity);
    cartData.total = cartData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    localStorage.setItem('cartData', JSON.stringify(cartData));
    setSessionCartData(cartData);
    setTimeout(() => {
      setEditingIndex(null);
    }, 0);
  }
 }

  const handleCancelEdit = () => {
    setTimeout(() => {
      setEditingIndex(null);
      setEditedQuantity(null);
    }, 0);
   
  }; 
  useEffect(() => {
    const cartdataFromStorage = localStorage.getItem('cartData');
    //console.log('cartdataFromStorage:', cartdataFromStorage);
    //console.log('cartData from context:', cartData);

    // ดึงข้อมูลจาก localStorage เฉพาะเมื่อ context ยังไม่มี cartData
    if (cartdataFromStorage && !cartData) {
      try {
        const parsedCartData = JSON.parse(cartdataFromStorage);
        setTimeout(() => {
          setSessionCartData(parsedCartData);
        }, 100);
        console.log('Cart data loaded from localStorage');
      } catch (error) {
        console.error('Error parsing cartData from localStorage:', error);
      }
    }

   

  }, [cartData, setSessionCartData]);
 
  // useEffect(() => {
  //   const getDocumentNumber = async () => {
  //       const docNo = await GetInvoiceNo()
  //      // console.log(cartData)
  //      const newCartData = {...cartData,docNo:docNo.Data,docDate:formatDateTime(new Date())}
       
  //       localStorage.setItem('cartData', JSON.stringify(newCartData));
  //       setSessionCartData(cartData);
  //   }
  //   getDocumentNumber()
  // }, [])
  //const items: CartItem[] = cartData ? JSON.parse(cartData).items : []
  //const total = cartData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
  // useEffect(() => {
  //   const cartdataFromStorage = localStorage.getItem('cartData');
  //   if (cartdataFromStorage) {
  //     const parsedCartData = JSON.parse(cartdataFromStorage);
  //     setSessionCartData(parsedCartData);
  //   }
  // }, [cartData]);

  useEffect(() => {
    // เรียก select() บน Input เมื่อเข้าสู่โหมดแก้ไข
    if (editingIndex !== null && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingIndex]);

  const clearCart = () => {
    //setReceiptDialog(true)

   // localStorage.removeItem('cartData');
    setSessionCartData({...cartData,items: [], total: 0}) 
    handleCancel()
  }

  const receipt = () => {
    setReceiptDialog(true)

    // localStorage.removeItem('cartData');
    // setSessionCartData({items: [], total: 0}) 
    
  }
 

  return (
    <>
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="p-4 font-semibold text-sm">{`เลขที่เอกสาร: ${cartData?.docNo}`}</div>
      <Separator />
      <div className="p-4 font-semibold text-lg">รายการสินค้า</div>
      <Separator />
      
      <ScrollArea className="flex-1 p-4">
        {cartData?.items && cartData?.items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No items in cart
          </div>
        ) : (
          <div className="space-y-4">
            { cartData?.items && cartData.items.map((item:any,index:any) => (
              <div
              key={index}
              className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => handleItemClick(index)}
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  ราคา: {item.price} x จำนวน:
                  {editingIndex === index ? (
                    <div className="inline-flex items-center ml-1">
                      <Input
                        type="text"
                        value={editedQuantity || item.quantity}
                        className="w-12 inline-block text-inherit border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 align-middle text-right"
                        onChange={(e) => handleQuantityInputChange(e.target.value)}
                        ref={inputRef}
                      />
                      <button
                        className="ml-1 px-2 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                        onClick={() => handleConfirmEdit(index)}
                      >
                        ยืนยัน
                      </button>
                      <button
                        className="ml-1 px-2 py-1 bg-gray-300 text-gray-700 rounded-md text-xs hover:bg-gray-400"
                        onClick={handleCancelEdit}
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <span className="ml-1">{item.quantity}</span>
                  )}
                </div>
              </div>
              <div className="font-medium">{item.price * item.quantity}</div>
            </div>
             
            ))}
             
          </div>
        )}
      </ScrollArea>
      
      <Separator />
      <div className="p-4 space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <span>ยอดรวม</span>
          <span>{cartData?.total?.toFixed(2)}</span>
        </div>
        <Button className="w-full bg-green-500" disabled={cartData?.isEdit} size="lg" onClick={() => {receipt()}}>
          {"ชำระเงิน"}
        </Button>
        <Separator />
        <Button className="w-full bg-red-500" disabled={cartData?.isEdit} size="lg" onClick={() => {setClearCartDialog(true)}}>
          {"ยกเลิก"}
        </Button>
      </div>
    </Card>
    <ConfirmDialog  open={clearCartDialog} setOpen={setClearCartDialog} title="ยืนยันการยกเลิก" description="คุณต้องการยกเลิกการสั่งซื้อหรือไม่" onConfirm={clearCart} onCancel={handleCancel}/>
  </>
  )
}
