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
    constructor(private readonly studentsService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "segredo_shiiiu",
        });
    }

    async validate(payload: JwtPayload) {
        const student = await this.studentsService.findOne(payload.id);
        if (!student) {
            throw new UnauthorizedException('Token inválido');
        }
        return student;
    }
}       