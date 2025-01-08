import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Otp extends Document {
    @Prop({ required: true })
    otp: number;
 
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    userId: mongoose.Schema.Types.ObjectId;
    
    @Prop({ required: true })
    attempts: number;
    
    @Prop({ required: true })
    expiryDate: Date;

    @Prop({ required: true })
    lastAttemtTime: Date;

    @Prop({ required: true })
    isBlocked: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);