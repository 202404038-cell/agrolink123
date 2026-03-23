"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { 
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

  // Se agrega nuevos estados para Full Data JSON
  const [fullData, setFullData] = useState<any>(null)
  const [isShowingJSON, setIsShowingJSON] = useState(false)
  const [isFetchingJSON, setIsFetchingJSON] = useState(false)

  // Se agrega nuevos estados para XML y TXT
  const [isShowingXML, setIsShowingXML] = useState(false);
  const [isShowingTXT, setIsShowingTXT] = useState(false);

  const { data: productsData, error: productsError } = useSWR("/api/v1/productos", fetcher)
  const { data: categoriesData } = useSWR("/api/v1/categorias", fetcher)
  const [viewData, setViewData] = useState<string | null>(null); // Guardará el texto formateado
  const [viewType, setViewType] = useState<'json' | 'xml' | 'txt' | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  
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

  function addToCart(product: Producto) {
    setCart(prev => {
      const existing = prev.find(item => item.productoId === product.id)
      if (existing) {
        return prev.map(item => 
          item.productoId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { productoId: product.id, name: product.nombre, quantity: 1, price: product.precio_mayoreo }]
    })
    toast.success(`${product.nombre} añadido al carrito`)
  }

  function removeFromCart(id: number) {
    setCart(prev => prev.filter(item => item.productoId !== id))
  }

  function updateQuantity(id: number, delta: number) {
    setCart(prev => prev.map(item => {
      if (item.productoId === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const totalCart = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  async function checkout() {
    if (cart.length === 0) return

    try {
      const res = await fetch("/api/v1/pedidos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify({
          empresa_id: session.empresaId,
          notas: "Pedido realizado desde la web shop",
          items: cart.map(item => ({
            producto_id: item.productoId,
            cantidad: item.quantity
          }))
        })
      })

      const data = await res.json()
      if (data.success) {
        toast.success("¡Pedido realizado con éxito!")
        setCart([])
      } else {
        toast.error("Error al realizar el pedido: " + data.error?.message)
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor")
    }
  }

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST" })
    router.push("/login")
  }

  // Funciones para manejar la visualización y descarga del JSON completo
  const handleToggleJSON = async () => {
    if (isShowingJSON) {
      setIsShowingJSON(false)
      return;
    }

    setIsFetchingJSON(true)
    try {
      const response = await fetch(`/api/v1/full_data?key=${apiKey}`)
      const data = await response.json()
      setFullData(data)
      setIsShowingJSON(true)
    } catch (error) {
      console.error("Error: ", error)
    } finally {
      setIsFetchingJSON(false)
    }
  }

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "agrolink_full_data.json"
    link.click()
  }

  // --- FUNCIÓN PARA XML ---
  const handleDownloadXML = () => {
    if (!fullData) return;
    // Conversión simple a XML
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <root>
    ${Object.entries(fullData).map(([key, val]) => `<${key}>${JSON.stringify(val)}</${key}>`).join('\n  ')}
  </root>`;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "agro_data.xml";
    link.click();
  };

  // --- FUNCIÓN PARA TXT ---
  const handleDownloadTXT = () => {
    if (!fullData) return;
    // Convertimos el JSON a un texto plano legible
    const txtContent = JSON.stringify(fullData, null, 4).replace(/[{\|}|"|,]/g, "");
    
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "agro_data.txt";
    link.click();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (    
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">AgroLink Market</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{session.name}</span>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-card/95 backdrop-blur-md border-l border-border/50">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Tu Carrito
                  </SheetTitle>
                  <SheetDescription>
                    Revisa los productos seleccionados antes de confirmar tu pedido.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 space-y-4 max-h-[60vh] overflow-auto pr-2">
                  {cart.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
                      <p>Sú carrito está vacío</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.productoId} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} / unidad</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => updateQuantity(item.productoId, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7 rounded-sm" onClick={() => updateQuantity(item.productoId, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.productoId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-muted-foreground">Total Estimado</span>
                    <span className="text-2xl font-bold">${totalCart.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20" disabled={cart.length === 0} onClick={checkout}>
                    Confirmar Pedido
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 border-primary/30 hover:bg-primary/5 hidden lg:flex items-center gap-2">
                  <Code className="h-4 w-4" /> Ver API Access
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Acceso API para Desarrolladores</SheetTitle>
                  <SheetDescription>
                    Usa esta llave para integrar nuestros productos y catálogos en tus propios sistemas.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground mr-auto tracking-widest text-left">Tu X-API-Key</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-background rounded border border-border text-xs break-all text-primary font-mono text-left">
                        {apiKey}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => {
                        navigator.clipboard.writeText(apiKey)
                        toast.success("API Key copiada al portapapeles")
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-primary" /> Endpoints Recomendados
                    </h4>

                    {/* Nuevo Full Data JSON */}
                    <div className="space-y-3">
                      <button 
                        onClick={handleToggleJSON}
                        disabled={isFetchingJSON}
                        className="w-full text-left block p-3 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <p className="font-medium text-sm">Full Data JSON</p>
                        <p className="text-xs text-muted-foreground">
                          {isFetchingJSON ? "Cargando..." : isShowingJSON ? "Click para cerrar vista previa" : "Obtén todo el catálogo y estadísticas en un solo archivo."}
                        </p>
                      </button>

                      {/* Panel de visualizacion dinámica */}
                      {isShowingJSON && fullData && (
                        <div className="mt-4 border rounded-lg bg-slate-950 overflow-hidden shadow-xl">
                          <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-900/50">
                            <span className="text-[10px] font-mono text-slate-400 px-2">full_data.json</span>
                            <button 
                              onClick={handleDownloadJSON}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                            >
                              Descargar JSON
                            </button>
                          </div>
                          <pre className="p-4 text-[10px] font-mono overflow-auto max-h-80 text-green-400 custom-scrollbar">
                            {JSON.stringify(fullData, null, 2)}</pre>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        
                        {/* OPCIÓN XML */}
                        <div className="border rounded-lg p-4 bg-card">
                          <p className="font-bold text-sm mb-1">Formato XML</p>
                          <p className="text-xs text-muted-foreground mb-3">Estructura jerárquica para sistemas antiguos.</p>
                          <button 
                            onClick={() => { setIsShowingXML(!isShowingXML); if(!fullData) handleToggleJSON(); }}
                            className="w-full bg-secondary text-secondary-foreground py-2 rounded-md text-xs hover:bg-secondary/80 transition"
                          >
                            {isShowingXML ? "Cerrar Vista" : "Ver / Descargar XML"}
                          </button>
                          
                          {isShowingXML && fullData && (
                            <div className="mt-2">
                              <button onClick={handleDownloadXML} className="w-full mb-2 bg-green-600 text-white py-1 rounded text-[10px]">Descargar .xml</button>
                              <pre className="p-2 text-[9px] bg-black text-blue-300 max-h-32 overflow-auto rounded">
                                {`<?xml version="1.0" ... ?>\n<root>...`}
                              </pre>
                            </div>
                          )}
                        </div>

                        {/* OPCIÓN TXT */}
                        <div className="border rounded-lg p-4 bg-card">
                          <p className="font-bold text-sm mb-1">Formato TXT</p>
                          <p className="text-xs text-muted-foreground mb-3">Texto plano ideal para logs o lectura rápida.</p>
                          <button 
                            onClick={() => { setIsShowingTXT(!isShowingTXT); if(!fullData) handleToggleJSON(); }}
                            className="w-full bg-secondary text-secondary-foreground py-2 rounded-md text-xs hover:bg-secondary/80 transition"
                          >
                            {isShowingTXT ? "Cerrar Vista" : "Ver / Descargar TXT"}
                          </button>

                          {isShowingTXT && fullData && (
                            <div className="mt-2">
                              <button onClick={handleDownloadTXT} className="w-full mb-2 bg-slate-600 text-white py-1 rounded text-[10px]">Descargar .txt</button>
                              <pre className="p-2 text-[9px] bg-black text-yellow-200 max-h-32 overflow-auto rounded">
                                {JSON.stringify(fullData, null, 2).substring(0, 200)}...
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>

                      <a href={`/api/v1/productos?key=${apiKey}`} target="_blank" className="block p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <p className="font-medium text-sm">Solo Productos</p>
                        <p className="text-xs text-muted-foreground">Listado completo de existencias en tiempo real.</p>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero / Filter Section */}
      <section className="bg-secondary/30 border-b border-border/50 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
            <div className="space-y-4 w-full md:max-w-md">
              <h2 className="text-3xl font-bold tracking-tight">Catálogo de Huerta</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar frutas o verduras..." 
                  className="pl-10 h-11 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto mt-4 md:mt-0 no-scrollbar">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm" 
                className="rounded-full px-4"
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Button>
              {categories.map(cat => (
                <Button 
                  key={cat.id} 
                  variant={selectedCategory === cat.id ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full px-4 whitespace-nowrap"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.nombre}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 bg-muted relative flex items-center justify-center overflow-hidden">
                {product.imagen_url ? (
                  <img src={product.imagen_url} alt={product.nombre} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Sprout className="h-16 w-16 text-primary/20" />
                )}
                <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground border-border/50" variant="outline">
                  {product.unidad_medida}
                </Badge>
              </div>
              <CardHeader className="p-4 pb-0">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{product.nombre}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-xs h-8">
                  {product.descripcion || "Producto fresco recolectado de la huerta AgroLink."}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-4 flex-1">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black text-primary">
                    ${Number(product.precio_mayoreo || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    En stock: <span className="font-bold text-foreground">{product.cantidad_disponible}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full h-10 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border-primary/20 transition-all font-bold" 
                  variant="outline"
                  onClick={() => addToCart(product)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Añadir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-xl font-bold">No se encontraron productos</h3>
            <p className="text-muted-foreground">Intenta con otra búsqueda o categoría.</p>
          </div>
        )}
      </main>
    </div>
  )
}
