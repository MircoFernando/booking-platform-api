import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestContext } from '../storage/request-context';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // Retrieve the RequestID
        const store = RequestContext.getStore();
        const requestId = store?.requestId || 'req_unknown';

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