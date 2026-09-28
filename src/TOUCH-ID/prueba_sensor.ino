#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <Adafruit_Fingerprint.h>

// =====================================================
// CONFIGURACION
// =====================================================

// ---------- LCD ----------
#define LCD_ADDR 0x27
LiquidCrystal_I2C lcd(LCD_ADDR, 16, 2);

// ---------- HUELLA ----------
#define FP_RX 16   // ESP32 RX <- TX del sensor (NEGRO)
#define FP_TX 17   // ESP32 TX -> RX del sensor (AMARILLO)
#define FP_BAUD 57600

HardwareSerial fingerSerial(2);
Adafruit_Fingerprint finger(&fingerSerial);

bool sensorHuellaOK = false;

// ---------- TECLADO ----------
const byte FILAS = 4;
const byte COLUMNAS = 4;

char teclas[FILAS][COLUMNAS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

// R1 R2 R3 R4
byte pinesFilas[FILAS] = {
  13, 14, 25, 26
};

// C1 C2 C3 C4
byte pinesColumnas[COLUMNAS] = {
  27, 32, 33, 23
};

Keypad teclado = Keypad(
  makeKeymap(teclas),
  pinesFilas,
  pinesColumnas,
  FILAS,
  COLUMNAS
);

// =====================================================
// EMPLEADOS
// =====================================================

struct Empleado {
  uint16_t idHuella;
  const char* nombre;
  const char* pin;
};

Empleado empleados[] = {
  {1, "Empleado 1", "1111"},
  {2, "Empleado 2", "2222"},
  {3, "Empleado 3", "3333"},
};

const int cantidadEmpleados =
  sizeof(empleados) / sizeof(empleados[0]);

const char* PIN_ADMIN = "9999";

// =====================================================
// LCD
// =====================================================

void mostrar(const String &linea1, const String &linea2 = "") {
  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print(linea1.substring(0, 16));

  lcd.setCursor(0, 1);
  lcd.print(linea2.substring(0, 16));
}

void pantallaPrincipal() {
  mostrar("A:IN   B:OUT", "C:Alta D:Test");
}

// =====================================================
// EMPLEADOS
// =====================================================

const char* nombrePorID(uint16_t id) {
  for (int i = 0; i < cantidadEmpleados; i++) {
    if (empleados[i].idHuella == id) {
      return empleados[i].nombre;
    }
  }

  return nullptr;
}

int buscarEmpleadoPorPIN(String pin) {
  for (int i = 0; i < cantidadEmpleados; i++) {
    if (pin == empleados[i].pin) {
      return empleados[i].idHuella;
    }
  }

  return -1;
}

// =====================================================
// LEER CODIGO DEL TECLADO
// =====================================================

String leerDigitos(String titulo, bool ocultar, byte maximo) {
  String texto = "";

  mostrar(titulo, "");

  while (true) {
    char tecla = teclado.getKey();

    if (!tecla) {
      delay(10);
      continue;
    }

    if (tecla >= '0' && tecla <= '9') {
      if (texto.length() < maximo) {
        texto += tecla;
      }

      lcd.setCursor(0, 1);

      for (int i = 0; i < 16; i++) {
        lcd.print(" ");
      }

      lcd.setCursor(0, 1);

      if (ocultar) {
        for (unsigned int i = 0; i < texto.length(); i++) {
          lcd.print("*");
        }
      } else {
        lcd.print(texto);
      }
    }

    else if (tecla == '*') {
      texto = "";
      mostrar(titulo, "");
    }

    else if (tecla == '#') {
      return texto;
    }

    else if (tecla == 'D') {
      return "__CANCELAR__";
    }
  }
}

// =====================================================
// SENSOR DE HUELLA
// =====================================================

int leerHuella() {
  uint8_t resultado = finger.getImage();

  if (resultado == FINGERPRINT_NOFINGER) {
    return 0;
  }

  if (resultado != FINGERPRINT_OK) {
    return -2;
  }

  resultado = finger.image2Tz();

  if (resultado != FINGERPRINT_OK) {
    return -1;
  }

  resultado = finger.fingerFastSearch();

  if (resultado == FINGERPRINT_OK) {
    return finger.fingerID;
  }

  if (resultado == FINGERPRINT_NOTFOUND) {
    return -1;
  }

  return -2;
}

void esperarRetiroDedo() {
  unsigned long inicio = millis();

  while (millis() - inicio < 5000) {
    uint8_t resultado = finger.getImage();

    if (resultado == FINGERPRINT_NOFINGER) {
      return;
    }

    delay(50);
  }
}

// =====================================================
// REGISTRAR INGRESO / EGRESO
// =====================================================

void registrarMovimiento(uint16_t id, bool ingreso, const char* metodo) {
  const char* nombre = nombrePorID(id);

  String identificacion;

  if (nombre != nullptr) {
    identificacion = nombre;
  } else {
    identificacion = "ID " + String(id);
  }

  if (ingreso) {
    mostrar("INGRESO OK", identificacion);
  } else {
    mostrar("EGRESO OK", identificacion);
  }

  unsigned long segundos = millis() / 1000;

  Serial.println();
  Serial.println("==============================");
  Serial.println("NUEVO REGISTRO");

  Serial.print("Tiempo: ");
  Serial.print(segundos);
  Serial.println(" segundos");

  Serial.print("ID: ");
  Serial.println(id);

  Serial.print("Empleado: ");
  Serial.println(identificacion);

  Serial.print("Movimiento: ");
  Serial.println(ingreso ? "INGRESO" : "EGRESO");

  Serial.print("Metodo: ");
  Serial.println(metodo);

  Serial.println("==============================");
  Serial.println();

  delay(2500);

  pantallaPrincipal();
}

// =====================================================
// FALLBACK POR PIN
// =====================================================

void ingresoPorPIN(bool ingreso) {
  for (int intento = 1; intento <= 3; intento++) {
    String codigo = leerDigitos("PIN + #", true, 8);

    if (codigo == "__CANCELAR__") {
      pantallaPrincipal();
      return;
    }

    int id = buscarEmpleadoPorPIN(codigo);

    if (id > 0) {
      mostrar("PIN correcto", "");
      delay(700);
      registrarMovimiento(id, ingreso, "PIN");
      return;
    }

    mostrar("PIN incorrecto", "Intento " + String(intento) + "/3");
    delay(1500);
  }

  mostrar("ACCESO BLOQ.", "Intente despues");
  delay(3000);
  pantallaPrincipal();
}

// =====================================================
// AUTENTICACION
// =====================================================

void autenticar(bool ingreso) {
  if (!sensorHuellaOK) {
    mostrar("Huella ERROR", "Use PIN");
    delay(1200);
    ingresoPorPIN(ingreso);
    return;
  }

  int intentosFallidos = 0;

  while (intentosFallidos < 3) {
    if (ingreso) {
      mostrar("INGRESO", "Apoye huella");
    } else {
      mostrar("EGRESO", "Apoye huella");
    }

    while (true) {
      char tecla = teclado.getKey();

      if (tecla == 'D') {
        pantallaPrincipal();
        return;
      }

      int id = leerHuella();

      if (id == 0) {
        delay(50);
        continue;
      }

      if (id > 0) {
        Serial.print("Huella reconocida. ID = ");
        Serial.println(id);

        esperarRetiroDedo();
        registrarMovimiento(id, ingreso, "HUELLA");
        return;
      }

      if (id == -1) {
        intentosFallidos++;

        mostrar(
          "No reconocida",
          "Intento " + String(intentosFallidos) + "/3"
        );

        Serial.print("Huella incorrecta. Intento ");
        Serial.println(intentosFallidos);

        esperarRetiroDedo();
        delay(1200);
        break;
      }

      if (id == -2) {
        mostrar("Error sensor", "Pasando a PIN");
        Serial.println("ERROR de comunicacion con lector");
        delay(1500);
        ingresoPorPIN(ingreso);
        return;
      }
    }
  }

  mostrar("3 intentos", "Ingrese PIN");
  delay(1000);
  ingresoPorPIN(ingreso);
}

// =====================================================
// DAR DE ALTA HUELLA
// =====================================================

bool capturarDedo(uint8_t buffer) {
  while (true) {
    char tecla = teclado.getKey();

    if (tecla == 'D') {
      return false;
    }

    uint8_t resultado = finger.getImage();

    if (resultado == FINGERPRINT_NOFINGER) {
      delay(50);
      continue;
    }

    if (resultado != FINGERPRINT_OK) {
      mostrar("Error imagen", "Repita");
      delay(1000);
      return false;
    }

    resultado = finger.image2Tz(buffer);

    if (resultado != FINGERPRINT_OK) {
      mostrar("Huella mala", "Repita");
      delay(1000);
      return false;
    }

    return true;
  }
}

bool enrolarHuella(uint16_t id) {
  mostrar("Alta ID " + String(id), "Ponga dedo");

  if (!capturarDedo(1)) {
    return false;
  }

  mostrar("Retire dedo", "");
  esperarRetiroDedo();
  delay(800);

  mostrar("Mismo dedo", "Otra vez");

  if (!capturarDedo(2)) {
    return false;
  }

  mostrar("Procesando...", "");

  uint8_t resultado = finger.createModel();

  if (resultado != FINGERPRINT_OK) {
    mostrar("No coinciden", "Intente de nuevo");
    delay(2000);
    return false;
  }

  resultado = finger.storeModel(id);

  if (resultado != FINGERPRINT_OK) {
    mostrar("Error guardando", "");
    delay(2000);
    return false;
  }

  mostrar("Huella guardada", "ID " + String(id));

  Serial.print("Huella guardada con ID ");
  Serial.println(id);

  delay(2500);

  return true;
}

void menuAlta() {
  if (!sensorHuellaOK) {
    mostrar("Sensor ERROR", "No se puede");
    delay(2000);
    pantallaPrincipal();
    return;
  }

  String pinAdmin = leerDigitos("PIN ADMIN +#", true, 8);

  if (pinAdmin == "__CANCELAR__") {
    pantallaPrincipal();
    return;
  }

  if (pinAdmin != PIN_ADMIN) {
    mostrar("PIN ADMIN", "Incorrecto");
    delay(1800);
    pantallaPrincipal();
    return;
  }

  String textoID = leerDigitos("ID huella +#", false, 3);

  if (textoID == "__CANCELAR__") {
    pantallaPrincipal();
    return;
  }

  int id = textoID.toInt();

  if (id < 1 || id > 127) {
    mostrar("ID invalido", "1 a 127");
    delay(1800);
    pantallaPrincipal();
    return;
  }

  enrolarHuella(id);
  pantallaPrincipal();
}

// =====================================================
// TEST DEL TECLADO
// =====================================================

void testTeclado() {
  mostrar("TEST TECLADO", "# para salir");

  while (true) {
    char tecla = teclado.getKey();

    if (!tecla) {
      delay(10);
      continue;
    }

    Serial.print("Tecla: ");
    Serial.println(tecla);

    if (tecla == '#') {
      break;
    }

    mostrar("Tecla detectada", String(tecla));
  }

  pantallaPrincipal();
}

// =====================================================
// SCANNER I2C
// =====================================================

void escanearI2C() {
  Serial.println("Escaneando bus I2C...");

  for (uint8_t direccion = 1; direccion < 127; direccion++) {
    Wire.beginTransmission(direccion);

    uint8_t error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C encontrado en 0x");

      if (direccion < 16) {
        Serial.print("0");
      }

      Serial.println(direccion, HEX);
    }
  }
}

