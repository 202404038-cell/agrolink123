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