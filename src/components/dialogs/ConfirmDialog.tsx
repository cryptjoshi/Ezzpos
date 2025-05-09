import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ConfirmDialog({open,setOpen,title,description,onConfirm,onCancel}: {open: boolean,setOpen: (open: boolean) => void,title: string,description: string,onConfirm: () => void,onCancel: () => void}) {
   const handleCancel = () => {
    setOpen(false)
    onCancel()
   }
   const handleConfirm = () => {
    setOpen(false)
    onConfirm()
   }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleCancel}>ยกเลิก</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm}>ยืนยัน</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
