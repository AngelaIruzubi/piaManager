# Versiones de Terraform y del proveedor de Hetzner Cloud
terraform {
  required_version = ">= 1.16"

  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.70"
    }
  }
}

# Vacío a propósito: el token se lee de la variable de entorno HCLOUD_TOKEN, nunca va en el código
provider "hcloud" {}
