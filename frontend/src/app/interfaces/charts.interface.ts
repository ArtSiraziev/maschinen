export interface Stock {
  _id: string;
  name: string;
  timestamps: {
    high: string;
    low: string;
    date: string;
    close: string
  }[]
}

export interface DataForD3 {
  max: string;
  min: string;
  date: Date;
  topRange: number;
  bottomRange: number;
}
