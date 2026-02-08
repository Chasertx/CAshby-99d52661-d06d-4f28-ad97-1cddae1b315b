import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable() 
export class AuditInterceptor implements NestInterceptor { // Implement Nest middleware
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> { // Capture request flow
    const request = context.switchToHttp().getRequest(); // Access HTTP request
    const user = request.user; 

    console.log(`[DEBUG] Audit: Intercepting ${request.method} ${request.url}`); // Log incoming call

    return next.handle().pipe( 
      tap({
        next: (data) => { 
          console.log(`--- SERVER AUDIT LOG ---`); 
          console.log(`User: ${user?.email || 'Anonymous'}`); 
          console.log(`Org: ${user?.organizationId || 'N/A'}`); 
          console.log(`Action: ${request.method} ${request.url}`); 
          console.log(`------------------------`); 
        },
        error: (err) => { 
          console.error(`[DEBUG] Audit Error: ${err.message}`); 
        }
      })
    );
  }
}