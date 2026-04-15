export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: unknown;
};

export const successResponse = <T>(message: string, data: T): ApiSuccess<T> => ({
  success: true,
  message,
  data,
});

export const failureResponse = (message: string, errors?: unknown): ApiFailure => ({
  success: false,
  message,
  errors,
});

