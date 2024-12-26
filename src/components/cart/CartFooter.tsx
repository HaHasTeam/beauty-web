import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Ticket, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getMyCartApi, removeAllCartItemApi, removeMultipleCartItemApi } from '@/network/apis/cart'
import { ProjectInformationEnum } from '@/types/enum'

import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import VoucherDialog from '../voucher/VoucherDialog'

interface CartFooterProps {
  cartItemCountAll: number
  cartItemCount: number
  onCheckAll: () => void
  isAllSelected: boolean
  totalPrice: number
  savedPrice: number
  chosenVoucher: string
  selectedCartItems: string[]
  setChosenVoucher: (value: string) => void
  setSelectedCartItems: Dispatch<SetStateAction<string[]>>
}
export default function CartFooter({
  cartItemCountAll,
  cartItemCount,
  onCheckAll,
  isAllSelected,
  totalPrice,
  savedPrice,
  chosenVoucher,
  setChosenVoucher,
  selectedCartItems,
  setSelectedCartItems,
}: CartFooterProps) {
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const [openConfirmDeleteAllCartDialog, setOpenConfirmDeleteAllCartDialog] = useState(false)
  const [openConfirmDeleteMultipleCartDialog, setOpenConfirmDeleteMultipleCartDialog] = useState(false)

  const { mutateAsync: removeAllCartItemFn } = useMutation({
    mutationKey: [removeAllCartItemApi.mutationKey],
    mutationFn: removeAllCartItemApi.fn,
    onSuccess: () => {
      successToast({
        message: t('delete.cart.success', { amount: t('delete.cart.All') }),
      })
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
    },
  })
  const { mutateAsync: removeMultipleCartItemFn } = useMutation({
    mutationKey: [removeMultipleCartItemApi.mutationKey],
    mutationFn: removeMultipleCartItemApi.fn,
    onSuccess: () => {
      successToast({
        message: t('delete.cart.success', { amount: selectedCartItems?.length }),
      })
      setSelectedCartItems((prevSelectedCartItems) =>
        prevSelectedCartItems.filter((itemId) => !selectedCartItems.includes(itemId)),
      )
      queryClient.invalidateQueries({
        queryKey: [getMyCartApi.queryKey],
      })
    },
  })

  async function handleRemoveAllCartItem() {
    try {
      await removeAllCartItemFn()
    } catch (error) {
      console.log(error)
      handleServerError({
        error,
      })
    }
  }
  async function handleRemoveMultipleCartItem() {
    try {
      if (selectedCartItems && selectedCartItems?.length > 0) {
        await removeMultipleCartItemFn({ itemIds: selectedCartItems })
      }
    } catch (error) {
      console.log(error)
      handleServerError({
        error,
      })
    }
  }
  console.log(selectedCartItems)
  return (
    <>
      <div className="w-full sticky bottom-0 left-0 right-0 border-t bg-secondary rounded-tl-sm rounded-tr-sm">
        <div className="w-full px-4 py-3 space-y-2 lg:text-base md:text-sm sm:text-xs text-xs">
          {/* Voucher Section */}
          <div className="flex items-center gap-4 justify-end border-b border-primary/20 py-1">
            <div className="flex items-center gap-2">
              <Ticket className="text-red-500" />
              <span>
                {ProjectInformationEnum.name} {t('cart.voucher')}
              </span>
            </div>
            <VoucherDialog
              triggerComponent={
                <Button variant="link" className="text-blue-500 h-auto p-0 hover:no-underline">
                  {chosenVoucher ? chosenVoucher : t('cart.selectVoucher')}
                </Button>
              }
              onConfirmVoucher={setChosenVoucher}
              selectedCartItems={selectedCartItems}
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
            {/* Left Section */}
            <div className="w-full md:w-1/3 justify-start flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox checked={isAllSelected} onClick={onCheckAll} id="select-all" />
                <label htmlFor="select-all" className="text-sm">
                  {t('cart.selectAll')} ({cartItemCountAll})
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="destructive" onClick={() => setOpenConfirmDeleteAllCartDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span>{t('cart.removeAll')}</span>
                </Button>
                {selectedCartItems && selectedCartItems?.length > 0 && (
                  <Trash2
                    className="text-destructive w-7 h-7 cursor-pointer transition-colors hover:text-red-500"
                    onClick={() => setOpenConfirmDeleteMultipleCartDialog(true)}
                  />
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-2/3 flex items-center gap-6">
              {/* Total Section */}
              <div className="w-full justify-end flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {t('cart.total')} ({cartItemCount} {t('cart.products')} ):
                    </span>
                    <span className="text-xl font-medium text-red-500">
                      {t('productCard.price', { price: totalPrice })}
                    </span>
                  </div>
                  <div className="text-sm text-end">
                    {t('cart.saved')}:
                    <span className="text-sm text-red-500"> {t('productCard.price', { price: savedPrice })}</span>
                  </div>
                </div>
                <Link
                  to={configs.routes.checkout}
                  className="text-destructive-foreground px-8 py-2 rounded-lg bg-destructive hover:bg-destructive/80"
                >
                  {t('cart.buy')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationDialog
        open={openConfirmDeleteAllCartDialog}
        onOpenChange={setOpenConfirmDeleteAllCartDialog}
        onConfirm={() => {
          // Handle delete confirmation
          handleRemoveAllCartItem()
          setOpenConfirmDeleteAllCartDialog(false)
        }}
        item="cart"
        title={t('delete.cart.title', { amount: t('delete.cart.all') })}
        description={t('delete.cart.description', { amount: t('delete.cart.all') })}
      />
      <DeleteConfirmationDialog
        open={openConfirmDeleteMultipleCartDialog}
        onOpenChange={setOpenConfirmDeleteMultipleCartDialog}
        onConfirm={() => {
          // Handle delete confirmation
          handleRemoveMultipleCartItem()
          setOpenConfirmDeleteMultipleCartDialog(false)
        }}
        item="cart"
        title={t('delete.cart.title', { amount: selectedCartItems?.length })}
        description={t('delete.cart.description', { amount: selectedCartItems?.length })}
      />
    </>
  )
}
