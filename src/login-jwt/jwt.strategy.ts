import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { ConfigService } from "@nestjs/config";
import { UserRole } from "models/user.schema";

interface JwtPayload {
    id: string;
    email: string;
    role: UserRole;
    curso?: string;
    modulo?: number;
    nome: string;
    usuario: string;
    instituicao: string;
}

interface UserPayload {
    id: string;
    email: string;
    role: UserRole;
    curso?: string;
    modulo?: number;
    nome: string;
    usuario: string;
    instituicao: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService, 
    ) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret) {
            throw new Error('JWT_SECRET precisa estar definida em seu arquivo seguro.');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayload): Promise<UserPayload> {
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            curso: payload.curso,
            modulo: payload.modulo,
            nome: payload.nome,
            usuario: payload.usuario,
            instituicao: payload.instituicao,
        } as UserPayload;
    }
}