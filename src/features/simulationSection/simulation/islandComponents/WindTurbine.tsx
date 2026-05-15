interface WindTurbineProps {
  x: number;
  y: number;
  scale?: number;
  direction?: number;
  delay?: number;
  spinDuration?: number;
}

const WindTurbine: React.FC<WindTurbineProps> = ({
  x,
  y,
  scale = 1,
  direction = 1,
  delay = 0,
  spinDuration = 3,
}) => {
  const towerH = 70 * scale;
  const towerTop = y;
  const towerBottom = y + towerH;

  const halfBaseTop = 1.4 * scale;
  const halfBaseBot = 2.4 * scale;

  const bladeLen = 28 * scale;
  const hubR = 3 * scale;

  const rotorOffset = 5 * scale;
  const rotorCenterY = towerTop - rotorOffset;

  const rotationTo = direction === 1 ? 360 : -360;

  return (
    <g>
      {/* tower */}
      <path
        d={`
          M ${x - halfBaseTop} ${towerTop}
          L ${x + halfBaseTop} ${towerTop}
          L ${x + halfBaseBot} ${towerBottom}
          L ${x - halfBaseBot} ${towerBottom}
          Z
        `}
        fill="#f8fafc"
      />

      {/* nacelle */}
      <ellipse
        cx={x}
        cy={rotorCenterY}
        rx={hubR * 1.8}
        ry={hubR * 1.1}
        fill="#e2e8f0"
      />

      {/* rotor positioned exactly at center */}
      <g transform={`translate(${x}, ${rotorCenterY})`}>
        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 0 0"
            to={`${rotationTo} 0 0`}
            dur={`${spinDuration}s`}
            begin={`${delay}s`}
            repeatCount="indefinite"
          />

          {[0, 120, 240].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path
                d={`
                  M 0 0
                  C ${bladeLen * 0.18} ${-bladeLen * 0.35}
                    ${bladeLen * 0.08} ${-bladeLen * 0.85}
                    0 ${-bladeLen}
                  C ${-bladeLen * 0.08} ${-bladeLen * 0.85}
                    ${-bladeLen * 0.18} ${-bladeLen * 0.35}
                    0 0
                  Z
                `}
                fill="#ffffff"
                stroke="#cbd5e1"
                strokeWidth={0.7 * scale}
              />
            </g>
          ))}

          <circle cx={0} cy={0} r={hubR} fill="#e2e8f0" />
        </g>
      </g>
    </g>
  );
};

export default WindTurbine;