/**
 * Procesa la respuesta del LLM para ocultar las etiquetas de razonamiento
 * @param answer - La respuesta completa del LLM
 * @returns La respuesta limpia sin etiquetas de razonamiento
 */
export function processLLMResponse(answer: string): string {
  // Buscar etiquetas de razonamiento como <think>, <reasoning>, etc.
  const thinkPattern = /<think>[\s\S]*?<\/think>/gi;
  const reasoningPattern = /<reasoning>[\s\S]*?<\/reasoning>/gi;
  const thoughtPattern = /<thought>[\s\S]*?<\/thought>/gi;
  
  // Remover todas las etiquetas de razonamiento y su contenido
  let processedAnswer = answer
    .replace(thinkPattern, '')
    .replace(reasoningPattern, '')
    .replace(thoughtPattern, '');
  
  // Limpiar espacios en blanco extra y saltos de línea
  processedAnswer = processedAnswer
    .replace(/\n\s*\n/g, '\n') // Remover líneas vacías múltiples
    .trim();
  
  return processedAnswer;
}

/**
 * Verifica si una respuesta contiene etiquetas de razonamiento
 * @param answer - La respuesta del LLM
 * @returns true si contiene etiquetas de razonamiento
 */
export function hasReasoningTags(answer: string): boolean {
  const thinkPattern = /<think>[\s\S]*?<\/think>/gi;
  const reasoningPattern = /<reasoning>[\s\S]*?<\/reasoning>/gi;
  const thoughtPattern = /<thought>[\s\S]*?<\/thought>/gi;
  
  return thinkPattern.test(answer) || 
         reasoningPattern.test(answer) || 
         thoughtPattern.test(answer);
} 