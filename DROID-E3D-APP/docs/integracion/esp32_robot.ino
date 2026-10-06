// EJEMPLO de referencia: ESP32 del robot que habla con el backend de DROID-E3D.
// Es un punto de partida, no el código final: adaptalo a tus motores, sensores y pines.
// Librerías: WiFi y HTTPClient (vienen con el ESP32) y ArduinoJson (Administrador de bibliotecas).
// Contrato completo: docs/API.md

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ----- Completar con tus datos (NO subir claves reales al repo) -----
const char* WIFI_SSID   = "TU_WIFI";
const char* WIFI_CLAVE  = "TU_CLAVE_WIFI";
const char* URL_BASE    = "http://192.168.0.10:5000/api";   // IP de la PC con el backend
const char* ROBOT_KEY   = "PEGAR_ROBOT_API_KEY";

const unsigned long CADA_MS = 1500;      // consultar cada 1,5 s
unsigned long ultimaConsulta = 0;
String estado = "detenido";

// Hace un request al backend y devuelve el JSON de respuesta ("" si falla)
String llamar(const String& metodo, const String& ruta, const String& cuerpo = "") {
  HTTPClient http;
  http.begin(String(URL_BASE) + ruta);
  http.addHeader("X-API-KEY", ROBOT_KEY);
  http.addHeader("Content-Type", "application/json");
  int codigo = (metodo == "GET") ? http.GET() : http.POST(cuerpo);
  String respuesta = (codigo == 200) ? http.getString() : "";
  if (codigo != 200) Serial.printf("Error HTTP %d en %s\n", codigo, ruta.c_str());
  http.end();
  return respuesta;
}

// TODO: acá van tus motores. Devuelve true si pudo ejecutar el comando.
bool ejecutarComando(const String& comando) {
  if (comando == "iniciar")    { estado = "recorriendo"; /* arrancar motores */ return true; }
  if (comando == "pausar")     { estado = "pausado";     /* frenar suave */     return true; }
  if (comando == "detener")    { estado = "detenido";    /* frenar */           return true; }
  if (comando == "emergencia") { estado = "emergencia";  /* cortar motores YA */ return true; }
  return false;
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_CLAVE);
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.println("\nWiFi conectado");
}

void loop() {
  if (millis() - ultimaConsulta < CADA_MS) return;
  ultimaConsulta = millis();

  // 1) ¿Hay algo para hacer?
  String r = llamar("GET", "/robot/comando-pendiente");
  String ejecutado = "";
  if (r != "") {
    JsonDocument doc;
    if (!deserializeJson(doc, r) && !doc["comando"].isNull()) {
      String comando = doc["comando"].as<String>();
      if (ejecutarComando(comando)) ejecutado = comando;
    }
  }

  // 2) Contarle al backend cómo estoy (sirve también como "latido")
  JsonDocument rep;
  rep["estado"] = estado;
  rep["bateria"] = 87;               // TODO: leer la batería real (0 a 100)
  // rep["zona_actual_id"] = 2;      // TODO: cuando el robot sepa en qué zona está
  if (ejecutado != "") rep["comando_ejecutado"] = ejecutado;
  String cuerpo;
  serializeJson(rep, cuerpo);
  llamar("POST", "/robot/reporte", cuerpo);
}
