# NEXO: Plataforma de Descubrimiento y Reserva de Eventos

## Descripción.
Hoy en día, la información sobre eventos como conciertos, actividades culturales, deportivas, gastronómicas, educativas y de entretenimiento se encuentra distribuida entre redes sociales, páginas web, aplicaciones y medios tradicionales. Esta dispersión en su promoción causa que las personas tengan que buscar en diferentes lugares para encontrar actividades de su interés y comparar información como fechas, ubicaciones, precios y disponibilidad.
**NEXO** surge como una solución a esta problemática al reunir la información de diferentes eventos en una sola plataforma web. De esta manera, los usuarios pueden descubrir eventos disponibles en su zona, aplicar filtros según sus intereses, consultar los detalles de cada actividad, buscar eventos cercanos a través de un mapa interactivo, comentar los que ya han visitado y acceder a la opción de reserva sin tener que buscar la información en múltiples medios. A su vez, los organizadores pueden publicar y administrar sus propios eventos, registrando datos como fecha, ubicación, precio, capacidad y disponibilidad. El administrador puede supervisar y gestionar la información registrada en la plataforma.


## Problema.

Actualmente, la promoción y comercialización de eventos enfrenta el reto de alcanzar al público adecuado en un entorno digital cada vez más fragmentado. Con el crecimiento de las redes sociales y de las plataformas especializadas, los usuarios disponen de múltiples canales para descubrir actividades, mientras que los organizadores deben distribuir sus esfuerzos entre diferentes medios para conseguir visibilidad. Esta situación puede dificultar tanto la promoción de los eventos como el acceso de los usuarios a información rápida,completa y organizada.
Un estudio realizado por FIXR en 2024, mediante una encuesta a más de 3.500 asistentes de eventos entre los 18 y 24 años, evidenció que el descubrimiento de eventos ocurre a través de múltiples canales. Entre las opciones consultadas se encontraban Instagram, TikTok, Snapchat, Facebook, X/Twitter, Google, plataformas de venta de entradas, correo electrónico, SMS, WhatsApp y medios tradicionales como carteles y volantes [1]. Esto demuestra que el usuario no depende de una única fuente para encontrar actividades de su interés, sino que puede tener que consultar diferentes medios para descubrirlas.
Esta tendencia también se refleja en los datos de Eventbrite. Su informe "TRNDS 2025" señala que el 64 % de la generación Z y el 61 % de los millennials utilizan las redes sociales para encontrar actividades. Además, el 30 % de la generación Z utiliza específicamente TikTok para descubrir eventos y el 24 % los descubre siguiendo personas con intereses similares en redes sociales [2]. Esto evidencia la importancia de adaptar la promoción a los diferentes canales utilizados y a su vez diseñarlo según el usuario objetivo para cada medio que se use.
La diversidad de canales representa un reto adicional para los organizadores, debido a que la información de un mismo evento puede encontrarse distribuida entre redes sociales, plataformas de venta de entradas, páginas web y otros medios. Una investigación publicada en 2025 en la revista *Electronic Markets* describe el sector de las plataformas culturales como un mercado fragmentado y heterogéneo. Los autores identificaron cientos de plataformas de eventos culturales que promocionan conjuntos de eventos parcialmente superpuestos y que funcionan, en gran medida, de manera desconectada. Además, señalan que los organizadores pueden no contar con la capacidad necesaria para introducir la información de sus eventos en múltiples plataformas, a pesar de que cada una posee un alcance y una visibilidad diferentes [3].
Esta fragmentación puede generar una brecha entre los eventos existentes y su descubrimiento por parte del público. Un evento puede encontrarse disponible, pero no necesariamente ser visto por las personas que podrían estar interesadas en asistir. La misma investigación plantea que la agregación, estandarización e integración de datos de eventos podría mejorar su visibilidad y facilitar que los usuarios descubran eventos adicionales sin tener que realizar búsquedas adicionales en diferentes plataformas [3].
A esta situación se suma la experiencia durante el proceso de reserva o compra. Cuando un usuario descubre un evento mediante una red social o una plataforma de información, puede necesitar desplazarse posteriormente hacia otra página para consultar detalles adicionales, realizar una reserva o efectuar el pago. Esto incrementa la cantidad de pasos que debe realizar antes de completar la decisión de compra y puede tornar la experiencia algo tormentosa.
Aunque los estudios sobre abandono de compra no se concentran exclusivamente en eventos, la investigación de Baymard Institute sobre experiencia de *checkout* permite evidenciar la importancia de reducir este tipo de obstáculos. Su investigación de 2025 encontró que aproximadamente el 70 % de los usuarios abandona una compra después de agregar productos al carrito. Además, el 18 % de los adultos estadounidenses encuestados indicó haber abandonado una compra porque no quería crear una cuenta. Baymard también señala que el 64 % de los sitios de escritorio y el 63 % de los sitios móviles analizados presentan una experiencia de *checkout* considerada mediocre o peor [4].
Estos resultados no significan que los usuarios abandonen específicamente la compra de entradas para eventos por tener que utilizar diferentes plataformas. Sin embargo, permiten identificar un principio relevante para este proyecto: los obstáculos y pasos innecesarios durante el proceso de compra pueden aumentar el riesgo de abandono. De hecho, Baymard estima que un sitio de comercio electrónico grande podría incrementar su tasa de conversión hasta en un 35 % mediante mejoras en el diseño del proceso de *checkout* [4].
En el contexto de los eventos, esta problemática puede presentarse cuando el usuario debe realizar diferentes búsquedas para conocer información esencial como la fecha, hora, ubicación, precio, disponibilidad y mecanismo de reserva. Posteriormente, puede ser necesario utilizar otra plataforma para efectuar la compra o el pago y otra herramienta para localizar el lugar del evento. Esta dispersión aumenta la cantidad de acciones necesarias para pasar del descubrimiento del evento a la reserva.
Por lo tanto, el problema no se limita únicamente a la falta de eventos disponibles, sino a la dificultad para descubrir, comparar y acceder a la información necesaria para tomar una decisión de asistencia. La fragmentación de las plataformas puede afectar tanto la visibilidad de los eventos como la experiencia del usuario.
En este contexto surge la necesidad de una solución que centralice y organice la información relevante de los eventos, reduciendo la cantidad de búsquedas y pasos que el usuario debe realizar. NEXO propone abordar esta problemática mediante una plataforma que permita descubrir eventos a partir de criterios como ubicación, fecha, categoría, precio y disponibilidad, presentando en un mismo espacio la información necesaria para que el usuario pueda evaluar las diferentes opciones y acceder al mecanismo de reserva establecido por el organizador.

### Problema central

> La falta de una plataforma centralizada que permita descubrir, consultar y reservar eventos cercanos de acuerdo con la ubicación y dificulta tanto el acceso de las personas a actividades de su interés como la visibilidad y alcance de los organizadores.


## Actores

- **Usuario** (rol): consulta eventos, filtra por diferentes criterios, revisa su información, comenta su experiencia a los eventos asistidos, realiza reservas y consulta sus propias reservas.
- **Organizador de eventos** (rol): crea, publica, modifica y cancela sus propios eventos, además de gestionar su precio, capacidad y disponibilidad.
- **Administrador** (rol): supervisa la plataforma, gestiona los eventos y consulta información relacionada con las reservas.
- **Servicio de mapas y geolocalización** (sistema externo): proporciona la ubicación de los eventos y permite representarlos dentro de la plataforma de forma dinámica.
- **Login:** el usuario, el organizador y el administrador inician sesión mediante correo electrónico y contraseña cuando necesitan acceder a funcionalidades que requieren autenticación. La consulta y búsqueda de eventos es visible sin iniciar sesión.
- **Pagos:** no se implementará una pasarela de pagos dentro de la plataforma. Cuando un evento requiera pago, el usuario será dirigido al enlace externo proporcionado por el organizador o podrá utilizar el medio de contacto establecido por este.

