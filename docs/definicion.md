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

### Incluye

NEXO contempla las siguientes funcionalidades y componentes dentro de su alcance:

- Consulta pública de eventos publicados sin necesidad de iniciar sesión.
- Búsqueda de eventos por nombre o términos relacionados.
- Filtrado de eventos por fecha, hora, categoría, precio, distancia y disponibilidad.
- Combinación de diferentes filtros para obtener resultados más específicos.
- Visualización de eventos mediante un mapa interactivo.
- Consulta detallada de cada evento, incluyendo nombre, descripción, fecha, hora, ubicación, precio, disponibilidad y organizador.
- Registro e inicio de sesión de usuarios.
- Reserva de entradas o cupos para eventos disponibles.
- Consulta de las reservas realizadas por cada usuario.
- Gestión de eventos por parte de los organizadores.
- Creación, publicación, modificación y cancelación de eventos por parte de sus respectivos organizadores.
- Consulta de las reservas asociadas a los eventos de un organizador.
- Panel de administración para supervisar la plataforma.
- Gestión y revisión de información relacionada con usuarios, organizadores, eventos, reservas y reportes según los permisos del administrador.
- Integración con servicios externos de mapas y geolocalización.
- Acceso a enlaces externos de reserva o pago cuando estos sean proporcionados por el organizador.

### No incluye

Para la primera versión del proyecto, NEXO no contempla:

- Implementar una pasarela de pagos propia.
- Procesar directamente pagos con tarjeta, transferencias u otros medios dentro de NEXO.
- Sustituir las plataformas externas de pago o reserva utilizadas por los organizadores.
- Desarrollar una aplicación móvil nativa independiente de la plataforma web.
- Gestionar físicamente los eventos ni controlar la asistencia en el lugar del evento.
- Garantizar la disponibilidad, funcionamiento o validez de los servicios externos utilizados por los organizadores.
- Permitir que un organizador modifique eventos pertenecientes a otro organizador.
- Permitir que un usuario consulte o modifique las reservas privadas de otro usuario.

## Funcionalidades

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

### Autenticación y control de acceso

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-01 | El sistema debe permitir iniciar sesión mediante correo electrónico y contraseña. | Usuario / Organizador / Administrador | Alta |
| RF-02 | El sistema debe validar que las credenciales proporcionadas correspondan a una cuenta registrada y activa. | Usuario / Organizador / Administrador | Alta |
| RF-03 | El sistema debe identificar el rol asociado a la cuenta autenticada y habilitar únicamente las funcionalidades correspondientes. | Usuario / Organizador / Administrador | Alta |
| RF-04 | El sistema debe permitir consultar y buscar eventos publicados sin iniciar sesión. | Visitante / Usuario | Alta |
| RF-05 | El sistema debe restringir las operaciones de reserva y consulta de reservas a usuarios autenticados. | Usuario | Alta |
| RF-06 | El sistema debe impedir que un usuario acceda mediante la interfaz a funciones exclusivas de organizador o administrador. | Usuario | Alta |
| RF-07 | El sistema debe permitir cerrar la sesión de la cuenta autenticada. | Usuario / Organizador / Administrador | Media |

