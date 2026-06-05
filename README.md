# Proyecto de Ajuste de Suspensión para Specialized Turbo Levo Carbon

## Descripción
Esta aplicación está diseñada para ayudar a los ciclistas de e-bike, específicamente para la Specialized Turbo Levo Carbon, a calcular y optimizar los ajustes de sag (hundimiento), rebote y compresión para su horquilla y amortiguador.

Seguir las recomendaciones de este script te ayudará a tener un punto de partida excelente para que tu bicicleta Specialized Turbo Levo Carbon ofrezca el máximo rendimiento y confort.

## Componentes Soportados:
- **Horquilla:** Fox 38 Performance (180mm recorrido)
- **Amortiguador Trasero:** RockShox Air Deluxe (modelo específico a confirmar)
- **Bicicleta:** Specialized Turbo Levo Carbon (modelo y año a confirmar para ratio de apalancamiento)

## Cómo usarlo:
1.  Ejecuta el script principal `suspension_tuner.py`.
2.  Introduce tu peso total (con equipamiento, en kg).
3.  Introduce el recorrido total de la rueda trasera de tu bici (en mm).
4.  Introduce el **ratio de apalancamiento (leverage ratio)** específico de tu bici. Si no lo conoces, el script usará un valor por defecto que puede ser menos preciso. ¡Investiga este valor para obtener los mejores resultados!
5.  Introduce la presión actual de la horquilla y el amortiguador (en PSI).
6.  El script te proporcionará sugerencias de sag (en mm) y guías para ajustar el rebote y la compresión.
7.  Se te dará la opción de guardar estos ajustes como un perfil para su uso futuro.

## Consideraciones Clave:
-   **Ratio de Apalancamiento:** La precisión del cálculo del sag del amortiguador trasero depende críticamente de tener el ratio de apalancamiento correcto para tu modelo específico de Turbo Levo Carbon y su año.
-   **Sag:** Los valores de sag sugeridos son puntos de partida. **La sensación en ruta es el factor más importante.** Ajusta tu presión de aire hasta que logres el sag recomendado.
-   **Rebote y Compresión:** Estos ajustes son en gran medida empíricos. Las guías proporcionadas son recomendaciones de mecánicos experimentados para ayudarte a empezar. Experimenta en senderos reales.

## Estructura de Archivos:
-   `suspension_tuner.py`: Script principal con la lógica de cálculo.
-   `README.md`: Este archivo, con información general y propósito del proyecto.
-   `profiles/`: Carpeta donde se guardarán los perfiles de ajuste creados (archivos `.json`).

## Próximos pasos:
-   Validar el ratio de apalancamiento para la Turbo Levo Carbon.
-   Refinar las guías de ajuste de rebote y compresión basándose en la experiencia del usuario.
-   Considerar la adición de soporte para otros componentes de suspensión.