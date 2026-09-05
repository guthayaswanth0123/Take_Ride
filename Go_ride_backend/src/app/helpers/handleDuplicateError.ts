/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";


export const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message?.match(/"([^"]*)"/);
  const field = matchedArray?.[1] || "Field";
  
  return {
    statusCode: 400,
    message: `${field} already exists`,
  };
};