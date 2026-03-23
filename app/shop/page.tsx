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
  Code,
  ExternalLink
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
  const [fullData, setFullData] = useState<any>(null);
  const [isShowingJSON, setIsShowingJSON] = useState(false);
  const [isFetchingJSON, setIsFetchingJSON] = useState(false);

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
      });
  }, [router]);

  // FUNCIONES DE DESCARGA
  const handleDownloadJSON = () => {
    if (!fullData) return;
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agro_data.json";
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
      setIsShowingJSON(!isShowingJSON);
    } catch (error) {
      toast.error("Error al obtener datos");
    } finally {
      setIsFetchingJSON(false);
    }
  };

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

  const checkout = async () => {
    toast.info("Procesando pedido...");
    setCart([]);
  };

  if (!session) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">AgroLink</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}><User /></Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <Input 
            placeholder="Buscar..." 
            className="max-w-md" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={fetchFullData} variant="outline" className="gap-2">
            <Code className="h-4 w-4" /> API Access
          </Button>
        </div>

        {/* PANEL API ACCESS COMPLETO */}
        {isShowingJSON && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Developer API Access</CardTitle>
              <CardDescription>Usa estos recursos para integrar tus sistemas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-950 p-4">
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Endpoint URL</p>
                <code className="text-emerald-400 text-xs break-all">
                  https://agrolink.render.com/api/v1/productos
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={handleDownloadXML} className="bg-emerald-600 hover:bg-emerald-700 text-[10px] h-8">
                  <FileCode className="mr-1 h-3 w-3" /> Descargar XML
                </Button>
                <Button size="sm" onClick={handleDownloadTXT} className="bg-slate-600 hover:bg-slate-700 text-[10px] h-8">
                  <FileText className="mr-1 h-3 w-3" /> Descargar TXT
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={handleDownloadJSON} className="w-full text-[10px] h-8">
                Descargar JSON Completo
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsData?.productos?.filter((p: any) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((product: any) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <Badge className="w-fit mb-2">{product.categoria_nombre}</Badge>
                <CardTitle className="text-lg">{product.nombre}</CardTitle>
                <CardDescription className="font-bold text-emerald-700">
                  ${product.precio_mayoreo} / {product.unidad_medida}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button onClick={() => addToCart(product)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Añadir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" className="rounded-full shadow-2xl" onClick={checkout}>
            <ShoppingCart className="mr-2" /> Pagar ({cart.length})
          </Button>
        </div>
      )}
    </div>
  );
}