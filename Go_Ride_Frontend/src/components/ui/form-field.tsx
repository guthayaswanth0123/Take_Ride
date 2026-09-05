import { forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, success, helperText, className, ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(
            "text-sm font-medium",
            hasError && "text-red-600",
            hasSuccess && "text-green-600"
          )}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            className={cn(
              "transition-colors",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
              hasSuccess && "border-green-500 focus:border-green-500 focus:ring-green-500",
              className
            )}
            {...props}
          />
          
          {/* Success/Error Icons */}
          {(hasError || hasSuccess) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {hasError && <AlertCircle className="h-4 w-4 text-red-500" />}
              {hasSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {hasError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}
        
        {/* Helper Text */}
        {helperText && !hasError && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };