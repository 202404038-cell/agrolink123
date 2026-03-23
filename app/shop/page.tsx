"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { 
  FileText, FileCode, ShoppingCart, Search, 
  User, Sprout, Loader2, Code
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

  // LOGICA DE DESCARGAS
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
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?><productos>${productsData?.productos?.map((p: any) => `<item><id>${p.id}</id><nombre>${p.nombre}</nombre><precio>${p.precio_mayoreo}</precio></item>`).join('')}</productos>`;
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agro_data.xml";
    link.click();
  };

  const handleDownloadTXT = () => {
    if (!fullData) return;
    const txtContent = productsData?.productos?.map((p: any) => `${p.nombre} - $${p.precio_mayoreo} / ${p.unidad_medida}`).join('\n');
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

  if (!session) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold">AgroLink</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}><User /></Button>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Buscar insumos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button onClick={fetchFullData} variant="outline" className="gap-2">
            <Code className="h-4 w-4" /> API Access
          </Button>
        </div>

        {/* PANEL API ACCESS (IGUAL A TU FOTO 2) */}
        {isShowingJSON && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Developer API Access</CardTitle>
              <CardDescription className="text-xs">Usa estos recursos para integrar tus sistemas de gestión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800">
                <p className="text-[10px] uppercase text-slate-500 font-bold mb-1 tracking-wider">Endpoint URL</p>
                <code className="text-emerald-400 text-xs break-all">
                  https://agrolink.render.com/api/v1/productos
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={handleDownloadXML} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] h-8 font-bold">
                  <FileCode className="mr-1 h-3 w-3" /> Descargar XML
                </Button>
                <Button size="sm" onClick={handleDownloadTXT} className="bg-slate-600 hover:bg-slate-700 text-white text-[10px] h-8 font-bold">
                  <FileText className="mr-1 h-3 w-3" /> Descargar TXT
                </Button>
              </div>
              <Button size="sm" variant="outline" onClick={handleDownloadJSON} className="w-full text-[10px] h-8 font-medium">
                Descargar JSON Completo
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsData?.productos?.filter((p: any) => p.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map((product: any) => (
            <Card key={product.id} className="flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="p-4">
                <Badge variant="secondary" className="w-fit mb-2">{product.categoria_nombre}</Badge>
                <CardTitle className="text-base">{product.nombre}</CardTitle>
                <CardDescription className="font-bold text-emerald-700">
                  ${product.precio_mayoreo} / {product.unidad_medida}
                </CardDescription>
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