# Superheroes Test App

Una aplicación de React Native desarrollada con TypeScript que permite explorar, buscar y gestionar superhéroes utilizando la API de Superhero Database.

## 🚀 Características

- **Listado de superhéroes** con información detallada
- **Búsqueda avanzada** por nombre y nombre real
- **Sistema de favoritos** con persistencia local
- **Creación de equipos** con autenticación biométrica
- **Funcionamiento offline** completo
- **Interfaz moderna** con diseño pixel perfect

## 🛠️ Tecnologías

- **React Native** 0.79.6
- **TypeScript** 5.8.3
- **Expo** ~53.0.22
- **SQLite** (expo-sqlite) para base de datos local
- **React Navigation** para navegación
- **Expo Vector Icons** para iconografía

## 📱 Funcionalidades

### Navegación

- **Superheroes**: Lista principal con búsqueda
- **Favorites**: Superhéroes marcados como favoritos
- **Teams**: Gestión de equipos de superhéroes

### Búsqueda

- Búsqueda por **nombre** del superhéroe
- Búsqueda por **nombre real** (fullName)
- Búsqueda en **tiempo real** con optimización de BD
- **Índices SQLite** para búsquedas rápidas

### Equipos

- **Crear equipos** con autenticación biométrica
- **Agregar múltiples miembros** - Se pueden agregar más de un héroe al equipo
- **Gestión completa** de miembros del equipo
- **Persistencia local** de todos los datos

### Autenticación

- **Autenticación biométrica** (huella dactilar/Face ID)
- **Validación de disponibilidad** del sensor
- **Manejo de errores** robusto

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── screens/            # Pantallas de la aplicación
├── context/            # Context API para estado global
├── services/           # Servicios (API, autenticación)
├── database/           # Servicio de base de datos SQLite
├── types/              # Definiciones de TypeScript
├── theme/              # Sistema de diseño
└── navigation/         # Configuración de navegación
```

### Base de Datos

- **SQLite local** con `expo-sqlite`
- **Tablas optimizadas** con índices para búsquedas
- **Migración automática** de esquemas
- **Sincronización** con API externa

## 🎯 Plan de Optimizaciones

### **¿Qué pasos deberá tomar en el futuro si la cantidad de superhéroes aumenta?**

#### **Paginación** 📄

- Mostrar solo 20 superhéroes por pantalla
- Cargar más cuando el usuario haga scroll
- **Beneficio**: No se traba con listas grandes

#### **Cache Inteligente** 💾

- Guardar búsquedas frecuentes por 24 horas
- **Ejemplo**: Si buscas "Batman", se guarda y sale instantáneo la próxima vez
- **Beneficio**: Búsquedas súper rápidas

#### **Imágenes Optimizadas** 🖼️

- Cargar imágenes solo cuando se ven en pantalla
- Usar diferentes tamaños según el dispositivo
- **Beneficio**: App más ligera y rápida

### **¿Qué podría modificar si se reciben reportes de usuarios que perciben que la app es muy lenta?**

#### **Memoización** ⚡

- Recordar cálculos para no repetirlos
- **Ejemplo**: Si calculas el powerScore de Superman, se guarda
- **Beneficio**: No recalcula lo mismo una y otra vez

#### **Debounce en Búsquedas** 🔍

- Esperar a que termines de escribir antes de buscar
- **Ejemplo**: Si escribes "Bat", espera 300ms. Si sigues escribiendo "man", cancela la búsqueda anterior
- **Beneficio**: No hace búsquedas innecesarias

#### **Virtualización** 📱

- Solo mostrar elementos que caben en pantalla
- **Ejemplo**: Si tienes 1000 superhéroes, solo muestra 10 en pantalla
- **Beneficio**: No se traba con listas enormes

## 🚀 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd superheroestest

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start

# Ejecutar en Android
npm run android
```

## 📝 Notas de Desarrollo

- **Pixel Perfect**: Todos los iconos implementan diseño pixel perfect
- **TypeScript**: 100% tipado con interfaces bien definidas
- **Arquitectura**: Clean Architecture con separación de responsabilidades

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Desarrollado con ❤️ usando React Native y TypeScript**

## 👨‍💻 Autor

**Manuel De León**

- 📧 Email: manueldeleonsoto5@gmail.com
- 💼 LinkedIn: [Mamuel De León](www.linkedin.com/in/manuel-soto-2305developer)

```

```
