"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { 
  FileText,
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
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// 1. Definición del fetcher (Fuera de la función)
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ShopPage() {
  const router = useRouter();
  
  // 2. Estados de la página
  const [session, setSession] = useState<any>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [fullData, setFullData] = useState<any>(null);
  const [isShowingJSON, setIsShowingJSON] = useState(false);
  const [isFetchingJSON, setIsFetchingJSON] = useState(false);

  // 3. Carga de datos
  const { data: productsData } = useSWR("/api/v1/productos", fetcher);
  const { data: categoriesData } = useSWR("/api/v1/categorias", fetcher);

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
      });
  }, [router]);

  // 4. Funciones de Exportación
  const handleDownloadJSON = () => {
    if (!fullData) return;
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agrolink_data.json";
    link.click();
  };

  const handleDownloadXML = () => {
    if (!fullData) return;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><root>${JSON.stringify(fullData)}</root>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agro_data.xml";
    link.click();
  };

  const handleDownloadTXT = () => {
    if (!fullData) return;
    const txtContent = JSON.stringify(fullData, null, 4);
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agro_data.txt";
    link.click();
  };

  const fetchFullData = async () => {
    setIsFetchingJSON(true);
    try {
      const res = await fetch("/api/v1/productos");
      const data = await res.json();
      setFullData(data);
      setIsShowingJSON(true);
    } catch (error) {
      toast.error("Error al obtener datos");
    } finally {
      setIsFetchingJSON(false);
    }
  };

  // 5. Lógica del Carrito
  const addToCart = (product: any) => {
    setCart((prev: any[]) => {
      const existing = prev.find(item => item.productoId === product.id);
      if (existing) {
        return prev.map(item => item.productoId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { productoId: product.id, name: product.nombre, quantity: 1, price: product.precio_mayoreo }];
    });
    toast.success(`${product.nombre} añadido`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev: any[]) => prev.map((item: any) => {
      if (item.productoId === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const checkout = async () => {
    try {
      const res = await fetch("/api/v1/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify({
          empresa_id: session.empresaId,
          items: cart.map((item: any) => ({ producto_id: item.productoId, cantidad: item.quantity }))
        })
      });
      if ((await res.json()).success) {
        toast.success("Pedido realizado");
        setCart([]);
      }
    } catch (err) {
      toast.error("Error en pedido");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold tracking-tight">AgroLink</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar insumos..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={fetchFullData} disabled={isFetchingJSON} variant="outline" className="gap-2">
            {isFetchingJSON ? <Loader2 className="h-4 w-4 animate-spin" /> : <Code className="h-4 w-4" />}
            Acceso API (XML/TXT/JSON)
          </Button>
        </div>

        {isShowingJSON && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50/30">
            <CardHeader>
              <CardTitle className="text-sm">Panel de Exportación</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Button onClick={handleDownloadXML} className="bg-emerald-600 hover:bg-emerald-700">
                <FileCode className="mr-2 h-4 w-4" /> XML
              </Button>
              <Button onClick={handleDownloadTXT} className="bg-slate-600 hover:bg-slate-700">
                <FileText className="mr-2 h-4 w-4" /> TXT
              </Button>
              <Button onClick={handleDownloadJSON} variant="outline">
                JSON Completo
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsData?.productos?.filter((p: any) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((product: any) => (
            <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-4">
                <Badge variant="secondary" className="w-fit mb-2">{product.categoria_nombre}</Badge>
                <CardTitle className="text-lg">{product.nombre}</CardTitle>
                <CardDescription className="text-sm font-bold text-emerald-700">
                  ${product.precio_mayoreo} / {product.unidad_medida}
                </CardDescription>
              </CardHeader>
              <CardFooter className="p-4 mt-auto">
                <Button onClick={() => addToCart(product)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Añadir al carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button size="lg" className="h-14 rounded-full shadow-2xl gap-2 px-6" onClick={checkout}>
            <ShoppingCart className="h-5 w-5" />
            Pagar Pedido ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </Button>
        </div>
      )}
    </div>
  );
}