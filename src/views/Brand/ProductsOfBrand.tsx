import SearchProducts from './SearchProducts'

type Props = {
  brandId?: string
}

const ProductsOfBrand = ({ brandId }: Props) => {
  return <SearchProducts brandId={brandId} />
}

export default ProductsOfBrand
