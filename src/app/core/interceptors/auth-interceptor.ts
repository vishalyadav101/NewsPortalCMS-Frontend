import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  console.log('====================================');
  console.log('AUTH INTERCEPTOR');
  console.log('====================================');

  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Token Exists:', !!token);
  console.log('Token:', token);

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Authorization Header Added:', clonedRequest.headers.get('Authorization'));

    return next(clonedRequest);
  }

  console.warn('NO AUTH TOKEN FOUND');

  return next(req);
};
