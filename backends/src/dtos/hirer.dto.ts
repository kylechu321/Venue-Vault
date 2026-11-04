import { IsNumber, IsNotEmpty } from "class-validator";

export class CreateHirerDto {
    @IsNumber()
    @IsNotEmpty()
    userID: number;
}

export class UpdateHirerDto {
    @IsNumber()
    userID?: number;
}