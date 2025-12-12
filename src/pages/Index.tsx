import { Header } from "@/components/Header";
import { EmployeeForm } from "@/components/EmployeeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        <EmployeeForm />
      </main>
    </div>
  );
};

export default Index;
