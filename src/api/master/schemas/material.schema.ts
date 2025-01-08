import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ versionKey: false, timestamps: true })
export class Material extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user_id: Types.ObjectId;

    @Prop({ required: true, unique: true, trim: true })
    name: string;
    
    @Prop({ required: true })
    slug: string;

    @Prop({ required: true, trim: true })
    description: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);