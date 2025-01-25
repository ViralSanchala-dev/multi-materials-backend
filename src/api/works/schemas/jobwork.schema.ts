import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from 'src/constant/status.constant';

@Schema({ timestamps: true, versionKey: false })
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

    @Prop({ required: true })
    hours: number;

    @Prop({ required: true, default: 0 })
    minutes: number;

    @Prop({ required: true })
    price: number; // Price per hour

    @Prop({ required: true })
    total: number;

    @Prop({ required: true, enum: PaymentStatus })
    dropPartyBillStatus: string;

    @Prop({ required: true, enum: PaymentStatus })
    machineOwnerBillStatus: string;

    @Prop({ trim: true })
    note: string;

    @Prop({ type: [String], default: [] })
    files: string[];
}

export const JcbWorkSchema = SchemaFactory.createForClass(JcbWork);
