variable "nombre" {
  description = "Nombre base de los recursos en Hetzner (servidor, IP, firewall...)"
  type        = string
  default     = "piamanager"
}

variable "ubicacion" {
  description = "Ubicación de Hetzner: nbg1 (Núremberg), fsn1 (Falkenstein) o hel1 (Helsinki)"
  type        = string
  default     = "nbg1"
}

variable "ruta_clave_ssh" {
  description = "Ruta a la clave SSH PÚBLICA (.pub) que podrá entrar al servidor"
  type        = string
  default     = "~/.ssh/hetzner_pia.pub"
}

variable "tipo_servidor" {
  description = "Tipo de servidor de Hetzner: cx23 es el x86 más pequeño (2 vCPU, 4 GB de RAM)"
  type        = string
  default     = "cx23"
}
