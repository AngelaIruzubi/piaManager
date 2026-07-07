import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth.routes'; 
import personasRoutes from './routes/personas.routes';
import paiRoutes from './routes/pai.routes'; 
import objetivoRoutes from './routes/objetivo.routes';
import medioRoutes from './routes/medio.routes';

import seguimientoRoutes from './routes/seguimiento.routes';
import asignacionRoutes from './routes/asignacion.routes';


 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/personas', personasRoutes);
app.use('/api/personas/:personaId/pai', paiRoutes);
app.use('/api/pai', paiRoutes);
app.use('/api/areas/:areaId/objetivos', objetivoRoutes);
app.use('/api/objetivos', objetivoRoutes);
app.use('/api/objetivos/:objetivoId/medios', medioRoutes);
app.use('/api/medios', medioRoutes);
app.use('/api/objetivos/:objetivoId/seguimientos', seguimientoRoutes);
app.use('/api/seguimientos', seguimientoRoutes);
app.use('/api/personas/:personaId/asignaciones', asignacionRoutes);
app.use('/api/asignaciones', asignacionRoutes);


app.post('/test', (req, res) => {
  res.json({ mensaje: 'funciona' });
});

 app.use('/api/auth', authRoutes);  

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PIA Manager API funcionando 🚀' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Base de datos conectada correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos:', error);
  });

process.stdin.resume();