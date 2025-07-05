
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Tutorial } from "@/hooks/useRecursos";

interface TutorialesTableProps {
  tutoriales: Tutorial[];
  loading: boolean;
  onEdit: (tutorial: Tutorial) => void;
  onDelete: (id: string) => void;
}

export const TutorialesTable = ({ 
  tutoriales, 
  loading, 
  onEdit, 
  onDelete 
}: TutorialesTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando tutoriales...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Tutoriales</CardTitle>
        <CardDescription>
          Todos los tutoriales disponibles en la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Plataformas</TableHead>
              <TableHead>Video</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tutoriales.map((tutorial) => (
              <TableRow key={tutorial.id}>
                <TableCell className="font-medium">{tutorial.titulo}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {tutorial.descripcion || 'Sin descripción'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {tutorial.plataformas?.slice(0, 2).map((platform, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {platform.nombre}
                      </Badge>
                    ))}
                    {tutorial.plataformas?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tutorial.plataformas.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {tutorial.video_url ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      ✓ Video
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-red-600">
                      ✗ Sin video
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {tutorial.creado_en ? new Date(tutorial.creado_en).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/recursos/detalle?id=${tutorial.id}&tipo=tutorial`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(tutorial)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(tutorial.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
