#!/usr/bin/env python3
"""
Calculadora de Ajuste de Suspensión para E-Bikes (CLI)
Herramienta interactiva para calcular sag, rebote y compresión.
"""

import json
import os
from suspension_tuner.core import (
    calcular_sag_horquilla,
    calcular_sag_amortiguador,
    interpretar_rebote,
    interpretar_compresion,
)

RECORRIDO_HORQUILLA_DEFAULT_MM = 180.0
RECORRIDO_RUEDA_DEFAULT_MM = 150.0
RATIO_APALANCAMIENTO_DEFAULT = 2.5
PROFILES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "profiles")


def guardar_perfil(nombre_perfil: str, datos_perfil: dict) -> str:
    """Guarda un perfil de configuración en JSON."""
    if not os.path.exists(PROFILES_DIR):
        os.makedirs(PROFILES_DIR)
    ruta = os.path.join(PROFILES_DIR, f"{nombre_perfil}.json")
    try:
        with open(ruta, "w") as f:
            json.dump(datos_perfil, f, indent=4)
        return f"Perfil '{nombre_perfil}' guardado en {ruta}"
    except Exception as e:
        return f"Error al guardar perfil: {e}"


def cargar_perfil(nombre_perfil: str) -> tuple[dict | None, str]:
    """Carga un perfil desde JSON."""
    ruta = os.path.join(PROFILES_DIR, f"{nombre_perfil}.json")
    if not os.path.exists(ruta):
        return None, f"Perfil '{nombre_perfil}' no encontrado"
    try:
        with open(ruta) as f:
            return json.load(f), f"Perfil '{nombre_perfil}' cargado."
    except Exception as e:
        return None, f"Error al cargar perfil: {e}"


def main():
    print("--- Calculadora de Ajuste de Suspensión para E-Bike ---\n")

    nombre_perfil = input("¿Cargar un perfil? (nombre o vacío): ").strip()
    perfil = None

    if nombre_perfil:
        perfil, mensaje = cargar_perfil(nombre_perfil)
        print(mensaje)

    if perfil:
        peso = perfil.get("peso_ciclista_kg")
        recorrido_rueda = perfil.get("recorrido_rueda_mm", RECORRIDO_RUEDA_DEFAULT_MM)
        ratio = perfil.get("ratio_apalancamiento", RATIO_APALANCAMIENTO_DEFAULT)
        presion_h = perfil.get("presion_horquilla_psi")
        presion_a = perfil.get("presion_amortiguador_psi")
    else:
        try:
            peso = float(input("Peso total (kg): "))
            recorrido_rueda = float(input(f"Recorrido rueda trasera (mm) [{RECORRIDO_RUEDA_DEFAULT_MM}]: ") or RECORRIDO_RUEDA_DEFAULT_MM)
            ratio = float(input(f"Leverage ratio [{RATIO_APALANCAMIENTO_DEFAULT}]: ") or RATIO_APALANCAMIENTO_DEFAULT)
            presion_h = float(input("Presión horquilla (psi) [0]: ") or 0)
            presion_a = float(input("Presión amortiguador (psi) [0]: ") or 0)
        except ValueError:
            print("Error: valores numéricos válidos requeridos.")
            return

    sag_h = calcular_sag_horquilla(RECORRIDO_HORQUILLA_DEFAULT_MM)
    sag_a, recorrido_a = calcular_sag_amortiguador(recorrido_rueda, ratio)

    print(f"\n--- Sugerencias de Ajuste ---")
    print(f"\nHorquilla ({RECORRIDO_HORQUILLA_DEFAULT_MM}mm):")
    print(f"  Peso: {peso} kg")
    print(f"  Sag sugerido: ~{sag_h} mm (15%)")
    print(f"  {interpretar_rebote('horquilla')}")
    print(f"  {interpretar_compresion('horquilla')}")

    print(f"\nAmortiguador (recorrido rueda: {recorrido_rueda}mm):")
    print(f"  Ratio: {ratio}")
    print(f"  Recorrido efectivo: ~{recorrido_a} mm")
    print(f"  Sag sugerido: ~{sag_a} mm (25% de {recorrido_a}mm)")
    print(f"  {interpretar_rebote('amortiguador')}")
    print(f"  {interpretar_compresion('amortiguador')}")

    guardar = input("\n¿Guardar perfil? (s/N): ").lower().strip()
    if guardar == "s":
        nombre = input("Nombre del perfil: ").strip()
        if nombre:
            datos = {
                "nombre": nombre,
                "peso_ciclista_kg": peso,
                "recorrido_horquilla_mm": RECORRIDO_HORQUILLA_DEFAULT_MM,
                "recorrido_rueda_mm": recorrido_rueda,
                "ratio_apalancamiento": ratio,
                "presion_horquilla_psi": presion_h,
                "presion_amortiguador_psi": presion_a,
                "sag_horquilla_mm": sag_h,
                "sag_amortiguador_mm": sag_a,
                "recorrido_amortiguador_mm": recorrido_a,
            }
            print(guardar_perfil(nombre, datos))


if __name__ == "__main__":
    main()
