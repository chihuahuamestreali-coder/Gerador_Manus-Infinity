/**
 * Human Behavior Simulator - Simula comportamento humano natural
 * Inclui: delays aleatórios, cliques, scrolls, interações naturais
 */

export interface BehaviorConfig {
  minDelay: number;
  maxDelay: number;
  minTypingSpeed: number;
  maxTypingSpeed: number;
  enableMouseMovement: boolean;
  enableScrolling: boolean;
}

const DEFAULT_CONFIG: BehaviorConfig = {
  minDelay: 500,
  maxDelay: 3000,
  minTypingSpeed: 50,
  maxTypingSpeed: 150,
  enableMouseMovement: true,
  enableScrolling: true,
};

/**
 * Gera um delay aleatório realista (simula tempo de leitura/reflexão)
 */
export function generateRandomDelay(config: BehaviorConfig = DEFAULT_CONFIG): number {
  return Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
}

/**
 * Gera múltiplos delays para simular interações sequenciais
 */
export function generateDelaySequence(count: number, config: BehaviorConfig = DEFAULT_CONFIG): number[] {
  return Array.from({ length: count }, () => generateRandomDelay(config));
}

/**
 * Simula velocidade de digitação realista
 */
export function generateTypingDelay(config: BehaviorConfig = DEFAULT_CONFIG): number {
  return Math.floor(Math.random() * (config.maxTypingSpeed - config.minTypingSpeed + 1)) + config.minTypingSpeed;
}

/**
 * Gera um padrão de cliques natural (alguns duplos, alguns simples)
 */
export function generateClickPattern(count: number): boolean[] {
  return Array.from({ length: count }, () => Math.random() > 0.85); // 15% de chance de duplo clique
}

/**
 * Gera movimento de mouse realista (Bézier curve)
 */
export function generateMouseMovement(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  steps: number = 10
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Easing function para movimento mais natural
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    const x = startX + (endX - startX) * easeT;
    const y = startY + (endY - startY) * easeT;
    
    points.push({ x, y });
  }
  
  return points;
}

/**
 * Gera padrão de scroll realista
 */
export function generateScrollPattern(pageHeight: number): number[] {
  const scrollPoints: number[] = [];
  let currentScroll = 0;
  
  while (currentScroll < pageHeight) {
    const scrollAmount = Math.floor(Math.random() * 300) + 100; // 100-400px por scroll
    currentScroll += scrollAmount;
    scrollPoints.push(Math.min(currentScroll, pageHeight));
  }
  
  return scrollPoints;
}

/**
 * Gera tempo de permanência realista em uma página
 */
export function generatePageViewDuration(): number {
  // Distribuição mais realista: maioria 5-30 segundos, alguns mais longos
  const rand = Math.random();
  
  if (rand < 0.7) {
    return Math.floor(Math.random() * 25000) + 5000; // 5-30 segundos
  } else if (rand < 0.9) {
    return Math.floor(Math.random() * 30000) + 30000; // 30-60 segundos
  } else {
    return Math.floor(Math.random() * 60000) + 60000; // 1-2 minutos
  }
}

/**
 * Gera padrão de interação com formulário
 */
export interface FormInteractionPattern {
  fieldDelays: number[];
  focusOutDelays: number[];
  totalTime: number;
}

export function generateFormInteractionPattern(fieldCount: number): FormInteractionPattern {
  const fieldDelays = generateDelaySequence(fieldCount);
  const focusOutDelays = generateDelaySequence(fieldCount);
  const totalTime = fieldDelays.reduce((a, b) => a + b, 0) + focusOutDelays.reduce((a, b) => a + b, 0);
  
  return {
    fieldDelays,
    focusOutDelays,
    totalTime,
  };
}

/**
 * Gera padrão de movimento de mouse realista com pausas
 */
export function generateRealisticMousePattern(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): {
  movements: Array<{ x: number; y: number }>;
  totalDuration: number;
  pausePoints: number[];
} {
  const movements = generateMouseMovement(startX, startY, endX, endY, 15);
  const pausePoints = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
    Math.floor(Math.random() * movements.length)
  );
  const totalDuration = generateRandomDelay();
  
  return {
    movements,
    totalDuration,
    pausePoints,
  };
}

/**
 * Simula comportamento de leitura (scroll + pause)
 */
export function generateReadingBehavior(pageHeight: number): {
  scrollPoints: number[];
  pauseDurations: number[];
  totalTime: number;
} {
  const scrollPoints = generateScrollPattern(pageHeight);
  const pauseDurations = scrollPoints.map(() => generatePageViewDuration());
  const totalTime = pauseDurations.reduce((a, b) => a + b, 0);
  
  return {
    scrollPoints,
    pauseDurations,
    totalTime,
  };
}

/**
 * Gera configuração de comportamento anti-fraude
 */
export function generateAntiFraudConfig(): BehaviorConfig {
  return {
    minDelay: 1000,
    maxDelay: 5000,
    minTypingSpeed: 80,
    maxTypingSpeed: 200,
    enableMouseMovement: true,
    enableScrolling: true,
  };
}

/**
 * Cria um script de injeção que simula comportamento humano
 */
export function generateBehaviorInjectionScript(config: BehaviorConfig = DEFAULT_CONFIG): string {
  return `
    (function() {
      const config = ${JSON.stringify(config)};
      
      // Simula delays entre ações
      window.humanDelay = function(min = config.minDelay, max = config.maxDelay) {
        return new Promise(resolve => {
          const delay = Math.floor(Math.random() * (max - min + 1)) + min;
          setTimeout(resolve, delay);
        });
      };
      
      // Simula digitação lenta
      window.typeText = async function(element, text) {
        element.focus();
        for (let char of text) {
          element.value += char;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          await new Promise(r => setTimeout(r, Math.floor(Math.random() * (config.maxTypingSpeed - config.minTypingSpeed + 1)) + config.minTypingSpeed));
        }
      };
      
      // Simula movimento de mouse
      window.moveMouse = async function(fromX, fromY, toX, toY) {
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = fromX + (toX - fromX) * t;
          const y = fromY + (toY - fromY) * t;
          
          const event = new MouseEvent('mousemove', {
            clientX: x,
            clientY: y,
            bubbles: true
          });
          document.dispatchEvent(event);
          
          await new Promise(r => setTimeout(r, 50));
        }
      };
      
      // Simula scroll natural
      window.scrollNaturally = async function(targetScroll) {
        const current = window.scrollY;
        const distance = targetScroll - current;
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          window.scrollTo(0, current + distance * t);
          await new Promise(r => setTimeout(r, 50));
        }
      };
      
      console.log('Human behavior simulator loaded');
    })();
  `;
}
