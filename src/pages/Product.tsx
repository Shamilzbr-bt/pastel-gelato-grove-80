
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import ContainerSelector, { ContainerOption } from '@/components/product/ContainerSelector';
import ToppingsSelector from '@/components/product/ToppingsSelector';
import { Flavor } from '@/models/Flavor';
import { isSorbet } from '@/models/Flavor';
import { toast } from "sonner";
import { useCart } from '@/hooks/useCart';
import { getDemoProducts } from '@/data/products';

type ProductPageParams = {
  id: string;
  [key: string]: string;
};

export default function Product() {
  const [selectedContainer, setSelectedContainer] = useState('cup-minio');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [flavor, setFlavor] = useState<Flavor | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const { id } = useParams<ProductPageParams>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Get container options information
  const getSelectedContainerInfo = () => {
    const containerOptions: ContainerOption[] = [
      { id: 'cup-minio', type: 'cup', size: 'minio', name: 'Minio Cup', price: 1.600, description: 'Single scoop cup' },
      { id: 'cup-medio', type: 'cup', size: 'medio', name: 'Medio Cup', price: 1.950, description: 'Double scoop cup' },
      { id: 'cup-megano', type: 'cup', size: 'megano', name: 'Megano Cup', price: 2.350, description: 'Triple scoop cup' },
      { id: 'cone-standard', type: 'cone', size: 'standard', name: 'Standard Cone', price: 1.350, description: 'Single scoop cone' },
      { id: 'cone-tower', type: 'cone', size: 'tower', name: 'Mega Cone', price: 1.950, description: 'Double scoop cone' },
    ];
    
    return containerOptions.find(opt => opt.id === selectedContainer);
  };

  // Get toppings information
  const getSelectedToppingsInfo = () => {
    const toppings = [
      { id: 'marshmallow', name: 'Marshmallow', price: 0.400, category: 'addons' },
      { id: 'oreo', name: 'Oreo Crumbs', price: 0.400, category: 'addons' },
      { id: 'sprinkles', name: 'Sprinkles', price: 0.400, category: 'addons' },
      { id: 'nuts', name: 'Mixed Nuts', price: 0.400, category: 'addons' },
      { id: 'brownies', name: 'Brownie Pieces', price: 0.400, category: 'addons' },
      { id: 'chocolate', name: 'Chocolate Sauce', price: 0.350, category: 'sauces' },
      { id: 'caramel', name: 'Caramel Sauce', price: 0.350, category: 'sauces' },
      { id: 'pistachio', name: 'Pistachio Sauce', price: 0.350, category: 'sauces' },
      { id: 'strawberry', name: 'Strawberry Sauce', price: 0.350, category: 'sauces' },
      { id: 'honey', name: 'Honey', price: 0.350, category: 'sauces' },
    ];
    
    return selectedToppings.map(id => toppings.find(t => t.id === id)).filter(Boolean);
  };

  // Calculate total price based on container and toppings
  const calculateTotalPrice = () => {
    const containerInfo = getSelectedContainerInfo();
    const toppingsInfo = getSelectedToppingsInfo();
    
    const basePrice = (product?.variants?.[0]?.price ? parseFloat(product.variants[0].price) : 0) || 
                     (flavor?.price ? (typeof flavor.price === 'string' ? parseFloat(flavor.price) : flavor.price) : 0);
    
    const containerPrice = containerInfo?.price || 0;
    const toppingsPrice = toppingsInfo.reduce((total, topping) => total + (topping?.price || 0), 0);
    
    return basePrice + containerPrice + toppingsPrice;
  };

  useEffect(() => {
    if (!id) return;

    // Try to find the item as a product first
    const products = getDemoProducts();
    const foundProduct = products.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      return;
    }

    // If not a product, try as a flavor
    const mockedFlavors: Flavor[] = [
      {
        id: "coconutty",
        name: "Coconutty Gelato",
        description: "Creamy coconut gelato with toasted coconut flakes.",
        image: "/public/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png",
        tags: ["Gelato", "Coconut"],
        nutrition: { calories: 250, fat: 15, carbs: 25, protein: 3, sugar: 20 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "coconutty-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "bubblegum",
        name: "Bubblegum Gelato",
        description: "Sweet and nostalgic bubblegum flavored gelato.",
        image: "/public/lovable-uploads/68fdfc78-f84f-4411-b18a-ab7ce14b9128.png",
        tags: ["Gelato", "Bubblegum"],
        nutrition: { calories: 240, fat: 14, carbs: 26, protein: 2, sugar: 22 },
        featured: false,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "bubblegum-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "oreo",
        name: "Oreo Gelato",
        description: "Rich and creamy gelato with chunks of Oreo cookies.",
        image: "/public/lovable-uploads/6bc2aabc-0a5a-4554-a821-4dd77f9c8aea.png",
        tags: ["Gelato", "Oreo"],
        nutrition: { calories: 260, fat: 16, carbs: 28, protein: 4, sugar: 24 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "oreo-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "vanilla",
        name: "Vanilla Gelato",
        description: "Classic vanilla gelato made with real vanilla beans.",
        image: "/public/lovable-uploads/91b50f06-99cd-4593-938f-fabd0d114f7b.png",
        tags: ["Gelato", "Vanilla"],
        nutrition: { calories: 230, fat: 13, carbs: 24, protein: 2, sugar: 20 },
        featured: false,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "vanilla-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "cafe-espresso",
        name: "Cafe Espresso Gelato",
        description: "Intense coffee flavored gelato with a hint of chocolate.",
        image: "/public/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png",
        tags: ["Gelato", "Coffee"],
        nutrition: { calories: 250, fat: 15, carbs: 25, protein: 3, sugar: 20 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "cafe-espresso-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "becca-selvatica",
        name: "Becca Selvatica Gelato",
        description: "Unique blend of wild berries and cream in a smooth gelato.",
        image: "/public/lovable-uploads/bef4f851-ea34-4b80-ae6b-5f8094f7fe6c.png",
        tags: ["Gelato", "Berries"],
        nutrition: { calories: 240, fat: 14, carbs: 26, protein: 2, sugar: 22 },
        featured: false,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "becca-selvatica-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "chocolicious",
        name: "Chocolicious Gelato",
        description: "Extra rich chocolate gelato with dark chocolate shavings.",
        image: "/public/lovable-uploads/c13867b5-479c-403b-a532-b17b6554c0b6.png",
        tags: ["Gelato", "Chocolate"],
        nutrition: { calories: 260, fat: 16, carbs: 28, protein: 4, sugar: 24 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "chocolicious-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "strawberry-cheesecake",
        name: "Strawberry Cheesecake Gelato",
        description: "Delicious combination of strawberry and cheesecake flavors in a creamy gelato.",
        image: "/public/lovable-uploads/45be5889-006a-4270-a4ee-872ed44d60d1.png",
        tags: ["Gelato", "Strawberry", "Cheesecake"],
        nutrition: { calories: 250, fat: 15, carbs: 25, protein: 3, sugar: 20 },
        featured: false,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "strawberry-cheesecake-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "lotus",
        name: "Lotus Gelato",
        description: "Unique gelato with the distinctive taste of Lotus Biscoff cookies.",
        image: "/public/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png",
        tags: ["Gelato", "Lotus"],
        nutrition: { calories: 260, fat: 16, carbs: 28, protein: 4, sugar: 24 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "lotus-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "creme-caramel",
        name: "Creme Caramel Gelato",
        description: "Smooth and sweet creme caramel flavored gelato.",
        image: "/public/lovable-uploads/121dee10-adac-45ae-8ece-eaa383e8e50b.png",
        tags: ["Gelato", "Caramel"],
        nutrition: { calories: 240, fat: 14, carbs: 26, protein: 2, sugar: 22 },
        featured: false,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "creme-caramel-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "pistachio",
        name: "Pistachio Gelato",
        description: "Authentic pistachio gelato made with real pistachios.",
        image: "/public/lovable-uploads/2a94f97e-5d11-4c16-a825-93e84c05349d.png",
        tags: ["Gelato", "Pistachio"],
        nutrition: { calories: 250, fat: 15, carbs: 25, protein: 3, sugar: 20 },
        featured: true,
        price: "1.900",
        category: "Gelato",
        variants: [{ id: "pistachio-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "passion-fruit",
        name: "Passion Fruit Sorbet",
        description: "Refreshing passion fruit sorbet with a tangy flavor.",
        image: "/public/lovable-uploads/30d31163-952c-46c0-bbdf-0d6cdce4644f.png",
        tags: ["Sorbet", "Passion Fruit"],
        nutrition: { calories: 200, fat: 0, carbs: 50, protein: 1, sugar: 40 },
        featured: false,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "passion-fruit-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "lemon-mint",
        name: "Lemon Mint Sorbet",
        description: "Zesty lemon sorbet with a hint of fresh mint.",
        image: "/public/lovable-uploads/c80c3756-ab46-4f52-8c9f-5331b5964be1.png",
        tags: ["Sorbet", "Lemon", "Mint"],
        nutrition: { calories: 190, fat: 0, carbs: 48, protein: 0, sugar: 38 },
        featured: true,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "lemon-mint-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "fragola",
        name: "Fragola Sorbet",
        description: "Sweet and fruity strawberry sorbet.",
        image: "/public/lovable-uploads/f157d2dd-07de-44d1-b4dd-9cf9d433db54.png",
        tags: ["Sorbet", "Strawberry"],
        nutrition: { calories: 200, fat: 0, carbs: 50, protein: 1, sugar: 40 },
        featured: false,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "fragola-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "tropical-fusion",
        name: "Tropical Fusion Sorbet",
        description: "Exotic blend of tropical fruits in a refreshing sorbet.",
        image: "/public/lovable-uploads/8b030dc4-c8c6-4050-8198-0a33c9fdd312.png",
        tags: ["Sorbet", "Tropical"],
        nutrition: { calories: 210, fat: 0, carbs: 52, protein: 1, sugar: 42 },
        featured: true,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "tropical-fusion-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "mango",
        name: "Mango Sorbet",
        description: "Smooth and creamy mango sorbet.",
        image: "/public/lovable-uploads/b46d4ebf-e0ea-4c47-89b9-0c15123ec875.png",
        tags: ["Sorbet", "Mango"],
        nutrition: { calories: 200, fat: 0, carbs: 50, protein: 1, sugar: 40 },
        featured: false,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "mango-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "raspberry",
        name: "Raspberry Sorbet",
        description: "Tangy and refreshing raspberry sorbet.",
        image: "/public/lovable-uploads/abcafc13-aa1b-452e-a560-7e729fb20e0c.png",
        tags: ["Sorbet", "Raspberry"],
        nutrition: { calories: 190, fat: 0, carbs: 48, protein: 0, sugar: 38 },
        featured: true,
        price: "1.900",
        category: "Sorbet",
        variants: [{ id: "raspberry-regular", name: "Regular", price: "1.900" }]
      }
    ];

    const foundFlavor = mockedFlavors.find(f => f.id === id);
    if (foundFlavor) {
      setFlavor(foundFlavor);
    } else {
      toast.error("Product not found!");
      navigate('/shop');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    const itemToAdd = product || flavor;
    
    if (!itemToAdd) {
      toast.error("Product details not loaded yet.");
      return;
    }

    const containerInfo = getSelectedContainerInfo();
    const toppingsInfo = getSelectedToppingsInfo();
    
    // Get the container name and toppings names for display
    const containerName = containerInfo?.name || "";
    const toppingNames = toppingsInfo.map(t => t?.name).join(', ');
    
    // Calculate actual price with add-ons
    const totalPrice = calculateTotalPrice().toFixed(3);
    
    // Create a unique variant ID that includes customizations
    const customizationSuffix = `${selectedContainer}-${selectedToppings.join('-')}`;
    const customVariantId = `${itemToAdd.id || itemToAdd.variants?.[0]?.id}-${customizationSuffix}`;
    
    addItem({
      variantId: customVariantId,
      quantity: 1,
      title: itemToAdd.title || itemToAdd.name,
      price: totalPrice, // Use calculated price that includes container and toppings
      image: itemToAdd.images?.[0]?.src || itemToAdd.image,
      variantTitle: containerName,
      customizations: {
        container: containerInfo,
        toppings: toppingsInfo,
        toppingNames: toppingNames
      }
    });

    toast.success(`${itemToAdd.title || itemToAdd.name} added to cart with ${containerName}${toppingNames ? ' and ' + toppingNames : ''}`);
  };

  const displayItem = product || flavor;

  if (!displayItem) {
    return <div>Loading...</div>;
  }

  const itemTitle = product?.title || flavor?.name;
  const itemDescription = product?.description || flavor?.description;
  const itemImage = product?.images?.[0]?.src || flavor?.image;
  const itemCategory = product?.tags?.split(',')?.[0] || (flavor ? (isSorbet(flavor) ? 'Sorbet' : 'Gelato') : '');
  const backTo = product ? '/shop' : '/flavors';
  const backLabel = product ? 'Back to Shop' : 'Back to Flavors';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="page-container pt-32"
      >
        <button onClick={() => navigate(backTo)} className="mb-4 inline-flex items-center gelatico-button-secondary">
          <ChevronLeft size={20} className="mr-2" />
          {backLabel}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img 
              src={itemImage} 
              alt={itemTitle} 
              className="rounded-2xl shadow-lg w-full h-auto" 
            />
            <div className="absolute top-3 left-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gelatico-pink">
                {itemCategory}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold font-gelatico mb-4">{itemTitle}</h1>
            <p className="text-muted-foreground mb-6">{itemDescription}</p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Customize Your Order</h3>
              <ContainerSelector 
                selectedContainer={selectedContainer}
                onContainerChange={setSelectedContainer}
              />
            </div>

            <div className="mb-6">
              <ToppingsSelector 
                selectedToppings={selectedToppings}
                onToppingsChange={setSelectedToppings}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-gelatico-pink">{calculateTotalPrice().toFixed(3)} KD</span>
              <button 
                onClick={handleAddToCart}
                className="gelatico-button inline-flex items-center"
              >
                Add to Cart <ShoppingBag size={20} className="ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
