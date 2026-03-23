"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { 
  FileCode,
  ShoppingCart, 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Check, 
  Info, 
  LogOut,
  User,
  Sprout,
  Loader2,
  Trash2,
  Copy,
  ExternalLink,
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { toast } from "sonner"
import type { Producto, Categoria } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ShopPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [cart, setCart] = useState<{productoId: number, name: string, quantity: number, price: number}[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const [fullData, setFullData] = useState<any>(null)
  const [isShowingJSON, setIsShowingJSON] = useState(false)
  const [isFetchingJSON, setIsFetchingJSON] = useState(false)

  const { data: productsData } = useSWR("/api/v1/productos", fetcher)
  const { data: categoriesData } = useSWR("/api/v1/categorias", fetcher)
  
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSession(data.data)
          setApiKey(data.data.apiKey)
        } else {
          router.push("/login")
        }
      })
  }, [router])

  const products: Producto[] = productsData?.data || []
  const categories: Categoria[] = categoriesData?.data || []

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? p.categoria_id === selectedCategory : true
    return matchesSearch && matchesCategory && p.activo
  })

  // --- FUNCIONES DE DATOS ---
  const handleToggleJSON = async () => {
    if (isShowingJSON) { setIsShowingJSON(false); return; }
    setIsFetchingJSON(true)
    try {
      const response = await fetch(`/api/v1/full_data?key=${apiKey}`)
      const data = await response.json()
      setFullData(data); setIsShowingJSON(true)
    } catch (error) { toast.error("Error al obtener datos") } 
    finally { setIsFetchingJSON(false) }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url; link.download = "agrolink_full_data.json"; link.click()
  }

  const handleDownloadXML = () => {
    if (!fullData) return;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><root>${JSON.stringify(fullData)}</root>`
    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = "agro_data.xml"; link.click()
  }

  const handleDownloadTXT = () => {
    if (!fullData) return;
    const txtContent = JSON.stringify(fullData, null, 4)
    const blob = new Blob([txtContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = "agro_data.txt"; link.click()
  }

  // --- CARRITO LOGIC ---
  function addToCart(product: Producto) {
    setCart(prev => {
      const existing = prev.find(item => item.productoId === product.id)
      if (existing) {
        return prev.map(item => item.productoId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { productoId: product.id, name: product.nombre, quantity: 1, price: product.precio_mayoreo }]
    })
    toast.success(`${product.nombre} añadido`)
  }

  function updateQuantity(id: number, delta: number) {
    setCart(prev => prev.map(item => {
      if (item.productoId === id) return { ...item, quantity: Math.max(1, item.quantity + delta) }
      return item
    }))
  }

  async function checkout() {
    try {
      const res = await fetch("/api/v1/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({
          empresa_id: session.empresaId,
          items: cart.map(item => ({ producto_id: item.productoId, cantidad: item.quantity }))
        })
      })
      if ((await res.json()).success) { toast.success("Pedido realizado"); setCart([]) }
    } catch (err) { toast.error("Error en pedido") }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">AgroLink Market</span>
          </div>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-primary text-[10px] rounded-full px-1 text-white">{cart.length}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Tu Carrito</SheetTitle></SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.map(item => (
                    <div key={item.productoId} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.productoId, -1)}>-</Button>
                        <span>{item.quantity}</span>
                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.productoId, 1)}>+</Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4" onClick={checkout} disabled={cart.length === 0}>
                    Confirmar ${cart.reduce((s, i) => s + (i.price * i.quantity), 0).toFixed(2)}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

<Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2"><Code className="h-4 w-4" /> API Access</Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader><SheetTitle>API & Exportación</SheetTitle></SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-[10px] font-bold mb-2">TU API KEY</p>
                    <code className="text-[10px] break-all text-primary">{apiKey}</code>
                  </div>
                  <div className="space-y-3">
                    <Button onClick={handleToggleJSON} variant="secondary" className="w-full justify-start text-xs">
                      {isFetchingJSON ? <Loader2 className="animate-spin mr-2" /> : <FileCode className="mr-2 h-4 w-4" />}
                      Full Data JSON
                    </Button>
                    {isShowingJSON && fullData && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" onClick={handleDownloadXML} className="bg-emerald-600 text-white text-[10px] h-8">
                            Descargar XML
                          </Button>
                          <Button size="sm" onClick={handleDownloadTXT} className="bg-slate-600 text-white text-[10px] h-8">
                            Descargar TXT
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" onClick={handleDownloadJSON} className="w-full text-[10px] h-8">
                          Descargar JSON
                        </Button>
                        <pre className="p-2 bg-slate-950 text-green-400 text-[9px] rounded max-h-40 overflow-auto">
                          {JSON.stringify(fullData, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={() => { fetch("/api/v1/auth/logout", {method: "POST"}); router.push("/login") }}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-secondary/30 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <Input placeholder="Buscar productos..." className="max-w-md bg-background" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <div className="flex gap-2">
            <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)}>Todos</Button>
            {categories.map(c => (
              <Button key={c.id} variant={selectedCategory === c.id ? "default" : "outline"} onClick={() => setSelectedCategory(c.id)}>{c.nombre}</Button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="flex flex-col h-full">
            <div className="h-40 bg-muted flex items-center justify-center">
              {product.imagen_url ? <img src={product.imagen_url} className="object-cover h-full w-full" /> : <Sprout className="h-10 w-10 opacity-20" />}
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">{product.nombre}</CardTitle>
              <CardDescription className="text-[10px]">${product.precio_mayoreo} / {product.unidad_medida}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 mt-auto">
              <Button size="sm" className="w-full text-xs font-bold" onClick={() => addToCart(product)}>Añadir al carrito</Button>
            </CardFooter>
          </Card>
        ))}
      </main>
    </div>
  )
}