### Descubrimiento, búsqueda y consulta de eventos

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-08 | El sistema debe mostrar los eventos publicados y vigentes disponibles para consulta. | Visitante / Usuario | Alta |
| RF-09 | El sistema debe permitir buscar eventos por nombre o términos relacionados con el evento. | Visitante / Usuario | Alta |
| RF-10 | El sistema debe permitir filtrar eventos por fecha y hora. | Visitante / Usuario | Alta |
| RF-11 | El sistema debe permitir filtrar eventos por categoría. | Visitante / Usuario | Alta |
| RF-12 | El sistema debe permitir filtrar eventos por precio, incluyendo la identificación de eventos gratuitos. | Visitante / Usuario | Alta |
| RF-13 | El sistema debe permitir filtrar eventos por distancia respecto a una ubicación de referencia cuando exista información geográfica disponible. | Visitante / Usuario | Alta |
| RF-14 | El sistema debe permitir consultar la disponibilidad de un evento. | Visitante / Usuario | Alta |
| RF-15 | El sistema debe permitir combinar varios filtros en una misma búsqueda. | Visitante / Usuario | Alta |
| RF-16 | El sistema debe mostrar únicamente los eventos que cumplan los criterios de búsqueda y filtrado seleccionados. | Visitante / Usuario | Alta |
| RF-17 | El sistema debe informar cuando una búsqueda o combinación de filtros no produzca resultados. | Visitante / Usuario | Media |
| RF-18 | El sistema debe mostrar los eventos disponibles sobre un mapa interactivo mediante marcadores geográficos. | Visitante / Usuario | Alta |
| RF-19 | El sistema debe permitir seleccionar un marcador para consultar información resumida del evento. | Visitante / Usuario | Alta |
| RF-20 | El sistema debe mostrar el detalle completo de un evento seleccionado. | Visitante / Usuario | Alta |
| RF-21 | El detalle del evento debe mostrar como mínimo nombre, descripción, categoría, fecha, hora, ubicación, precio, disponibilidad y organizador. | Visitante / Usuario | Alta |
| RF-22 | El sistema debe mostrar la ubicación del evento mediante un servicio de mapas y geolocalización. | Visitante / Usuario | Alta |
| RF-23 | El sistema debe mostrar el estado actual del evento cuando corresponda: publicado, disponible, agotado, cancelado o finalizado. | Visitante / Usuario | Alta |

### Reservas

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-24 | El sistema debe permitir a un usuario autenticado iniciar una reserva desde el detalle de un evento disponible. | Usuario | Alta |
| RF-25 | El sistema debe permitir seleccionar la cantidad de entradas o cupos que desea reservar. | Usuario | Alta |
| RF-26 | El sistema debe verificar la disponibilidad antes de confirmar una reserva. | Usuario | Alta |
| RF-27 | El sistema no debe permitir confirmar una reserva cuando la cantidad solicitada supere la disponibilidad existente. | Usuario | Alta |
| RF-28 | El sistema debe registrar la reserva asociándola al usuario autenticado y al evento seleccionado. | Usuario | Alta |
| RF-29 | El sistema debe actualizar la disponibilidad del evento después de confirmar una reserva. | Usuario / Sistema | Alta |
| RF-30 | El sistema debe generar un identificador único para cada reserva confirmada. | Usuario / Sistema | Alta |
| RF-31 | El sistema debe mostrar una pantalla de confirmación después de registrar correctamente una reserva. | Usuario | Alta |
| RF-32 | La confirmación debe mostrar como mínimo número de reserva, evento, fecha, hora, ubicación, cantidad de entradas y estado de la reserva. | Usuario | Alta |
| RF-33 | El sistema debe permitir consultar las reservas asociadas al usuario autenticado. | Usuario | Alta |
| RF-34 | El sistema debe mostrar el estado de cada reserva del usuario. | Usuario | Alta |
| RF-35 | Cuando el evento utilice un mecanismo externo de pago o reserva, el sistema debe mostrar el enlace o medio de contacto proporcionado por el organizador. | Usuario | Alta |
| RF-36 | El sistema no debe procesar directamente pagos mediante una pasarela propia en la primera versión. | Usuario / Sistema | Alta |

### Perfil y experiencia del usuario

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-37 | El sistema debe permitir al usuario autenticado consultar su información de perfil. | Usuario | Media |
| RF-38 | El sistema debe permitir registrar un comentario o valoración sobre un evento cuando el usuario cumpla las condiciones definidas para realizarla. | Usuario | Media |
| RF-39 | El sistema debe asociar cada comentario o valoración al usuario y al evento correspondiente. | Usuario / Sistema | Media |
| RF-40 | El sistema debe impedir que un usuario registre una experiencia sobre un evento que no corresponda a una asistencia o reserva válida, de acuerdo con las reglas de negocio definidas. | Usuario / Sistema | Media |

