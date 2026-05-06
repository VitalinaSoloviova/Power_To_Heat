interface GroundPatchProps {
  /** ID of the gradient defined in the parent SVG's <defs> to use for the ground fill. */
  gradientId: string;
}

/**
 * Standard grass ground patch used by all simulation islands.
 */
const GroundPatch: React.FC<GroundPatchProps> = ({ gradientId }) => {
  return (
    <>
    {/* grass patch */}
      <ellipse cx="100" cy="170" rx="92" ry="35" fill={`url(#${gradientId})`} />
    </>
  );
};

export default GroundPatch;