import { useEffect } from "react";
import RideReqForm from "./RideReqForm";


export default function BookRide() {
  useEffect(() => {
    return () => {
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Ride</h1>
          <p className="text-muted-foreground">Choose your pickup and destination to get started</p>
        </div>
        
        <div className="flex justify-center">
          <RideReqForm key="ride-form" />
        </div>
      </div>
    </div>
  );
}