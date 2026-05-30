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
    name: 'Sara M.',
    text: 'The granola is absolutely delicious! My whole family loves it for breakfast.',
    textAm: 'ግራኖላው በጣም ጣፋጭ ነው! መላው ቤተሰቤ ለቁርስ ይወደዋል።',
    rating: 5,
    image: '/images/customer-1.png',
  },
  {
    id: '2',
    name: 'Daniel T.',
    text: "Ordered cupcakes for my daughter's birthday and they were a huge hit!",
    textAm: 'ለልጄ ልደት ካፕኬኮች አዝዣለሁ እና በጣም ተወዳጅ ነበሩ!',
    rating: 5,
    image: '/images/customer-2.png',
  },
  {
    id: '3',
    name: 'Hanna B.',
    text: 'Beautiful packaging and amazing taste. Perfect for gifting!',
    textAm: 'ቆንጆ ማሸጊያ እና አስደናቂ ጣዕም። ለስጦታ ፍፁም!',
    rating: 5,
    image: '/images/customer-3.png',
  },
]
