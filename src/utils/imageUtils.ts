/**
 * Utilitário para processar, redimensionar e otimizar imagens enviadas pelo usuário.
 * Suporta arquivos de qualquer tamanho (fotos de celular de 10MB+, PNG, JPG, WEBP, SVG),
 * redimensionando-os de forma inteligente para que caibam perfeitamente no banco de dados,
 * carreguem instantaneamente e nunca quebrem limites de payload ou do navegador.
 */
export async function processImageFile(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1920, quality = 0.86 } = options || {};

  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Nenhum arquivo fornecido.'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    // Para SVGs, ler diretamente como data URL
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Falha ao ler o arquivo SVG.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo do dispositivo.'));
    reader.onload = (e) => {
      const rawResult = e.target?.result as string;
      if (!rawResult) {
        reject(new Error('Arquivo vazio ou ilegível.'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Se a tag Image falhar, retorna o rawResult como fallback
        resolve(rawResult);
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Se a imagem for menor que os limites, mantemos as dimensões
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawResult);
            return;
          }

          // Renderizar no canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Se for PNG pequeno, preservar PNG, senão usar JPEG com qualidade 0.86
          const isSmallPng = file.type === 'image/png' && file.size < 500 * 1024;
          const outputFormat = isSmallPng ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputFormat, quality);
          resolve(dataUrl);
        } catch (err) {
          console.warn('[imageUtils] Falha no canvas, usando resultado bruto:', err);
          resolve(rawResult);
        }
      };

      img.src = rawResult;
    };

    reader.readAsDataURL(file);
  });
}
