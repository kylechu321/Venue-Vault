import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVenueDto {
    @IsNumber()
    @IsNotEmpty()
    vendorId: number;

    @IsString()
    @IsNotEmpty()
    venueName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsNumber()
    @IsNotEmpty()
    capacity: number;

    @IsString()
    @IsNotEmpty()
    suitability: string;
}

export class UpdateVenueDto {
    @IsNumber()
    @IsOptional()
    vendorId?: number;

    @IsString()
    @IsOptional()
    venueName?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsNumber()
    @IsOptional()
    capacity?: number;

    @IsString()
    @IsOptional()
    suitability?: string;
}