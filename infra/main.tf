# Tu clave pública: Hetzner la mete en el servidor para que puedas entrar por SSH sin contraseña
resource "hcloud_ssh_key" "angela" {
  name       = var.nombre
  public_key = file(pathexpand(var.ruta_clave_ssh))
}

# IP fija: sobrevive aunque se destruya el servidor, así DuckDNS siempre apunta bien
resource "hcloud_primary_ip" "principal" {
  name        = var.nombre
  location    = var.ubicacion
  type        = "ipv4"
  auto_delete = false

  # Terraform se niega a borrarla, también con terraform destroy.
  # Para ahorrar se destruye solo el servidor: terraform destroy -target=hcloud_server.pia
  lifecycle {
    prevent_destroy = true
  }
}

# Firewall: todo lo que entra está bloqueado salvo estas reglas
resource "hcloud_firewall" "web" {
  name = var.nombre

  # Solo con clave (el servidor no acepta contraseñas). Abierto a todos porque el CD
  # entra desde GitHub Actions, cuyas IPs cambian
  rule {
    description = "SSH"
    direction   = "in"
    protocol    = "tcp"
    port        = "22"
    source_ips  = ["0.0.0.0/0", "::/0"]
  }

  # Caddy lo necesita para conseguir el certificado y para redirigir a HTTPS
  rule {
    description = "HTTP"
    direction   = "in"
    protocol    = "tcp"
    port        = "80"
    source_ips  = ["0.0.0.0/0", "::/0"]
  }

  rule {
    description = "HTTPS"
    direction   = "in"
    protocol    = "tcp"
    port        = "443"
    source_ips  = ["0.0.0.0/0", "::/0"]
  }

  rule {
    description = "HTTP/3"
    direction   = "in"
    protocol    = "udp"
    port        = "443"
    source_ips  = ["0.0.0.0/0", "::/0"]
  }
}

# Disco aparte para los datos (PostgreSQL y certificados de Caddy). Sobrevive al servidor
resource "hcloud_volume" "datos" {
  name     = "${var.nombre}-datos"
  size     = 10 # GB
  location = var.ubicacion
  format   = "ext4" # Hetzner lo formatea al crearlo

  # Aquí están los datos: Terraform se niega a borrarlo
  lifecycle {
    prevent_destroy = true
  }
}

# El servidor: une la clave SSH, la IP fija y el firewall
resource "hcloud_server" "pia" {
  name         = var.nombre
  image        = "ubuntu-24.04"
  server_type  = var.tipo_servidor
  location     = var.ubicacion
  ssh_keys     = [hcloud_ssh_key.angela.id]
  firewall_ids = [hcloud_firewall.web.id]

  public_net {
    ipv4_enabled = true
    ipv4         = hcloud_primary_ip.principal.id
    ipv6_enabled = true
  }

  # Primera puesta en marcha: usuario deploy, SSH endurecido, Docker y el Volume en /mnt/datos.
  # Si cambia, Terraform recrea el servidor (los datos están a salvo en el Volume)
  user_data = templatefile("${path.module}/cloud-init.yaml", {
    clave_ssh  = trimspace(file(pathexpand(var.ruta_clave_ssh)))
    volumen_id = hcloud_volume.datos.id
  })
}

# El "cable" entre el disco y el servidor. Al destruir el servidor solo se rompe el cable, no el disco
resource "hcloud_volume_attachment" "datos" {
  volume_id = hcloud_volume.datos.id
  server_id = hcloud_server.pia.id
  automount = false # lo montaremos nosotros en /mnt/datos con cloud-init (B3b)
}

