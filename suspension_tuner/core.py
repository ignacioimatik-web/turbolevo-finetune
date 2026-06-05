"""
Núcleo de cálculo de suspensión para e-bikes de enduro.

Proporciona funciones para calcular sag, rebote y compresión
recomendados para horquilla y amortiguador.
"""

RECORRIDO_HORQUILLA_DEFAULT_MM = 180.0
SAG_HORQUILLA_PORCENTAJE = 0.15
SAG_AMORTIGUADOR_PORCENTAJE = 0.25  # Para e-MTB enduro


def calcular_sag_horquilla(
    recorrido_horquilla_mm: float = RECORRIDO_HORQUILLA_DEFAULT_MM,
) -> float:
    """
    Calcula el sag recomendado en milímetros para la horquilla.

    Args:
        recorrido_horquilla_mm: Recorrido total de la horquilla en mm.

    Returns:
        Sag recomendado en mm (redondeado a 1 decimal).
    """
    sag_mm = recorrido_horquilla_mm * SAG_HORQUILLA_PORCENTAJE
    return round(sag_mm, 1)


def calcular_sag_amortiguador(
    recorrido_rueda_mm: float,
    leverage_ratio: float,
    porcentaje: float = SAG_AMORTIGUADOR_PORCENTAJE,
) -> tuple[float, float]:
    """
    Calcula el sag recomendado para el amortiguador trasero.

    Args:
        recorrido_rueda_mm: Recorrido total de la rueda trasera (mm).
        leverage_ratio: Ratio de apalancamiento de la bicicleta.
        porcentaje: Porcentaje de sag objetivo (0.25 por defecto).

    Returns:
        Tupla (sag_mm, recorrido_amortiguador_mm).

    Raises:
        ValueError: Si leverage_ratio <= 0.
    """
    if leverage_ratio <= 0:
        raise ValueError("El leverage ratio debe ser un número positivo.")

    recorrido_amortiguador_mm = recorrido_rueda_mm / leverage_ratio
    sag_mm = recorrido_amortiguador_mm * porcentaje
    return round(sag_mm, 1), round(recorrido_amortiguador_mm, 1)


def interpretar_rebote(tipo_suspension: str) -> str:
    """
    Devuelve una guía textual para ajustar el rebote.

    Args:
        tipo_suspension: "horquilla" o "amortiguador".

    Returns:
        Texto guía.
    """
    if tipo_suspension.lower() == "horquilla":
        return (
            "Rebote horquilla: comienza con 5-7 clics desde cerrado. "
            "Si rebota tras impactos, cierra. Si se siente lenta, abre."
        )
    elif tipo_suspension.lower() == "amortiguador":
        return (
            "Rebote amortiguador: comienza con 5-7 clics desde cerrado. "
            "Si la rueda trasera rebota o salta, cierra. Si tarda en volver, abre."
        )
    return "Tipo de suspensión no reconocido."


def interpretar_compresion(tipo_suspension: str) -> str:
    """
    Devuelve una guía textual para ajustar la compresión.

    Args:
        tipo_suspension: "horquilla" o "amortiguador".

    Returns:
        Texto guía.
    """
    if tipo_suspension.lower() == "horquilla":
        return (
            "Compresión horquilla (LSC): comienza en medio. "
            "Más cerrado si se hunde al pedalear, más abierto si quieres absorción. "
            "HSC (si disponible): medio, ajusta según impactos fuertes."
        )
    elif tipo_suspension.lower() == "amortiguador":
        return (
            "Compresión amortiguador (LSC): medio por defecto. "
            "Más cerrado para firmeza al pedalear, más abierto para absorción. "
            "HSC (si disponible): medio para evitar bottom-out."
        )
    return "Tipo de suspensión no reconocido."
