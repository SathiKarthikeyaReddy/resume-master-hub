import { useState } from "react";
import { Briefcase, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkExperience } from "@/types/resume";

interface ExperienceSectionProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

const ExperienceSection = ({ data, onChange }: ExperienceSectionProps) => {
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newExp]);
  };

  const updateExperience = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Briefcase className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Work Experience</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addExperience}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            No work experience added yet
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={addExperience}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add your first experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 border border-border rounded-lg bg-card/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Experience {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Job Title
                  </Label>
                  <Input
                    placeholder="Software Engineer"
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(exp.id, "jobTitle", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Company
                  </Label>
                  <Input
                    placeholder="Google"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Location
                  </Label>
                  <Input
                    placeholder="Mountain View, CA"
                    value={exp.location}
                    onChange={(e) =>
                      updateExperience(exp.id, "location", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">
                      Start Date
                    </Label>
                    <Input
                      placeholder="Jan 2020"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">
                      End Date
                    </Label>
                    <Input
                      placeholder="Present"
                      value={exp.current ? "Present" : exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    updateExperience(exp.id, "current", checked as boolean)
                  }
                />
                <Label
                  htmlFor={`current-${exp.id}`}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  I currently work here
                </Label>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  placeholder="• Led development of key features...&#10;• Improved performance by 40%...&#10;• Mentored 3 junior developers..."
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(exp.id, "description", e.target.value)
                  }
                  className="mt-1 min-h-[100px] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