### Gestión de eventos por el organizador

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-41 | El sistema debe permitir al organizador acceder a su panel de gestión. | Organizador | Alta |
| RF-42 | El sistema debe permitir crear un evento desde el panel del organizador. | Organizador | Alta |
| RF-43 | El sistema debe permitir registrar nombre, descripción, categoría, fecha, hora y ubicación del evento. | Organizador | Alta |
| RF-44 | El sistema debe permitir registrar precio y capacidad del evento. | Organizador | Alta |
| RF-45 | El sistema debe permitir registrar la disponibilidad inicial del evento. | Organizador | Alta |
| RF-46 | El sistema debe permitir registrar un enlace externo de reserva o pago. | Organizador | Alta |
| RF-47 | El sistema debe permitir registrar información de contacto relacionada con el evento. | Organizador | Alta |
| RF-48 | El sistema debe validar los campos obligatorios antes de publicar un evento. | Organizador | Alta |
| RF-49 | El sistema debe permitir publicar un evento cuando toda la información obligatoria sea válida. | Organizador | Alta |
| RF-50 | El sistema debe mostrar al organizador únicamente los eventos asociados a su cuenta dentro de la sección de gestión propia. | Organizador | Alta |
| RF-51 | El sistema debe permitir al organizador modificar sus propios eventos. | Organizador | Alta |
| RF-52 | El sistema debe permitir actualizar precio, capacidad y disponibilidad de un evento propio cuando su estado lo permita. | Organizador | Alta |
| RF-53 | El sistema debe permitir cancelar un evento creado por el organizador. | Organizador | Alta |
| RF-54 | El sistema debe impedir que un organizador modifique o elimine eventos pertenecientes a otro organizador. | Organizador | Alta |
| RF-55 | El sistema debe permitir al organizador consultar las reservas asociadas a sus eventos. | Organizador | Alta |
| RF-56 | El sistema debe mostrar al organizador información suficiente para conocer la cantidad de reservas y cupos disponibles de cada evento. | Organizador | Alta |

### Administración de la plataforma

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-57 | El sistema debe permitir al administrador acceder al panel administrativo. | Administrador | Alta |
| RF-58 | El sistema debe permitir al administrador consultar los eventos registrados en la plataforma. | Administrador | Alta |
| RF-59 | El sistema debe permitir al administrador revisar la información de un evento. | Administrador | Alta |
| RF-60 | El sistema debe permitir al administrador aprobar, ocultar o reportar eventos de acuerdo con las reglas establecidas. | Administrador | Alta |
| RF-61 | El sistema debe permitir al administrador consultar usuarios y organizadores registrados. | Administrador | Media |
| RF-62 | El sistema debe permitir al administrador gestionar las cuentas de usuarios y organizadores de acuerdo con los permisos definidos. | Administrador | Media |
| RF-63 | El sistema debe permitir al administrador consultar información relacionada con las reservas. | Administrador | Alta |
| RF-64 | El sistema debe permitir al administrador consultar eventos reportados y su información asociada. | Administrador | Media |
| RF-65 | El sistema debe restringir el acceso al panel administrativo exclusivamente a cuentas con rol de administrador. | Administrador / Sistema | Alta |

### Integración con mapas y servicios externos

| ID | Requerimiento | Rol | Prioridad |
|---|---|---|---|
| RF-66 | El sistema debe integrar un servicio externo de mapas y geolocalización para representar la ubicación de los eventos. | Sistema | Alta |
| RF-67 | El sistema debe almacenar o utilizar la información geográfica necesaria para representar cada evento en el mapa. | Sistema | Alta |
| RF-68 | El sistema debe permitir consultar la ubicación de un evento desde su detalle. | Visitante / Usuario | Alta |
| RF-69 | El sistema debe abrir el enlace externo de reserva o pago definido por el organizador cuando corresponda. | Usuario | Alta |

---

## Pantallas y flujo


