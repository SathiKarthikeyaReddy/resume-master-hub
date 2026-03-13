const stats = [
  { value: "50K+", label: "Resumes Created" },
  { value: "95%", label: "ATS Pass Rate" },
  { value: "4.9/5", label: "User Rating" },
  { value: "10min", label: "Avg. Build Time" },
];

const StatsSection = () => {
  return (
    <section className="py-16 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
