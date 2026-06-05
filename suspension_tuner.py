# Calculadora de Ajuste de Suspensión para Bicicletas

Este script te ayudará a calcular los ajustes básicos de sag y rebote para tu horquilla y amortiguador.

**Datos Necesarios:**
- Peso total del ciclista (con equipamiento) en kg.
- Recorrido total de la horquilla en mm.
- Recorrido total de la rueda trasera (en mm) de tu bicicleta.
- **Ratio de apalancamiento (leverage ratio) específico de tu bici.** Este es crucial para calcular el sag del amortiguador trasero. Si no lo conoces, el cálculo será aproximado.
- Presión actual en la horquilla (PSI).
- Presión actual en el amortiguador (PSI).
- (Opcional) Tipo de muelle (aire/muelle) y volumen de aire en horquilla/amortiguador.

## Funciones:
- `calcular_sag_horquilla(peso_ciclista_kg, recorrido_horquilla_mm)`
- `calcular_sag_amortiguador(peso_ciclista_kg, recorrido_rueda_mm, leverage_ratio)`
- `interpretar_rebote(tipo_suspension, ajuste_sag_mm)`
- `interpretar_compresion(tipo_suspension, ajuste_sag_mm)`
- `guardar_perfil(nombre_perfil, datos_perfil)`
- `cargar_perfil(nombre_perfil)`

### Notas sobre las fórmulas y valores:
- **Sag Horquilla Fox 38 Performance:** Se recomienda un sag del 15-20% del recorrido total (180mm). Empezaremos con un 15% (27mm). **Nota:** La presión exacta para obtener este sag depende de la curva interna de la horquilla y el volumen de aire. El script no calcula la presión, sino el sag objetivo en mm.
- **Sag Amortiguador RockShox Air Deluxe:** Para bicis de E-MTB como la Turbo Levo, un sag del 25-30% del recorrido trasero es una buena referencia. La clave aquí es el `leverage_ratio` para convertir el recorrido de rueda a recorrido de amortiguador.

def calcular_sag_horquilla(peso_ciclista_kg, recorrido_horquilla_mm):
    """
    Calcula el sag recomendado en milímetros para la horquilla.
    Se basa en un porcentaje fijo del recorrido total.
    """
    sag_porcentaje_recomendado = 0.15 # 15% como punto de partida
    sag_recomendado_mm = recorrido_horquilla_mm * sag_porcentaje_recomendado
    return round(sag_recomendado_mm, 1)

def calcular_sag_amortiguador(peso_ciclista_kg, recorrido_rueda_mm, leverage_ratio):
    """
    Calcula el sag recomendado en milímetros para el amortiguador trasero.
    Requiere el recorrido de rueda y el leverage ratio de la bicicleta.
    """
    if leverage_ratio <= 0:
        raise ValueError("El leverage ratio debe ser un número positivo.")
    
    recorrido_amortiguador_mm = recorrido_rueda_mm / leverage_ratio
    sag_porcentaje_recomendado = 0.25 # 25% como punto de partida para E-MTB
    sag_recomendado_mm = recorrido_amortiguador_mm * sag_porcentaje_recomendado
    
    return round(sag_recomendado_mm, 1), round(recorrido_amortiguador_mm, 1)

def interpretar_rebote(tipo_suspension, ajuste_sag_mm):
    """
    Guía para ajustar el rebote basada en la experiencia.
    No hay una fórmula exacta, es empírico.
    """
    if tipo_suspension.lower() == "horquilla":
        return (
            "Para el ajuste de rebote de la horquilla:\n"
            " - Empieza con la configuración media (normalmente 5-7 clics desde totalmente cerrado 'tortuga').\n"
            " - Si la horquilla se siente rápida o 'rebota' tras un impacto (especialmente saltos o escalones), ciérrala (más lento, hacia la tortuga).\n"
            " - Si se siente 'abisinica' o tarda en extenderse completamente, ábrela (más rápido, hacia la liebre).\n"
            " - El sag influye: un sag mayor puede requerir un rebote ligeramente más rápido."
        )
    elif tipo_suspension.lower() == "amortiguador":
        return (
            "Para el ajuste de rebote del amortiguador:\n"
            " - Empieza con el ajuste medio (normalmente 5-7 clics desde totalmente cerrado 'tortuga').\n"
            " - Si la rueda trasera se siente 'pegajosa' o el amortiguador no se extiende a tiempo después de un impacto, ábrelo (más rápido, hacia la liebre).\n"
            " - Si la bici se siente nerviosa, con tendencia a rebotar o saltar, ciérralo (más lento, hacia la tortuga).\n"
            " - El sag influye: un sag mayor puede requerir un rebote ligeramente más rápido."
        )
    else:
        return "Tipo de suspensión desconocido para el ajuste de rebote."

