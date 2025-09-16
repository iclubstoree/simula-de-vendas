// Script para limpar localStorage e corrigir problemas de tela em branco
// Execute este código no console do navegador (F12 -> Console)

console.log('🧹 Limpando localStorage...');

// Limpar dados específicos que podem causar conflito
const keysToRemove = [
  'cardMachines',
  'phoneModels',
  'tradeInDevices',
  'damageTypes',
  'stores'
];

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Removido: ${key}`);
});

console.log('🔄 Recarregue a página para aplicar as mudanças');
console.log('📝 Os dados serão reinicializados com o novo formato');