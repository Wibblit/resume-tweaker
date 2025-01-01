export const pricingPlans = [
  {
    name: "Starter",
    credits: 200,
    price: 229,
    originalPrice: 299,
    gatewayFee: 7.58,
    tax: 41.22,
    effectivePrice: 180.2,
    popular: false,
  },
  {
    name: "Essentail",
    credits: 400,
    price: 458,
    originalPrice: 599,
    gatewayFee: 12.16,
    tax: 82.44,
    effectivePrice: 363.4,
    popular: true,
  },
  {
    name: "Power",
    credits: 1000,
    price: 1145,
    originalPrice: 1499,
    gatewayFee: 25.9,
    tax: 206.1,
    effectivePrice: 913,
    popular: false,
  },
  {
    name: "Super saver",
    credits: 2000,
    price: 2290,
    originalPrice: 2999,
    gatewayFee: 48.8,
    tax: 412.2,
    effectivePrice: 1829,
    popular: false,
  },
];

type CurrencyRates = {
  [key: string]: {
    value: number;
    fee: number;
    rate: number;
    symbol: string;
  };
};

export const currencies = [
  { code: "AUD", name: "Australian dollar", flag: "🇦🇺" },
  { code: "BRL", name: "Brazilian real", flag: "🇧🇷" },
  { code: "CAD", name: "Canadian dollar", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss franc", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Renmenbi", flag: "🇨🇳" },
  { code: "CZK", name: "Czech koruna", flag: "🇨🇿" },
  { code: "DKK", name: "Danish krone", flag: "🇩🇰" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Pound sterling", flag: "🇬🇧" },
  { code: "HKD", name: "Hong Kong dollar", flag: "🇭🇰" },
  { code: "HUF", name: "Hungarian forint", flag: "🇭🇺" },
  { code: "ILS", name: "Israeli new shekel", flag: "🇮🇱" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", name: "Japanese yen", flag: "🇯🇵" },
  { code: "MXN", name: "Mexican peso", flag: "🇲🇽" },
  { code: "MYR", name: "Malaysian ringgit", flag: "🇲🇾" },
  { code: "NOK", name: "Norwegian krone", flag: "🇳🇴" },
  { code: "NZD", name: "New Zealand dollar", flag: "🇳🇿" },
  { code: "PHP", name: "Philippine peso", flag: "🇵🇭" },
  { code: "PLN", name: "Polish złoty", flag: "🇵🇱" },
  { code: "SEK", name: "Swedish krona", flag: "🇸🇪" },
  { code: "SGD", name: "Singapore dollar", flag: "🇸🇬" },
  { code: "THB", name: "Thai baht", flag: "🇹🇭" },
  { code: "TWD", name: "New Taiwan dollar", flag: "🇹🇼" },
  { code: "USD", name: "United States dollar", flag: "🇺🇸" },
];


export const currencyrates: CurrencyRates = {
  INR: {
    value: 1,
    fee: 0,
    rate: 0,
    symbol: "₹",
  },
  AUD: {
    value: 0.01886,
    fee: 0.3,
    rate: 4.4,
    symbol: "A$",
  },
  BRL: {
    value: 0.07211,
    fee: 0.6,
    rate: 4.4,
    symbol: "R$",
  },
  CAD: {
    value: 0.01679,
    fee: 0.3,
    rate: 4.4,
    symbol: "CA$",
  },
  CNY: {
    value: 0.08521,
    fee: 0,
    rate: 4.4,
    symbol: "¥",
  },
  CZK: {
    value: 0.2838,
    fee: 10,
    rate: 4.4,
    symbol: "Kč",
  },
  DKK: {
    value: 0.0846,
    fee: 2.66,
    rate: 4.4,
    symbol: "kr",
  },
  EUR: {
    value: 0.01127,
    fee: 0.35,
    rate: 4.4,
    symbol: "€",
  },
  HKD: {
    value: 0.09069,
    fee: 2.35,
    rate: 4.4,
    symbol: "HK$",
  },
  HUF: {
    value: 4.635,
    fee: 90,
    rate: 4.4,
    symbol: "Ft",
  },
  ILS: {
    value: 0.04251,
    fee: 1.2,
    rate: 4.4,
    symbol: "₪",
  },
  JPY: {
    value: 1.835,
    fee: 40.0,
    rate: 4.4,
    symbol: "¥",
  },
  MYR: {
    value: 0.05222,
    fee: 2,
    rate: 4.4,
    symbol: "RM",
  },
  MXN: {
    value: 0.2431,
    fee: 4,
    rate: 4.4,
    symbol: "MX$",
  },
  TWD: {
    value: 0.3828,
    fee: 10,
    rate: 4.4,
    symbol: "NT$",
  },
  NZD: {
    value: 0.02087,
    fee: 0.45,
    rate: 4.4,
    symbol: "NZ$",
  },
  NOK: {
    value: 0.1328,
    fee: 2.8,
    rate: 4.4,
    symbol: "kr",
  },
  PHP: {
    value: 0.678,
    fee: 15,
    rate: 4.4,
    symbol: "₱",
  },
  PLN: {
    value: 0.04818,
    fee: 1.35,
    rate: 4.4,
    symbol: "zł",
  },
  GBP: {
    value: 0.009333,
    fee: 0.2,
    rate: 4.4,
    symbol: "£",
  },
  SGD: {
    value: 0.01594,
    fee: 0.5,
    rate: 4.4,
    symbol: "S$",
  },
  SEK: {
    value: 0.1292,
    fee: 3.25,
    rate: 4.4,
    symbol: "kr",
  },
  CHF: {
    value: 0.01059,
    fee: 0.55,
    rate: 4.4,
    symbol: "CHF",
  },
  THB: {
    value: 0.4003,
    fee: 11,
    rate: 4.4,
    symbol: "฿",
  },
  USD: {
    value: 0.01167,
    fee: 0.3,
    rate: 4.4,
    symbol: "$",
  },
};