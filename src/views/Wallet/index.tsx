import {  useQuery } from '@tanstack/react-query'
import { Info, MoreHorizontal, Wallet, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMyWalletApi } from '@/network/apis/wallet'

import EmptyWallet from './EmptyWallet'
import TopUpModal from './TopUpModal'

export default function BalanceOverview() {
  // const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()
  const { data: myWallet,  } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn,
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

  if (!myWallet) {
    return <EmptyWallet />
  }
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600 text-lg font-normal">Balance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                Seller Balance
                <span className="text-gray-400 text-sm">Automatic</span>
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  {t('format.currency', {
                    value: myWallet.data.balance ?? 0,
                  })}
                </span>
                <Button className="bg-red-500 hover:bg-red-600 text-white">Withdraw</Button>
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-primary hover:bg-primary/70 text-white">
                      <Wallet className="h-5 w-5" />
                      Top Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[70%] overflow-auto">
                    <TopUpModal />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">My Bank Account</span>
                <Button variant="ghost" className="text-blue-500 hover:text-blue-600">
                  More <span className="ml-1">›</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-gray-600">DBS BANK / POSB BANK</span>
                <Badge variant="outline" className="text-emerald-500 bg-emerald-50">
                  Default
                </Badge>
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                <span className="text-gray-400">€24€</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-600 text-lg font-normal">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Select defaultValue="16/06/2021 - 16/07/2021">
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16/06/2021 - 16/07/2021">16/06/2021 - 16/07/2021</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Export</Button>
          </div>

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
