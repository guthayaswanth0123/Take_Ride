import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from "lucide-react";

export default function Fail() {


 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
            <p className="text-gray-600">
              Your payment could not be processed. Please try again.
            </p>
           
            <Link 
              to="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}