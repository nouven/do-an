import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
import { CreateKeyReqDto } from './dto/create-key.req.dto';
import { KeyServiceInterface } from './interface/key.service.interface';

@Controller('keys')
export class KeyController {
  constructor(
    @Inject('KeyServiceInterface')
    private readonly keyService: KeyServiceInterface,
  ) { }

  @UseGuards(AuthGuard)
  @Post('create')
  public async create(@Body() body: CreateKeyReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return this.keyService.create(request);
  }
}
