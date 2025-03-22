
import { ShopifyProduct } from "@/services/shopify";

// Define gelato flavors using the uploaded images
export const flavorImages = [
  {
    id: "coconutty",
    title: "Coconutty Gelato",
    image: "/public/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png",
    price: "1.900",
    tags: "Gelato",
    description: "Creamy coconut gelato with toasted coconut flakes, offering a tropical paradise in every spoonful."
  },
  {
    id: "bubblegum",
    title: "Bubblegum Gelato",
    image: "/public/lovable-uploads/68fdfc78-f84f-4411-b18a-ab7ce14b9128.png", 
    price: "1.900",
    tags: "Gelato",
    description: "Nostalgic and playful bubblegum flavored gelato that brings back childhood memories with its sweet, distinctive taste."
  },
  {
    id: "oreo",
    title: "Oreo Gelato",
    image: "/public/lovable-uploads/6bc2aabc-0a5a-4554-a821-4dd77f9c8aea.png",
    price: "1.900",
    tags: "Gelato",
    description: "Rich and creamy gelato with chunks of Oreo cookies throughout, creating the perfect balance of smooth and crunchy textures."
  },
  {
    id: "vanilla",
    title: "Vanilla Gelato",
    image: "/public/lovable-uploads/91b50f06-99cd-4593-938f-fabd0d114f7b.png",
    price: "1.900",
    tags: "Gelato",
    description: "Classic vanilla gelato made with Madagascar vanilla beans, providing a pure, aromatic flavor that's both elegant and comforting."
  },
  {
    id: "cafe-espresso",
    title: "Cafe Espresso Gelato",
    image: "/public/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png",
    price: "1.900",
    tags: "Gelato",
    description: "Intense coffee-infused gelato made with freshly brewed espresso, delivering a bold and sophisticated flavor with subtle chocolate notes."
  },
  {
    id: "becca-selvatica",
    title: "Becca Selvatica Gelato",
    image: "/public/lovable-uploads/bef4f851-ea34-4b80-ae6b-5f8094f7fe6c.png",
    price: "1.900",
    tags: "Gelato",
    description: "A unique blend of wild berries swirled into a smooth cream base, capturing the essence of summer with each delightful bite."
  },
  {
    id: "chocolicious",
    title: "Chocolicious Gelato",
    image: "/public/lovable-uploads/c13867b5-479c-403b-a532-b17b6554c0b6.png",
    price: "1.900",
    tags: "Gelato",
    description: "Decadent chocolate gelato made with premium cocoa and dark chocolate shavings, creating an irresistibly rich and velvety experience."
  },
  {
    id: "strawberry-cheesecake",
    title: "Strawberry Cheesecake Gelato",
    image: "/public/lovable-uploads/45be5889-006a-4270-a4ee-872ed44d60d1.png",
    price: "1.900",
    tags: "Gelato",
    description: "Creamy cheesecake gelato with sweet strawberry ripples and graham cracker pieces, perfectly capturing the beloved dessert in frozen form."
  },
  {
    id: "lotus",
    title: "Lotus Gelato",
    image: "/public/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png",
    price: "1.900",
    tags: "Gelato",
    description: "Indulgent gelato infused with the distinctive caramelized flavor of Lotus Biscoff cookies, complemented by cookie crumbles throughout."
  },
  {
    id: "creme-caramel",
    title: "Creme Caramel Gelato",
    image: "/public/lovable-uploads/121dee10-adac-45ae-8ece-eaa383e8e50b.png",
    price: "1.900",
    tags: "Gelato",
    description: "Silky smooth gelato that captures the essence of classic crème caramel with ribbons of caramelized sugar throughout."
  },
  {
    id: "pistachio",
    title: "Pistachio Gelato",
    image: "/public/lovable-uploads/2a94f97e-5d11-4c16-a825-93e84c05349d.png",
    price: "1.900",
    tags: "Gelato",
    description: "Authentic Sicilian-style pistachio gelato made with roasted pistachios from Bronte, offering a naturally nutty and subtly sweet flavor."
  },
  // Sorbets
  {
    id: "passion-fruit",
    title: "Passion Fruit Sorbet",
    image: "/public/lovable-uploads/30d31163-952c-46c0-bbdf-0d6cdce4644f.png",
    price: "1.900",
    tags: "Sorbet",
    description: "Vibrant and exotic passion fruit sorbet with the perfect balance of sweet and tangy notes, creating a refreshing tropical escape."
  },
  {
    id: "lemon-mint",
    title: "Lemon Mint Sorbet",
    image: "/public/lovable-uploads/c80c3756-ab46-4f52-8c9f-5331b5964be1.png",
    price: "1.900",
    tags: "Sorbet",
    description: "Zesty lemon sorbet infused with fresh mint, creating an invigorating and cleansing palate experience that's perfectly refreshing."
  },
  {
    id: "fragola",
    title: "Fragola Sorbet",
    image: "/public/lovable-uploads/f157d2dd-07de-44d1-b4dd-9cf9d433db54.png",
    price: "1.900",
    tags: "Sorbet",
    description: "Authentic Italian strawberry sorbet made with hand-selected fragola berries, delivering an intense, natural fruit flavor in every spoonful."
  },
  {
    id: "tropical-fusion",
    title: "Tropical Fusion Sorbet",
    image: "/public/lovable-uploads/8b030dc4-c8c6-4050-8198-0a33c9fdd312.png",
    price: "1.900",
    tags: "Sorbet",
    description: "An exotic blend of tropical fruits creating a refreshing and vibrant sorbet experience that transports you to paradise."
  },
  {
    id: "mango",
    title: "Mango Sorbet",
    image: "/public/lovable-uploads/b46d4ebf-e0ea-4c47-89b9-0c15123ec875.png",
    price: "1.900",
    tags: "Sorbet",
    description: "Luscious mango sorbet made with perfectly ripened Alphonso mangoes, delivering a sweet, aromatic taste of tropical indulgence."
  },
  {
    id: "raspberry",
    title: "Raspberry Sorbet",
    image: "/public/lovable-uploads/abcafc13-aa1b-452e-a560-7e729fb20e0c.png",
    price: "1.900",
    tags: "Sorbet",
    description: "Luxuriously smooth raspberry sorbet with the perfect balance of sweetness and tartness, showcasing the berry's vibrant natural flavor."
  }
];

