/* --------------------------------------------------------------------------
 * Logique métier – Arbre MDCG 2019-11 v2.1  (mai 2023)
 * Définitions officielles tirées du MDR 2017/745
 * ------------------------------------------------------------------------ */
import {
  QuestionID,
  Question,
  ResultID,
  Result,
} from '@/types/mdQualification';

/* Questions séquentielles + définitions complètes */
export const questions: Record<QuestionID, Question> = {
  /* ─────────────────────────────── Q1 ─────────────────────────────── */
  Q1: {
    text: 'Le produit est-il un logiciel ?',
    hint:
      'Logiciel : “ensemble d’instructions pouvant être exécutées par un processeur” — incluant applications mobiles, web, embarquées, SaaS (MDCG 2019-11, §1.1).',
    yes: 'Q2',
    no: 'NOT_DM',
  },

  /* ─────────────────────────────── Q2 ─────────────────────────────── */
  Q2: {
    text: [
      'Est-ce un logiciel&nbsp;:',
      '• visé à l’<strong>Annexe XVI</strong> du MDR&nbsp;?',
      '• un <strong>accessoire</strong> de dispositif médical&nbsp;?',
      '• ou un logiciel <strong>influençant</strong> l’usage d’un DM physique&nbsp;?'
    ].join('<br/>'),

    hint: [
      /* Annexe XVI (texte condensé mais exhaustif) */
      '<strong>Annexe XVI – Produits sans finalité médicale réglementés comme DM :</strong>',
      '1. Lentilles de contact ou lentilles similaires (sauf correctives).',
      '2. Produits destinés à être totalement ou partiellement introduits dans le corps humain à des fins esthétiques (ex. implants sous-cutanés).',
      '3. Substances, combinaisons ou objets destinés au comblement facial ou autre implantation sous-cutanée.',
      '4. Équipements de liposuccion, lipolyse ou lipoplastie.',
      '5. Appareils à laser ou sources de lumière intense destinés à modifier l’aspect de la peau (tatouage, épilation, resurfaçage, etc.).',
      '6. Équipements de stimulation cérébrale électrique trans-crânienne.',
      '<br/>',

      /* Accessoire (art. 2(2)) */
      '<strong>Accessoire (art.&nbsp;2(2) MDR)</strong> : “un produit qui, sans être lui-même un DM, est destiné par son fabricant à permettre à un DM d’être utilisé conformément à sa destination ou à assister spécifiquement et directement sa fonction médicale”.',
      '<br/>',

      /* Logiciel influençant un DM */
      '<strong>Logiciel influençant un DM</strong> : logiciel qui modifie ou contrôle le fonctionnement d’un DM physique, par exemple en réglant automatiquement des paramètres thérapeutiques ou en déclenchant une action (MDCG 2019-11, §3.1).'
    ].join('<br/><br/>'),

    yes: 'DM',          // verdict direct
    no:  'Q3',
  },

  /* ─────────────────────────────── Q3 ─────────────────────────────── */
  Q3: {
    text: 'Exécute-t-il une action sur les données différente du simple stockage, archivage, communication ou recherche ?',
    hint:
      'Le traitement “simple” de données (stockage, transfert, compression sans interprétation) n’est pas considéré comme une action médicale (MDCG 2019-11, §3.2).',
    yes: 'Q4',
    no:  'NOT_DM',
  },

  /* ─────────────────────────────── Q4 ─────────────────────────────── */
  Q4: {
    text: 'L’action est-elle destinée au bénéfice de patients individuels ?',
    hint:
      'Un logiciel purement statistique ou administratif (bénéfice populationnel ou logistique) n’entre pas dans la définition de MDSW (MDCG 2019-11, §3.3).',
    yes: 'Q5',
    no:  'NOT_DM',
  },

  /* ─────────────────────────────── Q5 ─────────────────────────────── */
  Q5: {
    text: 'Le logiciel répond-il à la définition de “Dispositif Médical” (DM) ?',
    hint: [
  '<strong>Définition – Article 2(1) du Règlement (UE) 2017/745 :</strong>',
  'On entend par <em>« dispositif médical »</em>, tout instrument, appareil, équipement, logiciel, implant, réactif, matière ou autre article,',
  'destiné par le fabricant à être utilisé, seul ou en association, chez l’homme pour l’une ou plusieurs des fins médicales précises suivantes :',
  '— diagnostic, prévention, contrôle, prédiction, pronostic, traitement ou atténuation d’une maladie,',
  '— diagnostic, contrôle, traitement, atténuation d’une blessure ou d’un handicap ou compensation de ceux-ci,',
  '— investigation, remplacement ou modification d’une structure ou fonction anatomique ou d’un processus ou état physiologique ou pathologique,',
  '— communication d’informations au moyen d’un examen in vitro d’échantillons provenant du corps humain, y compris les dons d’organes, de sang et de tissus, et dont l’action principale voulue dans ou sur le corps humain n’est pas obtenue par des moyens pharmacologiques ou immunologiques ni par métabolisme, mais dont la fonction peut être assistée par de tels moyens.',
  '<br/>',
  'Les produits ci-après sont également réputés être des dispositifs médicaux :',
  '— les dispositifs destinés à la maîtrise de la conception ou à l’assistance à celle-ci,',
  '— les produits spécifiquement destinés au nettoyage, à la désinfection ou à la stérilisation des dispositifs visés à l’article 1er, paragraphe 4, et de ceux visés ci-dessus.',
].join('<br/>'),

    yes: 'DM',
    no:  'NOT_DM',
  },
};

/* Résultats finaux */
export const results: Record<ResultID, Result> = {
  DM: {
    verdict: 'Produit DM',
    message: '✅ Ce produit est considéré comme un Dispositif Médical Logiciel (MDSW) selon le règlement (UE) 2017/745 et la guidance MDCG 2019-11.',
    color:   'bg-green-50 border-green-200 text-green-800',
  },
  NOT_DM: {
    verdict: 'Produit non DM',
    message: '❌ Ce produit ne remplit pas les conditions pour être considéré comme un Dispositif Médical Logiciel au sens du MDR 2017/745.',
    color:   'bg-red-50 border-red-200 text-red-800',
  },
};

/* Numérotation pour l’UI */
export const getQuestionNumber = (q: QuestionID) =>
  ({ Q1: '1', Q2: '2', Q3: '3', Q4: '4', Q5: '5' }[q]);
