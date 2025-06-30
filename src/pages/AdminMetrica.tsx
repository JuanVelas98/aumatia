
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DynamicHeader } from "@/components/DynamicHeader";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Download, FileText, Clock, CheckSquare, Filter, BarChart as BarChartIcon, PieChart as PieChartIcon } from "lucide-react";

interface MetricaSummary {
  totalDescargas: number;
  totalFormularios: number;
  tiempoPromedio: number;
  totalPasos: number;
}

interface RecursoDescarga {
  recurso_id: string;
  total: number;
}

interface TipoEvento {
  tipo_evento: string;
  total: number;
}

interface ClickData {
  descripcion: string;
  pagina: string;
  total: number;
}

interface TiempoPagina {
  pagina: string;
  tiempo_promedio: number;
}

const AdminMetrica = () => {
  const [metricas, setMetricas] = useState<MetricaSummary>({
    totalDescargas: 0,
    totalFormularios: 0,
    tiempoPromedio: 0,
    totalPasos: 0
  });
  const [recursosDescargados, setRecursosDescargados] = useState<RecursoDescarga[]>([]);
  const [tiposEventos, setTiposEventos] = useState<TipoEvento[]>([]);
  const [clicksData, setClicksData] = useState<ClickData[]>([]);
  const [tiemposPagina, setTiemposPagina] = useState<TiempoPagina[]>([]);
  const [filtroFecha, setFiltroFecha] = useState<'7d' | '30d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);

  const isAdmin = true; // En producción esto debería verificarse con autenticación

  useEffect(() => {
    if (isAdmin) {
      fetchMetricas();
    }
  }, [filtroFecha, isAdmin]);

  const getFiltroFecha = () => {
    const now = new Date();
    switch (filtroFecha) {
      case '7d':
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sevenDaysAgo.toISOString();
      case '30d':
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return thirtyDaysAgo.toISOString();
      default:
        return null;
    }
  };

  const fetchMetricas = async () => {
    try {
      setLoading(true);
      const fechaFiltro = getFiltroFecha();
      let query = supabase.from('eventos_usuarios').select('*');
      
      if (fechaFiltro) {
        query = query.gte('creado_en', fechaFiltro);
      }

      const { data: eventos, error } = await query;

      if (error) {
        console.error('Error fetching métricas:', error);
        return;
      }

      // Calcular métricas de resumen
      const descargas = eventos?.filter(e => e.tipo_evento === 'descarga') || [];
      const formularios = eventos?.filter(e => e.tipo_evento === 'formulario_enviado') || [];
      const tiempos = eventos?.filter(e => e.tipo_evento === 'tiempo') || [];
      const pasos = eventos?.filter(e => e.tipo_evento === 'paso_completado') || [];

      const tiempoPromedio = tiempos.length > 0 
        ? tiempos.reduce((acc, curr) => acc + (curr.tiempo_segundos || 0), 0) / tiempos.length 
        : 0;

      setMetricas({
        totalDescargas: descargas.length,
        totalFormularios: formularios.length,
        tiempoPromedio: Math.round(tiempoPromedio),
        totalPasos: pasos.length
      });

      // Recursos más descargados
      const descargasPorRecurso = descargas.reduce((acc: { [key: string]: number }, evento) => {
        const recurso = evento.recurso_id || 'Sin especificar';
        acc[recurso] = (acc[recurso] || 0) + 1;
        return acc;
      }, {});

      setRecursosDescargados(
        Object.entries(descargasPorRecurso)
          .map(([recurso_id, total]) => ({ recurso_id, total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10)
      );

      // Distribución de tipos de eventos
      const eventosPorTipo = eventos?.reduce((acc: { [key: string]: number }, evento) => {
        acc[evento.tipo_evento] = (acc[evento.tipo_evento] || 0) + 1;
        return acc;
      }, {}) || {};

      setTiposEventos(
        Object.entries(eventosPorTipo)
          .map(([tipo_evento, total]) => ({ tipo_evento, total }))
          .sort((a, b) => b.total - a.total)
      );

      // Clicks registrados
      const clicks = eventos?.filter(e => e.tipo_evento === 'click') || [];
      const clicksPorDescripcion = clicks.reduce((acc: { [key: string]: { total: number; pagina: string } }, evento) => {
        const key = evento.descripcion || 'Sin descripción';
        if (!acc[key]) {
          acc[key] = { total: 0, pagina: evento.pagina || 'N/A' };
        }
        acc[key].total += 1;
        return acc;
      }, {});

      setClicksData(
        Object.entries(clicksPorDescripcion)
          .map(([descripcion, data]) => ({ descripcion, pagina: data.pagina, total: data.total }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 10)
      );

      // Tiempo promedio por página
      const tiemposPorPagina = tiempos.reduce((acc: { [key: string]: number[] }, evento) => {
        const pagina = evento.pagina || 'N/A';
        if (!acc[pagina]) acc[pagina] = [];
        acc[pagina].push(evento.tiempo_segundos || 0);
        return acc;
      }, {});

      setTiemposPagina(
        Object.entries(tiemposPorPagina)
          .map(([pagina, tiempos]) => ({
            pagina,
            tiempo_promedio: Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
          }))
          .sort((a, b) => b.tiempo_promedio - a.tiempo_promedio)
          .slice(0, 8)
      );

    } catch (error) {
      console.error('Error al cargar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return minutos > 0 ? `${minutos}m ${segs}s` : `${segs}s`;
  };

  const COLORS = ['#4A90E2', '#1B3A57', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-aumatia-dark mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para ver esta página.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button className="bg-aumatia-blue hover:bg-aumatia-dark">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 font-poppins">
      <DynamicHeader>
        <Link to="/admin_recursos" className="text-aumatia-blue hover:text-aumatia-dark inline-flex items-center group transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver a Admin
        </Link>
      </DynamicHeader>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-aumatia-dark">📊 Dashboard de Métricas</h1>
              <p className="text-gray-600 mt-2">Analytics y estadísticas de comportamiento de usuarios</p>
            </div>
            
            {/* Filtros de fecha */}
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <Filter className="w-4 h-4 text-gray-500 ml-2" />
              {(['7d', '30d', 'all'] as const).map((periodo) => (
                <Button
                  key={periodo}
                  variant={filtroFecha === periodo ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFiltroFecha(periodo)}
                  className={filtroFecha === periodo ? "bg-aumatia-blue" : ""}
                >
                  {periodo === '7d' ? 'Últimos 7 días' : 
                   periodo === '30d' ? 'Últimos 30 días' : 
                   'Todo el tiempo'}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aumatia-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando métricas...</p>
            </div>
          ) : (
            <>
              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Descargas</CardTitle>
                    <Download className="h-4 w-4 text-aumatia-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-aumatia-dark">{metricas.totalDescargas}</div>
                    <p className="text-xs text-gray-500 mt-1">Flujos descargados</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Formularios Enviados</CardTitle>
                    <FileText className="h-4 w-4 text-aumatia-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-aumatia-dark">{metricas.totalFormularios}</div>
                    <p className="text-xs text-gray-500 mt-1">Formularios completados</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Tiempo Promedio</CardTitle>
                    <Clock className="h-4 w-4 text-aumatia-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-aumatia-dark">{formatTiempo(metricas.tiempoPromedio)}</div>
                    <p className="text-xs text-gray-500 mt-1">Por sesión</p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Pasos Completados</CardTitle>
                    <CheckSquare className="h-4 w-4 text-aumatia-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-aumatia-dark">{metricas.totalPasos}</div>
                    <p className="text-xs text-gray-500 mt-1">Pasos de flujos</p>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Gráfico de barras - Recursos más descargados */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartIcon className="h-5 w-5 text-aumatia-blue" />
                      Recursos Más Descargados
                    </CardTitle>
                    <CardDescription>Top 10 flujos con más descargas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        total: {
                          label: "Descargas",
                          color: "#4A90E2",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={recursosDescargados}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="recurso_id" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={12}
                          />
                          <YAxis />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                          />
                          <Bar dataKey="total" fill="#4A90E2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Gráfico circular - Distribución de eventos */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5 text-aumatia-blue" />
                      Distribución de Eventos
                    </CardTitle>
                    <CardDescription>Tipos de eventos registrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{}}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={tiposEventos}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="total"
                            label={({ tipo_evento, percent }) => `${tipo_evento} ${(percent * 100).toFixed(0)}%`}
                          >
                            {tiposEventos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tablas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tabla de clicks */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle>Clicks Registrados</CardTitle>
                    <CardDescription>Botones y enlaces más utilizados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Página</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clicksData.map((click, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{click.descripcion}</TableCell>
                            <TableCell className="text-gray-600">{click.pagina}</TableCell>
                            <TableCell className="text-right font-semibold">{click.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Tabla de tiempo por página */}
                <Card className="border-0 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle>Tiempo por Página</CardTitle>
                    <CardDescription>Tiempo promedio de permanencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Página</TableHead>
                          <TableHead className="text-right">Tiempo Promedio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tiemposPagina.map((tiempo, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{tiempo.pagina}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatTiempo(tiempo.tiempo_promedio)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminMetrica;
