
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import { ArrowBigLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className=" min-h-svh bg-cover bg-center mx-auto bg-gray-100 ">
      <div className="flex justify-center p-6 lg:pt-16">
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 ">
       
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-5xl rounded-lg shadow-lg p-6 bg-white">
             <Link to="/" className="text-blue-600 font-medium hover:underline flex gap-2"> <ArrowBigLeft/>Go Back to Home</Link>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
