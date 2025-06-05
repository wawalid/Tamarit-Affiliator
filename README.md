# Tamarit Affiliator

# Sistema de Afiliados para Tamarit Motorcycles

Este proyecto es una plataforma interna diseñada para gestionar un sistema de afiliados personalizado para Tamarit Motorcycles. El sistema permite a usuarios registrados generar enlaces de afiliado, rastrear visitas y asignar comisiones automáticamente cuando se confirma una compra.

## Funcionalidades principales

- 🧾 Registro e inicio de sesión de afiliados
- ✅ Verificación manual de usuarios por parte de administradores
- 🔗 Generación de enlaces con parámetros UTM
- 📈 Registro de visitas desde enlaces compartidos
- 🛒 Asociación de pedidos de Shopify mediante coincidencia de IP (en curso...)
- 💸 Asignación de comisiones a afiliados por cada venta válida (proximamente...)
- 🔐 Panel de administración para control de usuarios y estado

## Tecnologías utilizadas

- **Frontend**: React + Tailwind CSS + React Router
- **Backend**: Node.js + Express + JWT
- **Base de datos**: MongoDB (Mongoose)
- **Integración externa**: CMS privado de Tamarit y API de Shopify
- **Tracking**: Logs del servidor con parámetros UTM, IP, timestamps, correos.

