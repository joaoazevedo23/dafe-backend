import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

interface JwtPayload {
    id: string;
    email: string;
}

@Injectable()// Analizar os dados e gerar o token
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "segredo_shiiiu",
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersService.findOne(payload.id);
        if (!user) {
            throw new UnauthorizedException('Token inválido');
        }
        return user;
    }
}       