### Pantallas del usuario

| Pantalla | Rol | Para qué sirve | Acceso / navegación |
|---|---|---|---|
| Inicio / Explorar eventos | Visitante / Usuario | Presenta el acceso principal a la búsqueda, categorías, eventos próximos y mapa. | Entrada principal → Mapa / Resultados / Detalle |
| Mapa de eventos | Visitante / Usuario | Permite visualizar eventos geográficamente y consultar marcadores. | Inicio → Mapa → Marcador → Detalle |
| Resultados de búsqueda | Visitante / Usuario | Presenta los eventos que coinciden con los criterios de búsqueda y filtros. | Inicio / Mapa → Buscar o Filtrar → Resultados |
| Detalle del evento | Visitante / Usuario | Presenta toda la información necesaria del evento, ubicación, disponibilidad y acciones disponibles. | Resultados / Mapa → Detalle |
| Inicio de sesión | Usuario | Permite autenticar la cuenta para acceder a operaciones privadas. | Acción privada → Inicio de sesión → Área autenticada |
| Realizar reserva | Usuario | Permite seleccionar la cantidad de entradas y confirmar la reserva. | Detalle → Reservar → Reserva |
| Confirmación de reserva | Usuario | Muestra el resultado de una reserva registrada y su identificador. | Reserva → Confirmación |
| Mis reservas | Usuario | Permite consultar las reservas propias y su estado. | Área autenticada → Mis reservas → Detalle de reserva |
| Perfil | Usuario | Permite consultar la información de la cuenta autenticada. | Área autenticada → Perfil |
| Experiencia / valoración | Usuario | Permite registrar una valoración o comentario sobre un evento cuando corresponda. | Mis reservas / evento asistido → Valorar |

### Flujo principal del usuario

```text
Inicio / Explorar
       │
       ├───────────────► Mapa de eventos
       │                      │
       │                      ▼
       └───────────────► Resultados
                              │
                              ▼
                       Detalle del evento
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
               Iniciar sesión      Enlace externo
                    │              de pago/reserva
                    ▼
                Reserva
                    │
                    ▼
             Confirmación
                    │
                    ▼
              Mis reservas
```

### Navegación alternativa del usuario

```text
Área autenticada
      │
      ├── Mis reservas ──► Detalle de reserva
      │                         │
      │                         ▼
      │                    Valorar evento
      │
      └── Perfil
```

### Pantallas del organizador

| Pantalla | Rol | Para qué sirve | Acceso / navegación |
|---|---|---|---|
| Inicio de sesión | Organizador | Permite autenticar al organizador antes de acceder a funciones de gestión. | Inicio → Iniciar sesión → Panel |
| Panel del organizador | Organizador | Presenta un resumen de sus eventos, disponibilidad y accesos a las funciones de administración. | Inicio de sesión → Panel |
| Mis eventos | Organizador | Lista los eventos creados por el organizador y permite seleccionar uno para gestionarlo. | Panel → Mis eventos |
| Crear evento | Organizador | Permite iniciar el registro de un nuevo evento. | Panel / Mis eventos → Crear evento |
| Formulario del evento | Organizador | Permite registrar información general, categoría, fecha, hora, ubicación, precio, capacidad, contacto y enlace externo. | Crear evento → Formulario |
| Vista previa / publicar | Organizador | Permite revisar la información antes de hacer público el evento. | Formulario → Vista previa → Publicar |
| Editar evento | Organizador | Permite modificar la información de un evento propio. | Mis eventos → Seleccionar evento → Editar |
| Reservas del evento | Organizador | Permite consultar las reservas asociadas a un evento y la cantidad de cupos disponibles. | Mis eventos → Evento → Reservas |

### Flujo principal del organizador

```text
Inicio
   │
   ▼
Inicio de sesión
   │
   ▼
Panel del organizador
   │
   ├───────────────► Mis eventos
   │                     │
   │                     ├────────► Editar evento
   │                     │
   │                     └────────► Reservas del evento
   │
   └───────────────► Crear evento
                         │
                         ▼
                  Formulario del evento
                         │
                         ▼
                    Vista previa
                         │
                         ▼
                      Publicar
                         │
                         ▼
                  Evento publicado
```

