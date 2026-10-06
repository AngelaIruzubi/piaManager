import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class GuardarPictogramaDto {
  @Type(() => Number)
  @IsInt({ message: 'arasaac_id debe ser un número entero' })
  @Min(1)
  arasaac_id: number;

  @IsString()
  @IsNotEmpty({ message: 'La palabra clave es obligatoria' })
  @MaxLength(200)
  keyword: string;
}
