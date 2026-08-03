# Touch ID 👆

Touch ID es una solución tecnológica diseñada para optimizar y asegurar el registro de asistencia de trabajadores mediante identificación biométrica (huella dactilar). 

A través de la integración de un lector de huellas con un sistema de software, el proyecto busca eliminar las ineficiencias de los registros manuales y brindar un control de horarios preciso y automatizado.

## El Problema Detectado

Se ha identificado que los métodos tradicionales de control de asistencia (planillas en papel, tarjetas o contraseñas) son propensos a errores humanos, pérdida de tiempo y vulnerables a fraudes (como que un empleado registre la asistencia de otro). Esto dificulta la gestión eficiente de los recursos humanos y el control de accesos.

## ✨ Solución

Touch ID ofrece un sistema rápido y confiable que automatiza el registro de entradas y salidas, dividido en dos componentes clave:

*   **Módulo Portátil de Hardware:** Una caja compacta y fácil de transportar que contiene un sensor de huella dactilar controlado por una placa Arduino. Esto da la idea y utilidad de un dispositivo portátil que se puede ubicar en cualquier punto de acceso.
*   **Software de Gestión Centralizada:** Una notebook con el software abierto que recibe, procesa y almacena la información enviada por el Arduino en tiempo real.
*   **Seguridad y Precisión:** Identificación biométrica única e intransferible para cada trabajador.
*   **Eficiencia:** Sistema de bajo costo, fácil de instalar y que reduce drásticamente el tiempo de procesamiento de datos para la administración.

## 🛠️ Tecnologías Involucradas

*   **Hardware:** Arduino (ej. Arduino UNO/Nano), Sensor de Huella Dactilar.
*   **Lenguaje (Microcontrolador):** C++ (Arduino IDE)
*   **Software (PC):** Python (o lenguaje a definir para la interfaz y recepción de datos)
*   **Comunicación:** Interfaz Serial

## 👥 Integrantes del Equipo:

El proyecto se desarrolla bajo una estructura de trabajo colaborativo, formado por:
*   Alexandra Mía Prado
*   María Sol Kassar
*   Lola Rozandal

## ⚙️ Instalación (Próximamente)

```bash
git clone [https://github.com/TuUsuario/TouchID.git](https://github.com/TuUsuario/TouchID.git)
cd TouchID
