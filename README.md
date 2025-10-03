# Aquí Cerca

## El corazón del Comercio de Medellín
**"Aquí Cerca"** es una plataforma digital de Geolocalización y Lealtad diseñada para revitalizar el comercio local y de barrio de Medellín. Más que un simple mapa, es un **directorio auténtico** y un **sitema de recompensas gamificado** que conecta a los habitantes de la ciudad con los negocios de su comunidad de forma directa y beneficiosa para ambas partes.

## Pilares del Objetivo de Aquí Cerca

### Aumentar la Visibilidad del Comercio Local
El objetivo primario es que **Aquí Cerca** sea la herramienta indispensable apra que cualquier negocio de barrio sea conocido.
- **KPI Clave:** Incrementar el tráfico peatonal y la base de clientes de los negocios registrados.
- **Función Clave:** La **Geolocalización** precisa y los **Catálogos Digitales** sencillos que superan la visibilidad pasiva ofrecida por los grandes mapas genéricos.
- **Valor**: POsicionar a los pequeños y medianos comercios de Medellín en la palma de la mano de los consumidores locales.

---
### Impulsar la Lealtad y Recurrencia del Consumo
El objetivo de enganche es transformar las visitas ocacionales en fidelidad recurrente a través de la gamificación.
- **KPI Clave**: Aumentar la frecuencia de uso de la aplicación y la tasa de escaneo de QR por usuario activo.
- **Función Clave**: El **Sistema de Puntos de Apoyo Local** y la **Lealtad Transversal**, donde le usuario gana recompensas canjeables en *cualquier* local de la plataforma, creando un incentivo para consumir en toda la red **Aquí Cerca**.
- **Valor** Motivar al consumidor a elegir el negocio de barrio sobre las grandes cadenas, haciendo que el apoyo local sea **divertido y rentable** para ellos.

---
### Fomentar una Comunidad Económica Local Sostenible
El objetivo final es crear un ecosistema digital que genere un impacto económico positivo y medible en la ciudad.
- **KPI Clave**: Crecimiento constante de negocios activos en la plataforma y volumen total de canjes de recompensas realizados.
- **Función Clave**: Un modelo de negocio que prioriza al vendedor, manteniéndose con **cero comisiones**, garantizando que la mayoría del beneficio económico se quede en el barrio.
- **Valor**: Promover el *orgullo paisa** y el consumo consciente, fortaleciendo la economía de base y la identidad cultural de Medellín.

## Funcionamiento de la aplicación

### Flujo de la Aplicación Actual
El flujo de la aplicación se centra actualmente en la **Autenticación de Usuarios**, permitiendo a nuevos usuarios registrarse y a los existentes acceder a su perfil.

#### Registro de Usuario
Este flujo permite a un nuevo usuario crear una nueva cuenta en la aplicación:
- El usuario accede al apartado de registro.
- El usuario completa y envia el formulario.

#### Inicio de Sesión
Este flujo permite a un usuario existente acceder a la aplicación:
- El usuario accede a al apartado de login
- El usuario ingresa email y constraseña y envía el fromulario.
- Si las credenciales son válidas
- Redirección principal

#### Estado de la aplicación Después del Login
Tras iniciar sesión exitosamente, la aplicación se encuentra en el **Perfil de Usuario**. ESta es la patnall principal o el punto de acceso para futuras funcionalidades que se implementen.

### Flujos para la próxima entrega
El alcance y las funcionalidades planificadas para la próxima iteración del proyecto se gestionan y describen detalladamente en la sección de **Issues** del repositorio.

Para conocer las tareas especifica a implementar revisa todas las *issues* que se encuentran en estado `Open`.

Cada *issue* abierta representa una funcionalidad, correción o mejora confimada que será incluida en la siguiente fase de desarrollo.

## Modelo de datos y Esquema
El **backend** gestiona el almacenamiento de datos utilizando **Supabase**.
El **esquema actual** de la base de datos se ilustra a continuación:
![databas schema](./backend/schema.png)
EL código **PL/SQL** completo para la creacioón de tablas y funciones está disponible en el archivo:
```
./backend/schema.sql
```
---

### Estrategia de Acceso a Datos: Funciones de Base de Datos (Stored Procedures)
La forma en que el backend interactúa con la base de datos es **exclusivamente a través de funciones y procedimientos almacenados**.

El **mayor beneficio** de esta aproximación es la **desacoplamiento** o **aislamiento** entre el backend y la estructura interna de la base de datos:
1. **Independencia**: El backend **no necesita conocer la estructura** de las tablas subyacentes (columnas, uniones, etc.) para solicitar datos o realizar operaciones. Solo necesita saber el nombre de la función (o procedimiento almacenado) y los parámetros que debe enviarle.
2. **Mantenimiento simplificado**: Si la estructura interna de una tabla cambia (por ejemplo, se renombra una columna o se refactoriza una consulta), solo se necesita **modificar la función** en la base de datos. El backend **no se ve afectado** y continúa llamando a la función con los mismos parámetros.


## Pasos para iniciar el proyecto
Esta sección deetalla las dependencias y los comandos necesario para poner en marcha tnato el backend como el frontend.

---

### Backend (Servidor)
El backend está desarrollado en **Node.js**

#### Requisitos
- **Node.js**: Versión 22.18.0 o superior
- **npm**: Versión 11.5.2 o superior

#### Confioguración del Entorno (`.env`)
Es **obligatorio** crear un arhivo llamado `.env` dentro de la carpeta `./backend` con las siguientes variables de entorno:
```
SUPABASE_URL=https://vjzgdepgtljbuzlbioyj.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqemdkZXBndGxqYnV6bGJpb3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMDg1MTYsImV4cCI6MjA3NDg4NDUxNn0.p4joFIEcpuH4lXWKphHPvWCk1VZhC2CTBFF3f2kXvw8
BCRYPT_SALT_ROUNDS=12
```
> **Nota** Las credenciales proporcionadas pueden ser reemplazadas por las de supabase su preferencia. 

#### Ejecución
Ejeecuta los siguientes comandos desde el **directorio raíz del proyecto**:
```
cd ./backend
npm install
npm run start
```

---

### Frontend (Cliente)
El frontend está desarrollado en **Angular**.

#### Requisitos
- **Angular CLI** (`ng`): Versión 0 20.3.3. Si no lo tienes, instálalo globalmente con `npm install -g @angular/ cli`.

#### Ejecución
Ejecuta los siguientes comandos desde el **directorio raíz del proyecto**:
```
cd ./frontend
cp src/environments/environment.development.ts src/environments/environment.ts
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200` (por defecto).


#### Documentación de la API (Swagger UI)
La documentación de la API se genera y mantiene automáticamente utilizando **Swagger**.
Para acceder a la interfaz interactiva de Swagger UI, sigue estos pasos:
1. **Iniciar el Servidor** de la aplicación (consulta la sección de [Pasos para iniciar el Servidor](#backend-servidor)).
2. Una vez que el backend esté en ejecución, abre tu navegador y navega a la siguiente URL:
```
http://localhost:3000/api
```
> Esta documentación permite explorar todos los endpoints disponible, verificar los esquemas de datos y probar las peticiones directamente en un entorno local.
