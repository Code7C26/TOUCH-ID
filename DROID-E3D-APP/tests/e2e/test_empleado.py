"""Pantallas del empleado: inicio, mis alertas, perfil y permisos."""
from datetime import date, timedelta

from conftest import api, selector, sesion


def test_inicio_muestra_zona_epp_y_cumplimiento(base_limpia, abrir):
    mias = api("/incidents?limit=200", token=sesion("juan")["token"])["incidencias"]
    desde = (date.today() - timedelta(days=29)).isoformat()
    esperado = round((30 - len({a["timestamp"][:10] for a in mias if a["timestamp"][:10] >= desde})) * 100 / 30)

    pag = abrir("juan", "/app")
    assert pag.get_by_role("heading", name="Hola, Juan").is_visible()
    assert pag.get_by_role("heading", name="Zona A").is_visible() and pag.get_by_text("Sierra circular").is_visible()
    assert all(pag.get_by_text(epp, exact=True).is_visible() for epp in ("Casco", "Lentes", "Guantes"))
    assert not pag.get_by_text("Chaleco", exact=True).is_visible()
    assert pag.get_by_text(f"{esperado}%", exact=True).is_visible()
    assert pag.get_by_text("Todo en orden").is_visible()
    assert not pag.errores


def test_empleado_con_alertas_activas_ve_el_cartel_rojo(base_limpia, abrir):
    pag = abrir("carlos", "/app")
    assert "alertas activas" in pag.locator("div.bg-alerta").inner_text()


def test_mis_alertas_filtros_paginado_y_detalle(base_limpia, abrir):
    todas = api("/incidents?limit=200", token=sesion("carlos")["token"])["incidencias"]
    pag = abrir("carlos", "/app/mis-alertas")
    assert pag.get_by_text(f"{len(todas)} en total").is_visible()
    assert pag.locator("article").count() == min(10, len(todas))

    selector(pag, "Estado").select_option("resuelta")
    pag.wait_for_timeout(900)
    resueltas = sum(1 for a in todas if a["estado"] == "resuelta")
    assert pag.get_by_text(f"{resueltas} en total").is_visible()
    pag.get_by_role("button", name="Limpiar").click()
    pag.wait_for_timeout(900)

    pag.locator('input[type="date"]').nth(1).fill("2000-01-01")
    pag.wait_for_timeout(900)
    assert pag.get_by_text("No hay alertas con esos filtros").is_visible()
    pag.get_by_role("button", name="Limpiar").click()
    pag.wait_for_timeout(900)

    pag.locator("article").first.click()
    assert pag.get_by_role("dialog").is_visible() and pag.get_by_text("Confianza de la IA").is_visible()
    pag.keyboard.press("Escape")
    assert not pag.get_by_role("dialog").is_visible()
    assert not pag.errores


def test_perfil_tema_y_cerrar_sesion(base_limpia, abrir):
    pag = abrir("juan", "/app/perfil")
    assert pag.get_by_role("heading", name="Juan Pérez").is_visible() and pag.get_by_text("L-001").is_visible()
    pag.get_by_role("button", name="Cambiar", exact=True).click()
    assert pag.evaluate("document.documentElement.classList.contains('dark')")
    pag.get_by_text("Cerrar sesión", exact=True).click()
    pag.wait_for_timeout(500)
    assert pag.url.endswith("/login")


def test_el_empleado_no_entra_a_pantallas_del_encargado(abrir):
    for ruta in ("/app/panel", "/app/empleados", "/app/zonas", "/app/robot", "/app/incidencias"):
        assert abrir("juan", ruta).url.endswith("/app")


def test_en_celular_no_hay_scroll_horizontal(abrir):
    for ruta in ("/app", "/app/mis-alertas", "/app/perfil"):
        assert abrir("carlos", ruta, ancho=390, alto=844).evaluate("document.documentElement.scrollWidth") <= 390
