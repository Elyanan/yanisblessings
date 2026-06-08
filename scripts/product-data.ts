export type SeedCategory = {
  title: string
  slug: string
  sortOrder: number
  titleAm?: string
}

export type SeedProduct = {
  name: string
  slug?: string
  titleAm?: string
  description: string
  descriptionAm?: string
  price: number | null
  category: string
  available: boolean
  featured: boolean
  ingredients?: string[]
  image?: string
}

export const seedCategories: SeedCategory[] = [
  { title: 'Granola', slug: 'granola', sortOrder: 1, titleAm: 'ግራኖላ' },
  { title: 'Cupcakes', slug: 'cupcakes', sortOrder: 2, titleAm: 'ካፕኬኮች' },
  { title: 'Cookies', slug: 'cookies', sortOrder: 3, titleAm: 'ኩኪዎች' },
  { title: 'Gift Boxes', slug: 'gift-boxes', sortOrder: 4, titleAm: 'የስጦታ ሳጥኖች' },
  { title: 'Seasonal', slug: 'seasonal', sortOrder: 5, titleAm: 'ወቅታዊ' },
]

export const seedProducts: SeedProduct[] = [
  // Granola
  {
    name: 'Classic Granola',
    slug: 'granola-classic',
    titleAm: 'ክላሲክ ግራኖላ',
    description: 'Our signature crunchy granola with oats, honey, and almonds. Perfect for breakfast or snacking.',
    descriptionAm: 'የእኛ ዋና ክራንቺ ግራኖላ ከአትክልት፣ ማር እና ለውዝ ጋር። ለቁርስ ወይም ለመክሰስ ፍፁም።',
    price: 2000,
    category: 'Granola',
    available: true,
    featured: true,
    ingredients: ['Oats', 'Honey', 'Almonds', 'Coconut Oil', 'Vanilla'],
    image: 'granola-classic.png',
  },
  {
    name: 'Chocolate Granola',
    slug: 'granola-chocolate',
    titleAm: 'ቸኮሌት ግራኖላ',
    description: 'Rich chocolate granola with cocoa nibs and dark chocolate chunks.',
    descriptionAm: 'ከኮኮ ኒብስ እና ጨለማ ቸኮሌት ቁርጥራጮች ጋር የበለጸገ ቸኮሌት ግራኖላ።',
    price: 2600,
    category: 'Granola',
    available: true,
    featured: true,
    ingredients: ['Oats', 'Cocoa', 'Dark Chocolate', 'Honey', 'Almonds'],
    image: 'granola-chocolate.png',
  },
  {
    name: 'Date Granola',
    slug: 'granola-date',
    titleAm: 'ተምር ግራኖላ',
    description: 'Naturally sweetened with dates and a touch of cinnamon.',
    descriptionAm: 'በተፈጥሮ በተምር እና በትንሽ ቀረፋ የተጣፈጠ።',
    price: 2600,
    category: 'Granola',
    available: true,
    featured: false,
    ingredients: ['Oats', 'Dates', 'Cinnamon', 'Walnuts', 'Coconut'],
    image: 'granola-date.png',
  },
  {
    name: 'Cinnamon Granola',
    slug: 'granola-cinnamon',
    titleAm: 'ቀረፋ ግራኖላ',
    description: 'Warm cinnamon spiced granola with pecans and dried apples.',
    descriptionAm: 'ከፔካን እና ደረቅ ፖም ጋር ሞቅ ያለ ቀረፋ ግራኖላ።',
    price: 2500,
    category: 'Granola',
    available: true,
    featured: false,
    ingredients: ['Oats', 'Cinnamon', 'Pecans', 'Dried Apples', 'Maple Syrup'],
    image: 'granola-cinnamon.png',
  },
  {
    name: 'Mini Breakfast Granola Pack',
    slug: 'granola-mini-pack',
    titleAm: 'ትንሽ የቁርስ ግራኖላ ጥቅል',
    description: 'Perfect single-serve portion for on-the-go breakfast.',
    descriptionAm: 'ለመንገድ ላይ ቁርስ ፍፁም የሆነ ነጠላ አገልግሎት ክፍል።',
    price: 800,
    category: 'Granola',
    available: true,
    featured: true,
    image: 'granola-mini.png',
  },
  {
    name: 'Vanilla Blessing Cupcakes',
    slug: 'cupcake-vanilla',
    titleAm: 'ቫኒላ በረከት ካፕኬኮች',
    description: 'Light and fluffy vanilla cupcakes with creamy buttercream frosting.',
    descriptionAm: 'ቀላል እና ፍሉፊ ቫኒላ ካፕኬኮች ከቅቤ ክሬም ጋር።',
    price: 150,
    category: 'Cupcakes',
    available: true,
    featured: true,
    image: 'cupcake-vanilla.png',
  },
  {
    name: 'Chocolate Love Cupcakes',
    slug: 'cupcake-chocolate',
    titleAm: 'ቸኮሌት ፍቅር ካፕኬኮች',
    description: 'Decadent chocolate cupcakes with rich chocolate ganache.',
    descriptionAm: 'ከቸኮሌት ጋናሽ ጋር የበለጸጉ ቸኮሌት ካፕኬኮች።',
    price: 180,
    category: 'Cupcakes',
    available: true,
    featured: true,
    image: 'cupcake-chocolate.png',
  },
  {
    name: 'Coffee Cupcakes',
    slug: 'cupcake-coffee',
    titleAm: 'ቡና ካፕኬኮች',
    description: 'Ethiopian coffee-infused cupcakes with espresso buttercream.',
    descriptionAm: 'ከኢትዮጵያ ቡና ጋር የተቀመሙ ካፕኬኮች ከኤስፕሬሶ ክሬም ጋር።',
    price: 180,
    category: 'Cupcakes',
    available: true,
    featured: false,
    image: 'cupcake-coffee.png',
  },
  {
    name: 'Mini Cupcake Box (12 pcs)',
    slug: 'cupcake-mini-box',
    titleAm: 'ትንሽ ካፕኬክ ሳጥን (12 ቁርጥራጮች)',
    description: 'Assorted mini cupcakes perfect for parties and gatherings.',
    descriptionAm: 'ለድግስ እና ስብሰባዎች ፍፁም የሆኑ የተለያዩ ትንንሽ ካፕኬኮች።',
    price: 1200,
    category: 'Cupcakes',
    available: true,
    featured: false,
    image: 'cupcake-mini-box.png',
  },
  {
    name: 'Oat Cookies',
    slug: 'cookie-oat',
    titleAm: 'አትክልት ኩኪዎች',
    description: 'Wholesome oat cookies with a hint of honey and cinnamon.',
    descriptionAm: 'ከማር እና ቀረፋ ጋር ጤናማ የአትክልት ኩኪዎች።',
    price: 100,
    category: 'Cookies',
    available: true,
    featured: true,
    image: 'cookie-oat.png',
  },
  {
    name: 'Birthday Blessing Box',
    slug: 'box-birthday',
    titleAm: 'የልደት በረከት ሳጥን',
    description: 'Curated selection of treats perfect for birthday celebrations.',
    descriptionAm: 'ለልደት በዓላት ፍፁም የሆነ የተመረጡ ጣፋጮች ስብስብ።',
    price: 3500,
    category: 'Gift Boxes',
    available: true,
    featured: true,
    image: 'box-birthday.png',
  },
  {
    name: 'Thank You Box',
    slug: 'box-thankyou',
    titleAm: 'አመሰግናለሁ ሳጥን',
    description: 'Show appreciation with this thoughtful gift box.',
    descriptionAm: 'በዚህ አስተዋይ የስጦታ ሳጥን አድናቆትዎን ያሳዩ።',
    price: 2800,
    category: 'Gift Boxes',
    available: true,
    featured: false,
    image: 'box-thankyou.png',
  },
  {
    name: 'Office Treat Box',
    slug: 'box-office',
    titleAm: 'የቢሮ ጣፋጮች ሳጥን',
    description: 'Perfect for sharing with colleagues at work.',
    descriptionAm: 'ከስራ ባልደረቦች ጋር ለማጋራት ፍፁም።',
    price: 4500,
    category: 'Gift Boxes',
    available: true,
    featured: false,
    image: 'box-office.png',
  },
  {
    name: 'Custom Gift Box',
    slug: 'box-custom',
    titleAm: 'ብጁ የስጦታ ሳጥን',
    description: 'Create your own personalized gift box.',
    descriptionAm: 'የራስዎን ግላዊ የስጦታ ሳጥን ይፍጠሩ።',
    price: 3000,
    category: 'Gift Boxes',
    available: true,
    featured: false,
    image: 'box-custom.png',
  },
]
