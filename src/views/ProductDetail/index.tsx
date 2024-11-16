import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { productId } = useParams()
  console.log(productId)
  return <div>{productId}</div>
}

export default ProductDetail