### Objetivo general

Desarrollar NEXO como una plataforma web que centralice el descubrimiento, consulta y reserva de eventos, permitiendo a los usuarios encontrar actividades de interés mediante criterios de búsqueda y filtrado, a los organizadores publicar y administrar sus eventos, y a los administradores supervisar la información y funcionamiento de la plataforma.

### Objetivos específicos

- Permitir que los visitantes consulten y encuentren eventos mediante búsqueda y filtros de categoría, fecha, hora, precio, ubicación, distancia y disponibilidad.
- Permitir que los usuarios autenticados realicen reservas de eventos disponibles y consulten el estado de sus reservas desde la plataforma.
- Permitir que los organizadores creen, publiquen, modifiquen y cancelen sus propios eventos, manteniendo actualizada su información.
- Permitir que los usuarios visualicen la ubicación de los eventos mediante un mapa interactivo y consulten la información necesaria para decidir si asistir.
- Mantener coherencia entre la capacidad, disponibilidad y reservas registradas para cada evento.
- Proporcionar al administrador herramientas para supervisar eventos, usuarios, organizadores, reservas y contenido reportado.
- Integrar servicios externos de mapas y geolocalización para facilitar la consulta de la ubicación de los eventos.
- Completar el flujo principal de descubrimiento y reserva de un evento dentro de la plataforma, dejando los procesos externos de pago o reserva bajo responsabilidad del mecanismo definido por cada organizador.

## Stakeholders

- **Usuarios** (stakeholder): buscan encontrar eventos de manera rápida, consultar información relevante y acceder a las opciones de reserva y localización.
- **Organizadores de eventos** (stakeholder): buscan aumentar la visibilidad de sus eventos y facilitar que los usuarios interesados conozcan sus actividades.
- **Empresas y establecimientos** (stakeholder): pueden utilizar la plataforma para promocionar eventos y actividades realizadas en sus instalaciones.
- **Artistas y emprendedores** (stakeholder): buscan aumentar la exposición de sus presentaciones, talleres, exposiciones, ferias y otras actividades.
- **Administrador de la plataforma** (stakeholder): tiene interés en garantizar el correcto funcionamiento del sistema y mantener la información de los eventos organizada y actualizada.
- **Proveedores de servicios tecnológicos** (stakeholder): proporcionan servicios externos necesarios para determinadas funcionalidades de la plataforma, como mapas y geolocalización.
- **Entidades gubernamentales** (stakeholder): se relacionan indirectamente con la plataforma debido a las normas y regulaciones aplicables a los eventos y a la protección de datos según las localidades que abarque el sitio.
- **Patrocinadores y publicistas** (stakeholder): pueden utilizar la plataforma como un medio adicional para promocionar marcas, productos, servicios o eventos.
- **Comunidad local** (stakeholder): se beneficia de una mayor visibilidad y acceso a las actividades culturales, deportivas, educativas, gastronómicas y de entretenimiento disponibles en su entorno. 

## Alcance

### Incluye (versión entregada)

- Catálogo público con búsqueda por texto, filtros por categoría, precio, fecha, hora, distancia y disponibilidad, y orden por fecha o precio.
- Mapa de eventos con radio de distancia y detalle de cada evento.
- Enlace externo de reserva o pago cuando el organizador lo define.
- Reservas de 1 a 4 entradas, confirmación, "Mis reservas" y cancelación hasta 48 horas antes.
- Registro e inicio de sesión con roles: asistente, organizador, curador y administrador.
- Perfil del asistente y valoración de eventos ya realizados.
- Panel del organizador: crear, publicar, editar y cancelar eventos propios, y consultar sus reservas.
- Administración: moderación de eventos, cuentas, verificación de organizadores, reservas y reportes.
- API REST con control de acceso por rol.

### No incluye

- Pasarela de pagos propia ni procesamiento de pagos dentro de NEXO.
- Sustituir las plataformas externas de pago o reserva de los organizadores.
- Aplicación móvil nativa.
- Gestión física de los eventos ni control de asistencia.
- Garantizar la disponibilidad o validez de servicios externos.
- Que un organizador modifique eventos de otro, o un usuario vea reservas ajenas.

## Funcionalidades

> Lista de lo previsto en el primer entregable. El estado de cada punto en la versión final está en Alcance y en los requerimientos funcionales.

### Usuario

- Consultar eventos publicados sin necesidad de iniciar sesión.
- Buscar eventos por nombre, fecha, ubicación y tipo de evento.
- Filtrar eventos por categoría, precio, distancia, hora y disponibilidad.
- Visualizar eventos mediante un mapa interactivo.
- Consultar la información detallada de un evento.
- Consultar la ubicación del evento y su representación geográfica.
- Consultar precio, disponibilidad, fecha, hora y datos del organizador.
- Registrarse e iniciar sesión mediante correo electrónico y contraseña.
- Realizar reservas de eventos disponibles.
- Indicar la cantidad de entradas o cupos que desea reservar.
- Recibir la confirmación de una reserva.
- Consultar sus reservas realizadas y el estado de cada una.
- Acceder a enlaces externos de pago o reserva cuando el organizador gestione el proceso fuera de NEXO.
- Consultar su información de perfil.
- Registrar una valoración o comentario sobre un evento asistido, cuando cumpla las condiciones definidas por la plataforma.

### Organizador

- Registrarse e iniciar sesión mediante correo electrónico y contraseña.
- Acceder a un panel de administración de sus eventos.
- Crear nuevos eventos.
- Registrar nombre, descripción, categoría, fecha, hora, ubicación, precio, capacidad y disponibilidad.
- Asociar una imagen al evento.
- Definir un enlace externo de reserva o pago.
- Definir un medio de contacto para los usuarios.
- Publicar eventos que cumplan la información obligatoria.
- Consultar sus eventos publicados, activos, cancelados y finalizados.
- Modificar la información de sus propios eventos.
- Actualizar precio, capacidad y disponibilidad.
- Consultar las reservas asociadas a sus eventos.
- Cancelar sus propios eventos.
- Consultar la información necesaria para gestionar la asistencia de los usuarios.

### Administrador

- Iniciar sesión mediante correo electrónico y contraseña.
- Acceder a un panel administrativo.
- Consultar los eventos registrados en la plataforma.
- Revisar la información de los eventos publicados.
- Gestionar eventos cuando sea necesario para mantener la integridad de la plataforma.
- Ocultar, aprobar o reportar eventos de acuerdo con las reglas definidas.
- Consultar y gestionar usuarios y organizadores.
- Consultar información relacionada con las reservas.
- Revisar eventos o contenido reportado.
- Gestionar incidencias relacionadas con eventos, usuarios y reservas.

###  Servicios externos

#### Servicio de mapas y geolocalización

- Proporcionar coordenadas o ubicación geográfica de los eventos.
- Permitir representar los eventos mediante marcadores.
- Permitir mostrar la ubicación del evento sobre un mapa.

#### Servicios externos de reserva o pago

- Recibir al usuario mediante un enlace externo proporcionado por el organizador.
- Permitir que el usuario complete fuera de NEXO el proceso de pago o reserva cuando corresponda.


## Requerimientos funcionales

Estado en la versión final: **62 implementados**, **7 modificados** y **0 recortados** de 69.

