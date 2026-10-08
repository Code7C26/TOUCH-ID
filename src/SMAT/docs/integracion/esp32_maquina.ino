// EJEMPLO de referencia: ESP32 de una máquina que corta la energía con un relé.
// Pregunta al backend si su zona tiene la máquina activa; si no, abre el relé.
// Contrato completo: docs/API.md

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ----- Completar con tus datos (NO subir claves reales al repo) -----
const char* WIFI_SSID  = "TU_WIFI";
const char* WIFI_CLAVE = "TU_CLAVE_WIFI";
const char* URL_BASE   = "http://192.168.0.10:5000/api";
const char* ROBOT_KEY  = "PEGAR_ROBOT_API_KEY";
const int   ZONA_ID    = 1;               // la zona donde está esta máquina

const int PIN_RELE = 26;                  // HIGH = máquina con energía (según tu módulo, puede ser al revés)
const int PIN_LED_ERROR = 2;              // se enciende si no hay conexión con el backend
const unsigned long CADA_MS = 1500;
unsigned long ultimaConsulta = 0;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_RELE, OUTPUT);
  pinMode(PIN_LED_ERROR, OUTPUT);
  digitalWrite(PIN_RELE, HIGH);           // arranca habilitada
  WiFi.begin(WIFI_SSID, WIFI_CLAVE);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
}

void loop() {
  if (millis() - ultimaConsulta < CADA_MS) return;
  ultimaConsulta = millis();

  HTTPClient http;
  http.begin(String(URL_BASE) + "/zones/" + ZONA_ID + "/maquina");
  http.addHeader("X-API-KEY", ROBOT_KEY);
  int codigo = http.GET();

  if (codigo == 200) {
    JsonDocument doc;
    if (!deserializeJson(doc, http.getString())) {
      bool activa = doc["maquina_activa"];
      digitalWrite(PIN_RELE, activa ? HIGH : LOW);   // false = CORTAR la máquina
      digitalWrite(PIN_LED_ERROR, LOW);
    }
  } else {
    // Sin conexión o error: se deja la máquina como está y se avisa con el LED.
    // Definir con el equipo si en este caso conviene cortarla por seguridad.
    digitalWrite(PIN_LED_ERROR, HIGH);
    Serial.printf("Error HTTP %d\n", codigo);
  }
  http.end();
}
