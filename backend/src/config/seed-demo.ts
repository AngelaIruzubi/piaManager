// Datos de demo: un centro inventado para enseñar la app (despliegue público, capturas, entrevistas).
// Todos los nombres, teléfonos y correos son ficticios (@example.com es un dominio reservado para ejemplos).
//
//   npm run seed:demo        → en local (después de npm run seed)
//   npm run seed:demo:prod   → con el código compilado (dentro del contenedor del backend)
//
// Si los datos de demo ya existen no hace nada. Todo se crea en una transacción: o entero o nada.
// La coordinadora inicial del seed base (ADMIN_EMAIL) se da de baja: en la demo solo coordina Marta.
import { EntityManager } from 'typeorm';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './database';
import { Usuario } from '../entities/Usuario';
import { Persona } from '../entities/Persona';
import { Asignacion } from '../entities/Asignacion';
import { Pai } from '../entities/Pai';
import { Area } from '../entities/Area';
import { Objetivo } from '../entities/Objetivo';
import { Medio } from '../entities/Medio';
import { Seguimiento } from '../entities/Seguimiento';
import { ObjetivoPictograma } from '../entities/ObjetivoPictograma';

const PASSWORD_DEMO = 'demo1234';
const EMAIL_COORDINACION = 'coordinacion@example.com';

// Las mismas cinco áreas que crea el servicio al dar de alta un PAI
const AREAS = ['autonomia', 'cognitiva', 'social', 'ocupacional', 'salud'];

// Las fechas se calculan desde hoy para que los seguimientos siempre parezcan recientes
function haceDias(dias: number): Date {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha;
}

function dentroDeDias(dias: number): Date {
  return haceDias(-dias);
}

interface SeguimientoDemo {
  hace: number;
  porcentaje: number;
  observacion: string;
}

interface ObjetivoDemo {
  area: string;
  descripcion: string;
  plazo: 'corto' | 'medio' | 'largo';
  estado: 'pendiente' | 'en_proceso' | 'conseguido' | 'no_trabajado';
  inicio: number;     // hace cuántos días empezó
  prevista: number;   // dentro de cuántos días se espera conseguir (negativo: ya pasó)
  conseguido?: number; // hace cuántos días se consiguió
  medios?: { tipo: string; descripcion: string; responsable?: string }[];
  seguimientos?: SeguimientoDemo[];
  pictogramas?: { id: number; keyword: string }[];
}

interface PaiDemo {
  estado: 'borrador' | 'activo';
  inicio: number;
  observaciones: string;
  objetivos: ObjetivoDemo[];
}

async function crearPai(
  manager: EntityManager,
  persona: Persona,
  coordinadora: Usuario,
  educador: Usuario,
  datos: PaiDemo
) {
  const inicio = haceDias(datos.inicio);
  const pai = await manager.save(manager.create(Pai, {
    persona,
    creado_por: coordinadora,
    anio: inicio.getFullYear(),
    fecha_inicio: inicio,
    fecha_revision: dentroDeDias(365 - datos.inicio),
    estado: datos.estado,
    observaciones_generales: datos.observaciones,
  }));

  const areas = new Map<string, Area>();
  for (const tipo of AREAS) {
    areas.set(tipo, await manager.save(manager.create(Area, { pai, tipo })));
  }

  for (const o of datos.objetivos) {
    const objetivo = await manager.save(manager.create(Objetivo, {
      area: areas.get(o.area),
      descripcion: o.descripcion,
      plazo: o.plazo,
      estado: o.estado,
      fecha_inicio: haceDias(o.inicio),
      fecha_prevista: dentroDeDias(o.prevista),
      fecha_consecucion: o.conseguido === undefined ? undefined : haceDias(o.conseguido),
    }));

    for (const m of o.medios ?? []) {
      await manager.save(manager.create(Medio, { objetivo, ...m }));
    }
    for (const s of o.seguimientos ?? []) {
      await manager.save(manager.create(Seguimiento, {
        objetivo,
        fecha: haceDias(s.hace),
        porcentaje_logro: s.porcentaje,
        observacion: s.observacion,
        registrado_por: educador,
      }));
    }
    for (const p of o.pictogramas ?? []) {
      await manager.save(manager.create(ObjetivoPictograma, { objetivo, arasaac_id: p.id, keyword: p.keyword }));
    }
  }
}

