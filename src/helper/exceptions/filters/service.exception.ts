import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ServiceException } from '../exceptions/service.layer.exception';

@Catch(ServiceException)
export class ServiceExceptionFilter extends BaseExceptionFilter {
  catch(exception: ServiceException, host: ArgumentsHost): void {
    console.log({exception})
    const message = exception.message;
    super.catch(new HttpException(message, exception.code), host);
  }
}
