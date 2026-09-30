# Senior Motion Designer Skill v0.1

This is the initial architecture for a Claude Agent Skill focused on professional motion design.

## Philosophy

Do not try to put all motion-design knowledge into one prompt.

The skill uses progressive disclosure:
- `SKILL.md` = operating system and routing logic.
- `references/` = specialist knowledge.
- `brands/` = brand-specific behavior.
- `templates/` = repeatable project inputs/outputs.
- `evals/` = quality measurement.
- `examples/` = concrete examples.
- `scripts/` = deterministic helper tools.

## Most important next step

The highest-value future addition is a curated reference library based on real motion-design work you admire.

Each reference should be broken down by:
- timecode,
- composition,
- movement,
- timing,
- easing,
- transition logic,
- sound,
- why it works,
- transferable principle.

That library will contribute more to "taste" than adding hundreds of generic animation rules.

## Version plan

v0.1 — core design/motion system
v0.2 — reference-video analysis workflow + first curated references
v0.3 — detailed After Effects/MCP production patterns
v0.4 — WKC brand system + approved project examples
v0.5 — evaluation dataset + iteration rules based on real outputs
