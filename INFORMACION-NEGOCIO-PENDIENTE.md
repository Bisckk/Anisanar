# Anisanar Veterinaria — Estado de la información

Actualizado tras recibir e implementar los datos del documento entregado por la clínica (contacto, historia, instalaciones, equipo). Este archivo ya no es el checklist original: ahora refleja qué quedó resuelto en el código y qué sigue pendiente antes de publicar el sitio.

## ✅ Ya aplicado en el código

- **Contacto**: tel/WhatsApp `+57 310 312 04 30`, email `centroveterinarioanisanar@gmail.com`, dirección `Cr 17 N 20-69, Avenida Santander, San Gil`, enlace real de Google Maps.
- **Locale corregido**: el sitio estaba con datos de Madrid/España (`+34`, EUR, `es-ES`) y ahora refleja San Gil, Santander, Colombia (`+57`, COP, `es-CO`, `addressCountry: CO`, geo real en el JSON-LD).
- **Redes sociales reales**: Instagram, Facebook y TikTok enlazados en el footer y en el schema SEO.
- **Historia real** en "Sobre nosotros": fundación el 5 de septiembre de 2011 por la Dra. Carolina Martinez en San Gil; evolución hasta la ampliación de 2020 (consultorios, cirugía, hospitalización propios, en plena pandemia).
- **Instalaciones/equipamiento real**: laboratorio clínico, cirugías, terapia láser, radioterapia, magnetoterapia, ecografías — reemplazó el equipamiento inventado ("radiología digital, ecografía Doppler...").
- **Estadísticas reales**: "15+ años" y "9/10 nos recomiendan" (dato real del documento) sustituyeron a "8K+ pacientes" y "4.9★ Google", que eran inventados.
- **Equipo**: la Dra. Carolina Martinez Pico es ahora el único perfil real (Directora y Fundadora, con sus credenciales reales: UCC, especialización UPTC, especialización U. La Salle). Los otros 3 veterinarios que aparecían como "reales" (Marcos Ibarra, Sofía Luna, Andrés Mora) **eran completamente inventados** y se eliminaron — no correspondían a personas de Anisanar.
- **Servicios**: se añadió un 7º servicio "Rehabilitación y Terapias Físicas" (láser, radioterapia, magnetoterapia) que antes no estaba cubierto.
- **Urgencias 24h**: el sitio afirmaba "urgencias 24h, 365 días del año" en Hero, Footer, banner y páginas de servicio. El documento **no confirma** que exista este servicio, así que se suavizó el lenguaje a "atención de urgencias / contáctanos ante cualquier emergencia", sin prometer disponibilidad 24/7.
- **Fotos y videos reales de la clínica**: se reemplazaron todas las fotos de stock (Unsplash) del Hero, "Sobre nosotros", los 7 servicios y la galería por fotos reales de Anisanar (quirófano, hospitalización, laboratorio, fachada, equipo, mascotas). Los originales sin procesar quedaron archivados en `_source-media/anisanar-originales/` (fuera de `public/`, no se despliegan). Se añadió además una sección nueva "Anisanar en video" con 6 videos reales de la clínica en un previsualizador: no se reproducen hasta que el usuario hace clic.
- **Frase de "Sobre nosotros"** actualizada a "Somos Anisanar. Más que una clínica, tu lugar seguro." (copy entregado por la clínica). Quedan sin usar más frases que enviaron para Hero, servicios individuales, CTAs y una posible sección de Misión/Visión/Valores — avisa si quieres que las apliquemos también.
- **Reseñas reales**: se reemplazaron las 6 reseñas ficticias por 4 reseñas reales tomadas de conversaciones de WhatsApp con clientes (Willy, Chiky, Missi, Mailo), con apellidos abreviados por privacidad. Se dejó fuera intencionalmente una conversación sobre una mascota que falleció, por ser un tema sensible para un carrusel de marketing.
- **Formulario de contacto conectado de verdad**: el stepper de "Agendar cita" mostraba un mensaje de "enviado por WhatsApp" pero nunca llamaba a `/api/book` (era una simulación). Ahora sí lo llama, y además el sitio pasó de `output: 'static'` a `output: 'hybrid'` con el adaptador `@astrojs/netlify` — sin este cambio, `/api/book` no podía funcionar ni en local ni una vez publicado, porque un sitio 100% estático no ejecuta rutas API. El resto de páginas se sigue generando 100% estático; solo `/api/book` corre como función serverless.
- **Horario real confirmado**: Lunes a Sábado de 7:00 a 19:00 h (antes decía Lun–Vie 9–20h y Sáb 9–14h, que era incorrecto). Corregido en Contact, FAQ, la barra lateral de cada servicio y el `openingHoursSpecification` del JSON-LD.
- **Guardería confirmada como servicio no activo**: se quitó la palabra "Guardería" del label y alt de la foto de los cachorros en la galería (ahora "Cuidado diario"). La mención histórica en "Sobre nosotros" (2011, en pasado) se dejó igual porque describe cómo empezó la clínica, no un servicio actual.
- **Video incorrecto retirado**: el video "Consulta veterinaria" no mostraba personal real de Anisanar — se quitó del carrusel y el archivo se archivó fuera de `public/` en `_source-media/no-usar-no-es-personal-del-cliente/`. Quedaron 5 videos activos; si tienen un video de reemplazo, lo agregamos.
- **Enunciado redundante quitado** en "Anisanar en video" (Videos.astro), a pedido del cliente.
- **El formulario de "Agendar cita" ahora redirige directo a WhatsApp**: al confirmar el paso 4, se abre `wa.me` en una pestaña nueva con un mensaje ya redactado (nombre, email, teléfono si lo dejó, mascota, servicio y notas) al número `+57 310 312 04 30` — el cliente solo tiene que darle "Enviar" en WhatsApp. Ya no depende de `/api/book` ni de configurar la API de WhatsApp Business; funciona hoy mismo, sin variables de entorno. El endpoint `/api/book` se dejó en el código sin usar, por si más adelante quieren retomar el envío automático server-side.

