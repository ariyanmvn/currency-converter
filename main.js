const selects = document.querySelectorAll("select");
const fromSelect = document.getElementById("from-select");
const toSelect = document.getElementById("to-select");
const copyButton = document.getElementById("copy-amount");
const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};

let amount = document.getElementById("from-input");
let toAmount = 0;
let finalAmount = document.getElementById("to-input");

for (let select of selects) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    select.append(newOption);
    if (select.name == "from" && currCode == "USD") {
      newOption.selected = "selected";
    } else if (select.name == "to" && currCode == "BDT") {
      newOption.selected = "selected";
    }
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
    const rate = document.getElementById("rate");
    rate.innerText = `1 ${fromSelect.value} = ${toAmount} ${toSelect.value}`;
    convert();
  });
}

const updateFlag = (select) => {
  const currCode = select.value;
  const countryCode = countryList[currCode];

  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  const image = select.parentElement.querySelector(".logo");
  image.src = newSrc;
};

amount.addEventListener("input", (e) => {
  console.log(e.target.value);
  if (amount.value < 0) {
    amount.value = 0;
  }
  if (finalAmount.value < 0) {
    finalAmount.value = 0;
  }
  convert();
});
window.addEventListener("load", () => {
  convert();
  const rate = document.getElementById("rate");
  if (amount.value < 0) {
    amount.value = 0;
  }
  if (finalAmount.value < 0) {
    finalAmount.value = 0;
  }
});

const convert = async () => {
  const response = await fetch(
    `https://latest.currency-api.pages.dev/v1/currencies/${fromSelect.value.toLowerCase()}.json`,
  );
  const data = await response.json();
  let curr1 = fromSelect.value.toLowerCase();
  let curr2 = toSelect.value.toLowerCase();
  let ins = data[curr1];
  let final = ins[curr2];
  toAmount = final;
  console.log(toAmount);
  rate.innerText = `1 ${fromSelect.value} = ${toAmount.toFixed(3)} ${toSelect.value}`;
  finalAmount.value = amount.value * toAmount.toFixed(3);
};

copyButton.addEventListener("click", async (e) => {
  e.preventDefault();

  await navigator.clipboard.writeText(finalAmount.value);

  alert("Copied!");
});
