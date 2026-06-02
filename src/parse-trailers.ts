/** A co-author trailer split into its name and optional `<email>`. */
export interface ParsedTrailer {
  value: string;
  name: string;
  email?: string;
}

const IDENTITY = /^(?<name>.*?)\s*(?:<(?<email>[^>]*)>)?\s*$/;

/**
 * Extract co-author trailers from a raw commit message.
 *
 * Scans every (non-comment) line for `<trailerName>: <value>` and splits the
 * value into a name and an optional `<email>`. Git comment lines (`#`) are
 * skipped so editor-based messages parse the same as `-m` ones.
 */
export function parseCoauthorTrailers(
  raw: string,
  trailerName = 'Co-authored-by',
): ParsedTrailer[] {
  if (!raw) return [];
  const escaped = trailerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lineRe = new RegExp(`^\\s*${escaped}\\s*:\\s*(.+?)\\s*$`, 'i');
  const trailers: ParsedTrailer[] = [];

  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith('#')) continue;
    const value = line.match(lineRe)?.[1];
    if (value === undefined) continue;
    const identity = value.match(IDENTITY);
    const name = (identity?.groups?.name ?? value).trim();
    const email = identity?.groups?.email?.trim() || undefined;
    trailers.push({ value, name, email });
  }

  return trailers;
}
