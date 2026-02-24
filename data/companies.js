const GICS_SECTORS = [
  "Information Technology",
  "Communication Services",
  "Consumer Discretionary",
  "Consumer Staples",
  "Health Care",
  "Financials",
  "Industrials",
  "Materials",
  "Energy",
  "Utilities",
  "Real Estate"
];

const SECTOR_ZH = {
  "Information Technology": "信息技术",
  "Communication Services": "通信服务",
  "Consumer Discretionary": "可选消费",
  "Consumer Staples": "必选消费",
  "Health Care": "医疗保健",
  Financials: "金融",
  Industrials: "工业",
  Materials: "原材料",
  Energy: "能源",
  Utilities: "公用事业",
  "Real Estate": "房地产"
};

function pack(sector, rows) {
  return rows.map(([ticker, name, keywords]) => ({ ticker, name, sector, keywords: keywords || [] }));
}

const BY_SECTOR = {
  "Information Technology": pack("Information Technology", [
    ["AAPL", "Apple"], ["MSFT", "Microsoft"], ["NVDA", "NVIDIA", ["semiconductor", "chip", "半导体"]], ["AVGO", "Broadcom", ["semiconductor", "chip", "半导体"]], ["ORCL", "Oracle"],
    ["ADBE", "Adobe"], ["CRM", "Salesforce"], ["CSCO", "Cisco"], ["AMD", "Advanced Micro Devices", ["semiconductor", "chip", "半导体"]], ["INTC", "Intel", ["semiconductor", "chip", "半导体"]],
    ["QCOM", "Qualcomm", ["semiconductor", "chip", "半导体"]], ["TXN", "Texas Instruments", ["semiconductor", "chip", "半导体"]], ["AMAT", "Applied Materials", ["semiconductor", "chip", "半导体"]], ["MU", "Micron Technology", ["semiconductor", "chip", "半导体"]], ["PANW", "Palo Alto Networks"],
    ["ANET", "Arista Networks"], ["ADI", "Analog Devices", ["semiconductor", "chip", "半导体"]], ["KLAC", "KLA Corporation", ["semiconductor", "chip", "半导体"]], ["SNPS", "Synopsys"], ["CDNS", "Cadence Design Systems"],
    ["NOW", "ServiceNow"], ["CRWD", "CrowdStrike"], ["FTNT", "Fortinet"], ["MSI", "Motorola Solutions"], ["HPQ", "HP Inc."],
    ["HPE", "Hewlett Packard Enterprise"], ["NXPI", "NXP Semiconductors", ["semiconductor", "chip", "半导体"]], ["MRVL", "Marvell Technology", ["semiconductor", "chip", "半导体"]], ["TEAM", "Atlassian"], ["MDB", "MongoDB"]
  ]),
  "Communication Services": pack("Communication Services", [
    ["GOOGL", "Alphabet Class A"], ["META", "Meta Platforms"], ["NFLX", "Netflix"], ["DIS", "Walt Disney"], ["TMUS", "T-Mobile US"],
    ["VZ", "Verizon Communications"], ["T", "AT&T"], ["CMCSA", "Comcast"], ["CHTR", "Charter Communications"], ["WBD", "Warner Bros. Discovery"],
    ["FOX", "Fox Corporation Class B"], ["FOXA", "Fox Corporation Class A"], ["PARA", "Paramount Global"], ["SNAP", "Snap"], ["PINS", "Pinterest"],
    ["MTCH", "Match Group"], ["SPOT", "Spotify Technology"], ["ROKU", "Roku"], ["RBLX", "Roblox"], ["TTWO", "Take-Two Interactive"],
    ["EA", "Electronic Arts"], ["LYV", "Live Nation Entertainment"], ["DKNG", "DraftKings"], ["IAC", "IAC"], ["NWS", "News Corporation Class B"],
    ["NWSA", "News Corporation Class A"], ["OMC", "Omnicom Group"], ["IPG", "Interpublic Group"], ["BIDU", "Baidu"], ["WB", "Weibo"]
  ]),
  "Consumer Discretionary": pack("Consumer Discretionary", [
    ["AMZN", "Amazon"], ["TSLA", "Tesla"], ["HD", "Home Depot"], ["MCD", "McDonald's"], ["SBUX", "Starbucks"],
    ["LOW", "Lowe's"], ["BKNG", "Booking Holdings"], ["TJX", "TJX Companies"], ["NKE", "Nike"], ["ORLY", "O'Reilly Automotive"],
    ["AZO", "AutoZone"], ["EBAY", "eBay"], ["ROST", "Ross Stores"], ["MAR", "Marriott International"], ["GM", "General Motors"],
    ["F", "Ford Motor"], ["LULU", "Lululemon Athletica"], ["DRI", "Darden Restaurants"], ["YUM", "Yum! Brands"], ["CMG", "Chipotle Mexican Grill"],
    ["BBY", "Best Buy"], ["ULTA", "Ulta Beauty"], ["KMX", "CarMax"], ["LEN", "Lennar"], ["NVR", "NVR"],
    ["PHM", "PulteGroup"], ["WHR", "Whirlpool"], ["ETSY", "Etsy"], ["EXPE", "Expedia Group"], ["RCL", "Royal Caribbean Group"]
  ]),
  "Consumer Staples": pack("Consumer Staples", [
    ["PG", "Procter & Gamble"], ["KO", "Coca-Cola"], ["PEP", "PepsiCo"], ["COST", "Costco Wholesale"], ["WMT", "Walmart"],
    ["PM", "Philip Morris International"], ["MO", "Altria Group"], ["MDLZ", "Mondelez International"], ["CL", "Colgate-Palmolive"], ["KMB", "Kimberly-Clark"],
    ["GIS", "General Mills"], ["KHC", "Kraft Heinz"], ["HSY", "Hershey"], ["MKC", "McCormick & Company"], ["SYY", "Sysco"],
    ["KR", "Kroger"], ["DG", "Dollar General"], ["DLTR", "Dollar Tree"], ["EL", "Estee Lauder"], ["CHD", "Church & Dwight"],
    ["STZ", "Constellation Brands"], ["BF.B", "Brown-Forman Class B"], ["TSN", "Tyson Foods"], ["CPB", "Campbell Soup"], ["CAG", "Conagra Brands"],
    ["HRL", "Hormel Foods"], ["TAP", "Molson Coors Beverage"], ["SAM", "Boston Beer"], ["SJM", "J.M. Smucker"], ["ADM", "Archer-Daniels-Midland"]
  ]),
  "Health Care": pack("Health Care", [
    ["LLY", "Eli Lilly"], ["JNJ", "Johnson & Johnson"], ["UNH", "UnitedHealth Group"], ["MRK", "Merck"], ["ABBV", "AbbVie"],
    ["PFE", "Pfizer"], ["TMO", "Thermo Fisher Scientific"], ["ABT", "Abbott Laboratories"], ["DHR", "Danaher"], ["BMY", "Bristol Myers Squibb"],
    ["AMGN", "Amgen"], ["MDT", "Medtronic"], ["GILD", "Gilead Sciences"], ["CVS", "CVS Health"], ["CI", "Cigna Group"],
    ["HUM", "Humana"], ["ISRG", "Intuitive Surgical"], ["SYK", "Stryker"], ["BSX", "Boston Scientific"], ["ZTS", "Zoetis"],
    ["HCA", "HCA Healthcare"], ["REGN", "Regeneron Pharmaceuticals"], ["BIIB", "Biogen"], ["VRTX", "Vertex Pharmaceuticals"], ["ILMN", "Illumina"],
    ["EW", "Edwards Lifesciences"], ["IDXX", "IDEXX Laboratories"], ["MRNA", "Moderna"], ["BDX", "Becton Dickinson"], ["CAH", "Cardinal Health"]
  ]),
  Financials: pack("Financials", [
    ["BRK.B", "Berkshire Hathaway Class B"], ["JPM", "JPMorgan Chase"], ["BAC", "Bank of America"], ["WFC", "Wells Fargo"], ["GS", "Goldman Sachs"],
    ["MS", "Morgan Stanley"], ["C", "Citigroup"], ["AXP", "American Express"], ["PGR", "Progressive"], ["BLK", "BlackRock"],
    ["SPGI", "S&P Global"], ["CME", "CME Group"], ["CB", "Chubb"], ["MMC", "Marsh & McLennan"], ["ICE", "Intercontinental Exchange"],
    ["USB", "U.S. Bancorp"], ["TFC", "Truist Financial"], ["BK", "Bank of New York Mellon"], ["SCHW", "Charles Schwab"], ["COF", "Capital One Financial"],
    ["AIG", "American International Group"], ["MET", "MetLife"], ["TRV", "Travelers"], ["ALL", "Allstate"], ["PRU", "Prudential Financial"],
    ["AFL", "Aflac"], ["MCO", "Moody's"], ["MSCI", "MSCI"], ["RJF", "Raymond James Financial"], ["NDAQ", "Nasdaq Inc."]
  ]),
  Industrials: pack("Industrials", [
    ["GE", "GE Aerospace"], ["RTX", "RTX Corporation"], ["BA", "Boeing"], ["CAT", "Caterpillar"], ["HON", "Honeywell International"],
    ["UPS", "United Parcel Service"], ["UNP", "Union Pacific"], ["LMT", "Lockheed Martin"], ["DE", "Deere & Company"], ["NOC", "Northrop Grumman"],
    ["ETN", "Eaton"], ["EMR", "Emerson Electric"], ["MMM", "3M"], ["GD", "General Dynamics"], ["WM", "Waste Management"],
    ["PH", "Parker-Hannifin"], ["TT", "Trane Technologies"], ["PCAR", "Paccar"], ["CMI", "Cummins"], ["ITW", "Illinois Tool Works"],
    ["JCI", "Johnson Controls"], ["FDX", "FedEx"], ["NSC", "Norfolk Southern"], ["LHX", "L3Harris Technologies"], ["PAYX", "Paychex"],
    ["ROP", "Roper Technologies"], ["ODFL", "Old Dominion Freight Line"], ["FAST", "Fastenal"], ["PWR", "Quanta Services"], ["IR", "Ingersoll Rand"]
  ]),
  Materials: pack("Materials", [
    ["LIN", "Linde"], ["APD", "Air Products and Chemicals"], ["SHW", "Sherwin-Williams"], ["ECL", "Ecolab"], ["FCX", "Freeport-McMoRan"],
    ["NEM", "Newmont"], ["DOW", "Dow"], ["DD", "DuPont de Nemours"], ["NUE", "Nucor"], ["VMC", "Vulcan Materials"],
    ["MLM", "Martin Marietta Materials"], ["ALB", "Albemarle"], ["IP", "International Paper"], ["LYB", "LyondellBasell"], ["CTVA", "Corteva"],
    ["CE", "Celanese"], ["CF", "CF Industries"], ["MOS", "Mosaic"], ["PKG", "Packaging Corp of America"], ["BALL", "Ball Corporation"],
    ["EMN", "Eastman Chemical"], ["AVY", "Avery Dennison"], ["FMC", "FMC Corporation"], ["IFF", "International Flavors & Fragrances"], ["RPM", "RPM International"],
    ["SEE", "Sealed Air"], ["AMCR", "Amcor"], ["EXP", "Eagle Materials"], ["X", "United States Steel"], ["WLK", "Westlake Corporation"]
  ]),
  Energy: pack("Energy", [
    ["XOM", "Exxon Mobil"], ["CVX", "Chevron"], ["COP", "ConocoPhillips"], ["SLB", "Schlumberger"], ["EOG", "EOG Resources"],
    ["MPC", "Marathon Petroleum"], ["PSX", "Phillips 66"], ["VLO", "Valero Energy"], ["OXY", "Occidental Petroleum"], ["KMI", "Kinder Morgan"],
    ["WMB", "Williams Companies"], ["HAL", "Halliburton"], ["BKR", "Baker Hughes"], ["DVN", "Devon Energy"], ["FANG", "Diamondback Energy"],
    ["MRO", "Marathon Oil"], ["APA", "APA Corporation"], ["HES", "Hess"], ["EQT", "EQT Corporation"], ["CTRA", "Coterra Energy"],
    ["TRGP", "Targa Resources"], ["LNG", "Cheniere Energy"], ["OVV", "Ovintiv"], ["SM", "SM Energy"], ["CNX", "CNX Resources"],
    ["CHK", "Chesapeake Energy"], ["AR", "Antero Resources"], ["PBF", "PBF Energy"], ["MUR", "Murphy Oil"], ["FSLR", "First Solar"]
  ]),
  Utilities: pack("Utilities", [
    ["NEE", "NextEra Energy"], ["SO", "Southern Company"], ["DUK", "Duke Energy"], ["AEP", "American Electric Power"], ["SRE", "Sempra"],
    ["XEL", "Xcel Energy"], ["PEG", "Public Service Enterprise Group"], ["EXC", "Exelon"], ["ED", "Consolidated Edison"], ["EIX", "Edison International"],
    ["WEC", "WEC Energy Group"], ["D", "Dominion Energy"], ["ATO", "Atmos Energy"], ["CNP", "CenterPoint Energy"], ["FE", "FirstEnergy"],
    ["ES", "Eversource Energy"], ["ETR", "Entergy"], ["PPL", "PPL Corporation"], ["DTE", "DTE Energy"], ["AEE", "Ameren"],
    ["CMS", "CMS Energy"], ["NI", "NiSource"], ["LNT", "Alliant Energy"], ["EVRG", "Evergy"], ["PNW", "Pinnacle West Capital"],
    ["NRG", "NRG Energy"], ["CEG", "Constellation Energy"], ["PCG", "PG&E Corporation"], ["AES", "AES Corporation"], ["AWK", "American Water Works"]
  ]),
  "Real Estate": pack("Real Estate", [
    ["AMT", "American Tower"], ["PLD", "Prologis"], ["EQIX", "Equinix"], ["CCI", "Crown Castle"], ["SPG", "Simon Property Group"],
    ["O", "Realty Income"], ["PSA", "Public Storage"], ["WELL", "Welltower"], ["VICI", "VICI Properties"], ["AVB", "AvalonBay Communities"],
    ["EQR", "Equity Residential"], ["ESS", "Essex Property Trust"], ["UDR", "UDR"], ["INVH", "Invitation Homes"], ["DLR", "Digital Realty Trust"],
    ["ARE", "Alexandria Real Estate Equities"], ["SBAC", "SBA Communications"], ["CBRE", "CBRE Group"], ["EXR", "Extra Space Storage"], ["CPT", "Camden Property Trust"],
    ["KIM", "Kimco Realty"], ["REG", "Regency Centers"], ["FRT", "Federal Realty Investment Trust"], ["BXP", "Boston Properties"], ["VTR", "Ventas"],
    ["HST", "Host Hotels & Resorts"], ["RHP", "Ryman Hospitality Properties"], ["DOC", "Healthpeak Properties"], ["PEAK", "Healthpeak Properties Class C"], ["MAA", "Mid-America Apartment Communities"]
  ])
};

const ALL_COMPANIES = GICS_SECTORS.flatMap((s) => BY_SECTOR[s]);
window.STOCK_DATA = { GICS_SECTORS, SECTOR_ZH, BY_SECTOR, ALL_COMPANIES };
