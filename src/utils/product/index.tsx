import { IClassification } from '@/types/classification'
import { StatusEnum } from '@/types/enum'

/**
 * Checks if the product classification is active.
 * @param productClassification - The current product classification to check.
 * @param productClassifications - List of product classifications to compare against.
 * @returns True if the product classification is active; false otherwise.
 */
export function checkCurrentProductClassificationHide(
  productClassification: IClassification | null,
  productClassifications: IClassification[] | [],
): boolean {
  if (!productClassification || !productClassifications) return false

  // Check if the title exists in productClassifications or if quantity > 0
  const isTitleMatch = productClassifications?.some((item) => item?.title === productClassification?.title)

  const isStatusActive = productClassifications?.some((item) => item?.status === StatusEnum.ACTIVE)

  return isTitleMatch || isStatusActive
}

/**
 * Checks if the product classification is active.
 * @param productClassification - The current product classification to check.
 * @param productClassifications - List of product classifications to compare against.
 * @returns True if the product classification is active; false otherwise.
 */
export function checkCurrentProductClassificationActive(
  productClassification: IClassification | null,
  productClassifications: IClassification[] | [],
): boolean {
  if (!productClassification || !productClassifications) return false

  // Check if the title exists in productClassifications or status is active or if quantity > 0
  const isQuantityPositive = productClassification?.quantity > 0

  return checkCurrentProductClassificationHide(productClassification, productClassifications) || isQuantityPositive
}
