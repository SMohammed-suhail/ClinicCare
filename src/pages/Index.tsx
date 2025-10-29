import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, Stethoscope, Users, Receipt, Shield } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="flex justify-center">
              <div className="p-4 bg-primary rounded-3xl shadow-elevated animate-pulse-glow">
                <Activity className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              ClinicCare
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Modern clinic management system designed for healthcare professionals. 
              Streamline patient registration, consultations, and billing in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 shadow-elevated hover:shadow-elevated">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Your Clinic
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for modern healthcare practices
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Doctor Features */}
          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all animate-slide-up">
            <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">For Doctors</h3>
            <p className="text-muted-foreground mb-4">
              Access complete patient histories, add prescriptions, and manage consultations efficiently.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Patient queue management
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Digital prescriptions
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Patient history tracking
              </li>
            </ul>
          </div>

          {/* Receptionist Features */}
          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 bg-secondary/10 rounded-xl w-fit mb-4">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">For Receptionists</h3>
            <p className="text-muted-foreground mb-4">
              Register patients, manage tokens, and handle billing seamlessly.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Quick patient registration
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Automatic token generation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Revenue tracking
              </li>
            </ul>
          </div>

          {/* Billing Features */}
          <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 bg-accent rounded-xl w-fit mb-4">
              <Receipt className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Smart Billing</h3>
            <p className="text-muted-foreground mb-4">
              Generate bills instantly after consultations with complete transparency.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Instant bill generation
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Payment tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Revenue analytics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-primary to-primary-glow rounded-3xl p-12 md:p-16 text-center shadow-elevated">
          <Shield className="h-16 w-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Clinic?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join modern healthcare professionals using ClinicCare to streamline their practice
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-lg px-8 shadow-elevated"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Activity className="h-5 w-5 text-primary" />
            <span>ClinicCare © 2025 - Modern Healthcare Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
