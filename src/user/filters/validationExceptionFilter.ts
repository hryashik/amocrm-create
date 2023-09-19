import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { Response } from "express";

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>()

      const errorResponse = {
         statusCode: HttpStatus.BAD_REQUEST,
         message: "Неверные данные, проверьте правильность полей name, phone, email",
         errors: exception.message
      }
      response.status(HttpStatus.BAD_REQUEST).json(errorResponse)
   }
}