def interpretar_compresion(tipo_suspension, ajuste_sag_mm):
    """
    Guía para ajustar la compresión basada en la experiencia.
    La compresión afecta a cómo la suspensión reacciona a impactos y al pedaleo.
    """
    if tipo_suspension.lower() == "horquilla":
        return (
            "Para el ajuste de compresión (si tu horquilla lo tiene, usualmente LOW/HIGH Speed):\n"
            " - COMPRESIÓN BAJA (LSC - Low Speed Compression):\n"
            "   - Controla el movimiento de la horquilla a bajas velocidades (pedaleo, baches lentos).\n"
            "   - Más cerrado (más clics hacia 'tortuga'/'bloqueo') reduce el balanceo al pedalear y aumenta la firmeza en baches lentos.\n"
            "   - Más abierto (hacia 'liebre'/'abierto') mejora la absorción de pequeños baches y se siente más 'viva'.\n"
            "   - Punto de partida: Medio o un poco más abierto que el rebote.\n"
            " - COMPRESIÓN ALTA (HSC - High Speed Compression, menos común en Performance):\n"
            "   - Controla la respuesta a impactos rápidos y duros (roca, aterrizajes de saltos).\n"
            "   - Más cerrado previene que la horquilla se hunda demasiado en impactos fuertes.\n"
            "   - Más abierto permite que la horquilla absorba mejor los impactos duros.\n"
            "   - Punto de partida: Medio si está disponible.\n"
            " - El sag influye: un sag más profundo puede hacer que a veces necesites abrir un poco la compresión baja."
        )
    elif tipo_suspension.lower() == "amortiguador":
        return (
            "Para el ajuste de compresión (si tu amortiguador tiene LSC/HSC):\n"
            " - COMPRESIÓN BAJA (LSC):\n"
            "   - Controla el movimiento del amortiguador a bajas velocidades (pedaleo, baches lentos).\n"
            "   - Más cerrado -> Mayor firmeza al pedalear, menos hundimiento en curvas.\n"
            "   - Más abierto -> Mayor absorción de pequeños impactos, más 'activo'.\n"
            "   - Punto de partida: Medio o un poco más cerrado que el rebote.\n"
            " - COMPRESIÓN ALTA (HSC - menos común en Air Deluxe sino es Limited/Ultimate):\n"
            "   - Controla la respuesta a impactos fuertes y rápidos.\n"
            "   - Más cerrado reduce el riesgo de golpe de fondo (bottom-out).\n"
            "   - Más abierto permite que el amortiguador absorba mejor los impactos grandes.\n"
            "   - Punto de partida: Medio si está disponible.\n"
            " - El sag influye: Un sag mayor puede indicar que necesitas un poco más de soporte de compresión para evitar hundimientos indeseados."
        )
    else:
        return "Tipo de suspensión desconocido para el ajuste de compresión."

def guardar_perfil(nombre_perfil, datos_perfil, ubicacion="/Users/jistev/projects/finetune/profiles/"):
    """Guarda un perfil de configuración de suspensión en un archivo JSON."""
    import os
    import json
    
    if not os.path.exists(ubicacion):
        os.makedirs(ubicacion)
        
    ruta_archivo = os.path.join(ubicacion, f"{nombre_perfil}.json")
    try:
        with open(ruta_archivo, 'w') as f:
            json.dump(datos_perfil, f, indent=4)
        return f"Perfil '{nombre_perfil}' guardado en {ruta_archivo}"
    except Exception as e:
        return f"Error al guardar perfil '{nombre_perfil}': {e}"