### Autenticación y control de acceso

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-01 | El sistema debe permitir iniciar sesión mediante correo electrónico y contraseña. | Usuario / Organizador / Administrador | Alta | Implementado | Login en el cliente React (/app/login) y en /Auth/Login, con la misma cookie. |
| RF-02 | El sistema debe validar que las credenciales proporcionadas correspondan a una cuenta registrada y activa. | Usuario / Organizador / Administrador | Alta | Implementado | Valida contraseña (BCrypt) y cuenta activa. |
| RF-03 | El sistema debe identificar el rol asociado a la cuenta autenticada y habilitar únicamente las funcionalidades correspondientes. | Usuario / Organizador / Administrador | Alta | Modificado | Se agregó el rol curador además de asistente, organizador y administrador. |
| RF-04 | El sistema debe permitir consultar y buscar eventos publicados sin iniciar sesión. | Visitante / Usuario | Alta | Implementado | API pública de eventos y pantallas React sin sesión. |
| RF-05 | El sistema debe restringir las operaciones de reserva y consulta de reservas a usuarios autenticados. | Usuario | Alta | Implementado | La API de reservas exige rol asistente. |
| RF-06 | El sistema debe impedir que un usuario acceda mediante la interfaz a funciones exclusivas de organizador o administrador. | Usuario | Alta | Implementado | Autorización por rol en controladores y API. |
| RF-07 | El sistema debe permitir cerrar la sesión de la cuenta autenticada. | Usuario / Organizador / Administrador | Media | Implementado | Cierre de sesión desde el menú. |

### Descubrimiento, búsqueda y consulta de eventos

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-08 | El sistema debe mostrar los eventos publicados y vigentes disponibles para consulta. | Visitante / Usuario | Alta | Implementado | Lista los publicados que aún no han pasado. |
| RF-09 | El sistema debe permitir buscar eventos por nombre o términos relacionados con el evento. | Visitante / Usuario | Alta | Implementado | Busca por nombre, recinto y categoría, sin distinguir tildes. |
| RF-10 | El sistema debe permitir filtrar eventos por fecha y hora. | Visitante / Usuario | Alta | Implementado | Filtro por fecha y por hora mínima de inicio. |
| RF-11 | El sistema debe permitir filtrar eventos por categoría. | Visitante / Usuario | Alta | Implementado | Filtro por categoría. |
| RF-12 | El sistema debe permitir filtrar eventos por precio, incluyendo la identificación de eventos gratuitos. | Visitante / Usuario | Alta | Implementado | Precio máximo; con 0 muestra los gratuitos. |
| RF-13 | El sistema debe permitir filtrar eventos por distancia respecto a una ubicación de referencia cuando exista información geográfica disponible. | Visitante / Usuario | Alta | Implementado | Filtro de 1 a 10 km desde la ubicación del usuario o el centro de Envigado; también en el mapa. |
| RF-14 | El sistema debe permitir consultar la disponibilidad de un evento. | Visitante / Usuario | Alta | Implementado | Se muestran los cupos disponibles. |
| RF-15 | El sistema debe permitir combinar varios filtros en una misma búsqueda. | Visitante / Usuario | Alta | Implementado | Combina texto, categoría, precio, fecha, hora, distancia y disponibilidad. |
| RF-16 | El sistema debe mostrar únicamente los eventos que cumplan los criterios de búsqueda y filtrado seleccionados. | Visitante / Usuario | Alta | Implementado | La consulta devuelve solo coincidencias. |
| RF-17 | El sistema debe informar cuando una búsqueda o combinación de filtros no produzca resultados. | Visitante / Usuario | Media | Implementado | Mensaje de búsqueda sin resultados. |
| RF-18 | El sistema debe mostrar los eventos disponibles sobre un mapa interactivo mediante marcadores geográficos. | Visitante / Usuario | Alta | Implementado | Mapa con marcadores y resumen emergente (/app/mapa). |
| RF-19 | El sistema debe permitir seleccionar un marcador para consultar información resumida del evento. | Visitante / Usuario | Alta | Implementado | Mapa con marcadores y resumen emergente (/app/mapa). |
| RF-20 | El sistema debe mostrar el detalle completo de un evento seleccionado. | Visitante / Usuario | Alta | Implementado | Pantalla /app/evento/{id}. |
| RF-21 | El detalle del evento debe mostrar como mínimo nombre, descripción, categoría, fecha, hora, ubicación, precio, disponibilidad y organizador. | Visitante / Usuario | Alta | Implementado | El detalle incluye el organizador. |
| RF-22 | El sistema debe mostrar la ubicación del evento mediante un servicio de mapas y geolocalización. | Visitante / Usuario | Alta | Implementado | Mapa en el detalle del evento. |
| RF-23 | El sistema debe mostrar el estado actual del evento cuando corresponda: publicado, disponible, agotado, cancelado o finalizado. | Visitante / Usuario | Alta | Implementado | El detalle indica disponible, agotado, cancelado o finalizado. |

### Reservas

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-24 | El sistema debe permitir a un usuario autenticado iniciar una reserva desde el detalle de un evento disponible. | Usuario | Alta | Implementado | Reserva desde el detalle. |
| RF-25 | El sistema debe permitir seleccionar la cantidad de entradas o cupos que desea reservar. | Usuario | Alta | Implementado | De 1 a 4 entradas por reserva. |
| RF-26 | El sistema debe verificar la disponibilidad antes de confirmar una reserva. | Usuario | Alta | Implementado | El procedimiento usp_CreateReservation bloquea la sobreventa. |
| RF-27 | El sistema no debe permitir confirmar una reserva cuando la cantidad solicitada supere la disponibilidad existente. | Usuario | Alta | Implementado | El procedimiento usp_CreateReservation bloquea la sobreventa. |
| RF-28 | El sistema debe registrar la reserva asociándola al usuario autenticado y al evento seleccionado. | Usuario | Alta | Implementado | Reserva con código único y cupos actualizados. |
| RF-29 | El sistema debe actualizar la disponibilidad del evento después de confirmar una reserva. | Usuario / Sistema | Alta | Implementado | Reserva con código único y cupos actualizados. |
| RF-30 | El sistema debe generar un identificador único para cada reserva confirmada. | Usuario / Sistema | Alta | Implementado | Reserva con código único y cupos actualizados. |
| RF-31 | El sistema debe mostrar una pantalla de confirmación después de registrar correctamente una reserva. | Usuario | Alta | Implementado | Pantalla /app/confirmacion/{code}. |
| RF-32 | La confirmación debe mostrar como mínimo número de reserva, evento, fecha, hora, ubicación, cantidad de entradas y estado de la reserva. | Usuario | Alta | Implementado | Pantalla /app/confirmacion/{code}. |
| RF-33 | El sistema debe permitir consultar las reservas asociadas al usuario autenticado. | Usuario | Alta | Implementado | Pantalla /app/mis-reservas; permite cancelar hasta 48 h antes. |
| RF-34 | El sistema debe mostrar el estado de cada reserva del usuario. | Usuario | Alta | Implementado | Pantalla /app/mis-reservas; permite cancelar hasta 48 h antes. |
| RF-35 | Cuando el evento utilice un mecanismo externo de pago o reserva, el sistema debe mostrar el enlace o medio de contacto proporcionado por el organizador. | Usuario | Alta | Implementado | Se muestran el enlace externo y el contacto. |
| RF-36 | El sistema no debe procesar directamente pagos mediante una pasarela propia en la primera versión. | Usuario / Sistema | Alta | Modificado | No hay pasarela; se elige un método de pago simulado que se registra como aprobado. |

