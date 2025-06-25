# 📦 Inventario

Aplicación web para la gestión de inventario de consumibles y productos de venta en una clínica de depilación láser. Permite llevar el control de productos, registrar movimientos (entradas y salidas), y visualizar métricas en tiempo real.

---

## 🚀 Tecnologías

- **Framework**: Next.js 14 + TypeScript  
- **Base de datos**: Neon PostgreSQL  
- **ORM**: Prisma  
- **Autenticación**: NextAuth.js (JWT)  
- **Estilos**: Tailwind CSS  
- **Gráficos**: SWR + Chart.js (opcional)  
- **Exportación**: jsPDF (PDF) y [xlsx](https://github.com/SheetJS/sheetjs) (Excel)  

---

## 🛠️ Prerrequisitos

- Node.js ≥ 18  
- Git  
- Cuenta en GitHub  
- Cuenta en Vercel (para despliegue)  

---

## 🔧 Instalación local

1. Clona el repositorio:  
   ```bash
   git clone https://github.com/tu-usuario/inventario.git
   cd inventario
Instala dependencias:
npm install

cp .env.example .env.local
Rellena .env.local con tus credenciales:


DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_largo
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=tu_password_segura
Genera el cliente de Prisma y aplica migraciones:

npx prisma generate
npx prisma migrate dev --name init

Arranca en modo desarrollo:
npm run dev

Abre http://localhost:3000 en tu navegador.

📁 Estructura de carpetas
.
├── prisma/
│   └── schema.prisma       # Definición de modelos
├── src/
│   ├── app/
│   │   ├── dashboard/      # Dashboard y subpáginas
│   │   ├── components/     # Modales, tablas, layouts
│   │   ├── globals.css     # Tailwind import
│   │   └── layout.tsx      # RootLayout
│   ├── lib/
│   │   ├── prisma.ts       # Cliente Prisma
│   │   └── auth.ts         # Config NextAuth
│   ├── pages/
│   │   ├── api/
│   │   │   ├── productos/  # CRUD productos
│   │   │   ├── movimientos/ # Entradas/Salidas
│   │   │   └── dashboard/  # Estadísticas
│   └── types/
│       └── index.ts        # Tipos globales
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── package.json
└── README.md

⚙️ Scripts útiles
npm run dev — Ejecuta en modo desarrollo (localhost:3000).

npm run build — Compila la app para producción.

npm run start — Arranca el build compilado.

npm run lint — Ejecuta ESLint.

npm run format — Formatea con Prettier.

📝 Funcionalidades
🔐 Autenticación con sesión JWT y roles de administrador.

📦 CRUD de Productos: añadir, editar, eliminar, exportar (PDF/Excel).

🔄 Movimientos (Entradas/Salidas) unificados en un único módulo.

📊 Dashboard en tiempo real:

Total de productos

Entradas y salidas diarias

Productos en stock crítico

🚨 Alertas visuales para productos con stock bajo.

📈 Gráficos (opcional) de evolución de movimientos.

🖥️ Responsive (móvil y escritorio).

🔒 Seguridad y buenas prácticas
Variables sensibles en entorno, nunca en el repositorio.

Todos los inputs validados en frontend y backend.

Route-guards en Next.js (layouts y middleware).

Sanitización de datos y protección contra inyección SQL (Prisma).

📄 Licencia
Este proyecto está bajo la licencia MIT. ¡Contribuciones bienvenidas!
