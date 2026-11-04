import { IsNumber, IsNotEmpty, IsOptional, IsDateString } from "class-validator";

export class CreateVenueBlockedPeriodDto {
    @IsNumber()
    @IsNotEmpty()
    venueId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: Date;

    @IsDateString()
    @IsNotEmpty()
    endDate: Date;
}

export class UpdateVenueBlockedPeriodDto {
    @IsNumber()
    @IsOptional()
    venueId?: number;

    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @IsDateString()
    @IsOptional()
    endDate?: Date;
}