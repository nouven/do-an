import {
  Body,
  Controller,
  ExecutionContext,
  Get,
  Header,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { response } from 'express';
import { isEmpty } from 'lodash';
import { BaseReqDto } from 'src/core/dto/base.dto';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
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

  @UseGuards(AuthGuard)
  @Post('/verify-token')
  public async verifyToken(@Body() body: BaseReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.authService.verifyToken(request);
  }
}
