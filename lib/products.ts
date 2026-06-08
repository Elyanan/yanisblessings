export interface Product {
  id: string
  name: string
  nameAm: string
  description: string
  descriptionAm: string
  price: number
  image: string
  category: string
  available: boolean
  featured?: boolean
  ingredients?: string[]
  sizes?: { name: string; price: number }[]
}

export const testimonials = [
  {
    id: '1',
    name: 'Nathan Mattewos',
    text: 'The granola tastes so good and fresh. I loved it so much.',
    textAm: 'ግራኖላው በጣም ጣፋጭና አዲስ ነው። በጣም ወድጄታለሁ።',
    rating: 5,
  },
  {
    id: '2',
    name: 'Bemnet Mattewos',
    text: "It's excellent taste. Delicious granola with the perfect crunch. Fresh, flavorful, and not overly sweet!",
    textAm: 'በጣም ጣፋጭ ጣዕም አለው። ፍፁም ጥብስ ያለው ጣፋጭ ግራኖላ። አዲስ፣ ትኩስ ጣዕም ያለው እና በጣም አይጨምርም!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Helen Temesgen',
    text: 'Perfect for breakfast or snacking. Healthy, tasty, and made with care. 👍',
    textAm: 'ለቁርስ ወይም ለመክመክ ፍፁም። ጤናማ፣ ጣፋጭ እና በእንክብካቤ የተሰራ። 👍',
    rating: 5,
  },
]
