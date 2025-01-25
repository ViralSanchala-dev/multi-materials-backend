import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaymentStatus } from 'src/constant/status.constant';

export class DevWorkDto {
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

    @Type(() => Number) // Transform the input to a number
    @IsNotEmpty({ message: 'Tones is required' })
    @IsInt({ message: 'Tones must be an integer.' })
    @Min(0, { message: 'Tones cannot be less than 0.' })
    tones: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Price is required' })
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
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

    @IsOptional()
    @Type(() => Object) // Transform to an object or array
    files?: Express.Multer.File[]; // Can also be a single object if only one file is expected
}

export class LocalWorkDto {
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

    @Type(() => Number) // Transform the input to a number
    @IsNotEmpty({ message: 'Quantity is required' })
    @IsInt({ message: 'Quantity must be an integer.' })
    quantity: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Price is required' })
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
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

    @IsOptional()
    @Type(() => Object) // Transform to an object or array
    files?: Express.Multer.File[]; // Can also be a single object if only one file is expected
}

export class JcbWorkDto {
    @IsDateString()
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @IsString()
    @IsNotEmpty({ message: 'Drop party name is required' })
    dropPartyName: string;

    @IsString()
    @IsNotEmpty({ message: 'Drop address is required' })
    dropPartyAddress: string;

    @IsString()
    @IsNotEmpty({ message: 'Machine type is required' })
    machineType: string;

    @Type(() => Number) // Transform the input to a number
    @IsInt({ message: 'Hours must be an integer.' })
    @Min(0, { message: 'Hours cannot be less than 0.' })
    @Max(23, { message: 'Hours cannot be greater than 23.' })
    hours: number;

    @IsOptional()
    @Type(() => Number) // Transform the input to a number
    @IsInt({ message: 'Minutes must be an integer.' })
    @Min(0, { message: 'Minutes cannot be less than 0.' })
    @Max(59, { message: 'Minutes cannot be greater than 59.' })
    minutes: number;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty({ message: 'Price is required' })
    price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Total is required' })
    total: number;

    @IsEnum(PaymentStatus)
    @IsNotEmpty({ message: 'Drop party bill status is required' })
    dropPartyBillStatus: PaymentStatus;

    @IsEnum(PaymentStatus)
    @IsNotEmpty({ message: 'Machine owner bill status is required' })
    machineOwnerBillStatus: PaymentStatus;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @Type(() => Object)
    files?: Express.Multer.File[];
}