def cargar_perfil(nombre_perfil, ubicacion="/Users/jistev/projects/finetune/profiles/"):
    """Carga un perfil de configuración de suspensión desde un archivo JSON."""
    import os
    import json

    ruta_archivo = os.path.join(ubicacion, f"{nombre_perfil}.json")
    if not os.path.exists(ruta_archivo):
        return None, f"Perfil '{nombre_perfil}' no encontrado en {ruta_archivo}"
    
    try:
        with open(ruta_archivo, 'r') as f:
            datos_perfil = json.load(f)
        return datos_perfil, f"Perfil '{nombre_perfil}' cargado."
    except Exception as e:
        return None, f"Error al cargar perfil '{nombre_perfil}': {e}"


if __name__ == "__main__":
    print("--- Calculadora de Ajuste de Suspensión para E-Bike ---")
    
    # Parámetros fijos y a confirmar
    recorrido_horquilla_predeterminado_mm = 180.0
    recorrido_rueda_predeterminado_mm = 150.0 # ¡A CONFIRMAR para la Turbo Levo!
    # Ratio de apalancamiento de la Turbo Levo Carbon - ¡A CONFIRMAR!
    # Valor de ejemplo: 2.5. Si encuentras el dato exacto, actualízalo aquí.
    ratio_apalancamiento_predeterminado = 2.5 

    print("\n**Información General de tu bici:**")
    print(f"- Horquilla: Fox 38 Performance ({recorrido_horquilla_predeterminado_mm}mm recorrido)")
    print(f"- Amortiguador Trasero: RockShox Air Deluxe (recorrido de rueda trasera a confirmar)")
    print(f"- Levo Carbon: Ratio de apalancamiento estimado: {ratio_apalancamiento_predeterminado} (¡IMPORTANTE: Verificar este valor!)")
    
    # Cargar un perfil si se desea
    nombre_perfil_a_cargar = input("¿Quieres cargar un perfil existente? (Introduce el nombre o deja vacío): ").strip()
    if nombre_perfil_a_cargar:
        perfil, mensaje = cargar_perfil(nombre_perfil_a_cargar)
        print(mensaje)
        if perfil:
            peso_ciclista_kg = perfil.get("peso_ciclista_kg")
            recorrido_rueda_mm = perfil.get("recorrido_rueda_mm", recorrido_rueda_predeterminado_mm)
            ratio_apalancamiento = perfil.get("ratio_apalancamiento", ratio_apalancamiento_predeterminado)
            presion_horquilla_psi = perfil.get("presion_horquilla_psi")
            presion_amortiguador_psi = perfil.get("presion_amortiguador_psi")
        else:
            # Si el perfil no se cargó, pedimos los datos
            peso_ciclista_kg = float(input("Introduce tu peso total (con equipamiento) en kg: "))
            recorrido_rueda_mm = float(input(f"Introduce el recorrido total de la rueda trasera en mm (ej. {recorrido_rueda_predeterminado_mm}): "))
            ratio_apalancamiento = float(input("Introduce el ratio de apalancamiento de la bici (ej. 2.5, ¡verifícalo!): "))
            presion_horquilla_psi = float(input("Introduce la presión actual de la horquilla en PSI: "))
            presion_amortiguador_psi = float(input("Introduce la presión actual del amortiguador en PSI: "))
    else:
        # Pedir datos si no se carga perfil
        try:
            peso_ciclista_kg = float(input("Introduce tu peso total (con equipamiento) en kg: "))
            recorrido_rueda_mm = float(input(f"Introduce el recorrido total de la rueda trasera en mm (ej. {recorrido_rueda_predeterminado_mm}): "))
            ratio_apalancamiento = float(input("Introduce el ratio de apalancamiento de la bici (ej. 2.5, ¡verifícalo!): "))
            presion_horquilla_psi = float(input("Introduce la presión actual de la horquilla en PSI: "))
            presion_amortiguador_psi = float(input("Introduce la presión actual del amortiguador en PSI: "))
        except ValueError:
            print("\nError: Por favor, introduce valores numéricos válidos.")
            exit() # Salir si los datos iniciales son inválidos

    try:
        # Cálculos de Sag
        sag_horquilla_mm = calcular_sag_horquilla(peso_ciclista_kg, recorrido_horquilla_predeterminado_mm)
        sag_amortiguador_mm, recorrido_amortiguador_real_mm = calcular_sag_amortiguador(peso_ciclista_kg, recorrido_rueda_mm, ratio_apalancamiento)

        # Guías de Ajuste
        guia_rebote_h = interpretar_rebote("horquilla", sag_horquilla_mm)
        guia_rebote_a = interpretar_rebote("amortiguador", sag_amortiguador_mm)
        guia_compresion_h = interpretar_compresion("horquilla", sag_horquilla_mm)
        guia_compresion_a = interpretar_compresion("amortiguador", sag_amortiguador_mm)

        print("\n--- Sugerencias de Ajuste ---")
        print(f"\nHorquilla Fox 38 ({recorrido_horquilla_predeterminado_mm}mm):")
        print(f"  - Peso ciclista: {peso_ciclista_kg} kg")
        print(f"  - Sag Sugerido: ~{sag_horquilla_mm:.1f} mm (Objetivo: aprox. {sag_porcentaje_recomendado*100:.0f}%). Si la presión actual no da esto, ajusta la presión hasta lograrlo.")
        print(f"  - Rebote: {guia_rebote_h}")
        print(f"  - Compresión: {guia_compresion_h}")

        print(f"\nAmortiguador RockShox Air Deluxe (Recorrido Rueda: {recorrido_rueda_mm}mm):")
        print(f"  - Peso ciclista: {peso_ciclista_kg} kg")
        print(f"  - Ratio de Apalancamiento: {ratio_apalancamiento:.2f}")
        print(f"  - Recorrido Efectivo Amortiguador: ~{recorrido_amortiguador_real_mm:.1f} mm")
        print(f"  - Sag Sugerido: ~{sag_amortiguador_mm:.1f} mm (Objetivo: aprox. {sag_porcentaje_recomendado*100:.0f}% de {recorrido_amortiguador_real_mm:.1f}mm). Si la presión actual no da esto, ajusta la presión hasta lograrlo.")
        print(f"  - Rebote: {guia_rebote_a}")
        print(f"  - Compresión: {guia_compresion_a}")

        print("\n**Manual de Ajuste - Pasos Recomendados:**")
        print("1. **Prueba de Sag:** Usa una brida en la horquilla/amortiguador. Monta la bici de forma que la suspensión se comprima (pero sin pedalear fuerte) y mide el recorrido que se hundió. Ajústa la presión hasta que el sag medido esté cerca de las sugerencias.")
        print("2. **Prueba de Rebote:** Con la suspensión con el sag correcto, haz varios recorridos. Siente cómo la suspensión vuelve a su posición. Ajusta el rebote según las guías.")
        print("3. **Prueba de Compresión:** Si tienes ajustes de compresión, pruébalos en senderos representativos. Empieza con los ajustes medios y ve modificando según sientas balanceo, firmeza o absorción.")
        print("4. **Ajuste Final:** Dale una buena ruta y haz pequeños ajustes finos. Lo más importante es cómo se siente la bici bajo tu conducción.")

        # Opción de guardar perfil
        guardar = input("\n¿Quieres guardar estos ajustes como un perfil? (s/N): ").lower().strip()
        if guardar == 's':
            nombre_perfil = input("Introduce un nombre para el perfil (ej. 'Rutas Montaña', 'DH Suave'): ").strip()
            if nombre_perfil:
                perfil_datos = {
                    "nombre": nombre_perfil,
                    "peso_ciclista_kg": peso_ciclista_kg,
                    "recorrido_horquilla_mm": recorrido_horquilla_predeterminado_mm,
                    "recorrido_rueda_mm": recorrido_rueda_mm,
                    "ratio_apalancamiento": ratio_apalancamiento,
                    "presion_horquilla_psi": presion_horquilla_psi,
                    "presion_amortiguador_psi": presion_amortiguador_psi,
                    "sag_horquilla_mm": sag_horquilla_mm,
                    "sag_amortiguador_mm": sag_amortiguador_mm,
                    "recorrido_amortiguador_real_mm": recorrido_amortiguador_real_mm,
                    "guia_rebote_h": guia_rebote_h,
                    "guia_compresion_h": guia_compresion_h,
                    "guia_rebote_a": guia_rebote_a,
                    "guia_compresion_a": guia_compresion_a
                }
                mensaje_guardado = guardar_perfil(nombre_perfil, perfil_datos)
                print(mensaje_guardado)
            else:
                print("No se introdujo nombre de perfil. Ajustes no guardados.")

    except ValueError as ve:
        print(f"\nError de entrada de datos: {ve}")
    except Exception as e:
        print(f"\nOcurrió un error inesperado: {e}")

