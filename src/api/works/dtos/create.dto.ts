import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentStatus } from 'src/constant/status.constant';

export class CreateWorkDto {
    @IsDateString()
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @IsString()
    @IsNotEmpty({ message: 'Pick party name is required' })
    pickPartyName: string;

    @IsString()
    @IsNotEmpty({ message: 'Pick address is required' })
    pickPartyAddress: string;

    @IsString()
    @IsNotEmpty({ message: 'Drop party name is required' })
    dropPartyName: string;

    @IsString()
    @IsNotEmpty({ message: 'Drop address is required' })
    dropPartyAddress: string;

    @IsString()
    @IsNotEmpty({ message: 'Material name is required' })
    material: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty({ message: 'Tones is required' })
    @Min(0)
    tones: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty({ message: 'Price is required' })
    @Min(0)
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsNotEmpty({ message: 'Total is required' })
    total: number;

    @IsEnum(PaymentStatus)
    @IsNotEmpty({ message: 'Pick party bill status is required' })
    pickPartyBillStatus: PaymentStatus;

    @IsEnum(PaymentStatus)
    @IsNotEmpty({ message: 'Drop party bill status is required' })
    dropPartyBillStatus: PaymentStatus;

    @IsOptional()
    @IsString()
    note?: string;
}