### Perfil y experiencia del usuario

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-37 | El sistema debe permitir al usuario autenticado consultar su información de perfil. | Usuario | Media | Implementado | Pantalla /Perfil. |
| RF-38 | El sistema debe permitir registrar un comentario o valoración sobre un evento cuando el usuario cumpla las condiciones definidas para realizarla. | Usuario | Media | Implementado | Desde /Perfil, sobre eventos ya realizados con reserva confirmada. |
| RF-39 | El sistema debe asociar cada comentario o valoración al usuario y al evento correspondiente. | Usuario / Sistema | Media | Implementado | La valoración se une a la reserva, que identifica usuario y evento. |
| RF-40 | El sistema debe impedir que un usuario registre una experiencia sobre un evento que no corresponda a una asistencia o reserva válida, de acuerdo con las reglas de negocio definidas. | Usuario / Sistema | Media | Implementado | Solo eventos realizados con reserva confirmada, una vez por evento. |

### Gestión de eventos por el organizador

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-41 | El sistema debe permitir al organizador acceder a su panel de gestión. | Organizador | Alta | Implementado | Panel y formulario del organizador. |
| RF-42 | El sistema debe permitir crear un evento desde el panel del organizador. | Organizador | Alta | Implementado | Panel y formulario del organizador. |
| RF-43 | El sistema debe permitir registrar nombre, descripción, categoría, fecha, hora y ubicación del evento. | Organizador | Alta | Implementado | Panel y formulario del organizador. |
| RF-44 | El sistema debe permitir registrar precio y capacidad del evento. | Organizador | Alta | Implementado | Panel y formulario del organizador. |
| RF-45 | El sistema debe permitir registrar la disponibilidad inicial del evento. | Organizador | Alta | Modificado | No se digita: la base la calcula como capacidad menos cupos reservados. |
| RF-46 | El sistema debe permitir registrar un enlace externo de reserva o pago. | Organizador | Alta | Implementado | Campo opcional de enlace externo. |
| RF-47 | El sistema debe permitir registrar información de contacto relacionada con el evento. | Organizador | Alta | Implementado | Campo de contacto obligatorio. |
| RF-48 | El sistema debe validar los campos obligatorios antes de publicar un evento. | Organizador | Alta | Implementado | Validación en formulario y servidor. |
| RF-49 | El sistema debe permitir publicar un evento cuando toda la información obligatoria sea válida. | Organizador | Alta | Implementado | Validación en formulario y servidor. |
| RF-50 | El sistema debe mostrar al organizador únicamente los eventos asociados a su cuenta dentro de la sección de gestión propia. | Organizador | Alta | Implementado | Solo se listan y editan eventos propios. |
| RF-51 | El sistema debe permitir al organizador modificar sus propios eventos. | Organizador | Alta | Implementado | Solo se listan y editan eventos propios. |
| RF-52 | El sistema debe permitir actualizar precio, capacidad y disponibilidad de un evento propio cuando su estado lo permita. | Organizador | Alta | Modificado | Se editan precio y capacidad; la disponibilidad se recalcula sola. |
| RF-53 | El sistema debe permitir cancelar un evento creado por el organizador. | Organizador | Alta | Implementado | Al cancelar el evento se cancelan también sus reservas. |
| RF-54 | El sistema debe impedir que un organizador modifique o elimine eventos pertenecientes a otro organizador. | Organizador | Alta | Implementado | Un evento ajeno se responde como inexistente (404). |
| RF-55 | El sistema debe permitir al organizador consultar las reservas asociadas a sus eventos. | Organizador | Alta | Implementado | Reservas y cupos por evento. |
| RF-56 | El sistema debe mostrar al organizador información suficiente para conocer la cantidad de reservas y cupos disponibles de cada evento. | Organizador | Alta | Implementado | Reservas y cupos por evento. |

### Administración de la plataforma

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-57 | El sistema debe permitir al administrador acceder al panel administrativo. | Administrador | Alta | Implementado | Panel administrativo, catálogo y revisión. |
| RF-58 | El sistema debe permitir al administrador consultar los eventos registrados en la plataforma. | Administrador | Alta | Implementado | Panel administrativo, catálogo y revisión. |
| RF-59 | El sistema debe permitir al administrador revisar la información de un evento. | Administrador | Alta | Implementado | Panel administrativo, catálogo y revisión. |
| RF-60 | El sistema debe permitir al administrador aprobar, ocultar o reportar eventos de acuerdo con las reglas establecidas. | Administrador | Alta | Modificado | Acciones: aprobar, ocultar, devolver a borrador y registrar reporte. |
| RF-61 | El sistema debe permitir al administrador consultar usuarios y organizadores registrados. | Administrador | Media | Implementado | Listado de cuentas con búsqueda. |
| RF-62 | El sistema debe permitir al administrador gestionar las cuentas de usuarios y organizadores de acuerdo con los permisos definidos. | Administrador | Media | Modificado | Activar o desactivar asistentes y organizadores, y verificar organizadores. |
| RF-63 | El sistema debe permitir al administrador consultar información relacionada con las reservas. | Administrador | Alta | Implementado | Listado de reservas con búsqueda. |
| RF-64 | El sistema debe permitir al administrador consultar eventos reportados y su información asociada. | Administrador | Media | Implementado | Pantalla de reportes con cambio de estado. |
| RF-65 | El sistema debe restringir el acceso al panel administrativo exclusivamente a cuentas con rol de administrador. | Administrador / Sistema | Alta | Modificado | El rol curador accede a la moderación de eventos; el resto es solo del administrador. |

### Integración con mapas y servicios externos

| ID | Requerimiento | Rol | Prioridad | Estado | Razón |
|---|---|---|---|---|---|
| RF-66 | El sistema debe integrar un servicio externo de mapas y geolocalización para representar la ubicación de los eventos. | Sistema | Alta | Implementado | Leaflet con OpenStreetMap; latitud y longitud en el recinto. |
| RF-67 | El sistema debe almacenar o utilizar la información geográfica necesaria para representar cada evento en el mapa. | Sistema | Alta | Implementado | Leaflet con OpenStreetMap; latitud y longitud en el recinto. |
| RF-68 | El sistema debe permitir consultar la ubicación de un evento desde su detalle. | Visitante / Usuario | Alta | Implementado | Ubicación en el detalle, con enlace para llegar. |
| RF-69 | El sistema debe abrir el enlace externo de reserva o pago definido por el organizador cuando corresponda. | Usuario | Alta | Implementado | El detalle abre el enlace externo en otra pestaña. |

## Requerimientos no funcionales

