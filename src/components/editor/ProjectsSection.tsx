import { FolderOpen, Plus, Trash2, GripVertical, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/resume";

interface ProjectsSectionProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

const ProjectsSection = ({ data, onChange }: ProjectsSectionProps) => {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const addProject = () => {
    onChange([...data, {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
    }]);
  };

  const update = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(data.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const remove = (id: string) => {
    onChange(data.filter((p) => p.id !== id));
  };

  const addTech = (id: string) => {
    const tech = (techInputs[id] || "").trim();
    const project = data.find((p) => p.id === id);
    if (tech && project && !project.technologies.includes(tech)) {
      update(id, "technologies", [...project.technologies, tech]);
      setTechInputs((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const removeTech = (id: string, tech: string) => {
    const project = data.find((p) => p.id === id);
    if (project) {
      update(id, "technologies", project.technologies.filter((t) => t !== tech));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <FolderOpen className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Projects</h3>
        </div>
        <Button variant="outline" size="sm" onClick={addProject} className="gap-1">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No projects added yet</p>
          <Button variant="ghost" size="sm" onClick={addProject} className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            Add a project
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project, index) => (
            <div key={project.id} className="p-4 border border-border rounded-lg bg-card/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">Project {index + 1}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Project Name</Label>
                  <Input placeholder="E-Commerce Platform" value={project.name} onChange={(e) => update(project.id, "name", e.target.value)} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <Textarea placeholder="Built a full-stack e-commerce platform..." value={project.description} onChange={(e) => update(project.id, "description", e.target.value)} className="mt-1 min-h-[80px] resize-none" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Start Date (optional)</Label>
                  <Input placeholder="Jan 2024" value={project.startDate || ""} onChange={(e) => update(project.id, "startDate", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">End Date (optional)</Label>
                  <Input placeholder="Mar 2024" value={project.endDate || ""} onChange={(e) => update(project.id, "endDate", e.target.value)} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">URL (optional)</Label>
                  <Input placeholder="https://github.com/..." value={project.url || ""} onChange={(e) => update(project.id, "url", e.target.value)} className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Technologies</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Add tech and press Enter..."
                      value={techInputs[project.id] || ""}
                      onChange={(e) => setTechInputs((prev) => ({ ...prev, [project.id]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech(project.id); } }}
                      className="flex-1"
                    />
                    <Button onClick={() => addTech(project.id)} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                          {tech}
                          <button onClick={() => removeTech(project.id, tech)} className="ml-1 hover:bg-destructive/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
