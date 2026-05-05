interface TreeProps {
  /** X position of the tree */
  x: number;
  /** Y position of the tree */
  y: number;
  /** Size/radius of the tree crown */
  size?: number;
}

/**
 * Realistic tree component with trunk and natural crown.
 * Used for background decoration on all simulation islands.
 */
const Tree: React.FC<TreeProps> = ({
  x,
  y,
  size = 8,
}) => {
  const trunkWidth = size * 0.25;
  const trunkHeight = size * 1.2;
  const crownWidth = size * 1.4;
  const crownHeight = size * 1.1;

  return (
    <g>
      {/* trunk */}
      <rect 
        x={x - trunkWidth / 2} 
        y={y} 
        width={trunkWidth} 
        height={trunkHeight} 
        fill="#8b5a2b"
        rx={trunkWidth * 0.1}
      />
      {/* crown - irregular tree shape */}
      <ellipse
        cx={x}
        cy={y - size * 0.3}
        rx={crownWidth * 0.5}
        ry={crownHeight * 0.4}
        fill="url(#treeGradient)"
      />
      <ellipse
        cx={x - size * 0.3}
        cy={y + size * 0.1}
        rx={size * 0.6}
        ry={size * 0.5}
        fill="url(#treeGradient)"
      />
      <ellipse
        cx={x + size * 0.2}
        cy={y - size * 0.1}
        rx={size * 0.7}
        ry={size * 0.6}
        fill="url(#treeGradient)"
      />
      <ellipse
        cx={x}
        cy={y - size * 0.6}
        rx={size * 0.4}
        ry={size * 0.3}
        fill="url(#treeGradient)"
      />
    </g>
  );
};

export default Tree;