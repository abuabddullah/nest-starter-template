import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly utilsService: UtilsService) {}
  use(req: Request, res: Response, next: () => void) {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    if (!token)
      throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);

    const isVerified = this.utilsService.verifyJwtToken(token);
    if (!isVerified)
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);

    console.log(isVerified);

    //@ts-ignore
    req.user = isVerified;

    next();
  }
}
