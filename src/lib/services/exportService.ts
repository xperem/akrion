// lib/services/exportService.ts - VERSION FINALE
import { Product } from '@/types/akrion-app/product';
import { StoredResult } from '@/lib/utils/resultUtils';
import { TOOLS } from '@/lib/constants/tools';

export interface ExportData {
  product: Product & { id: string };
  results: StoredResult[];
  exportDate: string;
  completionRate: number;
}

export class ExportService {
  /**
   * Génère les données structurées pour l'export
   */
  static prepareExportData(
    product: Product & { id: string },
    results: StoredResult[]
  ): ExportData {
    return {
      product,
      results,
      exportDate: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      completionRate: Math.round((results.length / 4) * 100) // 4 outils au total
    };
  }

  /**
   * Export PDF avec Puppeteer
   */
  static async exportToPDF(data: ExportData): Promise<void> {
    try {
      const htmlContent = this.generateHTMLForPDF(data);
      
      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          html: htmlContent,
          filename: `fiche-produit-${this.sanitizeFilename(data.product.name || 'sans-nom')}.pdf`
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération du PDF');

      const blob = await response.blob();
      this.downloadBlob(blob, `fiche-produit-${this.sanitizeFilename(data.product.name || 'sans-nom')}.pdf`);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      throw error;
    }
  }

  /**
   * Export DOCX avec la bibliothèque docx
   */
  static async exportToDocx(data: ExportData): Promise<void> {
    try {
      const response = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          filename: `fiche-produit-${this.sanitizeFilename(data.product.name || 'sans-nom')}.docx`
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la génération du DOCX');

      const blob = await response.blob();
      this.downloadBlob(blob, `fiche-produit-${this.sanitizeFilename(data.product.name || 'sans-nom')}.docx`);
    } catch (error) {
      console.error('Erreur export DOCX:', error);
      throw error;
    }
  }

  /**
   * Récupère les vraies questions depuis la config d'un outil
   */
  private static getToolQuestions(toolId: string): Record<string, string> {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool || !tool.config) return {};

    try {
      const config = tool.config;
      
      if (config.questions) {
        const questions: Record<string, string> = {};
        
        Object.entries(config.questions).forEach(([key, questionObj]: [string, any]) => {
          if (questionObj && questionObj.text) {
            let questionText = questionObj.text;
            
            // Si c'est un array, on le joint
            if (Array.isArray(questionText)) {
              questionText = questionText.join(' ');
            }
            
            // Nettoyer le HTML basique pour l'export
            questionText = questionText
              .replace(/<br\s*\/?>/gi, ' ')
              .replace(/<strong>/gi, '')
              .replace(/<\/strong>/gi, '')
              .replace(/<em>/gi, '')
              .replace(/<\/em>/gi, '')
              .replace(/&nbsp;/gi, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            questions[key] = questionText;
          }
        });
        
        return questions;
      }

      return {};
    } catch (error) {
      console.warn(`Impossible de récupérer les questions pour ${toolId}:`, error);
      return {};
    }
  }

  /**
   * Formate les réponses avec les vraies questions
   */
  private static formatAnswersWithQuestions(
    answers: Record<string, 'yes' | 'no'>,
    toolId: string
  ): Array<{ question: string; answer: string; key: string }> {
    const toolQuestions = this.getToolQuestions(toolId);
    
    return Object.entries(answers).map(([key, answer]) => ({
      key,
      question: toolQuestions[key] || key, // Fallback sur la clé si pas de question trouvée
      answer: answer === 'yes' ? 'Oui' : 'Non'
    }));
  }

  /**
   * Génère du HTML optimisé pour PDF avec vraies questions
   */
  private static generateHTMLForPDF(data: ExportData): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2563eb; text-align: center;">Fiche Produit - Analyse Réglementaire</h1>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">Généré le ${data.exportDate}</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h2 style="color: #1e40af; margin-bottom: 15px;">📋 Informations générales</h2>
        <p><strong>Nom du produit :</strong> ${data.product.name || 'Non spécifié'}</p>
        <p><strong>Description :</strong> ${data.product.description || 'Non spécifiée'}</p>
        <p><strong>Usage prévu :</strong> ${data.product.intended_use || 'Non spécifié'}</p>
        <p><strong>Utilisateur prévu :</strong> ${data.product.intended_user || 'Non spécifié'}</p>
        <p><strong>Environnement prévu :</strong> ${data.product.intended_environment || 'Non spécifié'}</p>
        <p><strong>Population de patients :</strong> ${data.product.patient_population || 'Non spécifiée'}</p>
        <p><strong>Principe de fonctionnement :</strong> ${data.product.operation_principle || 'Non spécifié'}</p>
      </div>

      <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h2 style="color: #1e40af; margin-bottom: 15px;">📊 Progression</h2>
        <p><strong>Taux de completion :</strong> ${data.completionRate}%</p>
        <p><strong>Outils complétés :</strong> ${data.results.length}/4</p>
      </div>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
        <h2 style="color: #1e40af; margin-bottom: 15px;">🔍 Résultats</h2>
        ${data.results.map(result => {
          const formattedAnswers = this.formatAnswersWithQuestions(result.result.answers || {}, result.tool);
          const toolName = TOOLS.find(t => t.id === result.tool)?.label || result.tool;
          
          return `
          <div style="border-left: 3px solid #3b82f6; padding-left: 15px; margin: 15px 0; background: white; padding: 15px; border-radius: 6px;">
            <h3 style="color: #1e40af; margin-bottom: 5px;">${toolName}</h3>
            <p><strong>Résultat :</strong> ${result.result.resultKey}</p>
            ${formattedAnswers.length > 0 ? `
              <div style="margin-top: 15px;">
                <strong>Réponses détaillées :</strong>
                ${formattedAnswers.map(({ question, answer }) => 
                  `<div style="margin: 8px 0; padding: 8px; background: #f8f9fa; border-radius: 4px; border: 1px solid #e5e7eb;">
                    <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">${question}</div>
                    <div style="color: ${answer === 'Oui' ? '#059669' : '#dc2626'}; font-weight: bold;">→ ${answer}</div>
                  </div>`
                ).join('')}
              </div>
            ` : ''}
          </div>
          `;
        }).join('')}
      </div>

      <div style="text-align: center; margin-top: 40px; color: #666; font-size: 14px;">
        <p>Document généré automatiquement par Akrion App</p>
        <p>Analyse réglementaire des dispositifs médicaux</p>
      </div>
    </div>`;
  }

  /**
   * Nettoie le nom de fichier
   */
  private static sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  /**
   * Télécharge un blob
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}