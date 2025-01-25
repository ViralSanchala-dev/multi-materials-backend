import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from 'src/constant/status.constant';

@Schema({ timestamps: true, versionKey: false })
export class DevWork extends Document {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
        type: Date,
        set: (value: any) => {
            const date = new Date(value); // Convert the value to a Date object
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format. Please provide a valid date in YYYY-MM-DD format.');
            }
            // Strip the time part and store only the date
            return new Date(date.toISOString().split('T')[0]);
        },
    })
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
    tones: number;

    @Prop({ required: true })
    price: number;

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

export const DevWorkSchema = SchemaFactory.createForClass(DevWork);
