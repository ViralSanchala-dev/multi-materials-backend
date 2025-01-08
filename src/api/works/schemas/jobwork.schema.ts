import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class JcbWork extends Document {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true, trim: true })
    dropPartyName: string;

    @Prop({ required: true, trim: true })
    dropPartyAddress: string;

    @Prop({ required: true, trim: true })
    machineType: string;

    @Prop({ required: true, trim: true })
    type: string;

    @Prop({ required: true })
    hours: number;

    @Prop({ required: true })
    minutes: number;

    @Prop({ required: true })
    price: number; // Price per hour

    @Prop({ required: true })
    total: number;

    @Prop({ required: true, enum: ['pending', 'paid'] })
    dropPartyBillStatus: string;

    @Prop({ required: true, enum: ['pending', 'paid'] })
    machineOwnerBillStatus: string;

    @Prop({ trim: true })
    note: string;
}

export const JcbWorkSchema = SchemaFactory.createForClass(JcbWork);
