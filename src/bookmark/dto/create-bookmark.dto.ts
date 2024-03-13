import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsNotEmpty()
    desc : string;

    @IsString()
    @IsNotEmpty()
    link : string;



}
