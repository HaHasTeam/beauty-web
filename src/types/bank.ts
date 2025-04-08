export interface IBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name?: string;
  support?: number;
  isTransfer?: number;
  swift_code?: string | null;
}

export interface BankApiResponse {
  code: string;
  desc: string;
  data: IBank[];
} 