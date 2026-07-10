import { ConsoleLogger, Injectable } from '@nestjs/common';
import { RequestContext } from '../storage/request-context';


// Custom Logger with Request ID that extends the ConsoleLogger class
@Injectable()
export class AppLogger extends ConsoleLogger {

    // Override the default methods to inject the RequestID
    private getMessageWithRequestId(message: any): string {
        const store = RequestContext.getStore();
        const requestId = store?.requestId;

        return requestId ? `[${requestId}] ${message}` : message;
    }

    log(message: any, context?: string) {
        super.log(this.getMessageWithRequestId(message), context);
    }

    error(message: any, stackOrContext?: string) {
        super.error(this.getMessageWithRequestId(message), stackOrContext);
    }

    warn(message: any, context?: string) {
        super.warn(this.getMessageWithRequestId(message), context);
    }
}