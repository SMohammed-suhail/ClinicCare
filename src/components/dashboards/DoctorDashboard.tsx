import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Activity, LogOut, Users, FileText, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  symptoms: string;
  tokenNumber: number;
  status: 'waiting' | 'consulting' | 'completed';
  prescription?: string;
  createdAt: string;
}

const DoctorDashboard = () => {
  const { logout, userProfile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescription, setPrescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'patients'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData: Patient[] = [];
      snapshot.forEach((doc) => {
        patientsData.push({ id: doc.id, ...doc.data() } as Patient);
      });
      setPatients(patientsData);
    });

    return unsubscribe;
  }, []);

  const handleAddPrescription = async () => {
    if (!selectedPatient || !prescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prescription",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'patients', selectedPatient.id), {
        prescription,
        status: 'completed',
        consultedAt: new Date().toISOString(),
      });
      toast({
        title: "Prescription added",
        description: "Patient consultation completed successfully",
      });
      setSelectedPatient(null);
      setPrescription('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const completedPatients = patients.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, Dr. {userProfile?.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting Patients</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{waitingPatients.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{completedPatients.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List and Prescription */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients Queue */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Patient Queue</CardTitle>
              <CardDescription>Click on a patient to add prescription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No patients registered yet</p>
              ) : (
                patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-card ${
                      selectedPatient?.id === patient.id ? 'border-primary bg-accent' : 'border-border'
                    }`}
                    onClick={() => {
                      setSelectedPatient(patient);
                      setPrescription(patient.prescription || '');
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Age: {patient.age} | Phone: {patient.phone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary">
                          Token #{patient.tokenNumber}
                        </Badge>
                        <Badge
                          variant={
                            patient.status === 'completed'
                              ? 'default'
                              : patient.status === 'consulting'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {patient.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Symptoms:</span> {patient.symptoms}
                    </p>
                    {patient.prescription && (
                      <p className="text-sm mt-2 text-secondary">
                        <span className="font-medium">Prescription added ✓</span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Prescription Form */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Add Prescription</CardTitle>
              <CardDescription>
                {selectedPatient
                  ? `Adding prescription for ${selectedPatient.name}`
                  : 'Select a patient to add prescription'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPatient && (
                <>
                  <div className="p-4 bg-accent rounded-lg space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Patient:</span> {selectedPatient.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Age:</span> {selectedPatient.age}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Symptoms:</span> {selectedPatient.symptoms}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prescription</label>
                    <Textarea
                      placeholder="Enter prescription details, medications, dosage, and instructions..."
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  <Button onClick={handleAddPrescription} disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Complete Consultation'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
