import { Request, Response, NextFunction } from 'express';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

// Los formularios mandan '' en los campos opcionales que se dejan vacíos: los tratamos como "no enviado"
function quitarVacios(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object') return {};
  return Object.fromEntries(
    Object.entries(body).filter(([, valor]) => valor !== '' && valor !== null)
  );
}

// Valida req.body contra un DTO antes de llegar al controller.
// whitelist + forbidNonWhitelisted: cualquier campo que no esté en el DTO se rechaza (evita mass assignment)
export const validarDto = (Dto: ClassConstructor<object>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(Dto, quitarVacios(req.body));
    const errores = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

    if (errores.length > 0) {
      const mensajes = errores.flatMap(error =>
        // "whitelistValidation" es el error de campo no permitido, que la librería da en inglés
        Object.entries(error.constraints ?? {}).map(([regla, texto]) =>
          regla === 'whitelistValidation' ? `El campo "${error.property}" no está permitido` : texto
        )
      );
      return res.status(400).json({ mensaje: mensajes.join('. '), errores: mensajes });
    }

    req.body = dto;
    next();
  };