// =====================================================
// SETUP
// =====================================================

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println();
  Serial.println("Sistema de control de personal");

  // ---------- LCD ----------
  Wire.begin(21, 22);

  escanearI2C();

  lcd.init();
  lcd.backlight();

  mostrar("Iniciando...", "");

  // ---------- HUELLA ----------
  fingerSerial.begin(
    FP_BAUD,
    SERIAL_8N1,
    FP_RX,
    FP_TX
  );

  finger.begin(FP_BAUD);

  delay(500);

  if (finger.verifyPassword()) {
    sensorHuellaOK = true;

    Serial.println("Sensor de huella conectado.");

    finger.getTemplateCount();

    Serial.print("Huellas almacenadas: ");
    Serial.println(finger.templateCount);

    mostrar("Huella: OK", "Sistema listo");
  }

  else {
    sensorHuellaOK = false;

    Serial.println("NO se encontro el sensor de huella.");

    mostrar("Huella: ERROR", "Revise cables");
  }

  delay(2500);
  pantallaPrincipal();
}

// =====================================================
// LOOP
// =====================================================

void loop() {
  char tecla = teclado.getKey();

  if (!tecla) {
    return;
  }

  switch (tecla) {
    case 'A':
      autenticar(true);      // INGRESO
      break;

    case 'B':
      autenticar(false);     // EGRESO
      break;

    case 'C':
      menuAlta();            // NUEVA HUELLA
      break;

    case 'D':
      testTeclado();         // TEST
      break;

    default:
      break;
  }
}
