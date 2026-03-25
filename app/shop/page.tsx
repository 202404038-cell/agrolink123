"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { 
  FileText, FileCode, ShoppingCart, Search, 
  User, Sprout, Loader2, Code, Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShopPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [isShowingJSON, setIsShowingJSON] = useState(false);

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
  
  const { data: productsData } = useSWR("/api/v1/productos", fetcher);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setSession(data.user);
          setApiKey(data.user.apiKey || "");
        } else {
          router.push("/login");
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
      });
  }, [router]);

  // FUNCIONES DE DESCARGA
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
    if (!productsData) return;
    const blob = new Blob([JSON.stringify(productsData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agro_data.json";
    link.click();
  };

  const handleDownloadXML = () => {
    if (!productsData) return;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><productos>${productsData?.productos?.map((p: any) => `<item><nombre>${p.nombre}</nombre><precio>${p.precio_mayoreo}</precio></item>`).join('')}</productos>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
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
  const handleDownloadTXT = () => {
    if (!productsData) return;
    const txtContent = productsData?.productos?.map((p: any) => `${p.nombre} - $${p.precio_mayoreo}`).join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("URL Local copiada");
  };

  if (!session) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">AgroLink</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}><User className="h-5 w-5" /></Button>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* BUSCADOR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Buscar insumos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button 
            onClick={() => setIsShowingJSON(!isShowingJSON)} 
            variant="outline"
            className={`gap-2 ${isShowingJSON ? "border-emerald-500 text-emerald-600" : ""}`}
          >
            <Code className="h-4 w-4" /> API Access
          </Button>
        </div>

        {/* PANEL API ACCESS (EL DE LA FOTO 2) */}
        {isShowingJSON && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50/50 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-600" />
                Developer API Access (Local)
              </CardTitle>
              <CardDescription className="text-xs">Usa estos recursos para integrar tus sistemas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-widest">Endpoint URL</p>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-emerald-400 text-xs font-mono break-all">
                    http://localhost:3000/api/v1/productos
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-400" onClick={() => copyToClipboard("http://localhost:3000/api/v1/productos")}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleDownloadXML} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] h-9 font-bold">
                  <FileCode className="mr-2 h-4 w-4" /> Descargar XML
                </Button>
                <Button onClick={handleDownloadTXT} className="bg-slate-700 hover:bg-slate-800 text-white text-[11px] h-9 font-bold">
                  <FileText className="mr-2 h-4 w-4" /> Descargar TXT
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
              <Button variant="outline" size="sm" onClick={handleDownloadJSON} className="w-full text-[11px] h-9 border-dashed border-2">
                Descargar JSON Completo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* PRODUCTOS */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsData?.productos?.filter((p: any) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((product: any) => (
            <Card key={product.id} className="flex flex-col hover:shadow-lg transition-all">
              <CardHeader className="p-4">
                <Badge variant="outline" className="w-fit mb-2 text-emerald-700 border-emerald-200">{product.categoria_nombre}</Badge>
                <CardTitle className="text-base">{product.nombre}</CardTitle>
                <p className="text-lg font-bold text-emerald-700 mt-1">${product.precio_mayoreo}</p>
              </CardHeader>
              <CardFooter className="p-4 mt-auto pt-0">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold" onClick={() => toast.success("Añadido")}>
                  Añadir al carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}