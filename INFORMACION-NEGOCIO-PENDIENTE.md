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

## ✅ Auditoría técnica — corregido

- **Formulario de contacto invisible**: bug de animación (GSAP/ScrollTrigger/Lenis) que dejaba secciones enteras en `opacity:0` sin recuperarse — corregido en [BaseLayout.astro](src/layouts/BaseLayout.astro) con recálculo automático + failsafe.
- **Rol ARIA inválido** (`role="text"`) eliminado de Hero.astro.
- **Archivo de 97 MB (`Wireshark-4.6.4-x64.exe`) dentro de `public/`**: se estaba desplegando públicamente con el sitio. Se movió a `../_archivos_fuera_del_sitio/` (fuera del proyecto web, sin borrarlo) — confirma si lo necesitas o si se puede eliminar definitivamente.
- **Imagen Open Graph rota**: `og-image.jpg` no existía; se generó una con el logo, nombre y ubicación reales (1200×630). Se puede reemplazar más adelante por una con foto real de la clínica.
- **Íconos PWA/favicon rotos**: `icon-192.png` e `icon-512.png` no existían; se generaron a partir del logo real.

## ⚠️ Pendiente de confirmar antes de publicar

1. **¿Ofrecen urgencias 24h reales?** Es el punto más importante — si la respuesta es sí, se puede volver a destacar con seguridad (stat, badge "24h", etc.); si no, el texto actual ya es seguro tal cual está.
2. **Horario exacto de atención.** El sitio sigue mostrando el horario original (Lun–Vie 9–20h, Sáb 9–14h) porque no vino en el documento — hay que confirmarlo o corregirlo.
3. **Confirmación de servicios**: ¿los 6 servicios originales (Medicina General, Cirugía, Diagnóstico por Imagen, Vacunación, Nutrición Clínica, Hospitalización) + el nuevo de Rehabilitación son exactamente los que ofrecen? ¿Siguen activos peluquería, guardería y tienda de mascotas (mencionados en la historia como servicios fundacionales)?
4. **Resto del equipo**: solo hay 1 veterinaria real cargada (Dra. Carolina, ya con foto real suya en la clínica). Hay 4 tarjetas "bloqueadas" (???) reservadas para el resto del staff — si hay más veterinarios/as, auxiliares o personal a mostrar, envía nombre, cargo, especialidad, bio y foto.
5. **Reseñas reales**: no se recibieron testimonios reales, así que se mantienen las 6 reseñas actuales (ficticias/ilustrativas) tal como indicó el documento.
6. **Respuestas de FAQ confirmadas**: se dejaron respuestas prudentes (sin afirmar lo no confirmado) para seguros de mascotas, animales exóticos y atención sin cita previa — confirmar la redacción exacta con la clínica.
7. **Credenciales de WhatsApp Business API** (`WA_TOKEN`, `WA_PHONE_ID`, `WA_CLINIC_NUMBER=573103120430`) — deben configurarse en Netlify → Site settings → Environment variables para que el formulario de citas envíe mensajes reales (hoy corre en modo demo).

## Cómo continuar

Envía las respuestas a los puntos pendientes (aunque sea uno a la vez) y actualizo el código correspondiente de inmediato.