async function cargarDemo(manager: EntityManager) {
  const hash = await bcrypt.hash(PASSWORD_DEMO, 10);
  const usuario = (nombre: string, apellidos: string, email: string, rol: string) =>
    manager.save(manager.create(Usuario, {
      nombre, apellidos, email, password: hash, rol, activo: true, fecha_alta: haceDias(400),
    }));

  // Equipo
  const marta = await usuario('Marta', 'Gómez Ruiz', EMAIL_COORDINACION, 'coordinador');
  const javier = await usuario('Javier', 'Ortega Sanz', 'educador@example.com', 'educador');
  const lucia = await usuario('Lucía', 'Martín Prieto', 'lucia.martin@example.com', 'educador');

  // Personas usuarias
  const persona = (
    nombre: string, apellidos: string, nacimiento: string, tutor: string, telefono: string,
    referencia: Usuario, alta: number
  ) => manager.save(manager.create(Persona, {
    nombre, apellidos, fecha_nacimiento: new Date(nacimiento), tutor_legal: tutor,
    telefono_contacto: telefono, profesional_referencia: referencia, activo: true, fecha_alta: haceDias(alta),
  }));

  const daniel = await persona('Daniel', 'Ríos Herrero', '1994-03-12', 'Carmen Herrero (madre)', '600 000 001', javier, 380);
  const irene = await persona('Irene', 'Navarro Gil', '1988-07-25', 'Antonio Navarro (padre)', '600 000 002', javier, 300);
  const oscar = await persona('Óscar', 'Molina Vega', '2001-11-03', 'Rosa Vega (madre)', '600 000 003', lucia, 60);
  const nuria = await persona('Nuria', 'Castillo Pardo', '1979-05-18', 'Fundación tutelar', '600 000 004', lucia, 15);

  // Asignaciones: cada educador solo ve a sus personas
  for (const [p, educador, desde] of [
    [daniel, javier, 380], [irene, javier, 300], [oscar, lucia, 60], [nuria, lucia, 15],
  ] as const) {
    await manager.save(manager.create(Asignacion, { persona: p, educador, fecha_inicio: haceDias(desde) }));
  }

  // Daniel: PAI activo y completo
  await crearPai(manager, daniel, marta, javier, {
    estado: 'activo',
    inicio: 200,
    observaciones: 'Daniel participa con interés en el taller y responde bien a los apoyos visuales. ' +
      'Prioridades del año: ganar autonomía en la vida diaria y anticipar los cambios de rutina.',
    objetivos: [
      {
        area: 'autonomia', descripcion: 'Lavarse las manos antes de cada comida sin necesidad de recordatorio',
        plazo: 'corto', estado: 'conseguido', inicio: 195, prevista: -60, conseguido: 70,
        medios: [
          { tipo: 'material', descripcion: 'Secuencia de pictogramas junto al lavabo', responsable: 'Javier Ortega' },
          { tipo: 'tecnica', descripcion: 'Encadenamiento hacia atrás y refuerzo positivo' },
        ],
        seguimientos: [
          { hace: 170, porcentaje: 30, observacion: 'Necesita el recordatorio verbal en todas las comidas.' },
          { hace: 120, porcentaje: 65, observacion: 'Lo hace solo en el almuerzo; en la merienda aún hay que recordárselo.' },
          { hace: 70, porcentaje: 100, observacion: 'Dos semanas seguidas sin recordatorios. Objetivo conseguido.' },
        ],
        pictogramas: [{ id: 8975, keyword: 'lavar las manos' }],
      },
      {
        area: 'autonomia', descripcion: 'Preparar un desayuno sencillo de forma autónoma',
        plazo: 'medio', estado: 'en_proceso', inicio: 60, prevista: 90,
        medios: [
          { tipo: 'adaptacion', descripcion: 'Utensilios ordenados y etiquetados con pictogramas en la cocina' },
          { tipo: 'persona_apoyo', descripcion: 'Apoyo en la cocina los martes y jueves', responsable: 'Javier Ortega' },
        ],
        seguimientos: [
          { hace: 45, porcentaje: 20, observacion: 'Sigue los pasos con apoyo físico para servir la leche.' },
          { hace: 10, porcentaje: 50, observacion: 'Prepara las tostadas solo; necesita ayuda con el microondas.' },
        ],
        pictogramas: [{ id: 2342, keyword: 'cocinar' }],
      },
      {
        area: 'cognitiva', descripcion: 'Usar una agenda visual para anticipar las actividades del día',
        plazo: 'corto', estado: 'en_proceso', inicio: 150, prevista: 20,
        medios: [{ tipo: 'material', descripcion: 'Agenda de pictogramas en la entrada del aula' }],
        seguimientos: [
          { hace: 120, porcentaje: 40, observacion: 'Consulta la agenda cuando se le indica.' },
          { hace: 25, porcentaje: 75, observacion: 'La revisa por iniciativa propia al llegar; los cambios imprevistos aún le cuestan.' },
        ],
        pictogramas: [{ id: 6012, keyword: 'horario' }],
      },
      {
        area: 'social', descripcion: 'Saludar a los compañeros al llegar al centro',
        plazo: 'corto', estado: 'conseguido', inicio: 190, prevista: -100, conseguido: 110,
        medios: [{ tipo: 'tecnica', descripcion: 'Modelado por parte del educador en la acogida' }],
        seguimientos: [
          { hace: 160, porcentaje: 50, observacion: 'Saluda cuando el compañero le saluda primero.' },
          { hace: 110, porcentaje: 100, observacion: 'Saluda a todos al llegar sin apoyo.' },
        ],
        pictogramas: [{ id: 6610, keyword: 'dar la mano' }],
      },
      {
        area: 'ocupacional', descripcion: 'Completar la tarea de clasificación del taller sin supervisión directa',
        plazo: 'largo', estado: 'pendiente', inicio: 30, prevista: 200,
        medios: [{ tipo: 'adaptacion', descripcion: 'Bandejas de colores para cada tipo de pieza' }],
      },
      {
        area: 'salud', descripcion: 'Caminar 20 minutos tres veces por semana',
        plazo: 'medio', estado: 'en_proceso', inicio: 100, prevista: 60,
        medios: [{ tipo: 'persona_apoyo', descripcion: 'Acompañamiento en los paseos', responsable: 'Lucía Martín' }],
        seguimientos: [
          { hace: 70, porcentaje: 35, observacion: 'Camina 10 minutos y pide parar.' },
          { hace: 5, porcentaje: 70, observacion: 'Completa los 20 minutos dos días por semana.' },
        ],
        pictogramas: [{ id: 6044, keyword: 'caminar' }],
      },
    ],
  });

  // Irene: PAI activo más corto
  await crearPai(manager, irene, marta, javier, {
    estado: 'activo',
    inicio: 150,
    observaciones: 'Irene quiere desplazarse sola al centro. El plan se centra en la movilidad y en el manejo del dinero.',
    objetivos: [
      {
        area: 'autonomia', descripcion: 'Usar el autobús para ir del centro a casa',
        plazo: 'largo', estado: 'en_proceso', inicio: 140, prevista: 150,
        medios: [
          { tipo: 'tecnica', descripcion: 'Entrenamiento del recorrido por fases' },
          { tipo: 'persona_apoyo', descripcion: 'Acompañamiento en el trayecto, retirándolo poco a poco', responsable: 'Javier Ortega' },
        ],
        seguimientos: [
          { hace: 100, porcentaje: 25, observacion: 'Reconoce la parada y la línea con apoyo.' },
          { hace: 20, porcentaje: 55, observacion: 'Hace el trayecto con el educador sentado aparte; duda al bajar.' },
        ],
        pictogramas: [{ id: 2262, keyword: 'autobús' }],
      },
      {
        area: 'cognitiva', descripcion: 'Pagar compras de menos de 10 € con monedas y billetes',
        plazo: 'medio', estado: 'en_proceso', inicio: 120, prevista: 45,
        medios: [{ tipo: 'material', descripcion: 'Monedero con separadores y tabla de precios con imágenes' }],
        seguimientos: [{ hace: 30, porcentaje: 40, observacion: 'Paga con billete de 5 €; aún no comprueba el cambio.' }],
        pictogramas: [{ id: 4630, keyword: 'dinero' }, { id: 8986, keyword: 'comprar' }],
      },
      {
        area: 'salud', descripcion: 'Tomar la medicación de forma autónoma con un pastillero semanal',
        plazo: 'medio', estado: 'pendiente', inicio: 20, prevista: 120,
        pictogramas: [{ id: 39792, keyword: 'pastilla' }],
      },
    ],
  });

  // Óscar: PAI en borrador, recién empezado
  await crearPai(manager, oscar, marta, lucia, {
    estado: 'borrador',
    inicio: 10,
    observaciones: 'Primer PAI tras su incorporación. Pendiente de revisar con la familia.',
    objetivos: [
      {
        area: 'social', descripcion: 'Mantener una conversación de 5 minutos con un compañero',
        plazo: 'medio', estado: 'pendiente', inicio: 5, prevista: 120,
        pictogramas: [{ id: 25790, keyword: 'amigo' }],
      },
      {
        area: 'ocupacional', descripcion: 'Usar el ordenador para buscar cursos de formación',
        plazo: 'largo', estado: 'pendiente', inicio: 5, prevista: 240,
        pictogramas: [{ id: 7190, keyword: 'ordenador' }],
      },
    ],
  });

  // Nuria: sin PAI todavía, para enseñar cómo se crea

  // En la demo, Marta es la única coordinadora: la coordinadora inicial del seed base queda de baja
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pia.com';
  await manager.update(Usuario, { email: adminEmail, activo: true }, { activo: false, fecha_baja: new Date() });
}

AppDataSource.initialize().then(async () => {
  const yaExiste = await AppDataSource.getRepository(Usuario).findOneBy({ email: EMAIL_COORDINACION });
  if (yaExiste) {
    console.log('⏭️  Los datos de demo ya están cargados');
  } else {
    await AppDataSource.transaction(cargarDemo);
    console.log('✅ Datos de demo cargados');
    console.log(`   Coordinación: ${EMAIL_COORDINACION} / ${PASSWORD_DEMO}`);
    console.log(`   Educador:     educador@example.com / ${PASSWORD_DEMO}`);
  }
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
