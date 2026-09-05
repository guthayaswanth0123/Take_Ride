// src/components/LazyWrapper.tsx
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export default LazyWrapper;