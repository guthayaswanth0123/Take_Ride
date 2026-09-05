import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
});

type LoginFormData = z.infer<typeof loginSchema>;

const QUICK_LOGIN_CREDENTIALS = {
  ADMIN: {
    email: "admin@goride.com",
    password: "admin@123"
  },
  DRIVER: {
    email: "driver@gmail.com",
    password: "123456A@"
  },
  RIDER: {
    email: "rider@gmail.com",
    password: "123456A@"
  }
};

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        if (res.data?.accessToken) {
          localStorage.setItem("token", res.data?.accessToken);
        }

        toast.success("Logged in successfully");

        const userRole = res.data.user.role;
        if (userRole === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (userRole === "DRIVER") {
          navigate("/driver/dashboard");
        } else if (userRole === "RIDER") {
          navigate(redirectTo || "/rider/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error(err);
      const error = err as { data?: { message?: string }; status?: number };

      if (error?.data?.message === "Password does not match") {
        toast.error("Invalid credentials");
      } else if (error?.data?.message === "Missing credentials") {
        toast.error("Please fill in all required fields");
      } else if (error?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  const handleQuickLogin = (role: keyof typeof QUICK_LOGIN_CREDENTIALS) => {
    const credentials = QUICK_LOGIN_CREDENTIALS[role];
    form.setValue("email", credentials.email);
    form.setValue("password", credentials.password);
    
    setTimeout(() => {
      form.handleSubmit(onSubmit)();
    }, 100);
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 font-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden">
        {/* Left Section - Main Login Form */}
        <div className="p-8">
          <div className="flex flex-col gap-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="text-sm text-gray-600 mt-2">
                Please sign in to continue
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          className="border-gray-300 focus:border-blue-500 text-black"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          className="border-gray-300 focus:border-blue-500 text-black"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={() => window.open(`${config.baseUrl}/auth/google`)}
              type="button"
              variant="outline"
              className="w-full text-primary border-1 border-gray-800 hover:bg-gray-50 cursor-pointer"
            >
             
              Continue with Google
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                replace
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section - Quick Login */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
           <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">
              Quick Access
            </h2>
            <p className="text-sm text-gray-600 text-center mb-10">
              Test the application with different user roles
            </p>

          <div className="flex flex-col  justify-center mt-4">
           
            <div className="space-y-4 mt-4">
              <Button
                type="button"
                onClick={() => handleQuickLogin("ADMIN")}
                disabled={isLoading}
                className="w-full h-16 bg-red-50 hover:bg-red-100 text-red-600 dark:text-white border border-red-200 cursor-pointer hover:text-primary"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Login as Admin</span>
                 
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleQuickLogin("DRIVER")}
                disabled={isLoading}
                className="w-full h-16 bg-blue-100  text-blue-600 hover:text-primary dark:text-white border border-blue-200 cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Login as Driver</span>
                  
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleQuickLogin("RIDER")}
                disabled={isLoading}
                className="w-full h-16 bg-green-100 hover:bg-green-100 hover:text-primary text-green-700 border border-green-200 cursor-pointer dark:text-white"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Login as Rider</span>
                 
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}