import { useQuery } from '@tanstack/react-query'
import { Flag, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFilteredReports } from '@/network/apis/report'

import TopUpModal from './Modal'

export default function BalanceOverview() {
  // const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()
  const [isOpened, setIsOpened] = useState(false)
  const { data: reportList } = useQuery({
    queryKey: [getFilteredReports.queryKey, {}],
    queryFn: getFilteredReports.fn,
  })

  const transactions = [
    {
      date: '2021-07-01',
      orderNumber: '210305JHR7HSA9',
      description: 'suettad | Kungfu Pao',
      amount: '+26.10',
      status: 'Completed',
    },
    {
      date: '2021-07-01',
      orderNumber: '210701QVKSFC5A',
      description: 'drcsell_unt_sg_official_cb_1 | Cookies',
      amount: '+4.87',
      status: 'Completed',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600 text-lg font-normal">Report Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  Total Report
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">
                    {t('format.number', {
                      value: reportList?.data.items.length ?? 0,
                    })}
                  </span>
                </div>
              </div>
              <Dialog open={isOpened} onOpenChange={setIsOpened}>
                <DialogTrigger>
                  <Button className="bg-primary hover:bg-primary/70 text-white">
                    <Flag className="h-5 w-5" />
                    New Report
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[70%] overflow-auto">
                  <DialogTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    New Report
                  </DialogTitle>
                  <DialogDescription>
                    <div className="text-gray-600 text-sm">Please fill in the form below to report a new issue.</div>
                  </DialogDescription>
                  <TopUpModal
                    setOpen={(open: boolean) => {
                      setIsOpened(open)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600 text-lg font-normal">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="order-income">Order Income</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="refund">Refund from Order</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
              <TabsTrigger value="balance-payment">Seller Balance Payment</TabsTrigger>
              <TabsTrigger value="ads-credit">Ads Credit Auto Top-Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="grid grid-cols-4 text-gray-500 text-sm py-2">
              <div>Date</div>
              <div>Type | Description</div>
              <div>Amount</div>
              <div>Status</div>
            </div>

            {transactions.map((transaction, index) => (
              <div key={index} className="grid grid-cols-4 items-center py-2">
                <div className="text-gray-600">{transaction.date}</div>
                <div>
                  <div className="text-gray-600">Income from Order {transaction.orderNumber}</div>
                  <div className="text-gray-400 text-sm">{transaction.description}</div>
                </div>
                <div className="text-emerald-500">{transaction.amount}</div>
                <div className="text-gray-400">{transaction.status}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                ‹
              </Button>
              <span className="px-3 py-1 border rounded">1</span>
              <Button variant="outline" size="sm">
                ›
              </Button>
            </div>
            <Select defaultValue="20">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
