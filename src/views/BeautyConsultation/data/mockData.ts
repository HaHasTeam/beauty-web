import { IFeedbackGeneral } from '@/types/feedback'

import { ConsultationService } from './types'

// Mock data for consultation services
export const consultationServices: ConsultationService[] = [
  {
    id: '1',
    title: 'Skin Analysis & Personalized Routine',
    description:
      'Get a detailed skin analysis and a customized skincare routine based on your unique needs and concerns.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070',
    rating: 4.8,
    reviewCount: 428,
    price: 299000,
    duration: 45,
    expertName: 'Dr. Kim Minh',
    expertTitle: 'Dermatologist',
    expertImageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070',
    category: 'Skincare',
    popular: true,
    type: 'STANDARD',
  },
  {
    id: '2',
    title: 'Tư vấn Trang điểm Chuyên nghiệp',
    description:
      'Học các kỹ thuật trang điểm phù hợp với khuôn mặt, tông da và phong cách sống của bạn cùng chuyên gia trang điểm.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087',
    rating: 4.7,
    reviewCount: 356,
    price: 349000,
    duration: 60,
    expertName: 'Trần Thu Hà',
    expertTitle: 'Chuyên gia Trang điểm',
    expertImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
    category: 'Makeup',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '7',
    title: 'Tư vấn Trang điểm Cơ bản',
    description: 'Tư vấn các kỹ thuật trang điểm cơ bản và sản phẩm phù hợp với làn da của bạn.',
    imageUrl: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=2071',
    rating: 4.6,
    reviewCount: 291,
    price: 199000,
    duration: 40,
    expertName: 'Trần Thu Hà',
    expertTitle: 'Chuyên gia Trang điểm',
    expertImageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
    category: 'Makeup',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '8',
    title: 'Tư vấn Trang điểm Dự tiệc Cao cấp',
    description:
      'Kỹ thuật trang điểm chuyên nghiệp cho các sự kiện đặc biệt, dạ tiệc, và lễ cưới với các sản phẩm cao cấp.',
    imageUrl: 'https://images.unsplash.com/photo-1549236177-97d455975684?q=80&w=1974',
    rating: 4.9,
    reviewCount: 427,
    price: 399000,
    duration: 75,
    expertName: 'Nguyễn Minh Tâm',
    expertTitle: 'Chuyên gia Trang điểm Sự kiện',
    expertImageUrl: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?q=80&w=1964',
    category: 'Makeup',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '9',
    title: 'Tư vấn Trang điểm Dự tiệc Cơ bản',
    description: 'Hướng dẫn trang điểm cho các sự kiện với các kỹ thuật đơn giản và sản phẩm phù hợp ngân sách.',
    imageUrl: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=1974',
    rating: 4.7,
    reviewCount: 312,
    price: 249000,
    duration: 45,
    expertName: 'Nguyễn Minh Tâm',
    expertTitle: 'Chuyên gia Trang điểm Sự kiện',
    expertImageUrl: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?q=80&w=1964',
    category: 'Makeup',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '10',
    title: 'Tư vấn Trang điểm Cá nhân Cao cấp',
    description:
      'Phân tích chuyên sâu về khuôn mặt và tone màu, cùng tư vấn cá nhân hóa về kỹ thuật trang điểm phù hợp với cá tính.',
    imageUrl: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=2069',
    rating: 4.8,
    reviewCount: 215,
    price: 379000,
    duration: 65,
    expertName: 'Lê Quỳnh Anh',
    expertTitle: 'Chuyên gia Trang điểm Cá nhân',
    expertImageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=1974',
    category: 'Makeup',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '11',
    title: 'Tư vấn Trang điểm Hàng ngày',
    description: 'Hướng dẫn các bước trang điểm đơn giản, nhanh chóng phù hợp cho công sở và cuộc sống hàng ngày.',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9759879ecae8?q=80&w=1974',
    rating: 4.6,
    reviewCount: 178,
    price: 189000,
    duration: 35,
    expertName: 'Lê Quỳnh Anh',
    expertTitle: 'Chuyên gia Trang điểm Cá nhân',
    expertImageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=1974',
    category: 'Makeup',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '12',
    title: 'Tư vấn Trang điểm Cô dâu Cao cấp',
    description:
      'Tư vấn chuyên sâu về trang điểm cô dâu, phối hợp màu sắc với váy cưới và hoa cưới, kèm thử nghiệm trang điểm.',
    imageUrl: 'https://images.unsplash.com/photo-151969948830-17cc69065dbf?q=80&w=1974',
    rating: 5.0,
    reviewCount: 156,
    price: 450000,
    duration: 90,
    expertName: 'Vũ Thanh Thảo',
    expertTitle: 'Chuyên gia Trang điểm Cô dâu',
    expertImageUrl: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?q=80&w=2070',
    category: 'Makeup',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '13',
    title: 'Tư vấn Trang điểm Dự Tiệc Cưới',
    description: 'Tư vấn trang điểm phù hợp dành cho khách mời đi đám cưới, phù dâu và các sự kiện quan trọng.',
    imageUrl: 'https://images.unsplash.com/photo-1597226051193-31270fcb6416?q=80&w=1974',
    rating: 4.7,
    reviewCount: 118,
    price: 229000,
    duration: 40,
    expertName: 'Vũ Thanh Thảo',
    expertTitle: 'Chuyên gia Trang điểm Cô dâu',
    expertImageUrl: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?q=80&w=2070',
    category: 'Makeup',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '14',
    title: 'Tư vấn Trang điểm Theo Xu hướng Cao cấp',
    description: 'Cập nhật các xu hướng trang điểm mới nhất và tư vấn cách áp dụng phù hợp với khuôn mặt Á Đông.',
    imageUrl: 'https://images.unsplash.com/photo-1571908598047-2f1adfa9b06d?q=80&w=1974',
    rating: 4.9,
    reviewCount: 204,
    price: 389000,
    duration: 70,
    expertName: 'Hoàng Lan Phương',
    expertTitle: 'Chuyên gia Trang điểm Thời trang',
    expertImageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964',
    category: 'Makeup',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '15',
    title: 'Tư vấn Trang điểm Theo Mùa',
    description:
      'Hướng dẫn điều chỉnh kỹ thuật và sản phẩm trang điểm phù hợp với từng mùa trong năm và tông màu của trang phục.',
    imageUrl: 'https://images.unsplash.com/photo-1542295474-5e78124e5f8e?q=80&w=1974',
    rating: 4.6,
    reviewCount: 167,
    price: 219000,
    duration: 45,
    expertName: 'Hoàng Lan Phương',
    expertTitle: 'Chuyên gia Trang điểm Thời trang',
    expertImageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964',
    category: 'Makeup',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '3',
    title: 'Hair Style & Color Consultation',
    description:
      'Find your perfect hair style and color with expert advice tailored to your face shape, lifestyle, and preferences.',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069',
    rating: 4.6,
    reviewCount: 289,
    price: 279000,
    duration: 40,
    expertName: 'Nguyen Van Tuan',
    expertTitle: 'Hair Stylist',
    expertImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974',
    category: 'Hair',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '4',
    title: 'Nail Art & Care Consultation',
    description: 'Discover the best nail shapes, colors, and care routines for your lifestyle and hand type.',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1974',
    rating: 4.9,
    reviewCount: 213,
    price: 199000,
    duration: 30,
    expertName: 'Le Thuy Tien',
    expertTitle: 'Nail Artist',
    expertImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976',
    category: 'Nails',
    popular: false,
    type: 'STANDARD',
  },
  {
    id: '5',
    title: 'Advanced Anti-Aging Consultation',
    description:
      'Comprehensive analysis and personalized treatment plan to address aging concerns with cutting-edge solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1974',
    rating: 4.9,
    reviewCount: 178,
    price: 499000,
    duration: 60,
    expertName: 'Dr. Pham Hong Hai',
    expertTitle: 'Cosmetic Dermatologist',
    expertImageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964',
    category: 'Anti-aging',
    popular: true,
    type: 'PREMIUM',
  },
  {
    id: '6',
    title: 'Body Care & Wellness Consultation',
    description:
      'Holistic approach to body care including nutrition, exercise, and skincare recommendations for overall wellness.',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070',
    rating: 4.7,
    reviewCount: 156,
    price: 399000,
    duration: 50,
    expertName: 'Hoang Thanh Mai',
    expertTitle: 'Wellness Specialist',
    expertImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964',
    category: 'Wellness',
    popular: false,
    type: 'PREMIUM',
  },
]

// Mock feedback data
export const mockReviewData: IFeedbackGeneral = {
  averageRating: 4.8,
  totalCount: 428,
  rating5Count: 320,
  rating4Count: 80,
  rating3Count: 18,
  rating2Count: 6,
  rating1Count: 4,
}

// Helper function to format currency in VND
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Default image for fallback
export const DEFAULT_IMAGE = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'