## ✅ Auditoría técnica — corregido

- **Formulario de contacto invisible**: bug de animación (GSAP/ScrollTrigger/Lenis) que dejaba secciones enteras en `opacity:0` sin recuperarse — corregido en [BaseLayout.astro](src/layouts/BaseLayout.astro) con recálculo automático + failsafe.
- **Rol ARIA inválido** (`role="text"`) eliminado de Hero.astro.
- **Archivo de 97 MB (`Wireshark-4.6.4-x64.exe`) dentro de `public/`**: se estaba desplegando públicamente con el sitio. Se movió a `../_archivos_fuera_del_sitio/` (fuera del proyecto web, sin borrarlo) — confirma si lo necesitas o si se puede eliminar definitivamente.
- **Imagen Open Graph rota**: `og-image.jpg` no existía; se generó una con el logo, nombre y ubicación reales (1200×630). Se puede reemplazar más adelante por una con foto real de la clínica.
- **Íconos PWA/favicon rotos**: `icon-192.png` e `icon-512.png` no existían; se generaron a partir del logo real.
- **Scroll horizontal del menú roto en mobile**: Lenis (el scroll suave que se usa en toda la página, con `syncTouch: true`) capturaba el gesto táctil dentro del menú desplegable de CardNav e impedía que la franja de tarjetas (Clínica/Pacientes/Urgencias) se deslizara en horizontal — por eso se veía una tarjeta vacía/cortada. Corregido añadiendo el atributo `data-lenis-prevent` (documentado por Lenis para exactamente este caso) a esa franja.

## ⚠️ Pendiente de confirmar antes de publicar

1. **¿Ofrecen urgencias 24h reales?** Es el punto más importante — si la respuesta es sí, se puede volver a destacar con seguridad (stat, badge "24h", etc.); si no, el texto actual ya es seguro tal cual está.
2. **Confirmación de servicios**: guardería ya se confirmó que **no** está activa (corregido). ¿Siguen activas peluquería y tienda de mascotas (mencionadas en la historia como servicios fundacionales)? ¿Los 7 servicios actuales (Medicina General, Cirugía, Diagnóstico por Imagen, Vacunación, Nutrición Clínica, Hospitalización, Rehabilitación) son exactamente los que ofrecen hoy?
3. **Resto del equipo**: solo hay 1 veterinaria real cargada (Dra. Carolina, ya con foto real suya en la clínica). Hay 4 tarjetas "bloqueadas" (???) reservadas para el resto del staff — si hay más veterinarios/as, auxiliares o personal a mostrar, envía nombre, cargo, especialidad, bio y foto.
4. **Respuestas de FAQ confirmadas**: se dejaron respuestas prudentes (sin afirmar lo no confirmado) para seguros de mascotas, animales exóticos y atención sin cita previa — confirmar la redacción exacta con la clínica.
5. **Credenciales de WhatsApp Business API** (`WA_TOKEN`, `WA_PHONE_ID`, `WA_CLINIC_NUMBER=573103120430`) — ya **no son necesarias** para que el formulario funcione (ahora redirige directo a WhatsApp, ver arriba). Solo se necesitarían si en el futuro quieren que el sitio envíe mensajes automáticos server-side sin que el cliente tenga que darle "Enviar" manualmente.
6. **Video de reemplazo para "Consulta veterinaria"** (opcional): si tienen una grabación real de una consulta con su propio personal, la agregamos de vuelta al carrusel.

## Cómo continuar

Envía las respuestas a los puntos pendientes (aunque sea uno a la vez) y actualizo el código correspondiente de inmediato.