Los siguientes requerimientos establecen condiciones de calidad y comportamiento que debe cumplir NEXO.

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Rendimiento | Las páginas principales de NEXO deben cargar su contenido inicial en un máximo de **3 segundos** bajo una conexión estable y una carga normal del sistema. |
| RNF-02 | Rendimiento | Una búsqueda o aplicación de filtros debe mostrar una respuesta o estado de carga en un máximo de **2 segundos** bajo condiciones normales. |
| RNF-03 | Seguridad | Las contraseñas de los usuarios no deben almacenarse en texto plano y deben utilizar un mecanismo de almacenamiento seguro mediante hash. |
| RNF-04 | Seguridad | El sistema debe verificar la autenticación y el rol del usuario antes de permitir el acceso a funcionalidades privadas de Usuario, Organizador o Administrador. |
| RNF-05 | Seguridad | Un usuario autenticado solo debe poder consultar y administrar la información privada asociada a su propia cuenta. |
| RNF-06 | Seguridad | Un organizador solo debe poder modificar, publicar o cancelar eventos asociados a su propia cuenta. |
| RNF-07 | Usabilidad | La plataforma debe ser responsive y mantener sus funciones principales utilizables en pantallas con un ancho mínimo de **360 px**. |
| RNF-08 | Usabilidad | Los formularios de registro, inicio de sesión, creación de eventos y reserva deben mostrar mensajes claros cuando exista información inválida o incompleta. |
| RNF-09 | Usabilidad | Cuando una búsqueda no produzca resultados, el sistema debe informar al usuario y permitir modificar los criterios de búsqueda. |
| RNF-10 | Compatibilidad | La plataforma debe funcionar en las versiones vigentes de **Google Chrome, Mozilla Firefox y Microsoft Edge** durante el periodo de desarrollo y evaluación del proyecto. |
| RNF-11 | Disponibilidad | Las funciones que dependan de un servicio externo deben informar al usuario cuando dicho servicio no esté disponible, sin presentar información geográfica como válida si no pudo obtenerse correctamente. |
| RNF-12 | Integridad | El sistema debe impedir que una reserva confirmada supere la disponibilidad registrada para el evento. |
| RNF-13 | Integridad | Después de confirmar una reserva, la disponibilidad del evento debe actualizarse de forma consistente con la cantidad reservada. |
| RNF-14 | Mantenibilidad | La aplicación debe mantener separadas las funcionalidades correspondientes a usuarios, organizadores y administradores para facilitar futuras modificaciones. |
| RNF-15 | Interoperabilidad | La plataforma debe permitir la integración con un servicio externo de mapas y geolocalización para representar la ubicación de los eventos. |
| RNF-16 | Interoperabilidad | Los enlaces externos de reserva o pago registrados por un organizador deben poder abrirse desde la información correspondiente del evento. |

---

## Reglas de negocio

Las siguientes reglas representan las condiciones que NEXO debe respetar independientemente de la tecnología utilizada para implementar la plataforma.

### Usuarios y roles

- **RN-01.** La consulta y búsqueda de eventos publicados puede realizarse sin iniciar sesión.
- **RN-02.** Un usuario debe iniciar sesión antes de confirmar una reserva.
- **RN-03.** Cada cuenta debe tener un rol que determine las funcionalidades disponibles.
- **RN-04.** Las funcionalidades exclusivas del administrador no deben estar disponibles para usuarios ni organizadores.
- **RN-05.** Un usuario solo puede consultar y administrar la información privada correspondiente a su propia cuenta.

### Eventos

- **RN-06.** Cada evento debe estar asociado a un organizador.
- **RN-07.** Un organizador solo puede gestionar los eventos asociados a su propia cuenta.
- **RN-08.** Un evento debe contar con la información obligatoria definida por NEXO antes de ser publicado.
- **RN-09.** Un organizador puede modificar la información de sus propios eventos de acuerdo con el estado del evento.
- **RN-10.** Un organizador puede cancelar sus propios eventos.
- **RN-11.** Un evento cancelado no debe permitir nuevas reservas.
- **RN-12.** Un evento finalizado no debe permitir nuevas reservas.
- **RN-13.** La capacidad de un evento no puede ser inferior a la cantidad de cupos que ya hayan sido comprometidos mediante reservas confirmadas.

### Reservas

- **RN-14.** Solo los usuarios autenticados pueden confirmar reservas.
- **RN-15.** Toda reserva debe estar asociada a un usuario y a un evento.
- **RN-16.** La cantidad solicitada en una reserva no puede superar la disponibilidad del evento.
- **RN-17.** El sistema debe comprobar la disponibilidad antes de confirmar una reserva.
- **RN-18.** La disponibilidad debe disminuir de acuerdo con la cantidad de cupos reservados cuando una reserva sea confirmada.
- **RN-19.** Cada reserva confirmada debe tener un identificador único.
- **RN-20.** Si no existe disponibilidad suficiente, la reserva debe ser rechazada y el sistema debe informar la causa.
- **RN-21.** Un usuario solo puede consultar sus propias reservas.

### Valoraciones y comentarios

- **RN-22.** Las valoraciones o comentarios deben estar asociados al usuario y al evento correspondiente.
- **RN-23.** Un usuario solo podrá registrar una valoración cuando cumpla las condiciones establecidas por NEXO para demostrar que corresponde a una experiencia válida con el evento.
- **RN-24.** El sistema debe conservar la relación entre una valoración, el usuario que la realizó y el evento valorado.

### Pagos y reservas externas

- **RN-25.** NEXO no procesará directamente pagos mediante una pasarela propia en la primera versión.
- **RN-26.** Cuando un organizador utilice un servicio externo de pago o reserva, NEXO mostrará o proporcionará el enlace o medio de contacto registrado.
- **RN-27.** El proceso que ocurra después de acceder al servicio externo será responsabilidad del proveedor externo y del organizador correspondiente.

### Búsqueda

- **RN-28.** Los filtros seleccionados por el usuario pueden combinarse en una misma búsqueda.
- **RN-29.** Los resultados de búsqueda deben cumplir los criterios seleccionados.
- **RN-30.** Cuando no existan resultados para los criterios seleccionados, el sistema debe informar la situación y permitir realizar una nueva búsqueda.

---

## 10. Modelo de datos

Modelo tal como quedó en SQL Server. Los nombres son los de las tablas y columnas reales.

### Entidades principales

| Tabla | Columnas | Uso |
|---|---|---|
| **Roles** | `RoleId`, `Name` | asistente, organizador, curador, admin |
| **Users** | `UserId`, `FullName`, `Email`, `PasswordHash`, `RoleId`, `City`, `IsActive`, `CreatedAt`, `LastLoginAt` | Cuentas |
| **Organizers** | `OrganizerId`, `OwnerUserId`, `Name`, `Description`, `IsVerified` | Perfil de organizador |
| **Categories** | `CategoryId`, `Name`, `ColorHex` | Categorías de evento |
| **Venues** | `VenueId`, `Name`, `Address`, `City`, `Latitude`, `Longitude`, `IsAccessible` | Recintos y ubicación |
| **Events** | `EventId`, `Title`, `Description`, `Tag`, `ImageUrl`, `CategoryId`, `VenueId`, `OrganizerId`, `StartsAt`, `Price`, `Capacity`, `SoldCount`, `AvailableSeats`, `ExternalUrl`, `Contact`, `Status`, `CreatedAt` | Eventos |
| **Reservations** | `ReservationId`, `Code`, `UserId`, `EventId`, `Quantity`, `UnitPrice`, `Subtotal`, `ServiceFee`, `Total`, `Status`, `CreatedAt`, `CancelledAt` | Reservas |
| **Reviews** | `ReviewId`, `ReservationId`, `Rating`, `Comment`, `CreatedAt` | Valoraciones |
| **Reports** | `ReportId`, `UserId`, `EventId`, `Reason`, `Description`, `Status`, `CreatedAt` | Reportes |
| **Payments** | `PaymentId`, `ReservationId`, `Method`, `Amount`, `Status`, `ProviderRef`, `CreatedAt` | Registro del pago simulado de cada reserva |
| **Favorites** | `UserId`, `EventId`, `CreatedAt` | Existe en el esquema; la aplicación no la usa |

### Relaciones

```text
Roles        1 ── N Users
Users        1 ── N Organizers     (dueño)
Organizers   1 ── N Events
Categories   1 ── N Events
Venues       1 ── N Events
Users        1 ── N Reservations   N ── 1 Events
Reservations 1 ── 0..1 Reviews
Reservations 1 ── N Payments
Users        1 ── N Reports        N ── 1 Events
Users        N ── N Events         (Favorites)
```

