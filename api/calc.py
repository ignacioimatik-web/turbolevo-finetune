import json

def handler(request):
    """Vercel Python function handler.
    Expects a JSON payload with the following fields:
        - weight (kg): float
        - rear_travel (mm): float (recorrido total de la rueda trasera)
        - leverage_ratio: float (ratio de apalancamiento de la bici)
        - front_pressure (psi): float (presión actual de la horquilla)
        - rear_pressure (psi): float (presión actual del amortiguador)
    Returns a JSON with calculated sag values and recommended rebote/compresión guidance.
    """
    try:
        # request.body may be None for GET requests
        body = request.body
        data = json.loads(body) if body else {}
    except Exception:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Invalid JSON payload"})
        }

    # Required fields validation
    required_fields = ["weight", "rear_travel", "leverage_ratio", "front_pressure", "rear_pressure"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Missing fields: {', '.join(missing)}"})
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
            "body": json.dumps({"error": "Fields must be numeric"})
        }

    # Constantes del proyecto
    fork_travel_mm = 180.0  # Fox 38 Performance
    # Sag de la horquilla (15% del recorrido)
    sag_fork_mm = round(fork_travel_mm * 0.15, 1)

    # Cálculo del sag del amortiguador
    if leverage_ratio <= 0:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Leverage ratio must be > 0"})
        }
    # Recorrido efectivo del amortiguador en mm
    shock_travel_mm = round(rear_travel / leverage_ratio, 1)
    sag_shock_mm = round(shock_travel_mm * 0.25, 1)  # 25% objetivo para e‑MTB

    # Guías simples de rebote y compresión (empíricas)
    rebote_horquilla = (
        "Rebote: empieza con la configuración media (≈ 5‑7 clics desde cerrado). "
        "Ajusta según la sensación: si la horquilla rebota demasiado después de impactos, ciérralo. "
        "Si se siente lenta para volver, ábrelo."
    )
    rebote_amortiguador = (
        "Rebote del amortiguador: configuración media (≈ 5‑7 clics). "
        "Cierra (más lento) si el tren trasero rebota o se siente ‘saltón’; abre (más rápido) si tarda en volver a la posición."
    )
    compresion_horquilla = (
        "Compresión horquilla (Low Speed Compression): comienza en medio, ajusta para que la horquilla no se hunda bajo pedaleo y sea firme en baches lentos. "
        "Compresión alta (si la horquilla la tiene) controla impactos fuertes; ajústala según la dureza que prefieras."
    )
    compresion_amortiguador = (
        "Compresión amortiguador (Low Speed): medio por defecto, más cerrado si buscas firmeza bajo pedaleo y en curvas, más abierto si prefieres mayor absorción de baches pequeños. "
        "Compresión alta (si está disponible) controla los impactos duros; más cerrado para evitar bottom‑out, más abierto si quieres más absorción."
    )

    result = {
        "sag_fork_mm": sag_fork_mm,
        "sag_shock_mm": sag_shock_mm,
        "shock_travel_mm": shock_travel_mm,
        "guidance": {
            "rebote_horquilla": rebote_horquilla,
            "rebote_amortiguador": rebote_amortiguador,
            "compresion_horquilla": compresion_horquilla,
            "compresion_amortiguador": compresion_amortiguador
        }
    }

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(result)
    }
