import { Search, Filter, LayoutGrid, List } from "lucide-react";
import Navbar from "@/components/Navbar";
import ResumeCard from "@/components/dashboard/ResumeCard";
import CreateResumeCard from "@/components/dashboard/CreateResumeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for resumes
const mockResumes = [
  {
    id: "1",
    title: "Software Engineer Resume",
    lastEdited: "2 hours ago",
    template: "modern",
  },
  {
    id: "2",
    title: "Product Manager CV",
    lastEdited: "Yesterday",
    template: "professional",
  },
  {
    id: "3",
    title: "Design Portfolio",
    lastEdited: "3 days ago",
    template: "creative",
  },
  {
    id: "4",
    title: "Marketing Specialist",
    lastEdited: "1 week ago",
    template: "modern",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Resumes
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage all your resumes in one place.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 animate-fade-up-delay-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                className="pl-10 bg-card border-border/50"
              />
            </div>

            {/* View Toggle & Filter */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="border-border/50">
                <Filter className="w-4 h-4" />
              </Button>
              <div className="flex items-center rounded-lg border border-border/50 p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resume Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-up-delay-2">
            <CreateResumeCard />
            {mockResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                title={resume.title}
                lastEdited={resume.lastEdited}
                template={resume.template}
              />
            ))}
          </div>

          {/* Empty State (shown when no resumes) */}
          {mockResumes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium text-foreground mb-2">
                No resumes yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first resume and start landing more interviews!
              </p>
              <Button variant="hero">Create Your First Resume</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