### Procedimientos almacenados

- `usp_CreateReservation`: valida el evento y los cupos, crea la reserva y su registro de pago en una transacción.
- `usp_CancelReservation`: cancela una reserva propia hasta 48 horas antes y libera los cupos.

### Consideraciones del modelo

- `PasswordHash` guarda un hash BCrypt, nunca la contraseña.
- `AvailableSeats` es una columna calculada (`Capacity - SoldCount`).
- `Events.Status`: borrador, pendiente, publicado o cancelado. "Finalizado" se deduce de la fecha.
- `Reservations.Status`: confirmada o cancelada. `Reports.Status`: pendiente, revisado o descartado.
- La valoración se asocia a una reserva (única), de donde salen el usuario y el evento.

### Cambios respecto al primer entregable

El primer modelo tenía cinco entidades. Se separaron roles, organizadores, categorías y recintos en tablas propias, y la valoración pasó a depender de la reserva.

## Pantallas y flujo

La interfaz tiene dos partes que comparten la sesión: un cliente React en `/app` para visitantes y asistentes, y vistas Razor para perfil, organizador y administración.

### Pantallas del visitante y asistente (React)

| Pantalla | Ruta | Acceso |
|---|---|---|
| Inicio | `/app/` | Todos |
| Búsqueda y filtros | `/app/buscar` | Todos |
| Mapa de eventos | `/app/mapa` | Todos |
| Detalle del evento | `/app/evento/{id}` | Todos |
| Inicio de sesión | `/app/login` | Todos |
| Registro | `/app/registro` | Todos |
| Reservar | `/app/reservar/{id}` | Asistente |
| Confirmación | `/app/confirmacion/{code}` | Asistente |
| Mis reservas | `/app/mis-reservas` | Asistente |
| Acceso denegado | `/app/denegado` | Todos |

### Pantallas con vistas Razor

| Pantalla | Ruta | Rol |
|---|---|---|
| Inicio de sesión y registros | `/Auth/...` | Todos (administrador con código) |
| Perfil | `/Perfil` | Asistente |
| Valorar evento | `/Perfil/Valorar/{eventId}` | Asistente |
| Panel del organizador | `/Organizador` | Organizador |
| Crear y editar evento | `/Organizador/CrearEvento`, `/Organizador/EditarEvento/{id}` | Organizador |
| Reservas del evento | `/Organizador/Reservas/{id}` | Organizador |
| Panel administrativo | `/Admin` | Administrador |
| Eventos y revisión | `/Admin/Eventos`, `/Admin/Eventos/{id}` | Administrador, curador |
| Usuarios, reservas y reportes | `/Admin/Usuarios`, `/Admin/Reservas`, `/Admin/Reportes` | Administrador |

### Flujos

```text
Visitante:     Inicio → Buscar / Mapa → Detalle → (enlace externo)
Asistente:     Detalle → Iniciar sesión → Reservar → Confirmación → Mis reservas
Organizador:   Iniciar sesión → Panel → Crear / Editar / Cancelar → Reservas del evento
Administrador: Iniciar sesión → Panel → Eventos, Usuarios, Reservas, Reportes
Curador:       Iniciar sesión → Eventos → Revisión
```

---

## Trazabilidad básica entre funcionalidades, requerimientos y pantallas

> Trazabilidad del diseño original. Las pantallas y estados vigentes están en "Pantallas y flujo" y en los requerimientos funcionales.

La siguiente relación permite comprobar que las funcionalidades principales cuentan con requerimientos y una representación en la interfaz.

| Funcionalidad | Requerimientos relacionados | Pantallas principales |
|---|---|---|
| Buscar y filtrar eventos | RF-09 a RF-17 | Inicio, Resultados, Mapa |
| Consultar evento | RF-20 a RF-23 | Detalle del evento |
| Consultar ubicación | RF-18, RF-19, RF-22 | Mapa, Detalle |
| Realizar reserva | RF-24 a RF-35 | Inicio de sesión, Detalle, Reserva, Confirmación |
| Consultar reservas propias | RF-33 y RF-34 | Mis reservas, Detalle de reserva |
| Valorar una experiencia | RF-37 a RF-40 | Mis reservas, Experiencia / valoración |
| Crear y publicar evento | RF-41 a RF-49 | Panel, Crear evento, Formulario, Vista previa |
| Modificar evento | RF-50 a RF-54 | Mis eventos, Editar evento |
| Gestionar reservas del organizador | RF-55 y RF-56 | Mis eventos, Reservas del evento |
| Administrar eventos | RF-57 a RF-60 | Panel administrativo, Gestión de eventos, Revisión |
| Gestionar usuarios | RF-61 y RF-62 | Usuarios y organizadores |
| Consultar reservas administrativamente | RF-63 | Gestión de reservas |
| Gestionar reportes | RF-64 | Reportes, Revisión de reporte |
| Controlar acceso por rol | RF-01 a RF-07, RF-65 | Inicio de sesión, paneles por rol |

---

## Flujo general de la plataforma

> Flujo previsto en el diseño original. El flujo vigente está en "Pantallas y flujo".

```text
                         ┌───────────────────────┐
                         │        INICIO         │
                         └───────────┬───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             Explorar eventos   Iniciar sesión    Mapa de eventos
                    │                │
                    ▼                ▼
             Buscar / filtrar    Identificar rol
                    │                │
                    ▼        ┌───────┼────────┐
             Resultados      │       │        │
                    │        ▼       ▼        ▼
                    ▼     Usuario  Organizador Administrador
             Detalle evento   │       │        │
                    │         │       │        │
            ┌───────┴──────┐  │       │        │
            │              │  │       │        │
            ▼              ▼  ▼       ▼        ▼
        Consultar      Reservar   Panel    Panel
        información        │      organizador administrativo
            │              │       │        │
            │              ▼       │        ├── Eventos
            │         Confirmación │        ├── Usuarios
            │              │       │        ├── Reservas
            │              ▼       │        └── Reportes
            │         Mis reservas│
            │                      ├── Mis eventos
            │                      ├── Crear evento
            │                      └── Reservas
            │
            └──────► Enlace externo de pago/reserva
```

## Historias de usuario, casos de uso, restricciones y supuestos

> Estado: HU-01 a HU-08 y CU-01 implementados.

### Historias de usuario

#### HU-01 — Buscar eventos

**Como** visitante o usuario  
**quiero** buscar eventos por nombre o términos relacionados  
**para** encontrar actividades específicas que me interesen.

**Criterios de aceptación:**
- El usuario puede introducir un criterio de búsqueda.
- El sistema muestra los eventos que coinciden con el criterio.
- Si no existen coincidencias, el sistema informa que no se encontraron resultados.
- El usuario puede modificar la búsqueda.

#### HU-02 — Filtrar eventos

**Como** visitante o usuario  
**quiero** filtrar eventos por fecha, hora, categoría, precio, distancia y disponibilidad  
**para** encontrar actividades que se ajusten a mis necesidades.

**Criterios de aceptación:**
- Se pueden seleccionar uno o varios filtros.
- Los filtros seleccionados pueden combinarse.
- Los resultados deben corresponder a los criterios seleccionados.
- El usuario puede limpiar o modificar los filtros.

#### HU-03 — Consultar ubicación de un evento

**Como** usuario  
**quiero** visualizar la ubicación de un evento en un mapa  
**para** conocer dónde se realizará.

