import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { AuthGuard } from 'src/core/guard/verify-token.guard';
import { DecryptReqDto } from './dto/request/decrypt.req.dto';
import { EncryptReqDto } from './dto/request/encrypt.req.dto';
import { GenerateKeyReqDto } from './dto/request/generate-key.request.dto';
import { SignReqDto } from './dto/request/sign.req.dto';
import { VerifyReqDto } from './dto/request/verify.req.dto';
import { SignatureServiceInterface } from './interface/signature.service.interface';

@Controller('signatures')
export class SignatureController {
  constructor(
    @Inject('SignatureServiceInterface')
    private readonly signatureService: SignatureServiceInterface,
  ) { }

  @UseGuards(AuthGuard)
  @Post('/generate-key')
  public async generateKey(@Body() body: GenerateKeyReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.generateKey(request);
  }

  @UseGuards(AuthGuard)
  @Post('/sign/:id')
  public async sign(
    @Param('id', new ParseIntPipe()) id,
    @Body() body: SignReqDto,
  ) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.sign(id, request);
  }

  @Post('/verify')
  public async verify(@Body() body: VerifyReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.verify(request);
  }

  @Post('/encrypt')
  public async encrypt(@Body() body: EncryptReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.encrypt(request);
  }

  @Post('/decrypt')
  public async decrypt(@Body() body: DecryptReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.decrypt(request);
  }
}
