// Glue: derive platform relevance + GOII Index™ for a prospect in one call.
import { scoreProspect, scoreToProspectFields, type ScoringInput } from "./scoring";

export function enrichAndScore(
  p: ScoringInput & { primaryPlatforms?: string[]; secondaryPlatforms?: string[] }
) {
  const result = scoreProspect(p);
  return {
    fields: {
      primaryPlatforms: result.primaryPlatforms,
      secondaryPlatforms: result.secondaryPlatforms,
      ...scoreToProspectFields(result),
    },
    result,
  };
}
