interface ProductClassificationComboboxProps {
  onSelect: (classification: { id: string; name: string }) => void
  placeholder: string
}

const ProductClassificationCombobox = ({ onSelect, placeholder }: ProductClassificationComboboxProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectProduct = (classification: { id: string; name: string }) => {
    onSelect(classification)
    console.log(placeholder)
  }
  return <div onClick={() => handleSelectProduct}>ProductClassificationCombobox</div>
}

export default ProductClassificationCombobox
