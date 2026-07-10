import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContext } from '../storage/request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    // Instantiate the Logger with context 'HTTP'
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const requestId = `req_${randomUUID().split('-')[0]}`;

        RequestContext.run({ requestId }, () => {
            const { method, originalUrl } = req;
            const startTime = Date.now();

            // Listen for the response to finish
            res.on('finish', async () => {
                const { statusCode } = res;
                const duration = Date.now() - startTime;

                // print using the custom AppLogger format
                this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
            });

            next();
        });
    }
}
