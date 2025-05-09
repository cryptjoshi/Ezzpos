'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, DollarSign, Languages, LogOut } from "lucide-react"
import { PrinterSettings } from "@/components/pos/PrinterSettings"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { SignOut } from "@/app/actions"
import { PosSettingDialog } from "../dialogs/SettingDialog"
import { useState } from "react"

const currencies = [
  { code: "THB", symbol: "฿", name: "Thai Bath" },
  //{ code: "USD", symbol: "$", name: "US Dollar" },
  // { code: "EUR", symbol: "€", name: "Euro" },
  // { code: "GBP", symbol: "£", name: "British Pound" },
  // { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  // { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  // { code: "INR", symbol: "₹", name: "Indian Rupee" },
  // { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  // { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
]

/* Commented out to fix unused variable warning
const languages = [
  { code: "en", name: "English" },
  { code: "th", name: "Thai" },
  { code: "la", name: "Lao" },
  // { code: "es", name: "Español" },
  // { code: "fr", name: "Français" },
  // { code: "de", name: "Deutsch" },
  // { code: "it", name: "Italiano" },
  // { code: "pt", name: "Português" },
  // { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
]
*/

export function SettingsMenu() {
 
 const router = useRouter()
  const [openDialog,setOpenDialog] = useState(false)
  const handleLogout = async() => {
    await SignOut()
    router.push('/login')
  }
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 h-9">
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild   ><PosSettingDialog open={openDialog} setOpen={setOpenDialog}/></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild ><PrinterSettings/></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>ออกจากระบบ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
