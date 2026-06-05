import type { EBike } from '../types'

export function SpecTable({ bike }: { bike: EBike }) {
  const sections: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Cuadro y Geometría',
      rows: [
        ['Material', bike.frame.material],
        ['Peso cuadro', `${bike.frame.weight} kg`],
        ['Ángulo dirección', `${bike.frame.geometry.headAngle}°`],
        ['Ángulo sillín', `${bike.frame.geometry.seatAngle}°`],
        ['Reach', `${bike.frame.geometry.reach} mm`],
        ['Distancia ejes', `${bike.frame.geometry.wheelbase} mm`],
        ['Chainstay', `${bike.frame.geometry.chainstay} mm`],
        ['Caída pedalier', `${bike.frame.geometry.bbDrop} mm`],
        ['Tallas', bike.frame.sizes.join(', ')],
      ],
    },
    {
      title: 'Componentes',
      rows: [
        ['Peso total', `${bike.specs.weight} kg`],
        ['Ruedas', `${bike.specs.wheels}"`],
        ['Frenos', bike.specs.brakes],
        ['Transmisión', bike.specs.drivetrain],
        ['Carga máxima', `${bike.specs.maxLoad} kg`],
      ],
    },
    {
      title: 'Motor y Batería',
      rows: [
        ['Motor', `${bike.motor.brand} ${bike.motor.model}`],
        ['Par motor', `${bike.motor.torque} Nm`],
        ['Potencia', `${bike.motor.power} W`],
        ['Sensor', bike.motor.sensor],
        ['Modos', bike.motor.assistModes.join(', ')],
        ['Capacidad', `${bike.battery.capacity} Wh`],
        ['Peso batería', `${bike.battery.weight} kg`],
        ['Extraíble', bike.battery.removable ? 'Sí' : 'No'],
        ['Cargador', bike.battery.chargerType],
      ],
    },
    {
      title: 'Suspensión',
      rows: [
        ['Horquilla', `${bike.suspension.front.brand} ${bike.suspension.front.model}`],
        ['Recorrido del.', `${bike.suspension.front.travel} mm`],
        ['Ajuste horquilla', bike.suspension.front.adjustment],
        ['Amortiguador', `${bike.suspension.rear.brand} ${bike.suspension.rear.model}`],
        ['Recorrido tras.', `${bike.suspension.rear.travel} mm`],
        ['Leverage ratio', bike.suspension.rear.leverageRatio.toString()],
        ['Ajuste amort.', bike.suspension.rear.adjustment],
      ],
    },
  ]

  return (
    <div className="panel divide-y divide-border">
      {sections.map(section => (
        <div key={section.title} className="p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3 font-mono">
            {section.title}
          </h3>
          <dl className="space-y-1.5">
            {section.rows.map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <dt className="text-text-muted">{label}</dt>
                <dd className="text-text-primary font-mono font-medium text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}
