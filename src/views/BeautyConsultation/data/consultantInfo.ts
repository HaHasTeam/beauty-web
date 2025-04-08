import { ConsultantInfo } from './types'

// Detailed information about makeup consultants and their services
export const consultantInfo: ConsultantInfo[] = [
  {
    id: '1',
    name: 'Trần Thu Hà',
    title: 'Chuyên gia Trang điểm',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961',
    experience: 7,
    description: 'Trần Thu Hà là chuyên gia trang điểm với hơn 7 năm kinh nghiệm làm việc tại các show thời trang và sự kiện lớn. Cô nổi tiếng với phong cách trang điểm tự nhiên nhưng vẫn tôn lên vẻ đẹp riêng của từng khách hàng.',
    expertise: ['Trang điểm tự nhiên', 'Trang điểm Hàn Quốc', 'Trang điểm cho da dầu'],
    priceRange: {
      min: 199000,
      max: 349000
    },
    services: [
      {
        id: '2',
        name: 'Tư vấn Trang điểm Chuyên nghiệp',
        price: 349000,
        duration: 60,
        type: 'PREMIUM'
      },
      {
        id: '7',
        name: 'Tư vấn Trang điểm Cơ bản',
        price: 199000,
        duration: 40,
        type: 'STANDARD'
      }
    ],
    rating: 4.7,
    reviewCount: 356,
    location: 'Quận 1, TP. Hồ Chí Minh',
    availability: ['Thứ 2 - Thứ 6: 9:00 - 20:00', 'Thứ 7, Chủ nhật: 10:00 - 18:00']
  },
  {
    id: '2',
    name: 'Nguyễn Minh Tâm',
    title: 'Chuyên gia Trang điểm Sự kiện',
    imageUrl: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?q=80&w=1964',
    experience: 9,
    description: 'Nguyễn Minh Tâm là chuyên gia trang điểm sự kiện với hơn 9 năm kinh nghiệm, đặc biệt chuyên sâu về trang điểm dự tiệc và sự kiện đặc biệt. Anh đã trang điểm cho nhiều nghệ sĩ và người nổi tiếng tại các sự kiện lớn.',
    expertise: ['Trang điểm dự tiệc', 'Trang điểm thảm đỏ', 'Trang điểm bền màu'],
    priceRange: {
      min: 249000,
      max: 399000
    },
    services: [
      {
        id: '8',
        name: 'Tư vấn Trang điểm Dự tiệc Cao cấp',
        price: 399000,
        duration: 75,
        type: 'PREMIUM'
      },
      {
        id: '9',
        name: 'Tư vấn Trang điểm Dự tiệc Cơ bản',
        price: 249000,
        duration: 45,
        type: 'STANDARD'
      }
    ],
    rating: 4.9,
    reviewCount: 427,
    location: 'Quận 3, TP. Hồ Chí Minh',
    availability: ['Thứ 3 - Thứ 7: 10:00 - 21:00', 'Chủ nhật: Theo lịch hẹn']
  },
  {
    id: '3',
    name: 'Lê Quỳnh Anh',
    title: 'Chuyên gia Trang điểm Cá nhân',
    imageUrl: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?q=80&w=1974',
    experience: 5,
    description: 'Lê Quỳnh Anh chuyên về tư vấn trang điểm cá nhân hóa, giúp mỗi khách hàng tìm ra phong cách trang điểm phù hợp nhất với đặc điểm khuôn mặt và cá tính riêng. Cô từng tu nghiệp tại Hàn Quốc và Nhật Bản.',
    expertise: ['Trang điểm theo kiểu khuôn mặt', 'Trang điểm hàng ngày', 'Trang điểm cho làn da nhạy cảm'],
    priceRange: {
      min: 189000,
      max: 379000
    },
    services: [
      {
        id: '10',
        name: 'Tư vấn Trang điểm Cá nhân Cao cấp',
        price: 379000,
        duration: 65,
        type: 'PREMIUM'
      },
      {
        id: '11',
        name: 'Tư vấn Trang điểm Hàng ngày',
        price: 189000,
        duration: 35,
        type: 'STANDARD'
      }
    ],
    rating: 4.8,
    reviewCount: 215,
    location: 'Quận 2, TP. Hồ Chí Minh',
    availability: ['Thứ 2 - Thứ 6: 8:00 - 19:00', 'Thứ 7: 9:00 - 16:00']
  },
  {
    id: '4',
    name: 'Vũ Thanh Thảo',
    title: 'Chuyên gia Trang điểm Cô dâu',
    imageUrl: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?q=80&w=2070',
    experience: 10,
    description: 'Vũ Thanh Thảo là chuyên gia trang điểm cô dâu với 10 năm kinh nghiệm, đã giúp hàng trăm cô dâu tỏa sáng trong ngày trọng đại. Cô đặc biệt giỏi trong việc tạo ra vẻ đẹp rạng rỡ nhưng vẫn giữ được nét tự nhiên.',
    expertise: ['Trang điểm cô dâu', 'Trang điểm chụp ảnh cưới', 'Trang điểm theo chủ đề đám cưới'],
    priceRange: {
      min: 229000,
      max: 450000
    },
    services: [
      {
        id: '12',
        name: 'Tư vấn Trang điểm Cô dâu Cao cấp',
        price: 450000,
        duration: 90,
        type: 'PREMIUM'
      },
      {
        id: '13',
        name: 'Tư vấn Trang điểm Dự Tiệc Cưới',
        price: 229000,
        duration: 40,
        type: 'STANDARD'
      }
    ],
    rating: 5.0,
    reviewCount: 156,
    location: 'Quận 7, TP. Hồ Chí Minh',
    availability: ['Thứ 2 - Chủ nhật: 8:00 - 20:00', 'Lịch linh hoạt theo yêu cầu cô dâu']
  },
  {
    id: '5',
    name: 'Hoàng Lan Phương',
    title: 'Chuyên gia Trang điểm Thời trang',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964',
    experience: 8,
    description: 'Hoàng Lan Phương là chuyên gia trang điểm thời trang với 8 năm kinh nghiệm làm việc tại các sàn catwalk, tạp chí và chiến dịch quảng cáo. Cô luôn cập nhật xu hướng mới nhất và có khả năng điều chỉnh cho phù hợp với người Á Đông.',
    expertise: ['Trang điểm theo xu hướng', 'Trang điểm nghệ thuật', 'Trang điểm theo mùa'],
    priceRange: {
      min: 219000,
      max: 389000
    },
    services: [
      {
        id: '14',
        name: 'Tư vấn Trang điểm Theo Xu hướng Cao cấp',
        price: 389000,
        duration: 70,
        type: 'PREMIUM'
      },
      {
        id: '15',
        name: 'Tư vấn Trang điểm Theo Mùa',
        price: 219000,
        duration: 45,
        type: 'STANDARD'
      }
    ],
    rating: 4.9,
    reviewCount: 204,
    location: 'Quận 1, TP. Hồ Chí Minh',
    availability: ['Thứ 3 - Thứ 7: 10:00 - 20:00', 'Các ngày khác: Theo lịch hẹn']
  }
]

// Tóm tắt khoảng giá dịch vụ
export const servicePriceRanges = {
  standard: {
    min: 189000, // Dịch vụ tiêu chuẩn rẻ nhất
    max: 249000, // Dịch vụ tiêu chuẩn đắt nhất
    avgDuration: 45 // Thời gian trung bình (phút)
  },
  premium: {
    min: 349000, // Dịch vụ cao cấp rẻ nhất
    max: 450000, // Dịch vụ cao cấp đắt nhất
    avgDuration: 70 // Thời gian trung bình (phút)
  }
}

// Format tiền tệ VND
export const formatPriceRange = (min: number, max: number): string => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });
  
  return `${formatter.format(min)} - ${formatter.format(max)}`;
} 