import { AppDataSource } from '../config/database';
import { Catalogo } from '../entities/Catalogo';

const repo = AppDataSource.getRepository(Catalogo);

export const catalogoService = {

  // Valores activos de un tipo de catálogo (TIPO_MEDIO, PLAZO...), en el orden en que se dieron de alta
  async getByTipo(tipo: string) {
    const valores = await repo.find({
      where: { tipo: tipo.toUpperCase(), activo: true },
      order: { id: 'ASC' }
    });
    return valores.map(({ codigo, descripcion }) => ({ codigo, descripcion }));
  }
};
