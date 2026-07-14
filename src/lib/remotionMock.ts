export function interpolate(
  frame: number,
  inputRange: number[],
  outputRange: number[],
  options?: { extrapolateRight?: 'clamp' | 'extend'; extrapolateLeft?: 'clamp' | 'extend' }
) {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  if (inputMin === inputMax) return outputMin;

  let t = (frame - inputMin) / (inputMax - inputMin);

  // Extrapolate Left
  if (t < 0) {
    if (options?.extrapolateLeft === 'clamp') {
      t = 0;
    }
  }
  // Extrapolate Right
  if (t > 1) {
    if (options?.extrapolateRight === 'clamp' || !options?.extrapolateRight) {
      t = 1;
    }
  }

  return outputMin + t * (outputMax - outputMin);
}

export function spring(options: { 
  frame: number; 
  fps: number; 
  config?: { damping?: number; stiffness?: number; mass?: number } 
}) {
  const { frame, fps, config = {} } = options;
  const damping = config.damping ?? 10;
  const stiffness = config.stiffness ?? 100;
  const mass = config.mass ?? 1;

  const t = frame / fps;
  if (t <= 0) return 0;

  const m = mass;
  const c = damping;
  const k = stiffness;

  const delta = c * c - 4 * m * k;
  if (delta > 0) {
    // Overdamped
    const r1 = (-c + Math.sqrt(delta)) / (2 * m);
    const r2 = (-c - Math.sqrt(delta)) / (2 * m);
    const A = r2 / (r1 - r2);
    const B = -r1 / (r1 - r2);
    const x = A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
    return 1 + x;
  } else if (delta === 0) {
    // Critically damped
    const r = -c / (2 * m);
    const A = -1;
    const B = r;
    const x = (A + B * t) * Math.exp(r * t);
    return 1 + x;
  } else {
    // Underdamped
    const alpha = -c / (2 * m);
    const beta = Math.sqrt(4 * m * k - c * c) / (2 * m);
    const A = -1;
    const B = alpha / beta;
    const x = Math.exp(alpha * t) * (A * Math.cos(beta * t) + B * Math.sin(beta * t));
    return 1 + x;
  }
}

// AST and state evaluator for the typed JSX code
export interface RenderedNode {
  type: 'AbsoluteFill' | 'div' | 'h1' | 'span' | 'Sequence';
  className?: string;
  style?: Record<string, any>;
  text?: string;
  from?: number;
  durationInFrames?: number;
  children?: RenderedNode[];
}

export function parseAndEvaluateCode(code: string, frame: number, defaultProps: Record<string, any> = {}): RenderedNode {
  try {
    // 1. Setup local variable environment
    const vars: Record<string, any> = { ...defaultProps };
    
    // Extract variables with values (simple regex assignments)
    // E.g. const opacity = interpolate(frame, [0, 30], [0, 1]...)
    const varMatches = code.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(.*?);/g);
    for (const match of varMatches) {
      const name = match[1];
      const expression = match[2];

      try {
        // Evaluate the expression with local mocks in context
        const evalFn = new Function('frame', 'fps', 'interpolate', 'spring', `
          try {
            return ${expression};
          } catch(e) {
            return null;
          }
        `);
        vars[name] = evalFn(frame, 30, interpolate, spring);
      } catch (e) {
        vars[name] = null;
      }
    }

    // 2. Parse structural layout from code using specialized regex
    // We search for elements like AbsoluteFill, Sequence, div, h1
    const nodes: RenderedNode[] = [];

    // Check background styling (from bg-... in MyVideo return)
    const bgMatch = code.match(/className\s*=\s*["'](bg-[\w\s-()/#:[\]]+)["']/);
    const rootBg = bgMatch ? bgMatch[1] : 'bg-slate-900';

    // Let's search for sequences or blocks
    // Sequence blocks
    const sequenceMatches = [...code.matchAll(/<Sequence\s+from=\{\s*(\d+)\s*\}(?:\s+durationInFrames=\{\s*(\d+)\s*\})?>([\s\S]*?)<\/Sequence>/g)];
    
    if (sequenceMatches.length > 0) {
      for (const seq of sequenceMatches) {
        const from = parseInt(seq[1]);
        const duration = seq[2] ? parseInt(seq[2]) : 9999;
        const body = seq[3];

        // Is sequence currently active?
        const relativeFrame = frame - from;
        const isActive = frame >= from && frame < (from + duration);

        if (isActive) {
          // Re-evaluate variables for this sequence since useCurrentFrame() starts at 0!
          const seqVars = { ...vars };
          const localMatches = body.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(.*?);/g);
          for (const m of localMatches) {
            const name = m[1];
            const expression = m[2];
            try {
              const evalFn = new Function('frame', 'fps', 'interpolate', 'spring', `return ${expression};`);
              seqVars[name] = evalFn(relativeFrame, 30, interpolate, spring);
            } catch (e) {
              seqVars[name] = null;
            }
          }

          // Parse children inside sequence
          const childNodes: RenderedNode[] = [];
          
          // Look for title/div elements inside sequence
          const divMatches = body.matchAll(/<(\w+)\s+className=["'](.*?)["'](?:\s+style=\{\{\s*(\w+)\s*\}\})?>([\s\S]*?)<\/\1>/g);
          for (const div of divMatches) {
            const tag = div[1] as any;
            const className = div[2];
            const styleVar = div[3];
            let innerText = div[4].replace(/\{[\w\s.]+\}/g, (m) => {
              const key = m.replace(/[{}]/g, '').trim();
              return seqVars[key] !== undefined ? String(seqVars[key]) : '';
            }).replace(/<.*?>/g, '').trim();

            const style: Record<string, any> = {};
            if (styleVar && seqVars[styleVar] !== undefined) {
              style[styleVar] = seqVars[styleVar];
            }

            childNodes.push({
              type: tag,
              className,
              style,
              text: innerText
            });
          }

          nodes.push({
            type: 'Sequence',
            from,
            durationInFrames: duration,
            children: childNodes
          });
        }
      }
    } else {
      // Direct children (no Sequences)
      // Parse main h1 or divs inside the AbsoluteFill
      const divMatches = code.matchAll(/<(\w+)\s+(?:style=\{\{\s*(\w+)\s*\}\}\s+)?className=["'](.*?)["'](?:\s+style=\{\{\s*(\w+)\s*\}\})?>([\s\S]*?)<\/\1>/g);
      for (const div of divMatches) {
        const tag = div[1] as any;
        const styleVar = div[2] || div[4];
        const className = div[3];
        const rawContent = div[5] || '';
        
        let innerText = rawContent.replace(/\{([\w\s.]+)\}/g, (m, key) => {
          const cleanKey = key.trim();
          return vars[cleanKey] !== undefined ? String(vars[cleanKey]) : '';
        }).replace(/<.*?>/g, '').trim();

        const style: Record<string, any> = {};
        if (styleVar && vars[styleVar] !== undefined) {
          style[styleVar] = vars[styleVar];
        }

        if (tag === 'div' || tag === 'h1' || tag === 'span') {
          nodes.push({
            type: tag,
            className,
            style,
            text: innerText
          });
        }
      }
    }

    // Default top-level node
    return {
      type: 'AbsoluteFill',
      className: rootBg,
      children: nodes
    };

  } catch (error) {
    console.error("Parser failed:", error);
    // Simple fallback
    return {
      type: 'AbsoluteFill',
      className: 'bg-slate-900',
      children: [
        {
          type: 'h1',
          className: 'text-white text-3xl font-bold',
          text: "Remotion Composition"
        }
      ]
    };
  }
}
