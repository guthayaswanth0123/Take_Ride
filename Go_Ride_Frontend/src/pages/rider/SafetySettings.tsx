import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, Phone, User, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { ContactCardSkeleton } from "@/components/ui/skeletons";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function SafetySettings() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts from localStorage on mount
  useEffect(() => {
    const loadContacts = async () => {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const savedContacts = localStorage.getItem('emergencyContacts');
      if (savedContacts) {
        setEmergencyContacts(JSON.parse(savedContacts));
      }
      setIsLoading(false);
    };
    loadContacts();
  }, []);

  // Save contacts to localStorage
  const saveContacts = (contacts: EmergencyContact[]) => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
    setEmergencyContacts(contacts);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Name and phone number are required");
      return;
    }

    if (!/^[+]?[\d\s\-()]{10,}$/.test(newContact.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };

    const updatedContacts = [...emergencyContacts, contact];
    saveContacts(updatedContacts);
    
    setNewContact({ name: "", phone: "", relationship: "" });
    setIsAdding(false);
    toast.success("Emergency contact added successfully");
  };

  const removeContact = (id: string) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== id);
    saveContacts(updatedContacts);
    toast.success("Emergency contact removed");
  };

  const callContact = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`, "_self");
    toast.success(`Calling ${contact.name}...`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Safety Settings</h1>
          <p className="text-muted-foreground">Manage your emergency contacts and safety preferences</p>
        </div>
      </div>

      {/* Emergency Services Info */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-semibold text-red-700">Police</p>
              <p className="text-2xl font-bold text-red-800">999</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-700">Fire Service</p>
              <p className="text-2xl font-bold text-red-800">998</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-red-700">Ambulance</p>
              <p className="text-2xl font-bold text-red-800">997</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Emergency Contacts</CardTitle>
            <Button onClick={() => setIsAdding(true)} disabled={isAdding} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Contact Form */}
          {isAdding && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newContact.phone}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+880 1234 567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="Family, Friend, etc."
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button  className="cursor-pointer" onClick={addContact}>Save Contact</Button>
                  <Button className="cursor-pointer" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Contacts */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <ContactCardSkeleton key={i} />
              ))}
            </div>
          ) : emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <Card key={contact.id} className="border-gray-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </p>
                          {contact.relationship && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {contact.relationship}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => callContact(contact)}
                          className="cursor-pointer"
                        >
                          Call
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeContact(contact.id)}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No emergency contacts added yet</p>
              <p className="text-sm">Add trusted contacts for emergency situations</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p>Always share your ride details with trusted contacts</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p>Keep your emergency contacts updated and accessible</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p>Use the SOS button during active rides for immediate help</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <p>Trust your instincts and report any suspicious behavior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}