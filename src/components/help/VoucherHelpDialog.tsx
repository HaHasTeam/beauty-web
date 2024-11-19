import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function VoucherHelpDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hỗ Trợ</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="space-y-6 pr-4">
            <div className="space-y-2">
              <h3 className="font-medium">Cách Sử Dụng Voucher</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Để có thể áp dụng mã Shopee voucher, bạn hãy chọn nút "Lưu" để lấy voucher và mục ví voucher của bạn
                nhé.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Cách Tìm Voucher</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bạn có thể tìm thấy Shopee Voucher xuyên suốt trang shopee.vn và ứng dụng shopee. Mèo riêng cho bạn nè,
                hãy bắt đầu với những trang chương trình khuyến mãi và trang chủ của shop nhé!
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
