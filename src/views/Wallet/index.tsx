import { useQuery } from '@tanstack/react-query'
import { Info, MoreHorizontal, Wallet, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { getMyWalletApi } from '@/network/apis/wallet'

import EmptyWallet from './EmptyWallet'
import TopUpModal from './TopUpModal'
import TransactionList from './TransactionList'

export default function BalanceOverview() {
  const { t } = useTranslation()
  const { data: myWallet } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn,
  })

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
                Balance
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TransactionList />
    </div>
  )
}
