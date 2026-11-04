import { IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVenuePreferenceDto {
    @IsNumber()
    @IsNotEmpty()
    venueId: number;

    @IsNumber()
    @IsNotEmpty()
    hirerId: number;

    @IsNumber()
    @IsNotEmpty()
    ranking: number;
}

export class UpdateVenuePreferenceDto {
    @IsNumber()
    @IsOptional()
    venueId?: number;

    @IsNumber()
    @IsOptional()
    hirerId?: number;

    @IsNumber()
    @IsOptional()
    ranking?: number;
}