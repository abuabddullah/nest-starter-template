// // src/auth/strategies/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UserService } from 'src/user/user.service';
// import appConfig from 'src/config/app.config';
// import { IJwtPayload } from '../interfaces/jwt-payload.interface';

// type AppConfig = ReturnType<typeof appConfig>;

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly config: AppConfig,
//     private usersService: UserService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: this.config.jwt.jwt_secret,
//     });
//     this.config = appConfig();
//   }

//   async validate(payload: IJwtPayload) {
//     const user = await this.usersService.findOne(payload.userId); // Fetch user from DB based on the userId
//     return user; // This user will be attached to the request object
//   }
// }
