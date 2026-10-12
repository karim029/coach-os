import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express'
import {map} from 'rxjs/operators'
export interface ResponseMessage<T>{
  success: Boolean,
  statusCode: number,
  timestamp: string,
  data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const res = ctx.getResponse<Response>()

    return next.handle().pipe(map((data: T)=> ({
      success: true,
      statusCode: res.statusCode ?? 200,
      timestamp: new Date().toISOString(),
      data: data
    })))
  }
}
