import { Module, Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'b1',
    slug: 'welcome',
    title: 'Premier Pas',
    description: 'Bienvenue sur Remotion Academy AI. Prêt à coder des vidéos ?',
    icon: 'Sparkles',
    rarity: 'common'
  },
  {
    id: 'b2',
    slug: 'first_lesson',
    title: 'Esprit Curieux',
    description: 'Vous avez terminé votre toute première leçon théorique.',
    icon: 'BookOpen',
    rarity: 'common'
  },
  {
    id: 'b3',
    slug: 'quiz_master',
    title: 'Sans Faute',
    description: 'Vous avez obtenu un score parfait de 100% à un quiz de module.',
    icon: 'Award',
    rarity: 'rare'
  },
  {
    id: 'b4',
    slug: 'first_render',
    title: 'Monteur Virtuel',
    description: 'Vous avez généré votre tout premier rendu vidéo MP4 en direct.',
    icon: 'Video',
    rarity: 'common'
  },
  {
    id: 'b5',
    slug: 'data_wizard',
    title: 'Magicien de la Data',
    description: 'Vous avez validé le module sur les vidéos pilotées par les données.',
    icon: 'Database',
    rarity: 'epic'
  },
  {
    id: 'b6',
    slug: 'certified',
    title: 'Architecte Vidéo Certifié',
    description: 'Diplômé officiel de Remotion Academy avec validation IA de votre projet.',
    icon: 'Cpu',
    rarity: 'legendary'
  }
];

