
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recursos from "./pages/Recursos";
import RecursoDetalle from "./pages/RecursoDetalle";
import AdminRecursos from "./pages/AdminRecursos";
import AdminMetrica from "./pages/AdminMetrica";
import Hablar from "./pages/Hablar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/recursos/detalle" element={<RecursoDetalle />} />
          <Route path="/admin_recursos" element={<AdminRecursos />} />
          <Route path="/admin_metrica" element={<AdminMetrica />} />
          <Route path="/hablar" element={<Hablar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
