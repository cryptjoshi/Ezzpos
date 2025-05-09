'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PrintSetupDialog() {
  const { toast } = useToast()
  const [open,setOpen] = useState(false)
  const [printerConfig, setPrinterConfig] = useState({
    paperWidth: "80",
    paperHeight: "297",
    fontSize: "12",
    fontFamily: "monospace",
    margins: "5",
  })

  const handleSaveSettings = () => {
    localStorage.setItem("printerConfig", JSON.stringify(printerConfig))
    toast({
      title: "Settings saved",
      description: "Printer configuration has been updated",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Printer className="mr-2 h-4 w-4" />
          ตั้งค่าพิมพ์
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ตั้งค่าพิมพ์</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperWidth" className="text-right">
              ความกว้างกระดาษ (mm)
            </Label>
            <Input
              id="paperWidth"
              value={printerConfig.paperWidth}
              onChange={(e) =>
                setPrinterConfig((prev) => ({
                  ...prev,
                  paperWidth: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paperHeight" className="text-right">
              ความสูงกระดาษ (mm)
            </Label>
            <Input
              id="paperHeight"
              value={printerConfig.paperHeight}
              onChange={(e) =>
                setPrinterConfig((prev) => ({
                  ...prev,
                  paperHeight: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fontSize" className="text-right">
              ขนาดตัวอักษร (pt)
            </Label>
            <Input
              id="fontSize"
              value={printerConfig.fontSize}
              onChange={(e) =>
                setPrinterConfig((prev) => ({
                  ...prev,
                  fontSize: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fontFamily" className="text-right">
              ชนิดตัวอักษร
            </Label>
            <Select
              value={printerConfig.fontFamily}
              onValueChange={(value) =>
                setPrinterConfig((prev) => ({ ...prev, fontFamily: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monospace">Monospace</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="sans-serif">Sans Serif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="margins" className="text-right">
              ขอบเขต (mm)
            </Label>
            <Input
              id="margins"
              value={printerConfig.margins}
              onChange={(e) =>
                setPrinterConfig((prev) => ({
                  ...prev,
                  margins: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSaveSettings}>บันทึก</Button>
      </DialogContent>
    </Dialog>
  )
}
