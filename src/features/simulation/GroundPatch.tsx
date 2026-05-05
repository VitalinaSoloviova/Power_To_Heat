/**
 * Standard grass ground patch used by all simulation islands.
 */
const GroundPatch: React.FC = () => {
  return (
    <>
    {/* grass patch */}
      <ellipse cx="100" cy="170" rx="92" ry="35" fill="url(#grassGradient)" />
    </>
  );
};

export default GroundPatch;