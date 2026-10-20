import { Component, OnInit, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedioService, DatosMedio } from '../../../core/services/medio.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Medio, ValorCatalogo } from '../../../shared/models/pai.model';

// Cómo se ve cada tipo de medio: el color se distingue también por claridad, y siempre va con icono y texto
const ESTILO_TIPO: Record<string, string> = {
  material: 'tipo-material',
  persona_apoyo: 'tipo-persona',
  tecnica: 'tipo-tecnica',
  adaptacion: 'tipo-adaptacion',
};

// Componente con signals: la vista se actualiza sola al cambiar el estado (no hace falta detectChanges)
@Component({
  selector: 'app-medios-objetivo',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './medios-objetivo.html',
  styleUrl: './medios-objetivo.scss'
})
export class MediosObjetivo implements OnInit {

  private medioService = inject(MedioService);
  private catalogoService = inject(CatalogoService);
  private fb = inject(FormBuilder);

  objetivoId = input.required<number>();
  mediosIniciales = input<Medio[]>([]);

  medios = signal<Medio[]>([]);
  tipos = signal<ValorCatalogo[]>([]);
  formAbierto = signal(false);
  editandoId = signal<number | null>(null);
  confirmandoId = signal<number | null>(null);
  guardando = signal(false);
  intentado = signal(false);
  error = signal('');

  private campoTipo = viewChild<ElementRef<HTMLSelectElement>>('campoTipo');

  form = this.fb.nonNullable.group({
    tipo: ['material', Validators.required],
    descripcion: ['', Validators.required],
    responsable: [''],
  });

  ngOnInit() {
    this.medios.set(this.mediosIniciales());
    this.catalogoService.getByTipo('TIPO_MEDIO').subscribe({
      next: tipos => this.tipos.set(tipos),
      error: () => this.error.set('No se han podido cargar los tipos de medio'),
    });
  }

  etiquetaTipo(codigo: string): string {
    return this.tipos().find(t => t.codigo === codigo)?.descripcion ?? codigo;
  }

  claseTipo(codigo: string): string {
    return ESTILO_TIPO[codigo] ?? 'tipo-material';
  }

  abrirNuevo() {
    this.form.reset({ tipo: this.tipos()[0]?.codigo ?? 'material', descripcion: '', responsable: '' });
    this.abrirFormulario(null);
  }

  editar(medio: Medio) {
    this.form.reset({ tipo: medio.tipo, descripcion: medio.descripcion, responsable: medio.responsable ?? '' });
    this.abrirFormulario(medio.id);
  }

  cerrar() {
    this.formAbierto.set(false);
    this.editandoId.set(null);
    this.error.set('');
  }

  guardar() {
    this.intentado.set(true);
    if (this.form.invalid || !this.form.getRawValue().descripcion.trim()) return;

    const valores = this.form.getRawValue();
    const datos: DatosMedio = {
      tipo: valores.tipo,
      descripcion: valores.descripcion.trim(),
      responsable: valores.responsable.trim(),
    };
    const id = this.editandoId();
    const peticion = id
      ? this.medioService.actualizar(id, datos)
      : this.medioService.crear(this.objetivoId(), datos);

    this.guardando.set(true);
    peticion.subscribe({
      next: guardado => {
        this.medios.update(lista => id
          ? lista.map(m => m.id === id ? guardado : m)
          : [...lista, guardado]);
        this.guardando.set(false);
        this.cerrar();
      },
      error: err => {
        this.error.set(err.error?.mensaje || 'No se ha podido guardar el medio');
        this.guardando.set(false);
      }
    });
  }

  pedirBorrar(id: number) {
    this.confirmandoId.set(id);
  }

  cancelarBorrar() {
    this.confirmandoId.set(null);
  }

  borrar(id: number) {
    this.medioService.eliminar(id).subscribe({
      next: () => {
        this.medios.update(lista => lista.filter(m => m.id !== id));
        this.confirmandoId.set(null);
      },
      error: err => {
        this.error.set(err.error?.mensaje || 'No se ha podido quitar el medio');
        this.confirmandoId.set(null);
      }
    });
  }

  private abrirFormulario(id: number | null) {
    this.editandoId.set(id);
    this.confirmandoId.set(null);
    this.intentado.set(false);
    this.error.set('');
    this.formAbierto.set(true);
    // Lleva el foco al primer campo para quien usa teclado o lector de pantalla
    setTimeout(() => this.campoTipo()?.nativeElement.focus());
  }
}
