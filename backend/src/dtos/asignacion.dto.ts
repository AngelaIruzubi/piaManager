import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AsignarEducadorDto {
  @Type(() => Number)
  @IsInt({ message: 'educador_id debe ser un número entero' })
  @Min(1)
  educador_id: number;
}
