import { IClassification } from '@/types/classification'
import { StatusEnum } from '@/types/enum'
import { IProductClassification } from '@/types/product'

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
  const isTitleMatch = productClassifications?.some((item) => item?.title !== productClassification?.title)

  const isStatusActive = productClassifications?.some((item) => item?.status !== StatusEnum.ACTIVE)

  return isTitleMatch && isStatusActive
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

  return !checkCurrentProductClassificationHide(productClassification, productClassifications) && isQuantityPositive
}

/**
 * Checks if at least one classification in the list is ACTIVE.
 * @param classifications - List of product classifications to check.
 * @returns True if at least one classification is ACTIVE; false otherwise.
 */
export function hasActiveClassification(classifications: IClassification[] | []): boolean {
  if (!classifications || classifications.length === 0) return false

  return classifications.some((classification) => classification?.status === StatusEnum.ACTIVE)
}

/**
 * Checks if at least one classification in the list has a quantity greater than 0.
 * @param classifications - List of product classifications to check.
 * @returns True if at least one classification has quantity > 0; false otherwise.
 */
export function hasClassificationWithQuantity(classifications: IClassification[] | []): boolean {
  if (!classifications || classifications.length === 0) return false

  return classifications.some((classification) => (classification?.quantity ?? 0) > 0)
}

/**
 * Finds the product classification with the minimum price.
 * @param {Array} classifications - List of product classifications.
 * @returns {Object|null} The classification with the minimum price, or null if the list is empty.
 */
export const getCheapestClassification = (classifications: IProductClassification[]) => {
  if (!classifications || classifications.length === 0) return null

  return classifications.reduce(
    (cheapest, current) => {
      // Ensure both current and cheapest have a defined price before comparison
      if (current?.price !== undefined && (cheapest?.price === undefined || current.price < cheapest.price)) {
        return current
      }
      return cheapest
    },
    null as IProductClassification | null,
  )
}
