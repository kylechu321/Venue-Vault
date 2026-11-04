import { IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVendorDto {
    @IsNumber()
    @IsNotEmpty()
    userID: number;
}

export class UpdateVendorDto {
    @IsNumber()
    @IsOptional()
    userID?: number;
}