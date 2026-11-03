# Lo que Terraform muestra al terminar el apply (y con: terraform output)

output "ipv4" {
  description = "IP fija del servidor: la que hay que poner en DuckDNS"
  value       = hcloud_primary_ip.principal.ip_address
}

output "ipv6" {
  description = "IPv6 del servidor"
  value       = hcloud_server.pia.ipv6_address
}

output "ssh" {
  description = "Comando para entrar al servidor"
  value       = "ssh -i ~/.ssh/hetzner_pia deploy@${hcloud_primary_ip.principal.ip_address}"
}
