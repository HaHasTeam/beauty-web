// Type for consultation service
export interface ConsultationService {
  id: string
  title: string
  description: string
  imageUrl: string
  rating: number
  reviewCount: number
  price: number
  duration: number
  expertName: string
  expertTitle: string
  expertImageUrl: string
  category: string
  popular: boolean
  type: 'STANDARD' | 'PREMIUM'
}

// Type for detailed service data
export interface DetailData {
  longDescription: string
  benefits: string[]
  whatToExpect: string[]
  additionalImages: string[]
}

// Type for service detail additions
export type ServiceDetailAdditions = Record<string, DetailData>

// Type for consultant service
export interface ConsultantService {
  id: string
  name: string
  price: number
  duration: number
  type: 'STANDARD' | 'PREMIUM'
}

// Type for consultant information
export interface ConsultantInfo {
  id: string
  name: string
  title: string
  imageUrl: string
  experience: number
  description: string
  expertise: string[]
  priceRange: {
    min: number
    max: number
  }
  services: ConsultantService[]
  rating: number
  reviewCount: number
  location: string
  availability: string[]
}
