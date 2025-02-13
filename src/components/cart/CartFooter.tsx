import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronDown, Pen, Ticket, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import configs from '@/config'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { getMyCartApi, removeAllCartItemApi, removeMultipleCartItemApi } from '@/network/apis/cart'
import { ICartByBrand } from '@/types/cart'
import { DiscountTypeEnum, ProjectInformationEnum } from '@/types/enum'
import { IPlatformBestVoucher, TVoucher } from '@/types/voucher'

import DeleteConfirmationDialog from '../dialog/DeleteConfirmationDialog'
import WarningDialog from '../dialog/WarningDialog'
import TotalPriceDetail from '../price/TotalPriceDetail'
import VoucherDialog from '../voucher/VoucherDialog'

interface CartFooterProps {
  cartItemCountAll: number
  cartItemCount: number
  onCheckAll: () => void
  isAllSelected: boolean
  selectedCartItems: string[]
  setSelectedCartItems: Dispatch<SetStateAction<string[]>>
  totalProductDiscount: number
  totalVoucherDiscount: number
  totalOriginalPrice: number
  totalFinalPrice: number
  savedPrice: number
  platformChosenVoucher: TVoucher | null
  setPlatformChosenVoucher: Dispatch<SetStateAction<TVoucher | null>>
  platformVoucherDiscount: number
  cartByBrand: ICartByBrand
  bestPlatformVoucher: IPlatformBestVoucher | null
}
export default function CartFooter({
  cartItemCountAll,
  cartItemCount,
  onCheckAll,
  isAllSelected,
  totalOriginalPrice,
  selectedCartItems,
  setSelectedCartItems,
  totalProductDiscount,
  totalVoucherDiscount,
  savedPrice,
  platformChosenVoucher,
  setPlatformChosenVoucher,
  totalFinalPrice,
  platformVoucherDiscount,
  cartByBrand,
  bestPlatformVoucher,
}: CartFooterProps) {
  const { t } = useTranslation()
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [openConfirmDeleteAllCartDialog, setOpenConfirmDeleteAllCartDialog] = useState(false)
  const [openConfirmDeleteMultipleCartDialog, setOpenConfirmDeleteMultipleCartDialog] = useState(false)
  const [openWarningDialog, setOpenWarningDialog] = useState(false)
  const insufficientStockItems = useMemo(() => {
    return Object.values(cartByBrand)
      .flat()
      .filter(
        (cartItem) =>
          selectedCartItems.includes(cartItem.id) &&
          cartItem.quantity &&
          cartItem.productClassification?.quantity !== undefined &&
          cartItem.quantity > cartItem.productClassification.quantity,
      )
  }, [cartByBrand, selectedCartItems])
  console.log(insufficientStockItems)
  const soldOutItems = useMemo(() => {
    return Object.values(cartByBrand)
      .flat()
      .filter(
        (cartItem) =>
          selectedCartItems.includes(cartItem.id) &&
          cartItem.quantity &&
          cartItem.productClassification?.quantity !== undefined &&
          cartItem.productClassification.quantity === 0,
      )
  }, [cartByBrand, selectedCartItems])
  // handle remove cart items api starts
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
  // handle remove cart items api ends
  // handle remove cart items function starts
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
  // handle remove cart items function ends

  // handle checkout button
  const handleCheckout = () => {
    if (selectedCartItems && selectedCartItems?.length > 0) {
      if (insufficientStockItems?.length > 0 || soldOutItems?.length > 0) {
        setOpenWarningDialog(true)
      } else {
        navigate(configs.routes.checkout)
      }
    } else setOpenWarningDialog(true)
  }
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
                  {platformChosenVoucher ? (
                    platformChosenVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                    platformChosenVoucher?.discountValue ? (
                      <div className="flex gap-2 items-center">
                        {t('voucher.discountAmount', { amount: platformVoucherDiscount })}
                        <Pen />
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {t('voucher.discountAmount', { amount: platformVoucherDiscount })}
                        <Pen />
                      </div>
                    )
                  ) : bestPlatformVoucher?.bestVoucher ? (
                    bestPlatformVoucher?.bestVoucher?.discountType === DiscountTypeEnum.AMOUNT &&
                    bestPlatformVoucher?.bestVoucher?.discountValue ? (
                      t('voucher.bestDiscountAmountDisplay', {
                        amount: bestPlatformVoucher?.bestVoucher?.discountValue,
                      })
                    ) : (
                      t('voucher.bestDiscountPercentageDisplay', {
                        percentage: bestPlatformVoucher?.bestVoucher?.discountValue * 100,
                      })
                    )
                  ) : (
                    t('cart.selectVoucher')
                  )}
                </Button>
              }
              bestPlatFormVoucher={bestPlatformVoucher}
              onConfirmVoucher={setPlatformChosenVoucher}
              selectedCartItems={selectedCartItems}
              chosenPlatformVoucher={platformChosenVoucher}
              cartByBrand={cartByBrand}
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
                  <span>
                    {t('cart.removeAll')} ({cartItemCountAll})
                  </span>
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
                    <span className="text-base sm:text-lg">
                      {t('cart.total')} ({cartItemCount} {t('cart.products')} ):
                    </span>
                    <div className="flex items-end">
                      <span className="text-xl font-medium text-red-500">
                        {t('productCard.price', { price: totalFinalPrice })}
                      </span>
                      {savedPrice && savedPrice > 0 ? (
                        <TotalPriceDetail
                          triggerComponent={<ChevronDown size={16} />}
                          totalProductDiscount={totalProductDiscount}
                          totalBrandDiscount={totalVoucherDiscount}
                          totalPlatformDiscount={platformVoucherDiscount}
                          totalPayment={totalFinalPrice}
                          totalSavings={savedPrice}
                          totalProductCost={totalOriginalPrice}
                        />
                      ) : null}
                    </div>
                  </div>
                  {savedPrice && savedPrice > 0 ? (
                    <div className="text-sm text-end">
                      {t('cart.saved')}:
                      <span className="text-sm text-red-500"> {t('productCard.price', { price: savedPrice })}</span>
                    </div>
                  ) : null}
                </div>
                <Button
                  onClick={() => handleCheckout()}
                  className="text-destructive-foreground px-8 py-2 rounded-lg bg-destructive hover:bg-destructive/80"
                >
                  {t('cart.buy')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* delete cart items modals */}
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
      {/* checkout warning dialog */}
      <WarningDialog
        open={openWarningDialog}
        onOpenChange={setOpenWarningDialog}
        onConfirm={() => {
          setOpenWarningDialog(false)
        }}
        item="cart"
        title={
          insufficientStockItems.length > 0
            ? t('warning.cart.insufficientStockTitle')
            : soldOutItems?.length > 0
              ? t('warning.cart.insufficientStockTitle')
              : t('warning.cart.title')
        }
        description={
          insufficientStockItems.length > 0
            ? t('warning.cart.insufficientStockDescription', {
                products: insufficientStockItems
                  .map(
                    (item) =>
                      item.productClassification?.preOrderProduct?.product?.name ??
                      item.productClassification?.productDiscount?.product?.name ??
                      item.productClassification?.product?.name,
                  )
                  .join(', '),
              })
            : soldOutItems?.length > 0
              ? t('warning.cart.insufficientStockDescription', {
                  products: insufficientStockItems
                    .map(
                      (item) =>
                        item.productClassification?.preOrderProduct?.product?.name ??
                        item.productClassification?.productDiscount?.product?.name ??
                        item.productClassification?.product?.name,
                    )
                    .join(', '),
                })
              : t('warning.cart.description')
        }
      />
    </>
  )
}