**Criterios de aceptación:**
- El evento debe tener información geográfica válida.
- El sistema muestra la ubicación mediante un marcador.
- El usuario puede consultar el detalle del evento desde la información mostrada.

#### HU-04 — Reservar un evento

**Como** usuario autenticado  
**quiero** reservar una cantidad determinada de entradas o cupos  
**para** asegurar mi asistencia a un evento.

**Criterios de aceptación:**
- El usuario debe haber iniciado sesión.
- El evento debe estar disponible.
- La cantidad solicitada no puede superar la disponibilidad.
- Al confirmar la reserva, el sistema registra la operación y actualiza la disponibilidad.

#### HU-05 — Consultar mis reservas

**Como** usuario  
**quiero** consultar mis reservas  
**para** conocer los eventos que he reservado y el estado de cada reserva.

**Criterios de aceptación:**
- Solo se muestran las reservas asociadas al usuario autenticado.
- Cada reserva muestra su información principal y estado.
- Las reservas deben estar asociadas al evento correspondiente.

#### HU-06 — Crear un evento

**Como** organizador  
**quiero** crear y publicar un evento  
**para** darlo a conocer a los usuarios de NEXO.

**Criterios de aceptación:**
- El organizador debe haber iniciado sesión.
- Debe completar los datos obligatorios del evento.
- Debe indicar información de capacidad y disponibilidad.
- El evento queda asociado a la cuenta del organizador.

#### HU-07 — Administrar mis eventos

**Como** organizador  
**quiero** modificar o cancelar mis eventos  
**para** mantener actualizada la información que consultan los usuarios.

**Criterios de aceptación:**
- El organizador solo puede administrar eventos propios.
- Puede actualizar la información permitida.
- Puede cancelar sus eventos.
- Un evento cancelado deja de aceptar nuevas reservas.

#### HU-08 — Supervisar la plataforma

**Como** administrador  
**quiero** revisar eventos, usuarios, organizadores, reservas y reportes  
**para** supervisar el funcionamiento de NEXO.

**Criterios de aceptación:**
- Solo un administrador autenticado puede acceder al panel administrativo.
- El administrador puede consultar la información correspondiente a sus permisos.
- Los reportes pueden ser revisados desde el panel administrativo.

---

### Caso de uso completo — Realizar una reserva

**Código:** CU-01  
**Nombre:** Realizar reserva de un evento  
**Actor principal:** Usuario autenticado

**Precondiciones:**

- El usuario tiene una cuenta registrada.
- El usuario ha iniciado sesión.
- El evento existe y está publicado.
- El evento acepta reservas.
- Existe disponibilidad para la cantidad solicitada.

**Flujo principal:**

1. El usuario busca o selecciona un evento.
2. El sistema muestra la información detallada del evento.
3. El usuario selecciona la opción de reservar.
4. El sistema solicita la cantidad de entradas o cupos.
5. El usuario indica la cantidad deseada.
6. El sistema verifica que el evento continúe disponible.
7. El sistema verifica que la cantidad solicitada no supere la disponibilidad.
8. El usuario confirma la reserva.
9. El sistema registra la reserva asociándola al usuario y al evento.
10. El sistema actualiza la disponibilidad del evento.
11. El sistema genera un identificador para la reserva.
12. El sistema muestra la confirmación al usuario.

**Excepciones:**

- **E-01:** Si el usuario no ha iniciado sesión, el sistema solicita autenticación antes de permitir la confirmación.
- **E-02:** Si la cantidad solicitada supera la disponibilidad, el sistema rechaza la operación e informa al usuario.
- **E-03:** Si el evento fue cancelado o finalizó antes de confirmar la reserva, el sistema rechaza la operación e informa que el evento ya no está disponible.
- **E-04:** Si ocurre un error al guardar la reserva, el sistema no debe presentar la reserva como confirmada y debe informar que la operación no pudo completarse.

---

### Restricciones

- **R-01.** La primera versión de NEXO no implementará una pasarela de pagos propia.
- **R-02.** Los procesos externos de pago o reserva dependerán del enlace o mecanismo proporcionado por el organizador.
- **R-03.** Las reservas requieren autenticación.
- **R-04.** Los organizadores solo pueden administrar sus propios eventos.
- **R-05.** Los usuarios solo pueden consultar sus propias reservas.
- **R-06.** Las funciones administrativas requieren el rol de administrador.
- **R-07.** Una reserva no puede superar la disponibilidad del evento.
- **R-08.** Los eventos cancelados o finalizados no aceptan nuevas reservas.
- **R-09.** La representación en el mapa depende de que exista información geográfica válida.
- **R-10.** La plataforma depende de servicios externos cuando un evento utiliza mapas, geolocalización o mecanismos externos de reserva o pago.

### Supuestos

- **S-01.** Se asume que los organizadores proporcionan información correcta y suficiente sobre sus eventos.
- **S-02.** Se asume que los organizadores mantienen actualizados el precio, capacidad y disponibilidad de sus eventos.
- **S-03.** Se asume que la información geográfica proporcionada por los organizadores es válida para representar la ubicación del evento.
- **S-04.** Se asume que el servicio externo de mapas y geolocalización está disponible cuando NEXO lo necesita.
- **S-05.** Se asume que los enlaces externos de reserva o pago proporcionados por los organizadores son válidos y funcionales.
- **S-06.** Se asume que los usuarios proporcionan información válida durante el registro.
- **S-07.** Se asume que las valoraciones se realizan únicamente cuando el usuario cumple las condiciones definidas por NEXO.
- **S-08.** Se asume que el administrador utiliza sus permisos para supervisar y gestionar la información de acuerdo con las reglas establecidas para la plataforma.

## 14. Arquitectura, base de datos y API

### Entorno

ASP.NET Core 10 MVC con Entity Framework Core 10 sobre SQL Server (LocalDB en desarrollo). Autenticación por cookie, contraseñas con BCrypt, protección antiforgery y Swagger. El cliente del visitante usa React 18, Vite, Tailwind y Leaflet; se compila en `wwwroot/app`. Las vistas Razor sirven Tailwind, Leaflet y jQuery desde `wwwroot/lib`. Las pruebas usan xUnit.

### Estructura

| Carpeta | Contenido |
|---|---|
| `Controllers/` | Controladores MVC; `Controllers/Api/` los de la API |
| `Services/` | Lógica de negocio |
| `Models/Entities/` | Entidades de la base |
| `Models/ViewModels/` | Modelos de vista y de entrada, con validaciones |
| `Data/` | `NexoDbContext`, `DbSeeder` y `Migrations/` |
| `Views/` | Vistas Razor |
| `wwwroot/` | CSS, JavaScript, imágenes y librerías |
| `client/` | Cliente React |
| `Nexo.Tests/` | Pruebas automatizadas |
| `legacy/` | Código anterior de referencia; no se compila |

### Base de datos

SQL Server. El modelo está en la sección 10. Hay dos migraciones, que se aplican al arrancar la aplicación:

- `InitialCreate`: esquema base, tomado de `nexo_database.sql`.
- `AddContactAndReports`: columna `Events.Contact` y tabla `Reports`.

### Endpoints de la API

