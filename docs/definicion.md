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

