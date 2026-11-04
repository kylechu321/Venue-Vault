import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";

export class CreateVenueHirerStatDto {
    @IsNumber()
    @IsNotEmpty()
    hirerId: number;

    @IsString()
    @IsNotEmpty()
    firstNameOfHirer: string;

    @IsString()
    @IsNotEmpty()
    lastNameOfHirer: string;

    @IsNumber()
    @IsOptional()
    ratingOfTheHirer: number;

    @IsNumber()
    @IsOptional()
    approvalCount: number;

    @IsNumber()
    @IsOptional()
    totalCount: number;

    @IsString()
    @IsNotEmpty()
    driverLicenseDoc: string;

    @IsString()
    @IsNotEmpty()
    insuranceDoc: string;

    @IsString()
    @IsNotEmpty()
    registrationDoc: string;
}

export class UpdateVenueHirerStatDto {
    @IsNumber()
    @IsOptional()
    hirerId?: number;

    @IsString()
    @IsOptional()
    firstNameOfHirer?: string;

    @IsString()
    @IsOptional()
    lastNameOfHirer?: string;

    @IsNumber()
    @IsOptional()
    ratingOfTheHirer?: number;

    @IsNumber()
    @IsOptional()
    approvalCount?: number;

    @IsNumber()
    @IsOptional()
    totalCount?: number;

    @IsString()
    @IsOptional()
    driverLicenseDoc?: string;

    @IsString()
    @IsOptional()
    insuranceDoc?: string;

    @IsString()
    @IsOptional()
    registrationDoc?: string;
}