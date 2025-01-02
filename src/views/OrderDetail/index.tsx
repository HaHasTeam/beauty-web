import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { orderId } = useParams()

  return <div>{orderId}</div>
}

export default OrderDetail
