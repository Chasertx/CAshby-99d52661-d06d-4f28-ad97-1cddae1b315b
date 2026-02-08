import { HttpInterceptorFn } from '@angular/common/http';

// Injects the saved JWT into the headers of outgoing API calls.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    // Clones the request to safely add the Bearer token.
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('AuthInterceptor: Token attached, proceeding to server.');
    return next(cloned);
  }

  console.log('AuthInterceptor: No token found, sending request as guest.');
  return next(req);
};