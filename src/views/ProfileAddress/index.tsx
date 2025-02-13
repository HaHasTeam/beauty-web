import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AddAddressDialog from '@/components/address/AddAddressDialog'
import AddressItem from '@/components/address/AddressItem'
import Empty from '@/components/empty/Empty'
import { Button } from '@/components/ui/button'
import { getMyAddressesApi } from '@/network/apis/address'
import { IAddress } from '@/types/address'

export default function ProfileAddress() {
  const { t } = useTranslation()
  const [myAddresses, setMyAddresses] = useState<IAddress[]>([])

  const { data: useMyAddressesData, isFetching: isGettingAddress } = useQuery({
    queryKey: [getMyAddressesApi.queryKey],
    queryFn: getMyAddressesApi.fn,
  })

  useEffect(() => {
    if (useMyAddressesData?.data) {
      setMyAddresses(useMyAddressesData?.data)
    }
  }, [useMyAddressesData])
  return (
    <div>
      <main className="flex-1 p-6">
        <div>
          <h3 className="text-2xl font-semibold">{t('address.profileAddress')}</h3>
          <p className="text-sm text-gray-500">{t('address.profileAddressDescription')}</p>
        </div>
        <div className="w-full flex justify-end">
          <AddAddressDialog
            triggerComponent={
              <Button className="text-primary border-primary hover:text-primary hover:bg-primary/15" variant="outline">
                <PlusCircle /> {t('address.addNewAddress')}
              </Button>
            }
          />
        </div>
        <div className="space-y-4">
          {/* Address List */}
          {!isGettingAddress && myAddresses && myAddresses?.length > 0 && (
            <div className="py-2 space-y-4 w-full">
              {/* <RadioGroup className="w-full" value={selectedAddressId} onValueChange={setSelectedAddress}> */}
              <div className="space-y-3 w-full">
                {myAddresses?.map((address) => (
                  <div key={address?.id} className="w-full">
                    <AddressItem address={address} isShowRadioItem={false} />
                  </div>
                ))}
              </div>
              {/* </RadioGroup> */}
            </div>
          )}
          {!isGettingAddress && (!myAddresses || myAddresses?.length === 0) && (
            <Empty title={t('empty.address.title')} description={t('empty.address.description')} />
          )}
        </div>
      </main>
    </div>
  )
}
