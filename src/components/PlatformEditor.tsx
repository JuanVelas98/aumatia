
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

interface Platform {
  nombre: string;
  link: string;
}

interface PlatformEditorProps {
  platforms: Platform[];
  onChange: (platforms: Platform[]) => void;
}

export const PlatformEditor = ({ platforms, onChange }: PlatformEditorProps) => {
  const addPlatform = () => {
    onChange([...platforms, { nombre: "", link: "" }]);
  };

  const updatePlatform = (index: number, field: keyof Platform, value: string) => {
    const newPlatforms = [...platforms];
    newPlatforms[index] = { ...newPlatforms[index], [field]: value };
    onChange(newPlatforms);
  };

  const removePlatform = (index: number) => {
    onChange(platforms.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold text-aumatia-dark">
          Plataformas Usadas
        </Label>
        <Button
          type="button"
          onClick={addPlatform}
          size="sm"
          className="bg-aumatia-blue hover:bg-aumatia-blue/90"
        >
          <Plus size={16} className="mr-1" />
          Agregar Plataforma
        </Button>
      </div>

      <div className="space-y-3">
        {platforms.map((platform, index) => (
          <Card key={index} className="border-l-4 border-l-aumatia-blue/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`platform-name-${index}`}>
                    Nombre de la Plataforma
                  </Label>
                  <Input
                    id={`platform-name-${index}`}
                    value={platform.nombre}
                    onChange={(e) => updatePlatform(index, "nombre", e.target.value)}
                    placeholder="ej: n8n, Google Sheets"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`platform-link-${index}`}>
                      Link de Referencia
                    </Label>
                    <Input
                      id={`platform-link-${index}`}
                      value={platform.link}
                      onChange={(e) => updatePlatform(index, "link", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlatform(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {platforms.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No hay plataformas agregadas. Haz clic en "Agregar Plataforma" para comenzar.
          </p>
        )}
      </div>
    </div>
  );
};
