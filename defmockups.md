# Documentación de Pantallas y Guía de Interfaz
Documento de trazabilidad y descripción de las pantallas de la plataforma NEXO, organizado por roles de usuario y componentes compartidos.

**Nota:** Los diseños podrán ser modificados sobre todo en el diseño (frases, logos, color) para mejor experiencia en la página. También se aclarará funciones que no se realizarán que por limitaciones con la IA no se pueden quitar por el momento. 

## 1. Pantallas Compartidas y Acceso Multirol

### [Inicio de sesión para los diferentes roles](mockups/inicioSesionMultirol.png)
Formulario centrado con credenciales de acceso (correo electrónico y contraseña), opción para recordar la sesión y selector de tipo de usuario (Asistente, Organizador o Administrador). Permite autenticación rápida mediante proveedores externos como Apple ID o Google, así como accesos directos al registro según el perfil.

### [Página de error o acceso denegado](mockups/ErrorAcceso.png)
Vista de notificación que se despliega cuando un usuario intenta ingresar a una sección sin la autorización o los permisos requeridos. Explica claramente la restricción de acceso con recomendaciones de verificación y ofrece botones para regresar al inicio de exploración o iniciar sesión con una cuenta diferente.

## 2. Rol: Visitante / Usuario 

### [Inicio / Explorar eventos](mockups/Homepage.png)
Página principal pública diseñada para la exploración y búsqueda de experiencias culturales con filtros por lugar, fechas y categorías. Presenta una velada destacada en portada, un catálogo por recomendaciones y un acceso promocional hacia la búsqueda por mapa interactivo.

### [Mapa de eventos](mockups/MapaInteractivoExplorador.png)
Vista cartográfica interactiva que permite a los usuarios ubicar geográficamente los eventos culturales disponibles. Al interactuar con los marcadores del mapa, despliega tarjetas informativas del evento para navegar directamente a sus detalles.

### [Resultados de búsqueda](mockups/resultadosBusqueda.png)
Pantalla que despliega la lista y cuadrícula de eventos resultantes tras aplicar filtros o criterios de búsqueda específicos. Conserva el contexto de búsqueda permitiendo modificar filtros de categoría, fecha y ubicación en tiempo real.


### [Realizar reserva](mockups/realizarReserva.png)
Interfaz del proceso de compra/reserva donde el usuario autenticado selecciona la cantidad de entradas deseada. Muestra el desglose de precios y permite confirmar la transacción en la plataforma.

### [Confirmación de reserva](mockups/confirmaciónReserva.png)
Comprobante digital que confirma el registro de una reserva con todos los detalles del evento, ubicación. Ofrece botones de acción directa para guardar en billeteras digitales (Apple/Google Wallet), descargar en PDF.
**Nota:** La acción de generar un QR y sincronizar con el calendario personal que aparecen en el mockup no se realizarán. 

### [Mis reservas](mockups/misReservas.png)
Panel personal del usuario donde se listan sus reservas activas e históricas con el estado de cada una. Permite acceder al detalle de cada pase digital o iniciar la valoración de eventos asistidos.

### [Perfil del usuario](mockups/perfilUsuario.png)
Sección privada para la consulta y edición de los datos de la cuenta del usuario autenticado. Permite gestionar preferencias culturales, datos de contacto y configuración de la cuenta.

### [Experiencia / Valoración](mockups/valorarEvento.png)
Formulario para registrar comentarios y puntuaciones sobre eventos a los que el usuario asistió previamente. Contribuye a la reputación pública del evento y ayuda a alimentar el sistema de recomendaciones.

### [Crear cuenta de usuario](mockups/crearCuentaUsuario.png)
Formulario de registro para nuevos asistentes donde se recaban datos personales básicos, ciudad de residencia e intereses culturales preferidos. Incluye la aceptación de términos, políticas de privacidad y un enlace directo para usuarios que prefieran registrarse como organizadores.

## 3. Rol: Organizador 

### [Panel del organizador](mockups/panelOrganizador.png)
Escritorio principal que resume la actividad del organizador, mostrando eventos activos, total de reservas acumuladas y accesos rápidos a la creación de nuevas propuestas.

### [Crear evento / Flujo inicial](mockups/formularioCrearEvento.png)
Punto de entrada para la creación de un nuevo evento donde se selecciona la modalidad y estructura básica de la velada antes de completar el formulario detallado.

### [Formulario para crear evento](mockups/formularioCrearEvento.png)
Interfaz de carga por pasos para detallar una nueva experiencia, permitiendo ingresar título, categoría, fechas, horarios y ubicación física. Muestra una vista previa dinámica en tiempo real de cómo se visualizará la tarjeta del evento ante los usuarios asistentes.

### [Reservas del evento](mockups/reservasEvento.png)
Módulo de consulta donde el organizador verifica el listado de personas reservadas para un evento específico y el porcentaje de ocupación o aforo disponible.

### [Registro de colectivo u organizador](mockups/crearCuentaOrganizador.png)
Formulario estructurado en dos columnas para dar de alta a nuevos organizadores, solicitando la información general del colectivo o espacio y los datos de contacto del responsable curatorial. Incluye un campo para la propuesta artística y notifica sobre el proceso de verificación de la cuenta en un lapso de 24 horas.


## 4. Rol: Administrador (Curaduría y Gobierno Central)

### [Panel administrativo](mockups/panelAdministrativo.png)
Dashboard central de control de la plataforma que sintetiza métricas globales, alertas del sistema y accesos a los distintos módulos de gobernanza.

### [Gestión de eventos y moderación](mockups/gestionDeEventos.png)
Consola centralizada para la supervisión y auditoría del catálogo global de eventos con indicadores de estado (activos, por aprobar, reportados y archivados). Permite realizar búsquedas por filtros, revisar expedientes en detalle y ejecutar aprobaciones o resoluciones de incidencias de forma rápida.

### [Detalle / Revisión del evento](mockups/revisionEvento.png)
Vista de auditoría donde el administrador examina a fondo el contenido de un evento en revisión para tomar acciones directas como aprobar, ocultar o solicitar correcciones.

### [Gestión de usuarios y organizadores](mockups/gestionDeUsuariosyOrganizadores.png)
Directorio administrativo de cuentas para la gobernanza del ecosistema, con métricas globales de usuarios, organizadores activos, procesos KYC y anomalías. Ofrece herramientas avanzadas para filtrar perfiles, validar credenciales pendientes y gestionar permisos o suspensiones de cuentas.


### [Crear cuenta de administrador](mockups/crearCuentaAdministrador.png)
Portal de registro institucional de acceso restringido diseñado exclusivamente para personal autorizado mediante correo corporativo y un token de invitación con sello criptográfico. Garantiza altos estándares de seguridad requiriendo políticas de confidencialidad y registro auditado bajo cifrado SHA-256.