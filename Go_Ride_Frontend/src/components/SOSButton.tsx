import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Phone, MessageSquare, MapPin, X, User } from "lucide-react";
import toast from "react-hot-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface SOSButtonProps {
  isVisible?: boolean;
}

export default function SOSButton({ isVisible = true }: SOSButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);

  // Load emergency contacts from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, [showOptions]);

  if (!isVisible) return null;

  const handleEmergencyCall = () => {
    window.open("tel:911", "_self");
    toast.success("Calling emergency services...");
  };

  const handleNotifyContact = (contact?: EmergencyContact) => {
    if (emergencyContacts.length === 0) {
      toast.error("No emergency contacts found. Please add contacts in Settings.");
      return;
    }

    const targetContact = contact || emergencyContacts[0];
    const message = "🚨 EMERGENCY! I need help. This is an automated message from GoRide. Please contact me immediately.";
    
    window.open(`sms:${targetContact.phone}?body=${encodeURIComponent(message)}`, "_self");
    toast.success(`Emergency message sent to ${targetContact.name}`);
  };

  const notifyAllContacts = () => {
    if (emergencyContacts.length === 0) {
      toast.error("No emergency contacts found. Please add contacts in Settings.");
      return;
    }

    emergencyContacts.forEach(contact => {
      setTimeout(() => handleNotifyContact(contact), 500);
    });
    toast.success(`Notifying all ${emergencyContacts.length} emergency contacts`);
  };

  const handleShareLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          const message = `Emergency! My current location: ${locationUrl}`;
          
          // Share via WhatsApp (example)
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
          
          setIsGettingLocation(false);
          toast.success("Location shared successfully");
        },
        (error) => {
          setIsGettingLocation(false);
          toast.error("Unable to get location. Please try again.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setIsGettingLocation(false);
      toast.error("Geolocation is not supported by this browser");
    }
  };

  return (
    <>
      {/* SOS Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowOptions(true)}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 cursor-pointer shadow-lg animate-pulse"
          size="lg"
        >
          <Phone className="h-8 w-8 text-white" />
        </Button>
      </div>

      {/* SOS Options Modal */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-between items-center">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Options
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(false)}
                  className="cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleEmergencyCall}
                className="w-full bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency Services (999)
              </Button>

              {emergencyContacts.length > 0 ? (
                <>
                  <Button
                    onClick={() => handleNotifyContact()}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                    size="lg"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Notify {emergencyContacts[0].name}
                  </Button>

                  {emergencyContacts.length > 1 && (
                    <Button
                      onClick={notifyAllContacts}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                      size="sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Notify All Contacts ({emergencyContacts.length})
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-500 cursor-pointer"
                  size="lg"
                  disabled
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  No Emergency Contacts
                </Button>
              )}

              <Button
                onClick={handleShareLocation}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                size="lg"
                disabled={isGettingLocation}
              >
                <MapPin className="h-5 w-5 mr-2" />
                {isGettingLocation ? "Getting Location..." : "Share Live Location"}
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-4">
                <p>Emergency contacts: {emergencyContacts.length} saved</p>
                <p>Manage contacts in Settings → Safety</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}