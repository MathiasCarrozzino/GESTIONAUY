# GestionaUy: proyecto Android

Este proyecto convierte la calculadora en una app Android (Capacitor 8) y la compila en GitHub, sin instalar nada en tu computadora.

Incluye, además de todas las funciones de la calculadora:
- **Desbloqueo con huella, rostro o PIN del teléfono** (Ajustes, icono del engranaje, Seguridad).
- **Respaldo de datos**: exporta e importa presupuestos, materiales y datos de la empresa en un archivo (Ajustes, Respaldo de datos).
- **Pedidos**: botón "Pedidos" arriba. Cargás cliente, trabajo, detalle y fecha de entrega; marcás hechos, editás y filtrás. Entran en el respaldo.
- **Etapas en los pedidos**: Por hacer, En producción, Listo y Entregado, con filtros por etapa y un botón que avanza al paso siguiente. Los avisos cuentan como pendientes todo lo que no está entregado.
- **Clientes**: se crean solos al cargar un nombre. Guardan teléfono (WhatsApp directo desde presupuestos, pedidos y la lista de clientes), autocompletan el nombre y muestran el historial de presupuestos, pedidos y saldo.
- **Productos guardados** (arriba de la calculadora) y **descuento por cantidad** de hasta dos escalones; el descuento se resta de la ganancia.
- **Respaldo**: recordatorio configurable en Ajustes (semanal, cada 15 días, mensual o nunca), con banner y notificación en Android. El respaldo incluye presupuestos, pedidos, clientes, productos, materiales y empresas. Se envía con el menú de compartir; no sube nada a la nube por sí solo.
- **Ajustes**: rubro con el que arranca la app, tema (automático, claro u oscuro), 5 paletas de colores y nombre y logo propios para cada emprendimiento (3D, láser y costura); el recibo usa los del rubro del presupuesto.
- **Ayuda**: el botón "?" del encabezado abre un manual de uso dentro de la app. Las pantallas ya no llevan textos explicativos.
- **Seña y saldo** en los pedidos, con el botón "Cobrar saldo". "A cobrar" suma lo que falta cobrar de todos los pedidos.
- **Enviar por WhatsApp** un resumen del presupuesto (sin el desglose de costos).
- **Pedidos desde presupuestos**: al activar "Aprobado" en un presupuesto guardado se crea solo un pedido con cliente, detalle, cantidad, material, tipo de trabajo y monto total. Después le cargás la fecha de entrega. No se duplica si lo desactivás y volvés a activar.
- **Monto total** en cada pedido y el total "A cobrar" de los pendientes.
- **Estadísticas**: además del total, muestran la ganancia y lo que corresponde destinar a mantenimiento de las máquinas.
- **Al tocar una notificación** la app se abre directo en Pedidos.
- **Avisos por notificación** de los pedidos pendientes (por defecto 10:00 y 19:00, editables en la pantalla Pedidos). Funcionan con la app cerrada: se programan los próximos 30 días y se actualizan cada vez que cambiás un pedido o abrís la app. Si pasás más de 30 días sin abrirla, se agotan; al abrirla se programan de nuevo. La primera vez Android pide permiso de notificaciones.
- **Compartir en Android**: los PDF y Excel se guardan en la caché y se abre el menú de compartir del teléfono. Ahí elegís Gmail (con el archivo adjunto), Drive, WhatsApp o "guardar en el teléfono".
- Botón "Atrás" de Android: vuelve de las pantallas internas en vez de cerrar la app.

## Contenido
- `www/index.html`: la calculadora.
- `www/pedidos.js`: pantalla de Pedidos y su lógica de avisos.
- `www/ajustes.js`: preferencias (rubro inicial, tema, paleta y recordatorio de respaldo).
- `www/clientes.js` y `www/productos.js`: clientes con teléfono y productos guardados.
- `src/native.js`: puente con las funciones del teléfono (huella, compartir archivos, botón atrás, notificaciones).
- `capacitor.config.json`: nombre y identificador de la app.
- `.github/workflows/android.yml`: la receta que compila el APK en GitHub.
- `resources/android/`: iconos de la app.

