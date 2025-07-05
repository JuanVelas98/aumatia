import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, ExternalLink, Download, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { toast } from "@/hooks/use-toast";
import { Flujo } from "@/hooks/useRecursos";

interface FlujosTableProps {
  flujos: Flujo[];
  loading: boolean;
  onEdit: (flujo: Flujo) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, currentVisibility: boolean) => void;
}

export const FlujosTable = ({ 
  flujos, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}: FlujosTableProps) => {
  const generateWordDocument = async (flujo: Flujo) => {
    try {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.nombre,
                    bold: true,
                    size: 32,
                  }),
                ],
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generado el: ${new Date().toLocaleDateString('es-ES')}`,
                    italics: true,
                    size: 20,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Descripción",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.descripcion || "Sin descripción disponible",
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Plataformas Compatibles",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: flujo.plataformas?.length > 0 
                      ? flujo.plataformas.map(p => `• ${p.nombre}`).join('\n')
                      : "• No se especificaron plataformas",
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),
              ...(flujo.link_descarga ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Enlace de Descarga",
                      bold: true,
                      size: 24,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: flujo.link_descarga,
                      size: 22,
                      color: "0000FF",
                    }),
                  ],
                  spacing: { after: 400 },
                }),
              ] : []),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Pasos del Flujo",
                    bold: true,
                    size: 24,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
              }),
              ...(flujo.pasos?.flatMap((paso, index) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Paso ${index + 1}`,
                      bold: true,
                      size: 22,
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 300, after: 150 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paso.descripcion || "Sin descripción",
                      size: 22,
                    }),
                  ],
                  spacing: { after: 200 },
                }),
                ...(paso.codigo ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Código:",
                        bold: true,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: paso.codigo,
                        size: 20,
                        font: "Courier New",
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ] : []),
                ...(paso.videoUrl ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Video de referencia: ",
                        bold: true,
                        size: 20,
                      }),
                      new TextRun({
                        text: paso.videoUrl,
                        size: 20,
                        color: "0000FF",
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ] : []),
              ]) || []),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flujo-${flujo.nombre.toLowerCase().replace(/\s+/g, '-')}-pasos.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Descarga completada",
        description: `El documento "${flujo.nombre}" se ha descargado correctamente`,
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el documento Word",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando flujos...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Flujos</CardTitle>
        <CardDescription>
          Todos los flujos disponibles en la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Plataformas</TableHead>
              <TableHead>Pasos</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flujos.map((flujo) => (
              <TableRow key={flujo.id}>
                <TableCell className="font-medium">{flujo.nombre}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {flujo.descripcion || 'Sin descripción'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {flujo.plataformas?.slice(0, 2).map((platform, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {platform.nombre}
                      </Badge>
                    ))}
                    {flujo.plataformas?.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{flujo.plataformas.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{flujo.pasos?.length || 0} pasos</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={flujo.visible}
                      onCheckedChange={() => onToggleVisibility(flujo.id, flujo.visible)}
                    />
                    {flujo.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {flujo.creado_en ? new Date(flujo.creado_en).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/recursos/detalle?id=${flujo.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => generateWordDocument(flujo)}
                      title="Descargar pasos en Word"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(flujo)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(flujo.id)}
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
