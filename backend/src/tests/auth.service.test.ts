import { AppDataSource } from '../config/database';
import bcrypt from 'bcryptjs';

jest.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepo = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

const { authService } = require('../services/auth.service');

describe('authService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  describe('login', () => {

    it('debe lanzar error si el usuario no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'noexiste@pia.com', password: '123456' })
      ).rejects.toThrow('Credenciales incorrectas');
    });

    it('debe lanzar error si la contraseña es incorrecta', async () => {
      const hash = await bcrypt.hash('correcta', 10);
      mockRepo.findOneBy.mockResolvedValue({
        id: 1,
        email: 'ana@pia.com',
        password: hash,
        rol: 'coordinador',
        activo: true
      });

      await expect(
        authService.login({ email: 'ana@pia.com', password: 'incorrecta' })
      ).rejects.toThrow('Credenciales incorrectas');
    });

    it('debe lanzar error si el usuario está dado de baja', async () => {
      const hash = await bcrypt.hash('123456', 10);
      mockRepo.findOneBy.mockResolvedValue({
        id: 2,
        email: 'maria@pia.com',
        password: hash,
        rol: 'educador',
        activo: false
      });

      await expect(
        authService.login({ email: 'maria@pia.com', password: '123456' })
      ).rejects.toThrow('Credenciales incorrectas');
    });

    it('debe devolver token con credenciales correctas', async () => {
      const hash = await bcrypt.hash('123456', 10);
      mockRepo.findOneBy.mockResolvedValue({
        id: 1,
        email: 'ana@pia.com',
        password: hash,
        rol: 'coordinador',
        nombre: 'Ana',
        activo: true
      });

      process.env.JWT_SECRET = 'test_secret';
      const result = await authService.login({
        email: 'ana@pia.com',
        password: '123456'
      });

      expect(result.token).toBeDefined();
      expect(result.rol).toBe('coordinador');
      expect(result.nombre).toBe('Ana');
    });

    it('el token lleva nombre y apellidos (para la barra superior tras recargar) y nunca la contraseña', async () => {
      const hash = await bcrypt.hash('123456', 10);
      mockRepo.findOneBy.mockResolvedValue({
        id: 1, email: 'ana@pia.com', password: hash, rol: 'coordinador',
        nombre: 'Ana', apellidos: 'García', activo: true
      });
      process.env.JWT_SECRET = 'test_secret';

      const { token } = await authService.login({ email: 'ana@pia.com', password: '123456' });
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());

      expect(payload.nombre).toBe('Ana');
      expect(payload.apellidos).toBe('García');
      expect(payload.password).toBeUndefined();
    });

  });

});