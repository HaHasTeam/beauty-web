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
  TO_PAY = 'TO_PAY',
  TO_SHIP = 'TO_SHIP',
  TO_RECEIVED = 'TO_RECEIVED',
  RETURN_REFUND = 'RETURN_REFUND',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  CANCELLED_BY_SHOP = 'CANCELLED_BY_SHOP',
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
