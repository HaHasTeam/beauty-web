export enum RoleEnum {
  CUSTOMER = 'CUSTOMER',
  MANAGER = 'MANAGER',
  CONSULTANT = 'CONSULTANT',
  STAFF = 'STAFF',
  KOL = 'KOL',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DENIED = 'DENIED',
}
export enum AddressEnum {
  HOME = 'HOME',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

export enum ProductEnum {
  PRE_ORDER = 'PRE_ORDER',
  OFFICIAL = 'OFFICIAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  INACTIVE = 'INACTIVE',
}

export enum FileEnum {
  CERTIFICATE = 'CERTIFICATE',
  AVATAR = 'AVATAR',
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  POPUP_IMAGE = 'POPUP_IMAGE',
  BRAND_IMAGE = 'BRAND_IMAGE',
  BRAND_LOGO = 'BRAND_LOGO',
  BRAND_DOCUMENT = 'BRAND_DOCUMENT',
  SERVICE_IMAGE = 'SERVICE_IMAGE',
}

export enum VoucherEnum {
  GROUP_BUYING = 'GROUP_BUYING',
  NORMAL = 'NORMAL',
}

export enum DiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT',
}

export enum OrderEnum {
  PRE_ORDER = 'PRE_ORDER',
  NORMAL = 'NORMAL',
  GROUP_BUYING = 'GROUP_BUYING',
  FLASH_SALE = 'FLASH_SALE',
}

export enum ProjectInformationEnum {
  name = 'Allure',
  copyRight = '© 2023 Allure',
  email = 'allure.beauty@gmail.com ',
  address = 'Ho Chi Minh City, Viet Nam ',
  phone = '+84 90 123 4567',
  website = 'https://allure.beauty.com',
  logo = 'allure-logo.png',
  facebook = 'https://www.facebook.com/allurebeauty',
  twitter = 'https://www.twitter.com/allurebeauty',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
}

export enum ShippingStatusEnum {
  JOIN_GROUP_BUYING = 'JOIN_GROUP_BUYING', // Tham gia mua nhóm
  TO_PAY = 'TO_PAY', // Chờ thanh toán
  WAIT_FOR_CONFIRMATION = 'WAIT_FOR_CONFIRMATION', // Chờ xác nhận đơn hàng
  PREPARING_ORDER = 'PREPARING_ORDER', // Chuẩn bị đơn hàng
  TO_SHIP = 'TO_SHIP', // Lấy hàng/Sẵn sàng để giao
  SHIPPING = 'SHIPPING', // Đang vận chuyển
  DELIVERED = 'DELIVERED', // Đã nhận hàng
  COMPLETED = 'COMPLETED', // Hoàn thành
  RETURNING = 'RETURNING', // Đang trả hàng
  REFUNDED = 'REFUNDED', // Đã trả hàng
  CANCELLED = 'CANCELLED', // Đã hủy
}

export enum ProductDiscountEnum {
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  WAITING = 'WAITING',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
}

export enum VoucherApplyTypeEnum {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC',
}

export enum VoucherStatusEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum ProductCartStatusEnum {
  HIDDEN = 'HIDDEN',
  SOLD_OUT = 'SOLD_OUT',
}
export enum ClassificationTypeEnum {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export enum VoucherUsedStatusEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  UNCLAIMED = 'UNCLAIMED',
}

export enum VoucherUnavailableReasonEnum {
  MINIMUM_ORDER_NOT_MET = 'MINIMUM_ORDER_NOT_MET',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  NOT_START_YET = 'NOT_START_YET',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum ResultEnum {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  FAILURE = 'FAILURE',
}

export enum CancelOrderRequestStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum FeedbackFilterEnum {
  ALL = 'ALL',
  RATING = 'RATING',
  IMAGE_VIDEO = 'IMAGE_VIDEO',
  CLASSIFICATION = 'CLASSIFICATION',
}
export enum ProductTagEnum {
  BEST_SELLER = 'BEST_SELLER',
  HOT = 'HOT',
  NEW = 'NEW',
}
