import { useQuery } from '@tanstack/react-query'

import { getMyVouchersApi } from '@/network/apis/voucher'

function ProfileVoucher() {
  const { data } = useQuery({
    queryKey: [getMyVouchersApi.queryKey],
    queryFn: getMyVouchersApi.fn,
  })
  console.log('data', data)

  return <div>ProfileVoucher view</div>
}

export default ProfileVoucher
