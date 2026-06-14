"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Waves, Bot, Sparkles, Navigation, Hotel, Loader2 } from "lucide-react";
import Script from "next/script";

const COASTAL_HOTELS = [
  { id: 1, name: "Taj Exotica Resort & Spa", location: "Goa", region: "West Coast", price: "₹25,000", rating: 4.9, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "The Leela Kovalam", location: "Kerala", region: "South Coast", price: "₹18,000", rating: 4.8, image: "https://images.unsplash.com/photo-1571011284432-680456105436?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Radisson Blu Resort Temple Bay", location: "Mahabalipuram", region: "East Coast", price: "₹12,000", rating: 4.5, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Sea Shell Neil", location: "Andaman Islands", region: "Bay of Bengal", price: "₹15,000", rating: 4.7, image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Novotel Visakhapatnam Varun Beach", location: "Vizag", region: "East Coast", price: "₹9,500", rating: 4.4, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" },
  { id: 6, name: "JW Marriott Mumbai Sahar", location: "Mumbai", region: "West Coast", price: "₹22,000", rating: 4.6, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80" },
  { id: 7, name: "Mayfair Waves", location: "Puri", region: "East Coast", price: "₹8,000", rating: 4.3, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80" },
  { id: 8, name: "The Park Calangute", location: "Goa", region: "West Coast", price: "₹14,000", rating: 4.5, image: "https://images.unsplash.com/photo-1512918766671-ed6a07be03f1?auto=format&fit=crop&w=800&q=80" },
];

export default function CoastalHotelsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState(COASTAL_HOTELS);
  const [aiTip, setAiTip] = useState("Search for 'Luxury villas in Goa' or 'Budget stays in Kerala'...");

  const handleSearch = async (e) => {
    if (e && e.key && e.key !== 'Enter') return;
    setLoading(true);
    setAiTip("Grok is scanning the coastline for the best matches...");
    try {
      const res = await fetch("/api/hotels/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search }),
      });
      
      const data = await res.json();
      
      if (!data.ok) {
        setAiTip("Using offline buffer. Ensure xAI credits are active for deep search.");
        return; 
      }

      if (data.hotels) {
        setHotels(data.hotels);
        setAiTip(`Found ${data.hotels.length} premium locations matching your query.`);
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (hotel) => {
    try {
      const res = await fetch("/api/hotels/book", {
        method: "POST",
        body: JSON.stringify({
          hotelId: hotel.id,
          hotelName: hotel.name,
          amount: parseInt(hotel.price.toString().replace(/[^0-9]/g, "")) || 5000,
          userName: "Test User",
          userEmail: "user@example.com"
        }),
      });
      const orderData = await res.json();
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "Oceanic Viz Booking",
        description: `Booking for ${hotel.name}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          alert("Payment Successful! Booking ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Test User",
          email: "user@example.com",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Booking initiation failed. Ensure Razorpay keys are configured.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          
          {/* Main Search Area */}
          <div className="lg:col-span-8">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
                <Sparkles size={12} />
                AI-Driven Exploration
              </div>
              <h1 className="text-5xl font-black text-black dark:text-white leading-tight">
                Coastal <span className="text-blue-600">Hotels</span>
              </h1>
              <p className="mt-4 text-lg font-bold text-zinc-800 dark:text-zinc-400 max-w-2xl">
                Real-time booking and discovery engine powered by Deep Intelligence. 
                Find exclusive stays across the 7,500km Indian coastline.
              </p>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-10 blur group-hover:opacity-20 transition duration-500"></div>
              <div className="relative">
                <Search className={`absolute left-5 top-1/2 -translate-y-1/2 ${loading ? 'animate-spin text-blue-500' : 'text-zinc-950'}`} size={22} />
                <input
                  type="text"
                  placeholder="Enter destination, landmark or vibe..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                  className="w-full rounded-2xl border-2 border-zinc-200 bg-white py-5 pl-14 pr-32 text-lg font-bold text-black shadow-2xl focus:border-blue-600 focus:outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-white"
                />
                <button 
                  onClick={() => handleSearch()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-black px-6 py-2.5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-zinc-800 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-4">
            <div className="jira-card h-full bg-blue-600 text-white border-none shadow-2xl shadow-blue-500/30 flex flex-col justify-between overflow-hidden">
              <div className="relative z-10 p-2">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Grok Assistant</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-100 uppercase">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Location Expert Active
                    </div>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10">
                  <p className="text-sm font-bold leading-relaxed italic">
                    "{aiTip}"
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-6 p-2 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-2">Nearby Assistant</p>
                <button className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-xs font-bold transition hover:bg-white/20">
                  <div className="flex items-center gap-2">
                    <Navigation size={14} />
                    Find near my location
                  </div>
                  <Sparkles size={14} />
                </button>
                <button className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-xs font-bold transition hover:bg-white/20">
                  <div className="flex items-center gap-2">
                    <Hotel size={14} />
                    Top Rated Stays
                  </div>
                  <Star size={12} className="fill-white" />
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="group overflow-hidden rounded-3xl border-2 border-zinc-100 bg-white shadow-lg transition-all hover:border-blue-500/30 hover:shadow-2xl dark:border-white/10 dark:bg-zinc-900">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-black text-black shadow-xl backdrop-blur">
                  <Star size={14} className="fill-blue-600 text-blue-600" />
                  {hotel.rating}
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/80 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-[0.1em] backdrop-blur-md">
                  <MapPin size={12} className="text-blue-500" />
                  {hotel.region || "Coastal"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {hotel.location}
                </div>
                <h3 className="mt-2 text-2xl font-black text-black dark:text-white line-clamp-1">{hotel.name}</h3>
                <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-6 dark:border-zinc-800">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Nightly Rate</span>
                    <div className="text-2xl font-black text-black dark:text-white">{hotel.price}</div>
                  </div>
                  <button 
                    onClick={() => handleBook(hotel)}
                    className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 shadow-xl shadow-blue-500/40 uppercase tracking-widest"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hotels.length === 0 && (
          <div className="mt-24 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-white/5">
              <Waves className="text-zinc-300" size={40} />
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white">Zero Results Found</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 font-bold">The AI couldn't find matches for this specific query. Try a broader location.</p>
          </div>
        )}
      </main>
    </div>
  );
}
