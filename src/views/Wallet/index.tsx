import { IconBuildingBank } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Info, Wallet } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BankAccountDialog from '@/components/wallet/BankAccountDialog'
import WithdrawModal from '@/components/wallet/WithdrawModal'
import { getBanksApi } from '@/network/apis/bank'
import { getBankAccountsApi } from '@/network/apis/bank-account'
import { getMyWalletApi } from '@/network/apis/wallet'

import EmptyWallet from './EmptyWallet'
import TopUpModal from './TopUpModal'
import TransactionDetail from './TransactionDetail'
import WithdrawalRequests from './WithdrawalRequests'

export default function BalanceOverview() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Define the tab query state with nuqs
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'transactions' })
  
  // Handle tab change - clear other URL params
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    
    // Clear all other query params by navigating to the current path with only the tab param
    navigate({ pathname: location.pathname, search: `?tab=${value}` })
  }

  const { data: myWallet } = useQuery({
    queryKey: [getMyWalletApi.queryKey],
    queryFn: getMyWalletApi.fn,
  })

  // Fetch bank accounts
  const { data: bankAccountsData } = useQuery({
    queryKey: [getBankAccountsApi.queryKey],
    queryFn: getBankAccountsApi.fn,
  })
  
  // Fetch banks to get logos
  const { data: banksData } = useQuery({
    queryKey: [getBanksApi.queryKey],
    queryFn: getBanksApi.fn,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })
  
  const bankAccounts = bankAccountsData?.data || []
  const banks = banksData?.data || []
  
  // Find default bank account
  const defaultBankAccount = bankAccounts.find(account => account.isDefault)
  
  // Function to find bank logo
  const getBankLogo = (bankName: string): string | undefined => {
    // Try to find the bank by name (partial match)
    const bank = banks.find((bank) => 
      bankName.toLowerCase().includes(bank.shortName.toLowerCase()) || 
      bank.name.toLowerCase().includes(bankName.toLowerCase())
    )
    return bank?.logo
  }
  
  // Mask account number for security
  const maskAccountNumber = (accountNumber: string): string => {
    if (!accountNumber || accountNumber.length <= 4) return accountNumber
    const lastFour = accountNumber.slice(-4)
    const maskedPart = '*'.repeat(accountNumber.length - 4)
    return `${maskedPart}${lastFour}`
  }

  if (!myWallet) {
    return <EmptyWallet />
  }
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className="text-gray-600 text-lg font-normal">
            {t('wallet.balanceOverview', 'Balance Overview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                {t('wallet.balance', 'Balance')}
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">
                  {t('format.currency', {
                    value: myWallet.data.balance ?? 0,
                  })}
                </span>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      {t('walletTerm.withdraw', 'Withdraw')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[70%] overflow-auto">
                    <WithdrawModal />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-primary hover:bg-primary/70 text-white">
                      <Wallet className="h-5 w-5" />
                      {t('wallet.topUp', 'Top Up')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl max-h-[70%] overflow-auto">
                    <TopUpModal />
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Display available balance */}
              {myWallet.data.availableBalance !== undefined && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-gray-600 text-sm">
                    {t('wallet.availableBalance', 'Available Balance')}:
                  </span>
                  <span className="text-gray-800 font-medium">
                    {t('format.currency', {
                      value: myWallet.data.availableBalance ?? 0,
                    })}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-sm">
                          {t('wallet.availableBalanceHint', 'Available balance is the amount you can currently withdraw, excluding any pending transactions.')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            <div className='flex-1 flex justify-end'>
            <div className="max-w-[400px]">
              <div className="flex items-center justify-between mb-3 gap-4">
                <span className="text-gray-700 font-medium text-wrap">{t('wallet.myBankAccount', 'My Bank Account')}</span>
                <BankAccountDialog />
              </div>
              
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                {defaultBankAccount ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {getBankLogo(defaultBankAccount.bankName) ? (
                          <img 
                            src={getBankLogo(defaultBankAccount.bankName)} 
                            alt={defaultBankAccount.bankName}
                            className="h-5 w-5 object-contain" 
                          />
                        ) : (
                          <IconBuildingBank size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{defaultBankAccount.bankName}</div>
                        <div className="text-xs text-gray-500">{maskAccountNumber(defaultBankAccount.accountNumber)}</div>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                      {t('wallet.bankAccounts.default', 'Mặc định')}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-gray-500 text-sm">{t('wallet.bankAccounts.noDefaultAccount', 'Chưa có tài khoản mặc định')}</div>
                    <BankAccountDialog />
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
              
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="transactions">{t('wallet.tabs.transactions', 'Transactions')}</TabsTrigger>
          <TabsTrigger value="withdrawal-requests">{t('wallet.tabs.withdrawalRequests', 'Withdrawal Requests')}</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <TransactionDetail />
        </TabsContent>
        <TabsContent value="withdrawal-requests">
          <WithdrawalRequests />
        </TabsContent>
      </Tabs>
    </div>
  )
}
