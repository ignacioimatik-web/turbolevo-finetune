import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from suspension_tuner.core import (
    calcular_sag_horquilla,
    calcular_sag_amortiguador,
    interpretar_rebote,
    interpretar_compresion,
)


def handler(request):
    """
    Vercel Python function handler.
    POST /api/calc con JSON body:
        - weight (kg): float
        - rear_travel (mm): float
        - leverage_ratio: float
        - front_pressure (psi): float
        - rear_pressure (psi): float
    """
    try:
        body = request.body
        data = json.loads(body) if body else {}
    except Exception:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "JSON inválido"}),
        }

    required = ["weight", "rear_travel", "leverage_ratio", "front_pressure", "rear_pressure"]
    missing = [f for f in required if f not in data]
    if missing:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Campos faltantes: {', '.join(missing)}"}),
        }

    try:
        weight = float(data["weight"])
        rear_travel = float(data["rear_travel"])
        leverage_ratio = float(data["leverage_ratio"])
        front_pressure = float(data["front_pressure"])
        rear_pressure = float(data["rear_pressure"])
    except (ValueError, TypeError):
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Los campos deben ser numéricos"}),
        }

    if leverage_ratio <= 0:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Leverage ratio debe ser > 0"}),
        }

    sag_fork_mm = calcular_sag_horquilla()
    sag_shock_mm, shock_travel_mm = calcular_sag_amortiguador(rear_travel, leverage_ratio)

    result = {
        "sag_fork_mm": sag_fork_mm,
        "sag_shock_mm": sag_shock_mm,
        "shock_travel_mm": shock_travel_mm,
        "input_weight_kg": weight,
        "input_front_pressure_psi": front_pressure,
        "input_rear_pressure_psi": rear_pressure,
        "guidance": {
            "rebote_horquilla": interpretar_rebote("horquilla"),
            "rebote_amortiguador": interpretar_rebote("amortiguador"),
            "compresion_horquilla": interpretar_compresion("horquilla"),
            "compresion_amortiguador": interpretar_compresion("amortiguador"),
        },
    }

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(result),
    }
