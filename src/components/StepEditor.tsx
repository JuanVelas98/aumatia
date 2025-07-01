
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface Paso {
  descripcion: string;
  codigo: string;
  videoUrl: string;
}

interface StepEditorProps {
  steps: Paso[];
  onChange: (steps: Paso[]) => void;
}

export const StepEditor = ({ steps, onChange }: StepEditorProps) => {
  const addStep = () => {
    onChange([...steps, { descripcion: "", codigo: "", videoUrl: "" }]);
  };

  const updateStep = (index: number, field: keyof Paso, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange(newSteps);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold text-aumatia-dark">
          Pasos del Flujo
        </Label>
        <Button
          type="button"
          onClick={addStep}
          size="sm"
          className="bg-aumatia-blue hover:bg-aumatia-blue/90"
        >
          <Plus size={16} className="mr-1" />
          Agregar Paso
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={index} className="border-l-4 border-l-aumatia-blue/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 mt-6">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="w-6 h-6 rounded-full bg-aumatia-blue text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor={`step-desc-${index}`}>
                      Descripción del Paso *
                    </Label>
                    <Textarea
                      id={`step-desc-${index}`}
                      value={step.descripcion}
                      onChange={(e) => updateStep(index, "descripcion", e.target.value)}
                      placeholder="Describe qué hace este paso... (puedes usar saltos de línea para párrafos)"
                      required
                      rows={3}
                      className="resize-vertical"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`step-code-${index}`}>
                      Código (opcional)
                    </Label>
                    <Textarea
                      id={`step-code-${index}`}
                      value={step.codigo}
                      onChange={(e) => updateStep(index, "codigo", e.target.value)}
                      placeholder="Código para copiar y pegar..."
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`step-video-${index}`}>
                      URL del Video (opcional)
                    </Label>
                    <Input
                      id={`step-video-${index}`}
                      value={step.videoUrl}
                      onChange={(e) => updateStep(index, "videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="flex items-start mt-6">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {steps.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No hay pasos agregados. Haz clic en "Agregar Paso" para comenzar.
          </p>
        )}
      </div>
    </div>
  );
};
