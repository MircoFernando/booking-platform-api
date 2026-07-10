import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'crypto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        // Generate a temporary request ID 
        const requestId = request.requestId || `req_${randomUUID().split('-')[0]}`;

        return next.handle().pipe(
            map((data) => {
                // If the data is already formatted for pagination, wrap it 
                if (data && data.items && data.nextCursor !== undefined) {
                    return {
                        success: true,
                        data: data,
                        meta: {
                            requestId: requestId,
                            timestamp: new Date().toISOString(),
                            apiVersion: 'v1',
                        }
                    };
                }

                // Standard success envelope for all other endpoints
                return {
                    success: true,
                    data: data || {},
                    meta: {
                        requestId: requestId,
                        timestamp: new Date().toISOString(),
                        apiVersion: 'v1',
                    },
                };
            }),
        );
    }
}