import { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, doc, updateDoc, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Activity, LogOut, UserPlus, Receipt, Users, DollarSign, CalendarIcon, Filter, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  symptoms: string;
  tokenNumber: number;
  status: 'waiting' | 'consulting' | 'completed';
  prescription?: string;
  billAmount?: number;
  billPaid?: boolean;
  createdAt: string;
  appointmentDate?: string;
}

const ReceptionistDashboard = () => {
  const { logout, userProfile } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [billAmount, setBillAmount] = useState('');
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [appointmentDate, setAppointmentDate] = useState<Date>();

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'patients'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData: Patient[] = [];
      snapshot.forEach((doc) => {
        patientsData.push({ id: doc.id, ...doc.data() } as Patient);
      });
      setPatients(patientsData);
    });
    return unsubscribe;
  }, []);

  const generateTokenNumber = async () => {
    const today = new Date().toDateString();
    const patientsToday = patients.filter(
      (p) => new Date(p.createdAt).toDateString() === today
    );
    return patientsToday.length + 1;
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !phone || !symptoms) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tokenNumber = await generateTokenNumber();
      await addDoc(collection(db, 'patients'), {
        name,
        age: parseInt(age),
        phone,
        symptoms,
        tokenNumber,
        status: 'waiting',
        billPaid: false,
        createdAt: new Date().toISOString(),
        appointmentDate: appointmentDate ? appointmentDate.toISOString() : new Date().toISOString(),
      });

      toast({
        title: "Patient registered",
        description: `Token number: ${tokenNumber}`,
      });

      // Reset form
      setName('');
      setAge('');
      setPhone('');
      setSymptoms('');
      setAppointmentDate(undefined);
      setShowAddPatient(false);
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

  const handleGenerateBill = async () => {
    if (!selectedPatient || !billAmount) {
      toast({
        title: "Error",
        description: "Please enter bill amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'patients', selectedPatient.id), {
        billAmount: parseFloat(billAmount),
        billPaid: true,
        billedAt: new Date().toISOString(),
      });

      toast({
        title: "Bill generated",
        description: `Bill of ₹${billAmount} generated successfully`,
      });

      setSelectedPatient(null);
      setBillAmount('');
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

  const handleDeletePatient = async () => {
    if (!deletePatientId) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'patients', deletePatientId));

      toast({
        title: "Patient deleted",
        description: "Patient record has been removed successfully",
      });

      setDeletePatientId(null);
      if (selectedPatient?.id === deletePatientId) {
        setSelectedPatient(null);
        setBillAmount('');
      }
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

  // Filter patients
  const filteredPatients = patients.filter(patient => {
    // Status filter
    if (statusFilter !== 'all' && patient.status !== statusFilter) return false;
    
    // Date filter
    if (filterDate && patient.appointmentDate) {
      const patientDate = new Date(patient.appointmentDate).toDateString();
      const selectedDate = filterDate.toDateString();
      if (patientDate !== selectedDate) return false;
    }
    
    // Search filter
    if (searchQuery && !patient.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  const completedPatients = patients.filter(p => p.status === 'completed');
  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const totalRevenue = patients
    .filter(p => p.billPaid && p.billAmount)
    .reduce((sum, p) => sum + (p.billAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-xl">
                <Activity className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Receptionist Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome, {userProfile?.name}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{waitingPatients.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{completedPatients.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-elevated">
                <UserPlus className="h-5 w-5 mr-2" />
                Register New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
                <DialogDescription>Add a new patient and generate token number</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Patient Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="symptoms">Symptoms</Label>
                   <Textarea
                     id="symptoms"
                     placeholder="Describe symptoms..."
                     value={symptoms}
                     onChange={(e) => setSymptoms(e.target.value)}
                     required
                     rows={4}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Appointment Date</Label>
                   <Popover>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         className={cn(
                           "w-full justify-start text-left font-normal",
                           !appointmentDate && "text-muted-foreground"
                         )}
                       >
                         <CalendarIcon className="mr-2 h-4 w-4" />
                         {appointmentDate ? format(appointmentDate, "PPP") : <span>Pick a date</span>}
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                         mode="single"
                         selected={appointmentDate}
                         onSelect={setAppointmentDate}
                         initialFocus
                         className="pointer-events-auto"
                       />
                     </PopoverContent>
                   </Popover>
                 </div>
                 <Button type="submit" className="w-full" disabled={loading}>
                   {loading ? 'Registering...' : 'Register Patient'}
                 </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Patients List and Billing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patients List */}
          <Card className="shadow-elevated">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>All Patients</CardTitle>
                  <CardDescription>Click on a completed patient to generate bill</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  <Filter className="h-3 w-3 mr-1" />
                  {filteredPatients.length} of {patients.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="statusFilter" className="text-xs">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="statusFilter" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Filter by Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 w-full justify-start text-left font-normal",
                          !filterDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filterDate ? format(filterDate, "PP") : <span>All dates</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterDate}
                        onSelect={setFilterDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                      {filterDate && (
                        <div className="p-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setFilterDate(undefined)}
                          >
                            Clear date
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-xs">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredPatients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {patients.length === 0 ? 'No patients registered yet' : 'No patients match the filters'}
                </p>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-4 border rounded-lg transition-all ${
                      patient.status === 'completed' && !patient.billPaid
                        ? 'cursor-pointer hover:shadow-card border-border'
                        : 'border-border'
                    } ${selectedPatient?.id === patient.id ? 'border-primary bg-accent' : ''}`}
                    onClick={() => {
                      if (patient.status === 'completed' && !patient.billPaid) {
                        setSelectedPatient(patient);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Age: {patient.age} | Phone: {patient.phone}
                        </p>
                        {patient.appointmentDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Appointment: {format(new Date(patient.appointmentDate), "PPP")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary">
                          #{patient.tokenNumber}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletePatientId(patient.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {patient.billPaid && (
                      <Badge variant="secondary" className="mt-2">
                        Bill Paid: ₹{patient.billAmount}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle>Generate Bill</CardTitle>
              <CardDescription>
                {selectedPatient
                  ? `Generate bill for ${selectedPatient.name}`
                  : 'Select a completed patient to generate bill'}
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
                      <span className="font-medium">Token:</span> #{selectedPatient.tokenNumber}
                    </p>
                    {selectedPatient.prescription && (
                      <div className="text-sm">
                        <span className="font-medium">Prescription:</span>
                        <p className="mt-1 text-muted-foreground">{selectedPatient.prescription}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billAmount">Bill Amount (₹)</Label>
                    <Input
                      id="billAmount"
                      type="number"
                      step="0.01"
                      placeholder="Enter amount in Rupees"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleGenerateBill} disabled={loading} className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    {loading ? 'Generating...' : 'Generate Bill'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePatientId} onOpenChange={() => setDeletePatientId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient record and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReceptionistDashboard;
