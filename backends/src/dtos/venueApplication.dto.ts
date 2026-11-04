import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString } from "class-validator";

export class CreateVenueApplicationDto {
    @IsNumber()
    @IsNotEmpty()
    venueId: number;

    @IsNumber()
    @IsNotEmpty()
    hirerId: number;

    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsNumber()
    @IsNotEmpty()
    guestNum: number;

    @IsDateString()
    @IsNotEmpty()
    hireDate: Date;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsNumber()
    @IsNotEmpty()
    hours: number;

    @IsString()
    @IsOptional()
    comment: string;

    @IsNumber()
    @IsOptional()
    pending: number;
}

export class UpdateVenueApplicationDto {
    @IsNumber()
    @IsOptional()
    venueId?: number;

    @IsNumber()
    @IsOptional()
    hirerId?: number;

    @IsString()
    @IsOptional()
    eventName?: string;

    @IsNumber()
    @IsOptional()
    guestNum?: number;

    @IsDateString()
    @IsOptional()
    hireDate?: Date;

    @IsString()
    @IsOptional()
    startTime?: string;

    @IsNumber()
    @IsOptional()
    hours?: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsNumber()
    @IsOptional()
    pending?: number;
}

export class UpdateVenueApplicationPendingDto {
    @IsNumber()
    @IsNotEmpty()
    pending: number;

    @IsString()
    @IsOptional()
    comment?: string;
}