### Pantallas del administrador

| Pantalla | Rol | Para qué sirve | Acceso / navegación |
|---|---|---|---|
| Inicio de sesión administrativo | Administrador | Permite autenticar al administrador y controlar el acceso al panel. | Inicio → Iniciar sesión → Panel administrativo |
| Panel administrativo | Administrador | Presenta los módulos de gestión y un resumen de información relevante. | Inicio de sesión → Panel |
| Gestión de eventos | Administrador | Permite consultar los eventos registrados y sus estados. | Panel → Eventos |
| Detalle / revisión del evento | Administrador | Permite revisar la información de un evento y ejecutar acciones administrativas. | Gestión de eventos → Seleccionar evento |
| Gestión de usuarios y organizadores | Administrador | Permite consultar y gestionar las cuentas registradas según los permisos establecidos. | Panel → Usuarios |
| Gestión de reservas | Administrador | Permite consultar información relacionada con las reservas de la plataforma. | Panel → Reservas |
| Reportes | Administrador | Permite consultar eventos o contenido reportado. | Panel → Reportes |
| Revisión de reporte | Administrador | Permite analizar la información reportada y ejecutar la acción administrativa correspondiente. | Reportes → Seleccionar reporte |

### Flujo principal del administrador

```text
Inicio
   │
   ▼
Inicio de sesión
   │
   ▼
Panel administrativo
   │
   ├──────────────► Gestión de eventos
   │                    │
   │                    ▼
   │              Revisión del evento
   │                    │
   │          ┌─────────┼─────────┐
   │          ▼         ▼         ▼
   │       Aprobar    Ocultar   Reportar
   │
   ├──────────────► Usuarios y organizadores
   │
   ├──────────────► Gestión de reservas
   │
   └──────────────► Reportes
                        │
                        ▼
                  Revisión de reporte
```

### Pantallas compartidas y navegación general

| Pantalla | Rol | Para qué sirve | Condición de acceso |
|---|---|---|---|
| Inicio | Visitante / Usuario / Organizador / Administrador | Punto de entrada general a la plataforma. | Pública |
| Inicio de sesión | Usuario / Organizador / Administrador | Autentica las cuentas que requieren funciones privadas. | Pública |
| Detalle del evento | Visitante / Usuario | Consulta información pública del evento. | Pública |
| Mapa de eventos | Visitante / Usuario | Permite descubrir eventos mediante ubicación geográfica. | Pública |
| Página de error / acceso denegado | Todos | Informa cuando una operación no puede ejecutarse o el rol no tiene permisos. | Según operación |

### Reglas de navegación

1. La consulta y búsqueda de eventos no requiere autenticación.
2. El usuario debe autenticarse antes de confirmar una reserva.
3. El organizador debe autenticarse antes de acceder a su panel.
4. El administrador debe autenticarse antes de acceder al panel administrativo.
5. Un organizador solo podrá acceder a la gestión de los eventos asociados a su cuenta.
  Un usuario solo podrá consultar sus propias reservas.
7. Las funcionalidades administrativas no deben estar disponibles para usuarios u organizadores.
8. Un evento cancelado debe permanecer consultable cuando corresponda, pero no debe permitir nuevas reservas.
9. Un evento finalizado no debe permitir nuevas reservas.
10. Si el pago o reserva se realiza externamente, la navegación debe dirigir al enlace o medio de contacto proporcionado por el organizador.
11. Si una búsqueda no devuelve resultados, el sistema debe conservar al usuario en el contexto de búsqueda y permitir modificar los criterios.
12. Si una reserva no puede completarse por falta de disponibilidad, el sistema debe informar la situación sin registrar una reserva incompleta.

---

## Trazabilidad básica entre funcionalidades, requerimientos y pantallas

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

