import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, X } from "lucide-react";

interface ServiceUnavailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName?: string;
}

export default function ServiceUnavailableModal({
  isOpen,
  onClose,
  locationName = "selected location",
}: ServiceUnavailableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 text-white text-center space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Rides Not Available Here</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sorry! <span className="font-semibold text-primary">{locationName}</span> is currently outside GoRide’s operational service zone.
          </p>
          <p className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mt-2">
            💡 Please choose a pickup or drop location within our supported city service area.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button onClick={onClose} className="w-full h-11 font-semibold text-sm rounded-xl">
            Choose Different Location
          </Button>
        </div>
      </div>
    </div>
  );
}
