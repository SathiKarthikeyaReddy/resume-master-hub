import { GraduationCap, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/resume";

interface EducationSectionProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const EducationSection = ({ data, onChange }: EducationSectionProps) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      description: "",
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Education</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addEducation}
          className="gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No education added yet</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={addEducation}
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add your education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div
              key={edu.id}
              className="p-4 border border-border rounded-lg bg-card/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Education {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">
                    Degree / Certification
                  </Label>
                  <Input
                    placeholder="Bachelor of Science in Computer Science"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Institution
                  </Label>
                  <Input
                    placeholder="Stanford University"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, "institution", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Location
                  </Label>
                  <Input
                    placeholder="Stanford, CA"
                    value={edu.location}
                    onChange={(e) =>
                      updateEducation(edu.id, "location", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Graduation Date
                  </Label>
                  <Input
                    placeholder="May 2020"
                    value={edu.graduationDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "graduationDate", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    GPA (optional)
                  </Label>
                  <Input
                    placeholder="3.8 / 4.0"
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      updateEducation(edu.id, "gpa", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">
                  Description (optional)
                </Label>
                <Textarea
                  placeholder="Relevant coursework, honors, activities..."
                  value={edu.description || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, "description", e.target.value)
                  }
                  className="mt-1 min-h-[80px] resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;
