import { IconBuildingBank } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { getBanksApi } from '@/network/apis/bank'
import { 
  deleteBankAccountApi, 
  getBankAccountsApi, 
  setDefaultBankAccountApi 
} from '@/network/apis/bank-account'
import { IBankAccount } from '@/network/apis/bank-account/type'
import { IBank } from '@/types/bank'

import LoadingContentLayer from '../loading-icon/LoadingContentLayer'

interface BankAccountListProps {
  accounts: IBankAccount[]
  isLoading: boolean
  onRefresh: () => void
  isFetching: boolean
}

const BankAccountList = ({ accounts, isLoading, onRefresh, isFetching }: BankAccountListProps) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  
  // Fetch banks to get logos
  const { data: banksData } = useQuery({
    queryKey: [getBanksApi.queryKey],
    queryFn: getBanksApi.fn,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  })
  
  const banks = banksData?.data || []
  
  // Function to find bank logo
  const getBankLogo = (bankName: string): string | undefined => {
    // Try to find the bank by name (partial match)
    const bank = banks.find((bank: IBank) => 
      bankName.toLowerCase().includes(bank.shortName.toLowerCase()) || 
      bank.name.toLowerCase().includes(bankName.toLowerCase())
    )
    return bank?.logo
  }
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBankAccountApi.fn,
    onSuccess: () => {
      successToast({
        message: t('wallet.bankAccounts.deleteSuccess', 'Bank account deleted successfully'),
        description: t('wallet.bankAccounts.deleteSuccessDescription', 'Your bank account has been removed from your profile')
      })
      queryClient.invalidateQueries({ queryKey: [getBankAccountsApi.queryKey] })
      onRefresh()
    },
    onError: (error) => {
      console.error('Delete error:', error)
      errorToast({
        message: t('wallet.bankAccounts.deleteError', 'Failed to delete bank account'),
        description: t('wallet.bankAccounts.deleteErrorDescription', 'There was a problem deleting your bank account. Please try again.')
      })
    }
  })
  
  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: setDefaultBankAccountApi.fn,
    onSuccess: () => {
      successToast({
        message: t('wallet.bankAccounts.defaultSuccess', 'Default bank account updated'),
        description: t('wallet.bankAccounts.defaultSuccessDescription', 'Your default bank account has been updated successfully')
      })
      queryClient.invalidateQueries({ queryKey: [getBankAccountsApi.queryKey] })
      onRefresh()
    },
    onError: (error) => {
      console.error('Set default error:', error)
      errorToast({
        message: t('wallet.bankAccounts.defaultError', 'Failed to update default bank account'),
        description: t('wallet.bankAccounts.defaultErrorDescription', 'There was a problem updating your default bank account. Please try again.')
      })
    }
  })
  
  const handleDelete = (accountId: string) => {
    setAccountToDelete(accountId)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = () => {
    if (accountToDelete) {
      deleteMutation.mutate(accountToDelete)
    }
    setDeleteDialogOpen(false)
    setAccountToDelete(null)
  }
  
  const handleSetDefault = (accountId: string) => {
    if (!accounts.find(acc => acc.id === accountId)?.isDefault) {
      setDefaultMutation.mutate(accountId)
    }
  }
  
  if (isLoading) {
    return (
      <div className="relative min-h-[200px]">
        <LoadingContentLayer />
      </div>
    )
  }
  
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <IconBuildingBank size={48} className="text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-800">
          {t('wallet.bankAccounts.noAccounts')}
        </h3>
        <p className="text-gray-500 mt-2 max-w-sm">
          {t('wallet.bankAccounts.addYourFirst')}
        </p>
        <Button 
          variant="outline" 
          className="mt-4 text-primary border-primary/40 hover:bg-primary/5"
          onClick={() => document.querySelector('[value="add"]')?.dispatchEvent(new Event('click'))}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('wallet.bankAccounts.addAccount')}
        </Button>
      </div>
    )
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium">
          {t('wallet.bankAccounts.yourAccounts')} ({accounts.length})
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh} 
          className="text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isFetching && "animate-spin duration-500")}/>
          {t('wallet.bankAccounts.refresh')}
        </Button>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {accounts.map(account => {
          const bankLogo = getBankLogo(account.bankName)
          
          return (
            <div key={account.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {bankLogo ? (
                    <img 
                      src={bankLogo} 
                      alt={account.bankName} 
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <IconBuildingBank className="text-gray-600" />
                  )}
                  <div>
                    <h3 className="font-semibold">{account.bankName}</h3>
                    <p className="text-sm text-gray-500">{account.accountNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {!account.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(account.id)}
                      disabled={setDefaultMutation.isPending}
                      className="text-xs"
                    >
                      {t('wallet.bankAccounts.setAsDefault', 'Đặt mặc định')}
                    </Button>
                  )}
                  
                  {account.isDefault && (
                    <Badge variant="outline" className="bg-primary/5 text-primary">
                      <Check className="h-3 w-3 mr-1" />
                      {t('wallet.bankAccounts.default', 'Mặc định')}
                    </Badge>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    onClick={() => handleDelete(account.id)}
                    disabled={deleteMutation.isPending}
                    title={t('wallet.bankAccounts.deleteAccount', 'Xóa tài khoản')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-700">{t('wallet.bankAccounts.accountName')}:</span> {account.accountName}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('wallet.bankAccounts.deleteConfirmTitle', 'Xác nhận xóa tài khoản')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('wallet.bankAccounts.deleteConfirmDescription', 'Bạn có chắc chắn muốn xóa tài khoản ngân hàng này? Hành động này không thể hoàn tác.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('general.cancel', 'Hủy')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t('general.delete', 'Xóa')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default BankAccountList 