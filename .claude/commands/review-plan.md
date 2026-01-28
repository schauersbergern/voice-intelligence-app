Review the implementation plan at: $ARGUMENTS

Act as a senior engineer reviewing a junior's plan. Be critical but constructive.

## Review Checklist

### 1. Completeness
- Does the plan address ALL requirements from the spec?
- Are there missing steps?
- Are edge cases considered?

### 2. Correctness
- Are the technical approaches sound?
- Any anti-patterns or security issues?
- Will this actually work with Electron + Next.js?

### 3. Simplicity
- Is this the MINIMAL solution?
- Any over-engineering?
- Can anything be removed?

### 4. Order
- Are dependencies correct?
- Is the sequence logical?
- Any steps that should be reordered?

### 5. Risks
- What could go wrong?
- What's underestimated?
- Any blocking unknowns?

## Output Format

Rate each area: ✅ Good | ⚠️ Needs Work | ❌ Problem

Then list:
1. **Must Fix** (blocking issues)
2. **Should Fix** (important improvements)
3. **Could Fix** (nice to have)

End with: **APPROVED** or **REVISE NEEDED**

If REVISE NEEDED, be specific about what to change.