## Paso a paso
1. Creá un repositorio **privado** en GitHub y subí todo el contenido de esta carpeta (incluida la carpeta oculta `.github`).
2. Abrí `capacitor.config.json` y cambiá `appId` por uno propio y único, por ejemplo `com.tunombre.gestionauy`. Cambiarlo después hace que Android lo trate como otra app.
3. En GitHub entrá a **Actions**, elegí **Compilar app Android** y tocá **Run workflow**. Tarda entre 8 y 15 minutos.
4. Cuando termine, descargá el archivo `apk-debug` del apartado Artifacts, descomprimilo y pasá el `.apk` al teléfono. Para instalarlo, Android te pide permitir "instalar apps de orígenes desconocidos".

## Importante: firmá el APK para poder actualizar
El APK de prueba (debug) se firma con una clave nueva en cada compilación. Por eso **no se puede instalar encima de la versión anterior** y habría que desinstalar, perdiendo los datos. Usalo solo para probar. Para uso real y para vender, firmá con tu propia clave:

1. En una computadora con Java, creá la clave una sola vez (guardá el archivo y las contraseñas en un lugar seguro: si las perdés, no podrás actualizar la app):
   `keytool -genkeypair -v -keystore release.jks -alias miclave -keyalg RSA -keysize 2048 -validity 10000`
2. Convertí el archivo a texto: `base64 -w0 release.jks` (en Mac: `base64 -i release.jks`).
3. En GitHub: Settings, Secrets and variables, Actions, y creá estos cuatro secretos: `KEYSTORE_BASE64` (el texto del paso 2), `KEY_ALIAS` (por ejemplo `miclave`), `KEYSTORE_PASSWORD` y `KEY_PASSWORD`.
4. Volvé a ejecutar el workflow. Además del de prueba, genera el artefacto `apk-firmado`. Ese es el que se instala y se actualiza sin perder datos. El número de versión sube solo en cada compilación.

## Actualizar la app
Reemplazá `www/index.html` por la versión nueva, subila a GitHub y ejecutá el workflow otra vez. Instalá el `apk-firmado` encima del anterior.

## Lista para probar en el teléfono
- Pedidos: cargar uno con entrega para hoy, aceptar el permiso de notificaciones y poner el primer aviso 2 minutos más adelante para ver que llega con la app cerrada. Si tenés alarmas de reloj duplicadas a las 10:00 y 19:00, borralas.
- Ajustes, Seguridad: activar el bloqueo, cerrar la app y volver a abrirla. Pide huella, rostro o PIN. Si salís de la app más de 1 minuto, vuelve a pedirlo.
- Un presupuesto: guardar, abrir, descargar PDF y Excel (abre el menú de compartir).
- "Enviar por Gmail": elegir Gmail en el menú y comprobar que el PDF va adjunto.
- Recibo PDF con el nombre y el logo de la empresa.
- Respaldo: exportar, borrar un presupuesto e importar el archivo.
- Botón Atrás desde las pantallas de Presupuestos, Recibo y Ajustes.

## Respaldo
Los datos se guardan en el teléfono. Si desinstalás la app o borrás sus datos, se pierden. Exportá un respaldo seguido y guardalo en Drive o en tu correo. Para pasar los datos a otro teléfono, exportá en uno e importá en el otro.

## Vender la app
- **Google Play:** necesitás una cuenta de desarrollador (pago único) y un paquete AAB (`./gradlew bundleRelease`). Con Play App Signing, Google gestiona la firma y la distribución. Los usuarios instalan desde la tienda, sin manejar archivos.
- **Fuera de la tienda:** un APK suelto se puede copiar y reenviar. Para controlarlo hace falta pedir una clave de licencia al abrir la app.
- Mantené el repositorio privado.

## Si el workflow falla
Abrí la ejecución en Actions, copiá el mensaje de error del paso que falló y pasámelo para corregirlo. Este proyecto no se pudo compilar en el entorno donde se preparó, así que la primera ejecución puede necesitar algún ajuste.
