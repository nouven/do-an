import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  Header,
  Inject,
  Post,
} from '@nestjs/common';
import { response } from 'express';
import { isEmpty } from 'lodash';
import { LoginReqDto } from './dto/request/login.req.dto';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: AuthServiceInterface,
  ) { }

  @Post('/login')
  public async login(@Body() body: LoginReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.authService.login(request);
  }
}
