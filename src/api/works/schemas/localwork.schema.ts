import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from 'src/constant/status.constant';

@Schema({ timestamps: true, versionKey: false })
export class LocalWork extends Document {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true, trim: true })
    pickPartyName: string;

    @Prop({ required: true, trim: true })
    pickPartyAddress: string;

    @Prop({ required: true, trim: true })
    dropPartyName: string;

    @Prop({ required: true, trim: true })
    dropPartyAddress: string;

    @Prop({ required: true, trim: true })
    material: string;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    price: number; // Price per quantity

    @Prop({ required: true })
    total: number;

    @Prop({ required: true, enum: PaymentStatus })
    pickPartyBillStatus: string;

    @Prop({ required: true, enum: PaymentStatus })
    dropPartyBillStatus: string;

    @Prop({ trim: true })
    note: string;

    @Prop({ type: [String], default: [] })
    files: string[];
}

export const LocalWorkSchema = SchemaFactory.createForClass(LocalWork);