// Additional new images
export const additionalImages = [
  {
    id: "milk-shake-strawberry",
    title: "Strawberry Milkshake",
    image: "/public/lovable-uploads/6e2cb952-a736-44cf-9688-34ddc202a542.png",
    price: "2.500",
    tags: "Milkshakes",
    description: "Creamy strawberry milkshake blended with premium gelato and fresh strawberries, topped with whipped cream."
  },
  {
    id: "milk-shake-pistachio",
    title: "Pistachio Milkshake",
    image: "/public/lovable-uploads/85bd8d12-912e-4165-a3b1-a06f09e4360d.png",
    price: "2.500",
    tags: "Milkshakes",
    description: "Rich pistachio milkshake made with our signature pistachio gelato, creating a nutty and indulgent treat."
  }
];

// Function to transform local data to ShopifyProduct format
export const getLocalProducts = (): ShopifyProduct[] => {
  return [...flavorImages, ...additionalImages].map(flavor => ({
    id: flavor.id,
    title: flavor.title,
    description: flavor.description || `Premium ${flavor.title.toLowerCase().includes('sorbet') ? 'Italian sorbet' : flavor.title.toLowerCase().includes('milkshake') ? 'creamy milkshake' : 'Italian gelato'} made with the finest ingredients.`,
    handle: flavor.id,
    images: [{ src: flavor.image }],
    variants: [{ id: `${flavor.id}-regular`, price: flavor.price, title: "Regular Size" }],
    tags: flavor.tags
  }));
};

// Dummy function to get demo products if Shopify fetch fails
export const getDemoProducts = (): ShopifyProduct[] => [
  {
    id: "gift-card-25",
    title: "Gelatico Gift Card - 25 KD",
    description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
    handle: "gift-card-25",
    images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
    variants: [{ id: "gift-card-25-variant", price: "25.000", title: "Default" }],
    tags: "Gift Cards"
  },
  {
    id: "gift-card-50",
    title: "Gelatico Gift Card - 50 KD",
    description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
    handle: "gift-card-50",
    images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
    variants: [{ id: "gift-card-50-variant", price: "50.000", title: "Default" }],
    tags: "Gift Cards"
  },
  ...getLocalProducts()
];