export const ACADEMY_MODULES: Module[] = [
  {
    id: 'm0',
    order: 0,
    title: 'Découvrir Remotion',
    description: 'Comprenez la révolution du "Video as Code" et comment React permet de générer des vidéos.',
    xpTotal: 80,
    lessons: [
      {
        id: 'm0-l1',
        moduleId: 'm0',
        order: 1,
        slug: 'introduction-remotion',
        title: 'Qu\'est-ce que Remotion ?',
        durationMinutes: 5,
        xp: 15,
        content: `### Qu'est-ce que Remotion ?

Remotion est une bibliothèque innovante qui permet aux développeurs de **créer des vidéos programmatiques en utilisant React**. Au lieu d'utiliser des logiciels de montage classiques avec une interface graphique de glisser-déposer (comme Premiere Pro, Final Cut ou CapCut), vous décrivez votre vidéo sous forme de composants React interactifs, stylisés avec du CSS (ou Tailwind CSS) et animés avec du code JavaScript.

#### Pourquoi faire de la vidéo par le code ?

*   **Automatisation absolue** : Générez des milliers de vidéos personnalisées à l'échelle (ex: vidéos personnalisées pour chaque utilisateur d'une application).
*   **Versionnage et collaboration** : Votre vidéo est du code. Elle peut être stockée sur GitHub, faire l'objet de Pull Requests et être versionnée de manière robuste.
*   **Précision ultime** : Les animations se basent sur des numéros de frames, ce qui garantit un rendu d'une fluidité et d'une précision chirurgicale.
*   **Réutilisabilité** : Créez des composants visuels réutilisables, des chartes graphiques de marque codées de manière uniforme.

#### Le Pipeline Remotion

Le processus de rendu se résume ainsi :
1.  **Développement** : Écriture de composants React dans votre projet.
2.  **Prévisualisation** : Utilisation du **Remotion Player** (une application web ou un widget) pour voir la vidéo en direct à 60 FPS.
3.  **Rendu** : Une commande CLI lance un navigateur sans tête (Chromium) qui prend une capture d'écran de chaque frame à grande vitesse, puis compile ces images en un fichier vidéo MP4 (à l'aide de FFmpeg).`
      },
      {
        id: 'm0-l2',
        moduleId: 'm0',
        order: 2,
        slug: 'pipeline-de-rendu',
        title: 'Le Pipeline de Rendu',
        durationMinutes: 6,
        xp: 15,
        content: `### Le Fonctionnement interne du Rendu

L'un des plus grands malentendus concernant Remotion est de penser qu'il s'agit d'un simple enregistreur d'écran. Ce n'est absolument pas le cas. Remotion utilise un pipeline d'exportation extrêmement robuste basé sur un navigateur moderne.

#### Comment FFmpeg et Puppeteer collaborent-ils ?

Lorsque vous lancez un rendu avec la commande \`npx remotion render\` :

1.  **Lancement de Puppeteer** : Remotion démarre une instance de Chromium en arrière-plan via la bibliothèque Puppeteer.
2.  **Navigation frame par frame** : Pour une vidéo à 30 images par seconde (FPS), Remotion ordonne au navigateur d'aller précisément à la frame 0, puis la frame 1, la frame 2, etc. Le temps système n'influence pas le rendu : même si une frame complexe prend 2 secondes à se charger, la vidéo finale sera parfaitement fluide sans saccade !
3.  **Captures d'écran temporaires** : Le navigateur exporte chaque frame sous forme d'image PNG ou JPEG haute résolution dans un dossier temporaire.
4.  **Multiplexage FFmpeg** : FFmpeg prend ensuite toutes ces images, les assemble, intègre la piste audio, et encode le tout dans un conteneur MP4 compressé avec le codec H.264.`
      },
      {
        id: 'm0-l3',
        moduleId: 'm0',
        order: 3,
        slug: 'cas-dusage-automatisation',
        title: 'Cas d\'usage & Automatisation',
        durationMinutes: 4,
        xp: 15,
        content: `### Les Cas d'Usage de Remotion dans le Monde Réel

L'automatisation vidéo est un marché en pleine explosion. Voici comment les entreprises et les développeurs exploitent la puissance de Remotion aujourd'hui :

#### 1. Vidéos Personnalisées (B2C & B2B)
Imaginez envoyer à chaque client une vidéo récapitulative de son année d'activité (comme le Spotify Wrapped). Avec Remotion, vous pouvez injecter les statistiques spécifiques d'un client (nom, heures d'écoute, graphiques) directement dans un template React, lancer un rendu automatique en arrière-plan, et lui envoyer son MP4 unique par e-mail en moins d'une minute !

#### 2. Génération de Contenu Automatique (Réseaux Sociaux)
Vous pouvez lier un flux de données (comme des actualités météo, des cours de bourse ou des offres d'emploi) à des templates Remotion. Un script cron se déclenche chaque matin, récupère les données, génère une vidéo de 15 secondes au format vertical, et la publie automatiquement sur TikTok, YouTube Shorts ou Instagram.

#### 3. Tableaux de Bord et Rapports Animés
Transformez des graphiques statiques ennuyeux en présentations vidéo animées haut de gamme pour des investisseurs ou des clients.`
      }
    ],
    quiz: {
      id: 'q0',
      moduleId: 'm0',
      questions: [
        {
          id: 'q0-1',
          statement: 'Sur quelle bibliothèque ou framework UI principal repose Remotion ?',
          options: ['Vue.js', 'React', 'Svelte', 'Angular'],
          correctAnswerIndex: 1,
          explanation: 'Remotion est conçu à 100% autour de React, exploitant ses composants et son cycle de vie pour structurer les scènes vidéo.'
        },
        {
          id: 'q0-2',
          statement: 'Quel logiciel est utilisé en arrière-plan par Remotion pour capturer chaque frame ?',
          options: ['VLC Media Player', 'OBS Studio', 'Un navigateur Chromium via Puppeteer', 'Adobe Media Encoder'],
          correctAnswerIndex: 2,
          explanation: 'Remotion pilote un navigateur Chromium sans tête (via Puppeteer) pour garantir un rendu pixel-perfect et précis de chaque image.'
        },
        {
          id: 'q0-3',
          statement: 'Quel outil open-source est utilisé par Remotion pour assembler les images et la piste audio en MP4 ?',
          options: ['FFmpeg', 'Docker', 'WebRTC', 'Blender'],
          correctAnswerIndex: 0,
          explanation: 'FFmpeg is the reference video tool used by Remotion for final composition rendering.'
        },
        {
          id: 'q0-4',
          statement: 'Pourquoi le temps de chargement d\'une frame complexe ne rend-il pas la vidéo finale saccadée ?',
          options: [
            'Parce que Remotion saute les images trop longues',
            'Parce que le navigateur fait un rendu asynchrone et attend que chaque frame soit entièrement chargée',
            'Parce que Remotion utilise la carte graphique pour forcer les 60 FPS',
            'C\'est faux, la vidéo sera saccadée'
          ],
          correctAnswerIndex: 1,
          explanation: 'Le rendu est asynchrone et découplé du temps réel. Remotion attend que chaque frame soit totalement chargée avant de prendre la photo, garantissant une fluidité absolue.'
        },
        {
          id: 'q0-5',
          statement: 'Lequel de ces cas d\'usage est une spécialité de Remotion ?',
          options: [
            'Le montage de films hollywoodiens à la main',
            'La génération de vidéos personnalisées à grande échelle basées sur des données',
            'La diffusion de flux de streaming en direct (live-streaming)',
            'Le développement de jeux vidéo 3D en temps réel'
          ],
          correctAnswerIndex: 1,
          explanation: 'La force absolue de Remotion est l\'automatisation et le "Data-driven video" (vidéos personnalisées à partir de fichiers JSON ou de requêtes API).'
        }
      ]
    }
  },
  {
    id: 'm1',
    order: 1,
    title: 'Installation et Premier Projet',
    description: 'Installez les outils requis, démarrez le template officiel et explorez sa structure.',
    xpTotal: 90,
    lessons: [
      {
        id: 'm1-l1',
        moduleId: 'm1',
        order: 1,
        slug: 'initialisation-template',
        title: 'Initialiser un projet Remotion',
        durationMinutes: 6,
        xp: 15,
        content: `### Initialisation et Configuration d'un Projet

Pour démarrer avec Remotion, vous devez avoir **Node.js** installé (version 16 ou supérieure recommandée) sur votre machine de développement.

#### La commande magique

Remotion fournit un utilitaire de création extrêmement pratique pour installer un template configuré avec TypeScript, Vite et Tailwind CSS :

\`MonProjetVideo\`

Lors de l'exécution de cette commande, vous serez invité à choisir plusieurs options :
1.  **Le template de départ** : Par défaut (recommandé), Tailwind CSS, ou d'autres variantes.
2.  **Le gestionnaire de paquets** : npm, pnpm, yarn ou bun.

#### Démarrer le Studio de prévisualisation

Une fois le dossier créé et les dépendances installées, naviguez dans le dossier et démarrez le serveur de développement :

\`\`\`bash
cd mon-projet-video
npm run start
\`\`\`

Cela ouvre le **Remotion Studio** dans votre navigateur par défaut à l'adresse \`http://localhost:3000\`. Le studio est une interface graphique fantastique qui vous permet d'inspecter vos compositions, de naviguer dans la timeline à l'aide d'un curseur temporel, et de voir vos modifications de code s'appliquer instantanément (Hot Module Replacement).`
      },
      {
        id: 'm1-l2',
        moduleId: 'm1',
        order: 2,
        slug: 'structure-des-fichiers',
        title: 'La Structure d\'un Projet Video-as-Code',
        durationMinutes: 5,
        xp: 15,
        content: `### Anatomie d'un Projet Remotion

Un projet Remotion ressemble à un projet React classique, mais possède des points d'entrée spécifiques. Voici les fichiers essentiels que vous trouverez à la racine :

#### 1. \`src/index.ts\` (Le point d'entrée)
C'est ici que Remotion enregistre vos compositions. Vous y trouverez l'appel à \`registerRoot()\` :

\`\`\`typescript
import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
\`\`\`

#### 2. \`src/Root.tsx\` (La déclaration des vidéos)
C'est dans ce fichier que vous déclarez toutes les compositions vidéo disponibles dans votre projet à l'aide du composant \`<Composition>\` :

\`\`\`tsx
import { Composition } from 'remotion';
import { MyVideo } from './MyVideo';

export const Root = () => {
  return (
    <Composition
      id="MaPremiereVideo"
      component={MyVideo}
      durationInFrames={150} // 5 secondes à 30fps
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
\`\`\`

#### 3. \`src/MyVideo.tsx\` (Le code visuel)
C'est ici que vit le code React qui dessine réellement votre vidéo. Vous pouvez y importer vos styles CSS globaux, utiliser des divs standards, des images, et implémenter vos animations.`,
        exercise: {
          id: 'ex1',
          lessonId: 'm1-l2',
          title: 'Mon Premier Template Remotion',
          instructions: 'Modifiez la composition ci-dessous pour que le titre de la vidéo affiche "Hello Remotion Academy!" au lieu du texte d\'exemple, et assurez-vous que la couleur de fond soit un dégradé bleu nuit (bg-gradient-to-br from-indigo-950 to-slate-900).',
          codeInitial: `import { AbsoluteFill } from 'remotion';\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-slate-900 flex items-center justify-center">\n      <h1 className="text-white text-5xl font-bold tracking-tight">\n        Texte d'exemple à modifier\n      </h1>\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill } from 'remotion';\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">\n      <h1 className="text-white text-5xl font-bold tracking-tight">\n        Hello Remotion Academy!\n      </h1>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex1-c1',
              description: 'Le titre doit contenir "Hello Remotion Academy!"',
              pattern: 'Hello\\s+Remotion\\s+Academy\\s*!',
              message: 'Le titre H1 n\'a pas été modifié avec le texte exact attendu : "Hello Remotion Academy!"'
            },
            {
              id: 'ex1-c2',
              description: 'La classe de fond doit utiliser le dégradé "bg-gradient-to-br from-indigo-950 to-slate-900"',
              pattern: 'bg-gradient-to-br\\s+from-indigo-950\\s+to-slate-900',
              message: 'Veuillez appliquer la classe Tailwind de dégradé demandée pour l\'arrière-plan.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q1',
      moduleId: 'm1',
      questions: [
        {
          id: 'q1-1',
          statement: 'Quelle commande CLI permet de générer instantanément un projet Remotion prêt à l\'emploi ?',
          options: ['npm install remotion', 'npx create-video mon-projet', 'npm init remotion-app', 'npx remotion-studio init'],
          correctAnswerIndex: 1,
          explanation: 'La commande "npx create-video" télécharge le générateur officiel et configure un projet de manière optimale.'
        },
        {
          id: 'q1-2',
          statement: 'Quel composant Remotion capital permet de configurer les dimensions, le FPS et la durée d\'une vidéo ?',
          options: ['<VideoConfig>', '<Timeline>', '<Composition>', '<VideoSettings>'],
          correctAnswerIndex: 2,
          explanation: 'Le composant <Composition> sert à déclarer une vidéo et à définir ses métadonnées clés (id, fps, dimensions, composant à rendre).'
        },
        {
          id: 'q1-3',
          statement: 'Si une composition est configurée à 30 FPS, combien de frames (durée) représentent une vidéo de 10 secondes ?',
          options: ['30 frames', '100 frames', '300 frames', '3000 frames'],
          correctAnswerIndex: 2,
          explanation: 'Le calcul est : FPS * secondes. Donc 30 * 10 = 300 frames.'
        },
        {
          id: 'q1-4',
          statement: 'Où se situe la fonction registerRoot() qui connecte le code source au compilateur Remotion ?',
          options: ['src/Root.tsx', 'src/index.ts ou src/index.tsx', 'package.json', 'vite.config.ts'],
          correctAnswerIndex: 1,
          explanation: 'registerRoot() se situe dans le fichier d\'entrée principal (index.ts) pour enregistrer le composant racine.'
        }
      ]
    }
  },
  {
    id: 'm2',
    order: 2,
    title: 'Compositions, Timeline et Frames',
    description: 'Maîtrisez la notion de frame, l\'orchestration temporelle avec Sequence, et l\'accès aux configurations.',
    xpTotal: 100,
    lessons: [
      {
        id: 'm2-l1',
        moduleId: 'm2',
        order: 1,
        slug: 'composition-metadata',
        title: 'useCurrentFrame et useVideoConfig',
        durationMinutes: 7,
        xp: 20,
        content: `### Les Hooks Fondamentaux de Remotion

Pour animer des éléments en fonction du temps, vous devez connaître à quelle image (frame) vous vous situez actuellement, ainsi que la configuration globale de la vidéo (dimensions, FPS, durée). Remotion met à disposition deux hooks magiques pour cela.

#### 1. \`useCurrentFrame()\`
Ce hook renvoie un nombre entier représentant **la frame active actuellement affichée par le player**. Elle commence à 0 et s'incrémente de 1 à chaque frame.
C'est le carburant de toutes vos animations !

\`\`\`tsx
import { useCurrentFrame } from 'remotion';

export const MyComponent = () => {
  const frame = useCurrentFrame();
  return <div className="text-white">Frame actuelle : {frame}</div>;
};
\`\`\`

#### 2. \`useVideoConfig()\`
Ce hook retourne un objet contenant la configuration déclarée dans votre composant \`<Composition>\`. Cela permet d'éviter de coder des valeurs en dur.

\`\`\`tsx
import { useVideoConfig } from 'remotion';

export const MyComponent = () => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const durationInSeconds = durationInFrames / fps;

  return (
    <div className="text-white">
      Cette vidéo fait {width}x{height} pixels et dure {durationInSeconds}s.
    </div>
  );
};
\`\`\`

En combinant \`frame / durationInFrames\` ou \`frame / fps\`, vous pouvez calculer des pourcentages de progression de l'animation en temps réel !`
      },
      {
        id: 'm2-l2',
        moduleId: 'm2',
        order: 2,
        slug: 'sequences-orchestration',
        title: 'Sequence pour orchestrer les scènes',
        durationMinutes: 8,
        xp: 20,
        content: `### L'Orchestration Temporelle avec \`<Sequence>\`

Dans un logiciel de montage classique, vous placez des blocs de clips sur des pistes différentes à des moments précis. Dans Remotion, vous utilisez le composant magique \`<Sequence>\` pour accomplir exactement cela.

#### Qu'est-ce qu'une \`Sequence\` ?

Une \`<Sequence>\` est un conteneur qui isole temporellement et spatialement ses enfants. Elle prend deux propriétés fondamentales :
*   \`from\` : La frame de départ à laquelle la séquence apparaît.
*   \`durationInFrames\` : La durée pendant laquelle la séquence reste active.

\`\`\`tsx
import { Sequence } from 'remotion';
import { Title } from './Title';
import { Description } from './Description';

export const MyVideo = () => {
  return (
    <div className="bg-slate-900 w-full h-full text-white">
      {/* Cette séquence démarre à l'image 0 et dure 60 images (2s à 30fps) */}
      <Sequence from={0} durationInFrames={60}>
        <Title />
      </Sequence>

      {/* Cette séquence démarre à l'image 60 (quand l'autre s'arrête) */}
      <Sequence from={60} durationInFrames={90}>
        <Description />
      </Sequence>
    </div>
  );
};
\`\`\`

#### Le Super-pouvoir du Temps Relatif

C'est la fonctionnalité clé de \`<Sequence>\` : **à l'intérieur de la séquence, \`useCurrentFrame()\` redémarre à 0 !**
Cela signifie que si votre composant \`<Title />\` possède une animation d'entrée qui dure 15 frames en commençant à la frame 0, vous pouvez le décaler à la frame 100 dans votre timeline générale en l'enveloppant simplement d'une \`<Sequence from={100}>\`. Son animation démarrera exactement à la frame 100 sans que vous ayez à modifier le code interne de \`<Title />\`.`,
        exercise: {
          id: 'ex2',
          lessonId: 'm2-l2',
          title: 'Orchestration avec Sequence',
          instructions: 'Construisez une timeline de deux scènes. Enveloppez les composants <Intro> et <Outro> dans des balises <Sequence> distinctes : l\'Intro commence à la frame 0 et dure 45 frames, tandis que l\'Outro commence précisément à la frame 45 et dure 60 frames.',
          codeInitial: `import { AbsoluteFill, Sequence } from 'remotion';\n\nconst Intro = () => (\n  <div className="text-emerald-400 text-4xl font-bold">Introduction</div>\n);\n\nconst Outro = () => (\n  <div className="text-orange-400 text-4xl font-bold">Fin de la vidéo</div>\n);\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-slate-900 flex flex-col items-center justify-center">\n      {/* Enveloppez les deux composants ci-dessous avec Sequence en respectant les consignes */}\n      <Intro />\n      <Outro />\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill, Sequence } from 'remotion';\n\nconst Intro = () => (\n  <div className="text-emerald-400 text-4xl font-bold">Introduction</div>\n);\n\nconst Outro = () => (\n  <div className="text-orange-400 text-4xl font-bold">Fin de la vidéo</div>\n);\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-slate-900 flex flex-col items-center justify-center">\n      <Sequence from={0} durationInFrames={45}>\n        <Intro />\n      </Sequence>\n      <Sequence from={45} durationInFrames={60}>\n        <Outro />\n      </Sequence>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex2-c1',
              description: 'La première Sequence doit démarrer à from={0} et durationInFrames={45}',
              pattern: 'Sequence\\s+from=\\{\\s*0\\s*\\}\\s+durationInFrames=\\{\\s*45\\s*\\}',
              message: 'L\'Intro doit être enveloppée dans une Sequence démarrant à la frame 0 pour une durée de 45.'
            },
            {
              id: 'ex2-c2',
              description: 'La deuxième Sequence doit démarrer à from={45} et durationInFrames={60}',
              pattern: 'Sequence\\s+from=\\{\\s*45\\s*\\}\\s+durationInFrames=\\{\\s*60\\s*\\}',
              message: 'L\'Outro doit être enveloppée dans une Sequence démarrant à la frame 45 pour une durée de 60.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q2',
      moduleId: 'm2',
      questions: [
        {
          id: 'q2-1',
          statement: 'Que renvoie précisément le hook useCurrentFrame() ?',
          options: [
            'L\'heure locale en millisecondes',
            'Un index numérique entier de l\'image actuellement rendue (démarre à 0)',
            'Le nombre total d\'images dans la vidéo',
            'Un objet contenant la configuration vidéo'
          ],
          correctAnswerIndex: 1,
          explanation: 'useCurrentFrame() renvoie l\'index de l\'image courante, qui commence à 0 et progresse d\'une unité par frame.'
        },
        {
          id: 'q2-2',
          statement: 'À quoi sert useVideoConfig() ?',
          options: [
            'À démarrer ou mettre en pause la vidéo',
            'À modifier la résolution de l\'exportation dynamiquement',
            'À lire les métadonnées de la composition parente (fps, largeur, hauteur, durée)',
            'À charger des musiques ou des fichiers audio'
          ],
          correctAnswerIndex: 2,
          explanation: 'useVideoConfig() donne accès à la configuration statique de la composition dans laquelle le composant est exécuté.'
        },
        {
          id: 'q2-3',
          statement: 'Quelle est la particularité temporelle de useCurrentFrame() à l\'intérieur d\'un composant enveloppé dans une <Sequence from={50}> ?',
          options: [
            'Elle commence à 50',
            'Elle est négative jusqu\'à l\'image 50',
            'Elle redémarre à 0 à partir du moment où la séquence s\'active',
            'Elle est doublée pour aller plus vite'
          ],
          correctAnswerIndex: 2,
          explanation: 'Le temps devient local et relatif. Dans la Sequence, la frame 50 absolue de la timeline équivaut à la frame 0 locale.'
        },
        {
          id: 'q2-4',
          statement: 'Lequel de ces attributs n\'appartient PAS au composant <Sequence> ?',
          options: ['from', 'durationInFrames', 'component', 'layout'],
          correctAnswerIndex: 2,
          explanation: 'L\'attribut "component" est utilisé dans la <Composition>, mais pas dans la <Sequence>. Une séquence reçoit ses enfants de manière classique (children).'
        }
      ]
    }
  },
  {
    id: 'm3',
    order: 3,
    title: 'Animations : interpolate et spring',
    description: 'Créez des animations fluides, physiques ou mathématiques à l\'aide de fonctions avancées.',
    xpTotal: 100,
    lessons: [
      {
        id: 'm3-l1',
        moduleId: 'm3',
        order: 1,
        slug: 'interpolate-math',
        title: 'Maîtriser interpolate()',
        durationMinutes: 8,
        xp: 20,
        content: `### La magie de \`interpolate()\`

Dans le montage traditionnel, vous définissez des keyframes : "À 1 seconde, l'opacité est 0, à 2 secondes elle est 1". Dans Remotion, vous faites cela de manière mathématique et puissante grâce à la fonction \`interpolate()\`.

#### Syntaxe de base

\`\`\`typescript
import { interpolate } from 'remotion';

const outputValue = interpolate(
  frame,          // 1. La variable d'entrée (souvent la frame courante)
  [inputRange],   // 2. L'intervalle des frames d'entrée [début, fin]
  [outputRange],  // 3. L'intervalle des valeurs de sortie correspondantes
  options         // 4. Options d'extrapolations (facultatif)
);
\`\`\`

#### Exemple concret : Un fondu et zoom

Imaginons que nous voulons qu'un titre apparaisse en fondu (opacité de 0 à 1) et grandisse (échelle de 0.8 à 1.0) entre la frame 0 et la frame 20 :

\`\`\`tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const MyTitle = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp', // Bloque la valeur à 1 après la frame 20
  });

  const scale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <h1 style={{ opacity, transform: \`scale(\${scale})\` }} className="text-white text-6xl">
      Mon Titre Animé
    </h1>
  );
};
\`\`\`

#### Pourquoi l'option \`extrapolateRight: 'clamp'\` est-elle essentielle ?
Sans \`clamp\`, si la frame continue de grandir (ex: frame 40), Remotion va extrapoler de manière linéaire. L'opacité continuerait à monter au-delà de 1 et l'échelle continuerait de grandir à l'infini ! Le \`clamp\` permet de verrouiller la valeur de sortie une fois la borne atteinte.`,
        exercise: {
          id: 'ex3',
          lessonId: 'm3-l1',
          title: 'Animation interactive avec interpolate',
          instructions: 'Dans la composition ci-dessous, utilisez le hook useCurrentFrame pour calculer une opacité qui passe de 0 (frame 0) à 1 (frame 30), en utilisant interpolate avec option de verrouillage (extrapolateRight: "clamp").',
          codeInitial: `import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';\n\nexport const MyVideo = () => {\n  const frame = useCurrentFrame();\n  \n  // Calculez l'opacité ici avec interpolate() de la frame 0 à 30\n  const opacity = 1;\n\n  return (\n    <AbsoluteFill className="bg-slate-900 flex items-center justify-center">\n      <div \n        style={{ opacity }}\n        className="text-white text-5xl font-semibold bg-blue-600 px-8 py-4 rounded-xl"\n      >\n        Entrée en Fondu\n      </div>\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';\n\nexport const MyVideo = () => {\n  const frame = useCurrentFrame();\n  \n  const opacity = interpolate(frame, [0, 30], [0, 1], {\n    extrapolateRight: 'clamp',\n  });\n\n  return (\n    <AbsoluteFill className="bg-slate-900 flex items-center justify-center">\n      <div \n        style={{ opacity }}\n        className="text-white text-5xl font-semibold bg-blue-600 px-8 py-4 rounded-xl"\n      >\n        Entrée en Fondu\n      </div>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex3-c1',
              description: 'interpolate() doit être appelé avec frame, les plages [0, 30] et [0, 1]',
              pattern: 'interpolate\\(\\s*frame,\\s*\\[\\s*0,\\s*30\\s*\\],\\s*\\[\\s*0,\\s*1\\s*\\]',
              message: 'L\'opacité doit évoluer linéairement de 0 à 1 entre les frames 0 et 30.'
            },
            {
              id: 'ex3-c2',
              description: 'extrapolateRight doit être défini sur "clamp"',
              pattern: 'extrapolateRight:\\s*[\'"]clamp[\'"]',
              message: 'Vous devez appliquer l\'option de "clamp" pour figer l\'opacité à 1 après la frame 30.'
            }
          ]
        }
      },
      {
        id: 'm3-l2',
        moduleId: 'm3',
        order: 2,
        slug: 'spring-animations',
        title: 'Animations physiques avec spring()',
        durationMinutes: 8,
        xp: 20,
        content: `### Des Mouvements Naturels avec \`spring()\`

Les animations linéaires calculées avec \`interpolate()\` peuvent paraître rigides ou artificielles. Pour créer des animations modernes, rebondissantes, fluides et professionnelles, vous devez utiliser la physique des ressorts avec la fonction \`spring()\`.

#### Comment fonctionne \`spring()\` ?

La fonction \`spring()\` de Remotion simule une véritable équation physique de ressort à partir de la frame courante et de la configuration du ressort (tension, frottement, masse). Elle renvoie toujours une valeur évoluant de **0 à 1**.

#### Syntaxe de base

\`\`\`typescript
import { spring, useVideoConfig, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const progress = spring({
  frame,
  fps,
  config: {
    damping: 12,   // Frottement (plus bas = plus de rebonds)
    stiffness: 100, // Raideur du ressort (plus haut = plus rapide)
    mass: 1,       // Masse de l'élément (plus haut = plus d'inertie)
  }
});
\`\`\`

#### Exemple d'utilisation pour déplacer un élément

Vous pouvez utiliser le résultat \`progress\` (0 à 1) à l'intérieur d'un interpolateur pour piloter une translation en pixels :

\`\`\`tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scaleProgress = spring({ frame, fps, config: { damping: 10 } });
const scale = interpolate(scaleProgress, [0, 1], [0.5, 1.2]); // Rebondit jusqu'à 1.2 puis revient à 1
\`\`\``
      }
    ],
    quiz: {
      id: 'q3',
      moduleId: 'm3',
      questions: [
        {
          id: 'q3-1',
          statement: 'À quoi sert l\'option extrapolateRight: "clamp" dans la fonction interpolate() ?',
          options: [
            'À accélérer l\'animation',
            'À forcer la valeur de sortie à rester verrouillée à son niveau maximal une fois la borne dépassée',
            'À boucler l\'animation indéfiniment',
            'À supprimer la piste audio'
          ],
          correctAnswerIndex: 1,
          explanation: '"clamp" empêche la valeur de s\'extrapoler de manière linéaire en dehors des bornes spécifiées, ce qui évite les comportements imprévus.'
        },
        {
          id: 'q3-2',
          statement: 'Quels sont les paramètres de configuration fondamentaux de la physique de spring() ?',
          options: [
            'red, green, blue',
            'stiffness (raideur), damping (frottement), mass (masse)',
            'from, to, duration',
            'width, height, ratio'
          ],
          correctAnswerIndex: 1,
          explanation: 'La physique de spring() repose sur un modèle mécanique composé d\'une raideur (stiffness), d\'un amortissement (damping), et d\'une masse.'
        },
        {
          id: 'q3-3',
          statement: 'Quelle est la plage de valeurs par défaut renvoyée par la fonction spring() ?',
          options: ['De 0 à 100', 'De -1 à 1', 'De 0 à 1', 'De 0 à l\'infini'],
          correctAnswerIndex: 2,
          explanation: 'La fonction spring() normalise l\'évolution du ressort entre 0 (départ) et 1 (équilibre final).'
        }
      ]
    }
  },
  {
    id: 'm4',
    order: 4,
    title: 'Médias : images, audio et vidéo',
    description: 'Importez des visuels externes, gérez la synchronisation de la musique et l\'intégration de fichiers vidéo.',
    xpTotal: 100,
    lessons: [
      {
        id: 'm4-l1',
        moduleId: 'm4',
        order: 1,
        slug: 'remotion-medias',
        title: 'Intégration d\'Images et d\'Audio',
        durationMinutes: 6,
        xp: 20,
        content: `### Importer et Intégrer des Assets Externes

Un montage vidéo réussi nécessite souvent l'utilisation d'images d'arrière-plan, de logos et d'une piste sonore ou musicale. Remotion propose des composants optimisés pour cela qui s'utilisent à la place de leurs équivalents HTML standards.

#### 1. Le composant \`<Img>\`

Pour afficher des images, utilisez \`<Img>\` de Remotion au lieu de \`<img>\`. Il est conçu pour être géré de manière asynchrone par Puppeteer, évitant ainsi que le navigateur ne prenne une frame blanche si l'image n'était pas entièrement chargée.

\`\`\`tsx
import { Img, staticFile } from 'remotion';

export const Logo = () => {
  return (
    <Img 
      src={staticFile("logo.png")} // staticFile fait référence au dossier /public
      className="w-32 h-32"
    />
  );
};
\`\`\`

#### 2. Le composant \`<Audio>\`

Pour ajouter de la musique ou des voix off, utilisez le composant \`<Audio>\`. Remotion prend en charge une gestion extrêmement précise de l'audio : FFmpeg extraira la piste sonore et la synchronisera avec vos animations pixel-perfect au moment de l'exportation.

\`\`\`tsx
import { Audio, staticFile } from 'remotion';

export const VideoWithMusic = () => {
  return (
    <div>
      <Audio 
        src={staticFile("ambient.mp3")}
        volume={0.5} // Ajuste le volume de 0 (muet) à 1 (max)
      />
      {/* Reste de vos visuels... */}
    </div>
  );
};
\`\`\`

Vous pouvez décaler l'audio dans le temps en l'enveloppant dans une \`<Sequence from={30}>\` pour ne lancer la musique qu'au bout de 1 seconde !`,
        exercise: {
          id: 'ex4',
          lessonId: 'm4-l1',
          title: 'Slideshow et Musique de Fond',
          instructions: 'Créez une composition qui intègre une piste audio de fond appelée "background.mp3" à l\'aide du composant <Audio> de Remotion, importée de staticFile.',
          codeInitial: `import { AbsoluteFill, Audio, Img, staticFile } from 'remotion';\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-slate-950 flex items-center justify-center">\n      {/* Insérez le composant Audio pointant vers "background.mp3" ici */}\n      <div className="text-white text-3xl">Visualiseur Audio</div>\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill, Audio, Img, staticFile } from 'remotion';\n\nexport const MyVideo = () => {\n  return (\n    <AbsoluteFill className="bg-slate-950 flex items-center justify-center">\n      <Audio src={staticFile("background.mp3")} />\n      <div className="text-white text-3xl">Visualiseur Audio</div>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex4-c1',
              description: 'Le composant <Audio> doit être présent dans le code',
              pattern: '<Audio',
              message: 'Vous devez insérer le composant <Audio> pour activer le support sonore de votre vidéo.'
            },
            {
              id: 'ex4-c2',
              description: 'L\'attribut src doit utiliser staticFile("background.mp3")',
              pattern: 'src=\\{\\s*staticFile\\(\\s*["\']background\\.mp3["\']\\s*\\)\\s*\\}',
              message: 'L\'Audio doit pointer sur la source "background.mp3" enveloppée par staticFile().'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q4',
      moduleId: 'm4',
      questions: [
        {
          id: 'q4-1',
          statement: 'Pourquoi est-il recommandé d\'utiliser le composant <Img> au lieu de la balise HTML classique <img> ?',
          options: [
            'Parce que <Img> est deux fois plus petit',
            'Pour s\'assurer que l\'image est totalement chargée dans le navigateur de rendu Puppeteer avant de capturer la frame',
            'Pour pouvoir lire des vidéos dans l\'image',
            'Ce composant n\'existe pas'
          ],
          correctAnswerIndex: 1,
          explanation: 'Le composant <Img> est optimisé pour bloquer temporairement la capture si l\'image externe est en cours de téléchargement, évitant des artefacts de frames blanches.'
        },
        {
          id: 'q4-2',
          statement: 'Comment faire référence à un fichier local situé dans le dossier /public d\'un projet Remotion ?',
          options: ['src="./public/file.mp3"', 'src={staticFile("file.mp3")}', 'src={importFile("file.mp3")}', 'src="/file.mp3"'],
          correctAnswerIndex: 1,
          explanation: 'La fonction utilitaire staticFile() calcule dynamiquement le chemin correct des assets publics en local comme sur le cloud lors du rendu.'
        }
      ]
    }
  },
  {
    id: 'm5',
    order: 5,
    title: 'Vidéos pilotées par les données',
    description: 'Personnalisez vos vidéos en masse grâce aux props de compositions et à calculateMetadata.',
    xpTotal: 100,
    lessons: [
      {
        id: 'm5-l1',
        moduleId: 'm5',
        order: 1,
        slug: 'data-driven-video',
        title: 'Props et calculateMetadata',
        durationMinutes: 7,
        xp: 20,
        content: `### Le Cœur de l'Automatisation Vidéo

C'est ici que Remotion surclasse n'importe quel logiciel de montage vidéo. Puisque votre vidéo est générée par du code React, vous pouvez **passer des variables (props) à votre composition**, exactement comme vous le feriez pour un composant React de tableau de bord !

#### 1. Déclarer des Props par Défaut

Pour que votre composition fonctionne dans l'éditeur (Remotion Studio) et pour donner un exemple de données, vous déclarez des \`defaultProps\` dans votre fichier \`Root.tsx\` :

\`\`\`tsx
export const Root = () => {
  return (
    <Composition
      id="VideoPersonnalisee"
      component={MyVideo}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        userName: "Marc Antoine",
        score: 95,
      }}
    />
  );
};
\`\`\`

#### 2. Consommer les Props dans le Composant

Dans votre composant vidéo, vous recevez ces props de manière classique et les affichez dans vos balises React :

\`\`\`tsx
interface VideoProps {
  userName: string;
  score: number;
}

export const MyVideo: React.FC<VideoProps> = ({ userName, score }) => {
  return (
    <AbsoluteFill className="bg-indigo-900 flex items-center justify-center text-white">
      <h1>Félicitations {userName} !</h1>
      <p>Votre score est de {score} points !</p>
    </AbsoluteFill>
  );
};
\`\`\`

#### 3. Passer des Props dynamiques lors du Rendu

Lors de l'exportation, vous pouvez écraser ces valeurs de props par défaut en passant un fichier JSON ou une chaîne de caractères via la ligne de commande CLI :

\`\`\`bash
npx remotion render VideoPersonnalisee --props='{"userName": "Franck", "score": 100}'
\`\`\`

Remotion va compiler instantanément un nouveau fichier MP4 avec les données du nouvel utilisateur ! C'est le principe fondamental de l'automatisation de masse.`,
        exercise: {
          id: 'ex5',
          lessonId: 'm5-l1',
          title: 'Personnalisation dynamique',
          instructions: 'Dans la vidéo ci-dessous, modifiez le code pour utiliser la prop "productName" au lieu du texte statique d\'exemple. Le composant reçoit déjà productName en tant que prop React.',
          codeInitial: `import { AbsoluteFill } from 'remotion';\n\ninterface VideoProps {\n  productName: string;\n}\n\nexport const MyVideo: React.FC<VideoProps> = ({ productName }) => {\n  return (\n    <AbsoluteFill className="bg-indigo-950 flex flex-col items-center justify-center text-white">\n      <div className="text-sm uppercase tracking-widest text-indigo-400">Offre du jour</div>\n      <h1 className="text-5xl font-bold mt-2">\n        Acheter un Produit d'exemple\n      </h1>\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill } from 'remotion';\n\ninterface VideoProps {\n  productName: string;\n}\n\nexport const MyVideo: React.FC<VideoProps> = ({ productName }) => {\n  return (\n    <AbsoluteFill className="bg-indigo-950 flex flex-col items-center justify-center text-white">\n      <div className="text-sm uppercase tracking-widest text-indigo-400">Offre du jour</div>\n      <h1 className="text-5xl font-bold mt-2">\n        Acheter un {productName}\n      </h1>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex5-c1',
              description: 'Le code doit inclure la prop dynamique {productName}',
              pattern: '\\{\\s*productName\\s*\\}',
              message: 'Vous devez remplacer le texte "Produit d\'exemple" par l\'expression JavaScript React {productName}.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q5',
      moduleId: 'm5',
      questions: [
        {
          id: 'q5-1',
          statement: 'Comment définit-on des props de secours ou d\'exemple pour l\'éditeur Remotion Studio ?',
          options: [
            'Dans un fichier .env uniquement',
            'En utilisant la propriété defaultProps du composant <Composition>',
            'En codant en dur dans le composant final',
            'Ce n\'est pas possible'
          ],
          correctAnswerIndex: 1,
          explanation: 'defaultProps permet d\'injecter des valeurs d\'exemples dans l\'interface graphique du Studio pour prévisualiser la vidéo.'
        },
        {
          id: 'q5-2',
          statement: 'Comment écraser les props par défaut lors d\'un rendu en ligne de commande (CLI) ?',
          options: [
            'En modifiant le code source avant chaque rendu',
            'En utilisant le drapeau --props de la commande CLI de rendu',
            'En relançant npx create-video',
            'On ne peut pas écraser les props en production'
          ],
          correctAnswerIndex: 2,
          explanation: 'Le drapeau --props de la ligne de commande (qui accepte un chemin de fichier JSON ou une chaîne JSON brute) permet d\'injecter des données dynamiques au moment précis du rendu.'
        }
      ]
    }
  },
  {
    id: 'm6',
    order: 6,
    title: 'Rendu et industrialisation',
    description: 'Exportez vos projets localement ou configurez une infrastructure hautement évolutive basée sur le cloud (Remotion Lambda).',
    xpTotal: 100,
    lessons: [
      {
        id: 'm6-l1',
        moduleId: 'm6',
        order: 1,
        slug: 'rendering-industrialisation',
        title: 'Le Rendu en CLI et Cloud',
        durationMinutes: 8,
        xp: 20,
        content: `### Rendu Local vs Rendu Cloud Lambda

Une fois que votre vidéo React est programmée et qu'elle fonctionne parfaitement dans le Studio, l'étape finale consiste à l'exporter sous forme de fichier MP4.

#### 1. Le Rendu Local (Ligne de commande CLI)

C'est la méthode la plus simple, idéale pour un usage individuel ou semi-régulier. Elle utilise les ressources de votre machine locale.

\`\`\`bash
npx remotion render MaPremiereVideo out.mp4
\`\`\`

Remotion va compiler le projet avec Vite, lancer Chromium localement, enregistrer chaque image et utiliser FFmpeg pour produire le fichier \`out.mp4\` final.

#### 2. Le Rendu Cloud (Remotion Lambda)

Si vous devez générer des centaines ou des milliers de vidéos personnalisées en même temps (ex: immédiatement après que vos utilisateurs cliquent sur un bouton de votre site web), la méthode locale montre rapidement ses limites de vitesse et de puissance CPU.

**Remotion Lambda** est la solution d'industrialisation officielle. Elle déploie votre projet vidéo dans des fonctions **AWS Lambda** hautement scalables.

*   **Parallélisation massive** : Vous pouvez lancer 100 rendus en même temps. Chacun s'exécute de manière isolée sur AWS en quelques secondes !
*   **Coûts à l'usage** : Vous ne payez que les millisecondes d'exécution réelles sur AWS.
*   **Vitesse phénoménale** : Un rendu qui prendrait 10 minutes sur votre ordinateur peut être "splitté" sur 10 lambdas différentes travaillant en parallèle sur des segments de 10 secondes, ramenant le temps de rendu final à moins de 30 secondes !`,
        exercise: {
          id: 'ex6',
          lessonId: 'm6-l1',
          title: 'Commande de rendu',
          instructions: 'Donnez le nom de la commande CLI officielle pour lancer le rendu d\'une composition identifiée par "Promo" dans un fichier de sortie nommé "teaser.mp4". Écrivez la commande complète ci-dessous.',
          codeInitial: `// Écrivez la commande de rendu sous forme de chaîne de caractères\nexport const renderCommand = "npx remotion ...";`,
          codeSolution: `// Écrivez la commande de rendu sous forme de chaîne de caractères\nexport const renderCommand = "npx remotion render Promo teaser.mp4";`,
          validationCriteria: [
            {
              id: 'ex6-c1',
              description: 'La commande doit utiliser "npx remotion render Promo teaser.mp4"',
              pattern: 'npx\\s+remotion\\s+render\\s+Promo\\s+teaser\\.mp4',
              message: 'La commande doit être exactement : npx remotion render Promo teaser.mp4'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q6',
      moduleId: 'm6',
      questions: [
        {
          id: 'q6-1',
          statement: 'Quelle commande permet de lancer un rendu d\'une composition appelée "Video" en local ?',
          options: [
            'npx remotion start Video',
            'npx remotion render Video out.mp4',
            'npm run dev Video',
            'npx remotion compile Video'
          ],
          correctAnswerIndex: 1,
          explanation: 'La commande "render" est la méthode officielle pour compiler la vidéo de manière asynchrone sur une machine locale.'
        },
        {
          id: 'q6-2',
          statement: 'Quel est l\'avantage principal de l\'architecture Remotion Lambda sur AWS ?',
          options: [
            'Elle permet de supprimer le code React',
            'Elle distribue et parallélise les calculs pour rendre de nombreuses vidéos en quelques secondes',
            'Elle est totalement gratuite pour tous',
            'Elle remplace le besoin de coder'
          ],
          correctAnswerIndex: 2,
          explanation: 'Remotion Lambda permet de paralléliser le rendu d\'une même vidéo ou de milliers de vidéos en distribuant le travail sur des serveurs AWS sans serveur (serverless).'
        }
      ]
    }
  },
  {
    id: 'm7',
    order: 7,
    title: 'Projet final certifiant',
    description: 'Appliquez l\'intégralité de vos compétences pour créer un teaser animé et décrocher votre certification validée par IA.',
    xpTotal: 150,
    lessons: [
      {
        id: 'm7-l1',
        moduleId: 'm7',
        order: 1,
        slug: 'projet-final-certifiant',
        title: 'Le Brief Créatif du Certificat',
        durationMinutes: 10,
        xp: 50,
        content: `### Projet de Fin d'Études : Teaser Produit Remotion Academy

Vous êtes arrivé au bout du parcours théorique ! Pour obtenir votre **Certificat de Maîtrise de Remotion**, vous devez réaliser un projet pratique complet.

#### Le Brief Client

Le client fictif "Remotion Academy" souhaite obtenir un teaser vidéo promotionnel dynamique de 5 secondes (150 frames à 30 FPS) au format carré (1080x1080) destiné aux réseaux sociaux.

La vidéo doit impérativement respecter les consignes techniques et artistiques suivantes :

1.  **Arrière-plan** : Un fond avec dégradé sombre élégant.
2.  **Scénographie et Timeline** :
    *   **Séquence 1 (Frame 0 à 60)** : Affiche un logo ou une image de produit avec un effet d'échelle spring.
    *   **Séquence 2 (Frame 60 à 150)** : Fait disparaître le logo pour laisser place à un message accrocheur stylisé (ex: "Codez vos vidéos avec React !").
3.  **Animations** : Utilisation d'au moins un hook \`useCurrentFrame()\` et d'une fonction d'animation mathématique (\`interpolate\` ou \`spring\`).
4.  **Audio** : Un habillage sonore d'ambiance en arrière-plan.

#### Évaluation et Soumission

Une fois votre code prêt, notre assistant IA se chargera d'inspecter vos fichiers de code pour valider la logique d'orchestration de vos séquences et de vos animations. En cas de succès, un certificat nominatif unique vous sera décerné !`,
        exercise: {
          id: 'ex7',
          lessonId: 'm7-l1',
          title: 'Projet de Certification Complet',
          instructions: 'Écrivez le code de votre composition finale. Vous devez inclure AbsoluteFill, un élément avec opacité interpolée, et au moins une Sequence démarrant à la frame 45.',
          codeInitial: `import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';\n\nexport const MyVideo = () => {\n  const frame = useCurrentFrame();\n  const opacity = 1; // Remplacez par un interpolateur temporel\n  \n  return (\n    <AbsoluteFill className="bg-slate-950 flex flex-col items-center justify-center text-white">\n      <div style={{ opacity }} className="text-4xl font-extrabold text-blue-500 mb-8">\n        PROJET DE CERTIFICATION\n      </div>\n      \n      {/* Insérez une Sequence démarrant à la frame 45 avec un texte de conclusion */}\n    </AbsoluteFill>\n  );\n};`,
          codeSolution: `import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';\n\nexport const MyVideo = () => {\n  const frame = useCurrentFrame();\n  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });\n  \n  return (\n    <AbsoluteFill className="bg-slate-950 flex flex-col items-center justify-center text-white">\n      <div style={{ opacity }} className="text-4xl font-extrabold text-blue-500 mb-8">\n        PROJET DE CERTIFICATION\n      </div>\n      \n      <Sequence from={45}>\n        <div className="text-xl text-orange-400 font-semibold">\n          Félicitations, vous êtes diplômé !\n        </div>\n      </Sequence>\n    </AbsoluteFill>\n  );\n};`,
          validationCriteria: [
            {
              id: 'ex7-c1',
              description: 'Le code doit utiliser la fonction interpolate()',
              pattern: 'interpolate\\(',
              message: 'Vous devez interpoler l\'opacité ou une autre propriété de votre scène.'
            },
            {
              id: 'ex7-c2',
              description: 'Une Sequence doit démarrer précisément à la frame 45',
              pattern: 'Sequence\\s+from=\\{\\s*45\\s*\\}',
              message: 'Une Sequence doit être positionnée à partir de la frame 45 pour créer votre deuxième plan.'
            }
          ]
        }
      }
    ],
    quiz: {
      id: 'q7',
      moduleId: 'm7',
      questions: [
        {
          id: 'q7-1',
          statement: 'Quel élément est capital pour valider le projet final certifiant Remotion Academy ?',
          options: [
            'Créer une vidéo de 4 heures',
            'Avoir un arrière-plan, une orchestration en séquences, au moins une animation temporelle et un habillage sonore',
            'Utiliser d\'autres frameworks comme Angular',
            'La certification s\'obtient automatiquement sans code'
          ],
          correctAnswerIndex: 1,
          explanation: 'La structure cumulative exige de prouver la maîtrise des séquences, de la timeline, du son, et d\'animations basées sur la physique ou les mathématiques de Remotion.'
        }
      ]
    }
  }
];
