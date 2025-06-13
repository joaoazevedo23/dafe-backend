import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type RefreshTokenSchema = RefreshToken & Document;


@Schema({timestamps: true})
export class RefreshToken{
    @Prop({ required: true, unique: true})
    longToken: string;

    @Prop({ type: Types.ObjectId, ref: 'Student', required: true})
    userId: Types.ObjectId

    @Prop({ required: true})
    expiresAt: Date;

    @Prop({default: false})
    revoked: boolean;

    @Prop()
    userAgent?: string;

    @Prop({ type: String})
    ipAddress?: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.index({ expiresAt: 1}, { expireAfterSeconds: 0 });