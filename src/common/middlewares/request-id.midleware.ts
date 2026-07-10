import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { RequestContext } from '../storage/request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = `req_${randomUUID().split('-')[0]}`;


        RequestContext.run({ requestId }, () => {
            next();
        });
    }
}