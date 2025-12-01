import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Send, Moon, Sun, Search, Coffee, Pizza, Utensils, Cake } from 'lucide-react'

const menuItems = [
  { id: 1, name: "Jollof Rice & Chicken", price: 2500, category: "rice", emoji: "Rice" },
  { id: 2, name: "Egusi Soup + Pounded Yam", price: 3000, category: "soup", emoji: "Soup" },
  { id: 3, name: "Fried Rice + Plantain", price: 2200, category: "rice", emoji: "Rice" },
  { id: 4, name: "Pepper Soup (Goat)", price: 3500, category: "soup", emoji: "Soup" },
  { id: 5, name: "Chapman Drink", price: 800, category: "drinks", emoji: "Drink" },
  { id: 6, name: "Zobo", price: 500, category: "drinks", emoji: "Drink" },
  { id: 7, name: "Meat Pie", price: 700, category: "snacks", emoji: "Pie" },
  { id: 8, name: "Puff Puff (10 pcs)", price: 1000, category: "snacks", emoji: "Cake" },
]

export default function App() {
  const [cart, setCart] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem('restaurantCart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('restaurantCart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart(current => {
      const existing = current.find(i => i.id === item.id)
      if (existing) {
        return current.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...current, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, change) => {
    setCart(current => current
      .map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item)
      .filter(item => item.qty > 0)
    )
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)

  const aiSuggestion = total > 0 && total < 5000 ? "Complete your meal with a drink?" : total > 5000 ? "Add dessert?" : ""

  const whatsappMessage = `Hello! I'd like to order:\n\n${cart.map(i => `${i.qty}x ${i.name} - ₦${(i.price * i.qty).toLocaleString()}`).join('\n')}\n\nTotal: ₦${total.toLocaleString()}${aiSuggestion ? `\n\n${aiSuggestion}` : ''}`
  const whatsappLink = `https://wa.me/2348123456789?text=${encodeURIComponent(whatsappMessage)}`

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-orange-50'} transition-all`}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Utensils className="w-10 h-10 text-orange-600" />
            <h1 className="text-4xl font-bold">Mama Put Restaurant</h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-8 h-8" /> : <Moon className="w-8 h-8" />}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-lg`}
          />
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredMenu.map(item => (
            <div key={item.id} className={`rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} flex justify-between items-center`}>
              <div>
                <h3 className="text-xl font-bold">{item.emoji} {item.name}</h3>
                <p className="text-2xl font-bold text-orange-600 mt-2">₦{item.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className={`rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} sticky bottom-4`}>
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-bold">Your Order ({cart.reduce((s,i)=>s+i.qty,0)} items)</h2>
            </div>

            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b">
                <span>{item.qty}x {item.name}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.id, -1)}><Minus className="w-5 h-5" /></button>
                  <span className="font-bold">₦{(item.price * item.qty).toLocaleString()}</span>
                  <button onClick={() => updateQty(item.id, 1)}><Plus className="w-5 h-5" /></button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-2xl font-bold mb-4">
                <span>Total</span>
                <span className="text-orange-600">₦{total.toLocaleString()}</span>
              </div>

              {aiSuggestion && (
                <p className="text-center text-lg font-medium text-orange-600 mb-4">
                  AI Suggestion: {aiSuggestion}
                </p>
              )}

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className=" w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-xl text-center text-xl flex items-center justify-center gap-3"
              >
                <Send className="w-6 h-6" />
                Send Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}