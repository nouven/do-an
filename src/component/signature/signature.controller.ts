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
import { GenerateKeyReqDto } from './dto/request/generate-key.request.dto';
import { signReqDto } from './dto/request/sign.req.dto';
import { verifyReqDto } from './dto/request/verify.req.dto';
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
    @Body() body: signReqDto,
  ) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.sign(id, request);
  }

  @UseGuards(AuthGuard)
  @Post('/verify')
  public async verify(@Body() body: verifyReqDto) {
    const { request, responseError } = body;
    if (!isEmpty(responseError)) {
      return responseError;
    }
    return await this.signatureService.verify(request);
  }
}