| Método | Ruta | Para qué sirve | Rol |
|---|---|---|---|
| GET | `/api/events` | Catálogo con búsqueda, filtros, orden y paginación. | Todos |
| GET | `/api/events/{id}` | Detalle de un evento publicado. | Todos |
| GET | `/api/csrf` | Token antiforgery del cliente. | Todos |
| POST | `/api/auth/register` | Registra un asistente. | Todos |
| POST | `/api/auth/login` | Inicia sesión. | Todos |
| POST | `/api/auth/logout` | Cierra sesión. | Autenticado |
| GET | `/api/auth/me` | Usuario actual. | Autenticado |
| POST | `/api/reservations` | Crea una reserva si hay cupos. | Asistente |
| GET | `/api/reservations/mine` | Reservas propias. | Asistente |
| GET | `/api/reservations/{code}` | Detalle de una reserva propia. | Asistente |
| POST | `/api/reservations/{code}/cancel` | Cancela una reserva propia. | Asistente |
| GET | `/api/eventos/mios` | Lista los eventos propios. | Organizador |
| POST | `/api/eventos` | Crea un evento (borrador o publicado). | Organizador |
| PUT | `/api/eventos/{id}` | Actualiza un evento propio. | Organizador |
| POST | `/api/eventos/{id}/cancelar` | Cancela un evento propio. | Organizador |
| GET | `/api/reservas/evento/{eventId}` | Reservas y cupos de un evento propio. | Organizador |
| GET | `/api/valoraciones` | Valoraciones del usuario autenticado. | Asistente |
| POST | `/api/valoraciones` | Registra una valoración. | Asistente |
| POST | `/api/admin/eventos/{id}/moderar` | Aprueba, oculta o devuelve un evento. | Administrador, curador |
| POST | `/api/admin/eventos/{id}/reportes` | Registra un reporte. | Administrador, curador |
| PUT | `/api/admin/usuarios/{id}/activo` | Activa o desactiva una cuenta. | Administrador |
| PUT | `/api/admin/organizadores/{id}/verificado` | Verifica un organizador. | Administrador |
| PUT | `/api/admin/reportes/{id}` | Cambia el estado de un reporte. | Administrador |

## 15. Despliegue y configuración

La plataforma **no está publicada todavía**; se ejecuta en local. La columna de producción describe lo previsto.

| Elemento | Local (actual) | Producción (previsto) |
|---|---|---|
| Dirección | `http://localhost:5080` | Dirección pública de Azure App Service |
| Base de datos | SQL Server LocalDB | Azure SQL |
| Cadena de conexión (`ConnectionStrings:NexoDb`) | `appsettings.json`, excluido de Git | Configuración de la aplicación en Azure |
| Datos de prueba (`Seed:DemoUsers`, `Seed:DemoEvents`, `Seed:DemoPassword`) | `appsettings.json` | Desactivados |
| Código de administrador (`Registro:CodigoInvitacionAdmin`) | `appsettings.json`; vacío deshabilita el registro | Configuración de la aplicación en Azure |
| Cliente React | `npm install` y `npm run build` en `client/` (requiere Node.js) | Compilado antes de publicar |
| Swagger | Activo en `/swagger` | Desactivado |
| HTTPS | No se fuerza | Redirección y HSTS |
| Publicación | No aplica | Por definir |

Arranque local: copiar `appsettings.example.json` como `appsettings.json`, compilar el cliente y ejecutar `dotnet run`. Las migraciones se aplican solas.

### Pruebas realizadas (2026-11-28)

- La aplicación y el cliente React compilan.
- Las 76 pruebas automatizadas pasan sobre .NET 10.
- Con una base temporal: catálogo y filtros, registro, reserva, cancelación, sobreventa, cancelación de un evento, permisos por rol, organizador y administración.
- En el navegador: portada, búsqueda, filtro de distancia, detalle, reserva, confirmación, mis reservas y mapa.

## 16. Aportes por integrante

| Integrante | Aportes principales | Evidencia |
|---|---|---|
| Ana Isabel Patiño Carvajal | Documento: descripción, problema, actores, stakeholders, funcionalidades, requerimientos, pantallas y mockups. Commits de la base: configuración, base de datos, vistas Razor, autenticación, módulos por rol y API. Integración de las ramas de visitante. | PR #1, #2, #4, #10 a #14; merges `d72d1ea`, `1a474df`, `25a1440`, `9fdf431`, `e64135e` |
| Juan David Rojas Villegas | Documento: objetivos, alcance, requerimientos no funcionales, reglas de negocio, modelo de datos, historias y casos de uso. Integración de la base en `main`. API del visitante, cliente React, datos de demostración, pruebas, recursos y actualización a .NET 10 para Azure. | PR #3, #5 a #8, #15 a #20; commits `26f30d9`, `d6f785f`, `ed5a1cd`, `17532e3`, `373c405`, `9816362` |

## Historial de cambios

| Fecha | Qué cambió | Por qué | Quién |
|---|---|---|---|
| 2026-09-23 a 2026-09-26 | Primera versión del documento y mockups. | Primer entregable. | Ana Isabel y Juan David |
| 2026-11-27 | Se integró en `main` la base de la aplicación. | Implementación. | Ana Isabel y Juan David |
| 2026-11-28 | Se integraron la API del visitante, el cliente React, las pruebas y recursos. | Completar el flujo de descubrimiento y reserva. | Juan David (código) y Ana Isabel (integración) |
| 2026-11-28 | Corrección de la portada, filtros nuevos, organizador, contacto y estados en el detalle, y cancelación de reservas al cancelar un evento (RF-08, 10, 13, 15, 21, 23, 35, 53). | Completar requerimientos pendientes. | Ana Isabel |
| 2026-11-28 | Estados de requerimientos, alcance, modelo, pantallas y secciones 14 a 16. | Que el documento describa la plataforma entregada. | Ana Isabel |

## Referencias bibliográficas

[1] FIXR. (2024, 24 de abril). *How Gen Z ticket buyers discover events in 2024*. FIXR.  
https://blog.fixr.co/how-gen-z-ticket-buyers-discover-events-in-2024/

[2] Eventbrite. (2025). *TRNDS 2025: The future of experiences*. Eventbrite.  
https://www.eventbrite.com/blog/wp-content/uploads/2025/01/Eventbrite-TRNDS-2025-US.pdf

[3] Althaus, M., Vorbohle, C., Müller, M., et al. (2025). *Setting the stage for a flourishing cultural data ecosystem: A spotlight on business models of cultural event platforms*. Electronic Markets, 35, 47.  
https://doi.org/10.1007/s12525-025-00790-y

[4] Baymard Institute. (2024). *Checkout UX 2025: 10 Pitfalls and Best Practices*. Actualizado en 2025.  
https://baymard.com/research-articles/current-state-of-checkout-ux

Francis, C. (2025, 14 de marzo). Social media event marketing: Expert advice beyond the basics. Eventbrite.

https://www.eventbrite.com/blog/how-to-promote-event-social-media-ds00/?

### Uso de la IA en el proyecto 
- **Chat GPT:** Se uso para la organización de los flujos de forma visual. Se le entregó el flujo en formato prosa y se le pidió que creará un diagrama apto para Markdown, se verificó que estuviera bien y se hicieron lso respectivos cambios. También se uso para el prompt que se uso para la creación de los mockups, se le entrego: tipo de diseño, letras, colores, funcionalidad por pantalla, etc. 
- **Notebooklm:** Se uso para complementar y organizar el flujo de argumentos usados para la creación del planteamiento del problema. Se esocgieron los articulos, se leyeron y se sacó las ideas principales que ayudarian a formar el argumento. Se le pidió a la IA que verifiacará la coherencia entre los datos adquiridos en la investigación que se usarian para la posterior redacción. 
- **Stitch IA:** Creación de mockups segun el prompt hecho con chatGPT, por restricciones del plan gratuito se tiene que modificar ciertas funcionalidades que no se harán en el proyecto, pero ya estan debidamente aclaradas en el documento.
