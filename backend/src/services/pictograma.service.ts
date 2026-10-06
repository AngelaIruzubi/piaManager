import { BadGatewayError, ConflictError, NotFoundError } from '../errors';
import { AppDataSource } from '../config/database';
import { ObjetivoPictograma } from '../entities/ObjetivoPictograma';
import { Objetivo } from '../entities/Objetivo';

const repo = AppDataSource.getRepository(ObjetivoPictograma);
const objetivoRepo = AppDataSource.getRepository(Objetivo);

const PALABRAS_VACIAS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'a', 'ante', 'con', 'sin', 'sobre', 'bajo', 'en', 'y', 'o', 'u', 'que',
  'se', 'su', 'sus', 'lo', 'le', 'les', 'por', 'para', 'como', 'mas', 'más',
  'muy', 'es', 'son', 'ser', 'estar', 'esta', 'está', 'este', 'esa', 'ese'
]);

function palabrasClave(descripcion: string): string[] {
  const palabras = descripcion
    .split(/\s+/)
    .map(p => p.replace(/[.,;:¡!¿?()"']/g, '').trim())
    .filter(p => p.length > 3 && !PALABRAS_VACIAS.has(p.toLowerCase()));

  // Sin duplicados, más largas (normalmente más específicas) primero
  return [...new Set(palabras)]
    .sort((a, b) => b.length - a.length)
    .slice(0, 6);
}

export const pictogramaService = {

  async buscar(keyword: string) {
    const url = `https://api.arasaac.org/v1/pictograms/es/search/${encodeURIComponent(keyword)}`;
    const response = await fetch(url);
    if (!response.ok) throw new BadGatewayError('Error al buscar pictogramas');
   const data = await response.json() as any[];

    return data.slice(0, 12).map((p: any) => ({
        arasaac_id: p._id,
        keyword,
        imagen_url: `https://static.arasaac.org/pictograms/${p._id}/${p._id}_500.png`
        }));
    },

  async sugerirPorObjetivo(objetivoId: number) {
    const objetivo = await objetivoRepo.findOneBy({ id: objetivoId });
    if (!objetivo) throw new NotFoundError('Objetivo no encontrado');

    const palabras = palabrasClave(objetivo.descripcion);
    const vistos = new Set<number>();
    const resultados: any[] = [];

    for (const palabra of palabras) {
      if (resultados.length >= 15) break;
      try {
        const encontrados = await this.buscar(palabra);
        for (const p of encontrados) {
          if (!vistos.has(p.arasaac_id)) {
            vistos.add(p.arasaac_id);
            resultados.push(p);
          }
        }
      } catch {
        // si una palabra falla (p.ej. ARASAAC no la reconoce), probamos con la siguiente
      }
    }

    return { palabras_probadas: palabras, resultados };
  },

  async getByObjetivo(objetivoId: number) {
    const pictogramas = await repo.find({
      where: { objetivo: { id: objetivoId } },
      order: { created_at: 'ASC' }
    });
    return pictogramas.map(p => ({
      ...p,
      imagen_url: `https://static.arasaac.org/pictograms/${p.arasaac_id}/${p.arasaac_id}_500.png`
    }));
  },

  async guardar(objetivoId: number, arasaac_id: number, keyword: string) {
    // Comprobar que no está ya guardado
    const existe = await repo.findOne({
      where: { objetivo: { id: objetivoId }, arasaac_id }
    });
    if (existe) throw new ConflictError('Este pictograma ya está asignado al objetivo');

    const pictograma = repo.create({
      objetivo: { id: objetivoId } as any,
      arasaac_id,
      keyword
    });
    return await repo.save(pictograma);
  },

  async eliminar(id: number) {
    const pictograma = await repo.findOneBy({ id });
    if (!pictograma) throw new NotFoundError('Pictograma no encontrado');
    await repo.remove(pictograma);
    return { mensaje: 'Pictograma eliminado correctamente' };
  }
};