// app/api/export/docx/route.ts
import { NextRequest } from 'next/server';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

interface ExportData {
  product: {
    name?: string;
    description?: string;
    intended_use?: string;
    intended_user?: string;
    intended_environment?: string;
    patient_population?: string;
    operation_principle?: string;
  };
  results: Array<{
    tool: string;
    result: {
      resultKey: string;
      answers?: Record<string, 'yes' | 'no'>;
    };
  }>;
  exportDate: string;
  completionRate: number;
}

// Import des configs pour récupérer les vraies questions
import { mdConfig } from '@/lib/akrion-toolbox/mdQualification/mdConfig';
import { regulatoryConfig } from '@/lib/akrion-toolbox/regulatoryQualification/regulatoryConfig';
import { classificationConfig } from '@/lib/akrion-toolbox/classification/classificationConfig';
import { softwareSafetyConfig } from '@/lib/akrion-toolbox/softwareSafetyClass/softwareSafetyConfig';

function createFieldParagraphs(fields: [string, string][]): Paragraph[] {
  return fields.map(([label, value]) => 
    new Paragraph({
      children: [
        new TextRun({ text: `${label} : `, bold: true }),
        new TextRun({ text: value })
      ],
      spacing: { after: 100 }
    })
  );
}

function getToolName(toolId: string): string {
  const toolNames: Record<string, string> = {
    'qualification_dm': 'Qualification DM',
    'regulation': 'Règlement',
    'class_rule11': 'Classe (règle 11)',
    'software_safety': 'Sécurité logicielle'
  };
  return toolNames[toolId] || toolId;
}

// Récupère les vraies questions depuis la config d'un outil
function getToolQuestions(toolId: string): Record<string, string> {
  const configs: Record<string, any> = {
    'qualification_dm': mdConfig,
    'regulation': regulatoryConfig,
    'class_rule11': classificationConfig,
    'software_safety': softwareSafetyConfig
  };

  const config = configs[toolId];
  if (!config || !config.questions) return {};

  try {
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
  } catch (error) {
    console.warn(`Impossible de récupérer les questions pour ${toolId}:`, error);
    return {};
  }
}

// Formate les réponses avec les vraies questions
function formatAnswersWithQuestions(
  answers: Record<string, 'yes' | 'no'>,
  toolId: string
): Array<{ question: string; answer: string; key: string }> {
  const toolQuestions = getToolQuestions(toolId);
  
  return Object.entries(answers).map(([key, answer]) => ({
    key,
    question: toolQuestions[key] || key, // Fallback sur la clé si pas de question trouvée
    answer: answer === 'yes' ? 'Oui' : 'Non'
  }));
}

export async function POST(request: NextRequest) {
  try {
    const { data, filename }: { data: ExportData; filename: string } = await request.json();

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Fiche Produit - Analyse Réglementaire",
            heading: HeadingLevel.TITLE,
            spacing: { after: 400 },
            alignment: "center"
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Généré le ${data.exportDate}`,
                italics: true,
                color: "666666"
              })
            ],
            spacing: { after: 600 },
            alignment: "center"
          }),

          new Paragraph({
            text: "📋 Informations générales",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...createFieldParagraphs([
            ["Nom du produit", data.product.name || 'Non spécifié'],
            ["Description", data.product.description || 'Non spécifiée'],
            ["Usage prévu", data.product.intended_use || 'Non spécifié'],
            ["Utilisateur prévu", data.product.intended_user || 'Non spécifié'],
            ["Environnement prévu", data.product.intended_environment || 'Non spécifié'],
            ["Population de patients", data.product.patient_population || 'Non spécifiée'],
            ["Principe de fonctionnement", data.product.operation_principle || 'Non spécifié']
          ]),

          new Paragraph({
            text: "📊 Progression de l'analyse",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Taux de completion : ", bold: true }),
              new TextRun({ 
                text: `${data.completionRate}% (${data.results.length}/4 outils complétés)`,
                color: "0066CC"
              })
            ],
            spacing: { after: 300 }
          }),

          new Paragraph({
            text: "🔍 Résultats des analyses",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...data.results.flatMap(result => {
            const isCompleted = !!result.result;
            const toolName = getToolName(result.tool);
            
            const paragraphs = [
              new Paragraph({
                children: [
                  new TextRun({ text: toolName, bold: true, size: 24 }),
                  new TextRun({ 
                    text: ` - ${isCompleted ? 'Terminé' : 'En attente'}`,
                    color: isCompleted ? "00AA00" : "CC6600",
                    bold: true
                  })
                ],
                spacing: { before: 200, after: 100 }
              }),

              new Paragraph({
                children: [
                  new TextRun({ text: "Résultat : ", bold: true }),
                  new TextRun({ text: result.result.resultKey })
                ],
                spacing: { after: 100 }
              })
            ];

            if (result.result.answers && Object.keys(result.result.answers).length > 0) {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: "Réponses détaillées :", bold: true })
                  ],
                  spacing: { before: 100, after: 50 }
                })
              );

              // Utiliser les vraies questions formatées
              const formattedAnswers = formatAnswersWithQuestions(result.result.answers, result.tool);
              
              formattedAnswers.forEach(({ question, answer }) => {
                paragraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: `• ${question}: `, italics: true }),
                      new TextRun({ 
                        text: answer,
                        bold: true,
                        color: answer === 'Oui' ? "00AA00" : "CC0000"
                      })
                    ],
                    spacing: { after: 50 }
                  })
                );
              });
            }

            paragraphs.push(
              new Paragraph({
                text: "",
                spacing: { after: 200 }
              })
            );

            return paragraphs;
          }),

          new Paragraph({
            text: "",
            spacing: { before: 600 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Document généré automatiquement par Akrion App",
                italics: true,
                color: "666666"
              })
            ],
            alignment: "center"
          })
        ]
      }]
    });

    const buffer = await Packer.toBuffer(doc);

    // Convertir en ReadableStream
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(buffer);
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Erreur génération DOCX:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du DOCX' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}