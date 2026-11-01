/* Cartothèque — contenu (domaines, cartes, équipes) */
const ch = (id,name,items,boss)=>({id,name,items,boss:!!boss});
const RES_DATE = '31 octobre 2026';

const DOMAINS = [
/* ---------- LANGUES ---------- */
{id:'en', cat:'Langues', name:'Anglais', icon:'🇬🇧', c:'#5b8cff', lang:'en-GB', defLvl:1, levels:[
 {name:'Débutant', chapters:[
  ch('en1','Salutations',[['Bonjour','Hello'],['Au revoir','Goodbye'],['Merci','Thank you'],["S'il te plaît",'Please'],['Comment ça va ?','How are you?'],['Bonne nuit','Good night'],['Enchanté','Nice to meet you'],['À bientôt','See you soon']]),
  ch('en2','Nourriture',[['Pain','Bread'],['Fromage','Cheese'],['Pomme','Apple'],['Eau','Water'],['Poulet','Chicken'],['Petit-déjeuner','Breakfast'],['Fraise','Strawberry'],['Oignon','Onion']]),
  ch('en3','En voyage',[['Gare','Train station'],['Billet','Ticket'],['Aéroport','Airport'],['Valise','Suitcase'],['À gauche','On the left'],['Tout droit','Straight ahead'],["Chambre d'hôtel",'Hotel room'],['Combien ça coûte ?','How much is it?']]),
  ch('en4','Verbes irréguliers',[['Aller → passé','Went'],['Voir → passé','Saw'],['Manger → passé','Ate'],['Prendre → passé','Took'],['Écrire → passé','Wrote'],['Acheter → passé','Bought'],['Penser → passé','Thought'],['Boire → passé','Drank']],1)]},
 {name:'Intermédiaire', chapters:[
  ch('en5','Phrasal verbs',[['Abandonner','Give up'],['Avoir hâte de','Look forward to'],['Comprendre, trouver la solution','Figure out'],['Être à court de','Run out of'],['Remettre à plus tard','Put off'],["Bien s'entendre avec",'Get along with'],['Refuser (une offre)','Turn down'],['Aborder (un sujet)','Bring up']]),
  ch('en6','Faux amis',[['En fait','Actually'],['Finalement, à la longue','Eventually'],['Bibliothèque','Library'],['Raisonnable','Sensible'],['Actuellement','Currently'],['Réussir, accomplir','Achieve'],['Déception','Disappointment'],['Cours magistral','Lecture']]),
  ch('en7','Au travail',[['Réunion','Meeting'],['Date limite','Deadline'],['Salaire','Salary'],['Compétences','Skills'],['Embaucher','Hire'],['Licencier','Fire / Lay off'],['Fournisseur','Supplier'],['Facture','Invoice']]),
  ch('en8','Grammaire en contexte',[['Je travaille ici depuis 2 ans','I have been working here for 2 years'],["Si j'avais su, je serais venu",'If I had known, I would have come'],["J'avais l'habitude de jouer au foot",'I used to play football'],['Je suis habitué à conduire à gauche',"I'm used to driving on the left"],['Elle aurait dû appeler','She should have called'],["Plus tu t'entraînes, plus tu progresses",'The more you train, the better you get'],['On m’a volé mon vélo','My bike was stolen'],["Ça fait longtemps que je ne l'ai pas vu","I haven't seen him for a long time"]],1)]},
 {name:'Avancé', chapters:[
  ch('en9','Expressions',[['C’est du gâteau',"It's a piece of cake"],['Briser la glace','Break the ice'],['Mettre dans le mille','Hit the nail on the head'],['Coûter les yeux de la tête','Cost an arm and a leg'],['Être patraque','Feel under the weather'],['Tous les 36 du mois','Once in a blue moon'],['Vendre la mèche','Spill the beans'],['La balle est dans ton camp','The ball is in your court']]),
  ch('en10','Vocabulaire soutenu',[['Minutieux','Thorough'],['Réticent','Reluctant'],['Omniprésent','Ubiquitous'],['Saper, fragiliser','Undermine'],['Défaut, lacune','Shortcoming'],['Convaincant','Compelling'],['Réalisable','Feasible'],['Avec le recul','In hindsight']]),
  ch('en11','Business English',[['Tirer parti de','Leverage'],['Partie prenante','Stakeholder'],["Goulot d'étranglement",'Bottleneck'],["Chiffre d'affaires",'Revenue'],['Rationaliser (un process)','Streamline'],['Prévision','Forecast'],['Frais généraux','Overheads'],['Délai d’approvisionnement','Lead time']]),
  ch('en12','Argot des séries',[['Sans mentir','No cap'],['Regarder en rafale','Binge-watch'],['Disparaître sans donner de nouvelles','Ghost someone'],['Peur de rater quelque chose','FOMO'],['Un peu, discrètement','Low-key'],["C'est moi qui paie","It's on me"],['Quelle poisse !','What a bummer!'],['Je suis crevé',"I'm knackered"]],1)]}
 ], coll:[
  {id:'en-a', n:'Big Ben', art:'🕰️', r:'c', f:"Big Ben est le nom de la grosse cloche. La tour s'appelle Elizabeth Tower depuis 2012."},
  {id:'en-b', n:'Afternoon tea', art:'🫖', r:'c', f:"Popularisé vers 1840 par la duchesse de Bedford, qui avait faim entre le déjeuner et le dîner."},
  {id:'en-c', n:'Bus à impériale', art:'🚌', r:'r', f:"Le célèbre Routemaster rouge a circulé à Londres à partir de 1956."},
  {id:'en-d', n:'Shakespeare', art:'🪶', r:'r', f:"On lui attribue la première trace écrite de plus de 1 700 mots anglais."},
  {id:'en-e', n:'Stonehenge', art:'🪨', r:'e', f:"Les plus grosses pierres pèsent environ 25 tonnes et ont été dressées il y a près de 4 500 ans."},
  {id:'en-f', n:'« The »', art:'👑', r:'l', f:"« The » est le mot le plus fréquent de la langue anglaise, à l'écrit comme à l'oral."}
 ]},
{id:'es', cat:'Langues', name:'Espagnol', icon:'🇪🇸', c:'#ff6b5a', lang:'es-ES', defLvl:0, levels:[
 {name:'Débutant', chapters:[
  ch('es1','Les bases',[['Salut','Hola'],['Merci','Gracias'],['Oui','Sí'],['Bonjour (matin)','Buenos días'],['Au revoir','Adiós'],["S'il te plaît",'Por favor'],['Pardon','Perdón'],['Bonne nuit','Buenas noches']]),
  ch('es2','Les nombres',[['Un','Uno'],['Deux','Dos'],['Trois','Tres'],['Quatre','Cuatro'],['Cinq','Cinco'],['Dix','Diez'],['Vingt','Veinte'],['Cent','Cien']]),
  ch('es3','La famille',[['Mère','Madre'],['Père','Padre'],['Frère','Hermano'],['Sœur','Hermana'],['Grand-mère','Abuela'],['Fils','Hijo'],['Oncle','Tío'],['Cousine','Prima']]),
  ch('es4','Au restaurant',[["L'addition",'La cuenta'],['La carte (menu)','La carta'],["Un verre d'eau",'Un vaso de agua'],["J'ai faim",'Tengo hambre'],['Délicieux','Delicioso'],['Le serveur','El camarero'],['Le dessert','El postre'],['Je voudrais…','Quisiera…']],1)]},
 {name:'Intermédiaire', chapters:[
  ch('es5','Verbes du quotidien',[['Se lever','Levantarse'],['Travailler','Trabajar'],['Apprendre','Aprender'],['Chercher','Buscar'],['Pouvoir','Poder'],['Savoir','Saber'],['Sortir','Salir'],['Attendre','Esperar']]),
  ch('es6','Faux amis',[['Enceinte','Embarazada'],['Gêné, honteux','Avergonzado'],['Rhume','Resfriado'],['Bureau (pièce)','Despacho'],['Large (vêtement)','Ancho'],['Long','Largo'],['Salle à manger','Comedor'],['Tôt','Temprano']]),
  ch('es7','Expressions',[['Ça me plaît beaucoup','Me gusta mucho'],['Pas de souci','No pasa nada'],["J'en ai marre",'Estoy harto'],['Quelle chance !','¡Qué suerte!'],['Ça dépend','Depende'],['À tout à l’heure','Hasta luego'],['Génial (Espagne)','¡Qué guay!'],['Bon appétit','Buen provecho']],1)]}
 ], coll:[
  {id:'es-a', n:'Paella', art:'🥘', r:'c', f:"Née à Valence. La recette traditionnelle contient du poulet et du lapin, pas de fruits de mer."},
  {id:'es-b', n:'Flamenco', art:'💃', r:'c', f:"Inscrit au patrimoine culturel immatériel de l'UNESCO en 2010."},
  {id:'es-c', n:'Sagrada Família', art:'⛪', r:'r', f:"La basilique de Gaudí à Barcelone est en construction depuis 1882."},
  {id:'es-d', n:'La lettre Ñ', art:'🔤', r:'r', f:"Le ñ vient d'un double n abrégé par les copistes médiévaux, avec un petit trait au-dessus."},
  {id:'es-e', n:'Don Quichotte', art:'🛡️', r:'e', f:"Publié par Cervantes en 1605, souvent cité comme le premier roman moderne."},
  {id:'es-f', n:'500 millions', art:'🌎', r:'l', f:"Environ 500 millions de locuteurs natifs : la 2e langue maternelle la plus parlée au monde."}
 ]},
/* ---------- MÉTIER ---------- */
{id:'lo', cat:'Métier', name:'Logistique', icon:'📦', c:'#13a89e', defLvl:0, levels:[
 {name:'Fondamentaux', chapters:[
  ch('lo1','Les fondamentaux',[['Supply chain','Chaîne de flux du fournisseur au client final'],['Flux tendu','Livrer au plus juste, selon la demande réelle'],['Stock de sécurité','Stock tampon contre les aléas'],['Rupture de stock','Plus aucun article disponible'],['Lead time','Délai entre la commande et la réception'],['Inventaire','Comptage physique du stock'],['Réapprovisionnement','Recompléter le stock'],['Logistique inverse','Gestion des retours produits']]),
  ch('lo2','Les acronymes',[['WMS','Logiciel de gestion d’entrepôt'],['TMS','Logiciel de gestion du transport'],['ERP','Progiciel de gestion intégré'],['FIFO','Premier entré, premier sorti'],['FEFO','Premier périmé, premier sorti'],['SKU','Référence unique d’article'],['EDI','Échange de données informatisé'],['KPI','Indicateur clé de performance']]),
  ch('lo3','L’entrepôt',[['Quai','Zone de chargement et déchargement des camions'],['Picking','Préparation de commande'],['Cross-docking','Transfert direct sans stockage'],['Palette Europe','80 × 120 cm'],['Rack','Rayonnage de stockage'],['Colisage','Conditionnement des colis pour l’expédition'],['Adressage','Emplacement codé de chaque produit'],['Taux de service','Commandes livrées complètes et à l’heure (%)']]),
  ch('lo4','Transport',[['FTL','Camion complet'],['Messagerie / groupage','Camion partagé entre plusieurs clients'],['EVP / TEU','Équivalent conteneur 20 pieds'],['CMR','Lettre de voiture du transport routier international'],['Dernier kilomètre','Livraison finale jusqu’au client'],['Semi-remorque standard','33 palettes Europe au sol'],['Lettre de voiture','Document qui accompagne la marchandise transportée'],['Réserves à la livraison','Mentions écrites en cas de colis abîmé ou manquant']],1)]},
 {name:'E-commerce', chapters:[
  ch('lo13','Préparation e-commerce',[['Picking par vague','Lancer un lot de commandes ensemble sur un créneau'],['Batch picking','Préparer plusieurs commandes en un seul passage'],['Picking par zone','Chaque préparateur reste dans sa zone, la commande passe de zone en zone'],['Goods-to-person','La marchandise vient au préparateur (robots, navettes)'],['Pick-to-light','Des voyants indiquent l’emplacement et la quantité à prendre'],['Slotting','Placer les articles selon leur rotation pour réduire les déplacements'],['Commande mono-ligne','Un seul article, préparé en flux rapide'],['Commande multi-ligne','Plusieurs articles à consolider avant l’emballage']]),
  ch('lo14','Expédition & transporteurs',[['Cut-off','Heure limite pour qu’une commande parte le jour même'],['Point relais','Commerce partenaire où le client vient retirer son colis'],['Poids volumétrique','Poids calculé à partir des dimensions du colis'],['Étiquette transport','Adresse et code-barres du transporteur, éditée par le WMS ou le TMS'],['Tri des colis','Répartition par transporteur ou par tournée avant chargement'],['Manifeste','Liste des colis remis au transporteur'],['Calage','Remplir le vide du carton pour protéger le produit'],['Carton ajusté','Réduire le vide pour baisser le coût de transport et de calage']]),
  ch('lo15','Retours & service client',[['Logistique des retours','Réception, contrôle et traitement des colis renvoyés'],['RMA','Numéro d’autorisation de retour'],['Contrôle qualité retour','Vérifier l’état pour décider de la remise en stock'],['Remise en stock','L’article retourné redevient vendable'],['Taux de retour','Part des articles renvoyés par les clients'],['Délai de rétractation en ligne (UE)','14 jours'],['Litige transport','Colis perdu, abîmé ou en retard, à réclamer au transporteur'],['WISMO','« Where is my order? » : les demandes de suivi de commande']]),
  ch('lo16','Pic d’activité (Black Friday)',[['Dimensionner les équipes du pic','Partir des volumes prévus et de la productivité par poste'],['Quand recruter les intérimaires','Quelques semaines avant, pour avoir le temps de les former'],['Tenir les cut-off pendant le pic','Lancer des vagues plus fréquentes pour lisser la charge'],['Articles stars du pic','Les pré-emballer à l’avance'],['Commandes en retard au cut-off','Prioriser les envois express et prévenir le service client'],['Productivité qui chute en fin de journée','Faire tourner les postes et planifier les pauses'],['Rupture de cartons pendant le pic','Suivre les consommables comme un article en stock'],['Après le pic','Analyser les KPI et faire un retour d’expérience']],1)]},
 {name:'Confirmé', chapters:[
  ch('lo5','Gestion des stocks',[['Méthode ABC','Classer les articles selon leur poids dans la valeur (Pareto)'],['Classe A','Environ 20 % des articles pour 80 % de la valeur'],['Rotation des stocks','Consommation annuelle ÷ stock moyen'],['Couverture de stock','Nombre de jours tenus avec le stock actuel'],['Point de commande','Conso/jour × délai + stock de sécurité'],['Quantité économique de Wilson','Quantité qui minimise coûts de commande et de possession'],['Stock dormant','Article sans mouvement depuis longtemps'],['Inventaire tournant','Comptages réguliers par zone, sans arrêter le site']]),
  ch('lo6','KPI & pilotage',[['OTIF','Livré à l’heure et complet'],['Taux de service','Part des commandes servies complètes'],['Productivité picking','Lignes préparées par heure'],['Taux de remplissage','Volume chargé ÷ capacité du camion'],['Précision d’inventaire','Part des emplacements justes au comptage'],['Taux de litige','Part des livraisons avec casse, manquant ou erreur'],['Coût logistique / CA','Poids de la logistique dans le chiffre d’affaires'],['Dock-to-stock','Délai entre réception à quai et mise en stock']]),
  ch('lo7','Lean & amélioration continue',[['5S','Trier, ranger, nettoyer, standardiser, maintenir'],['Kaizen','Amélioration continue par petits pas'],['Muda','Gaspillage : tout ce qui n’apporte pas de valeur'],['PDCA','Plan, Do, Check, Act'],['Kanban','Réappro déclenché par la consommation réelle'],['VSM','Cartographie de la chaîne de valeur'],['Gemba','Aller sur le terrain, là où se crée la valeur'],['SMED','Réduire les temps de changement de série']]),
  ch('lo8','Incoterms 2020',[['Nombre d’Incoterms 2020','11'],['Organisme qui publie les Incoterms','Chambre de commerce internationale (ICC)'],['EXW','L’acheteur prend tout en charge dès les locaux du vendeur'],['FCA','Le vendeur remet la marchandise dédouanée export au transporteur de l’acheteur'],['FOB','Maritime : risque transféré une fois la marchandise à bord'],['CIF','Maritime : le vendeur paie fret et assurance jusqu’au port d’arrivée'],['DAP','Le vendeur livre à destination, droits d’import à la charge de l’acheteur'],['DDP','Le vendeur paie tout jusqu’à destination, droits inclus']],1)]},
 {name:'Manager', chapters:[
  ch('lo9','Management & sécurité',[['CACES R489','Recommandation de référence pour les chariots élévateurs'],['DUERP','Document unique d’évaluation des risques'],['TMS (santé)','Troubles musculo-squelettiques'],['Protocole de sécurité','Document requis pour chargement et déchargement avec un transporteur'],['Plan de prévention','Encadre l’intervention d’une entreprise extérieure'],['Matrice de polyvalence','Tableau des compétences de chaque membre de l’équipe'],['Quart d’heure sécurité','Point court et régulier sur la sécurité avec l’équipe'],['Brief de prise de poste','Point d’équipe sur les objectifs et les écarts du jour']]),
  ch('lo10','Planification (S&OP)',[['S&OP','Processus mensuel qui aligne ventes, production et stocks'],['MRP','Calcul des besoins en composants'],['DRP','Planification des besoins de distribution'],['MAPE','Erreur moyenne absolue des prévisions, en %'],['Biais de prévision','Tendance à sur- ou sous-estimer la demande'],['VMI','Le fournisseur gère le stock chez son client'],['Effet coup de fouet','Amplification des variations de demande en remontant la chaîne'],['Prévision de la demande','Estimation des ventes futures']]),
  ch('lo11','Achats & prestataires',[['Appel d’offres','Mise en concurrence de prestataires'],['Cahier des charges','Document qui décrit le besoin'],['SLA','Engagement de niveau de service'],['TCO','Coût total de possession'],['Dual sourcing','Deux fournisseurs pour un même besoin'],['3PL','Prestataire logistique à qui l’on confie ses opérations'],['Affrètement','Confier un transport à un transporteur'],['Surestaries','Frais quand un conteneur ou un navire est immobilisé trop longtemps']]),
  ch('lo12','Cas pratiques',[['Conso 100/jour, délai 5 jours, stock de sécurité 200 : point de commande ?','700 unités'],['Stock 30 000 unités, conso 1 000/jour : couverture ?','30 jours'],['Conso annuelle 600 k€, stock moyen 50 k€ : rotation ?','12 fois par an'],['1 200 lignes en 8 h à 3 préparateurs : productivité ?','50 lignes/h par préparateur'],['26 palettes chargées sur 33 places : remplissage ?','Environ 79 %'],['950 commandes à l’heure et complètes sur 1 000 : OTIF ?','95 %'],['Ruptures répétées sur des articles A : priorité ?','Revoir stock de sécurité et point de commande'],['Erreurs de préparation en hausse : 1er réflexe ?','Analyser les causes sur le terrain (Gemba)']],1)]}
 ],
 pages:[
  {id:'formules', label:'Formules', title:'Les formules à connaître', rows:[
   ['Rotation des stocks','Consommation annuelle ÷ stock moyen'],
   ['Couverture (jours)','Stock ÷ consommation moyenne par jour'],
   ['Point de commande','Conso/jour × délai de réappro + stock de sécurité'],
   ['Stock de sécurité (statistique)','z × écart-type de la demande × √délai'],
   ['Quantité économique (Wilson)','√(2 × demande annuelle × coût d’une commande ÷ coût de possession unitaire)'],
   ['Taux de service','Commandes servies complètes ÷ commandes totales'],
   ['OTIF','Commandes à l’heure ET complètes ÷ commandes totales'],
   ['Productivité picking','Lignes préparées ÷ heures travaillées'],
   ['Taux de remplissage','Volume (ou palettes) chargé ÷ capacité'],
   ['Précision d’inventaire','Emplacements justes ÷ emplacements comptés'],
   ['Coût logistique / CA','Coûts logistiques ÷ chiffre d’affaires']]},
  {id:'carriere', label:'Carrière', title:'Évoluer dans la logistique', rows:[
   ['Préparateur·rice, cariste','Préparation, chargement, réception. Le CACES R489 ouvre la conduite des chariots.'],
   ['Chef d’équipe','Anime l’équipe, suit la productivité, la qualité et la sécurité au quotidien.'],
   ['Responsable d’exploitation','Pilote les flux, les plannings et les indicateurs d’une activité ou d’un site.'],
   ['Responsable d’entrepôt','Budget, effectifs, qualité de service et relation client du site.'],
   ['Approvisionneur, planificateur','Prévisions, réapprovisionnement et niveaux de stock.'],
   ['Responsable supply chain','Organisation des flux de bout en bout, projets et investissements.'],
   ['Compétences qui font évoluer','Excel (tableaux croisés), WMS et ERP, Lean, management, sécurité, anglais.'],
   ['Formations reconnues','Titres pro (AFTRAL, Promotrans), Lean Six Sigma Green Belt, certifications ASCM (CPIM, CSCP), licence pro ou master supply chain, VAE pour valider ton expérience.']]}
 ],
 coll:[
  {id:'lo-a', n:'La palette Europe', art:'🪵', r:'c', f:"80 × 120 cm, elle supporte environ 1 500 kg en charge dynamique."},
  {id:'lo-b', n:'Le chariot élévateur', art:'🚜', r:'c', f:"En France, sa conduite demande une autorisation de l'employeur, en général appuyée sur le CACES."},
  {id:'lo-g', n:'La loi de Pareto', art:'📊', r:'c', f:"20 % des causes produisent 80 % des effets. C'est la base de la classification ABC des stocks."},
  {id:'lo-c', n:'Le code-barres', art:'🏷️', r:'r', f:"Premier scan en caisse en 1974 : un paquet de chewing-gums Wrigley's dans l'Ohio."},
  {id:'lo-d', n:'Le conteneur', art:'📦', r:'r', f:"Inventé par Malcom McLean en 1956, il a divisé par plus de 30 le coût de chargement des navires."},
  {id:'lo-h', n:'Le Kanban', art:'🗂️', r:'e', f:"Né chez Toyota sous l'impulsion de Taiichi Ohno, au cœur du système de production Toyota."},
  {id:'lo-e', n:'Le canal de Suez', art:'🚢', r:'e', f:"Environ 12 % du commerce mondial y passe. En 2021, l'Ever Given l'a bloqué pendant 6 jours."},
  {id:'lo-f', n:'Le porte-conteneurs géant', art:'🛳️', r:'l', f:"Les plus grands dépassent 24 000 EVP, soit plus de 24 000 conteneurs de 20 pieds à bord."}
 ]},
/* ---------- SPORT ---------- */
{id:'fo', cat:'Sport', name:'Football', icon:'⚽', c:'#2fd17a', stl:['VIT','TIR','DRI'], levels:[{name:'Parcours', chapters:[
  ch('fo1','Les règles',[["Durée d'un match pro",'2 × 45 minutes'],['Joueurs par équipe sur le terrain','11'],['Distance du point de penalty','11 mètres'],['Remplacements autorisés (temps réglementaire)','5'],['Carton synonyme d’exclusion','Rouge'],['Deux cartons jaunes donnent…','Un carton rouge'],['Ballon sorti derrière le but, touché en dernier par un défenseur','Corner'],['Distance du mur sur un coup franc','9,15 mètres']]),
  ch('fo2','Les postes',[['Seul joueur autorisé à toucher le ballon à la main','Le gardien'],['Défenseur placé sur un côté','Latéral'],['Milieu qui protège la défense','Sentinelle'],['Le n°10 qui organise le jeu','Meneur de jeu'],['Attaquant de pointe dans l’axe','Avant-centre'],['Ancien défenseur libre derrière la ligne','Libéro'],['Joueur rapide le long de la ligne de touche','Ailier'],['Latéral très offensif dans une défense à 3','Piston']]),
  ch('fo3','La tactique',[['Presser l’adversaire dès sa relance','Pressing haut'],['Défendre regroupé près de sa surface','Bloc bas'],['Attaque rapide juste après la récupération','Contre-attaque'],['4 défenseurs, 3 milieux, 3 attaquants','4-3-3'],['Passe et remise immédiate pour éliminer','Une-deux'],['Avant-centre qui décroche au milieu','Faux 9'],['Chaque joueur couvre un espace','Marquage de zone'],['Adversaires minimum entre l’attaquant et la ligne de but pour ne pas être hors-jeu','2']]),
  ch('fo4','Actu 2026-27',[['Ballon d’Or 2026','Harry Kane'],['2e du Ballon d’Or 2026','Kylian Mbappé'],['Trophée Kopa 2026 (3e de suite)','Lamine Yamal'],['Score du Clasico du 25 octobre 2026','Barcelone 1-2 Real Madrid'],['Auteur du doublé dans ce Clasico','Kylian Mbappé'],['Entraîneur du Real Madrid','José Mourinho'],['Ballon d’Or 2025','Ousmane Dembélé'],['Score de Le Havre – PSG (30 oct. 2026)','1-5']],1)]}],
 coll:[
  {id:'p-mbappe', n:'Kylian Mbappé', pos:'BU', nat:'🇫🇷', team:'Real Madrid', ovr:93, st:[97,93,92], f:"Champion du monde 2018 à 19 ans. 2e du Ballon d'Or 2026, à 28 points de Kane.", news:"Doublé dans le Clasico gagné 2-1 au Camp Nou (25 oct.)"},
  {id:'p-kane', n:'Harry Kane', pos:'BU', nat:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', team:'Bayern Munich', ovr:93, st:[72,96,82], f:"Plus rapide de l'histoire à 100 buts en Bundesliga, en septembre 2026.", news:"Ballon d'Or et Trophée Gerd-Müller 2026 (26 oct.)"},
  {id:'p-yamal', n:'Lamine Yamal', pos:'AD', nat:'🇪🇸', team:'FC Barcelone', ovr:91, st:[90,84,95], f:"Champion d'Europe 2024 avec l'Espagne, à 17 ans.", news:"Trophée Kopa pour la 3e année de suite (26 oct.)"},
  {id:'p-haaland', n:'Erling Haaland', pos:'BU', nat:'🇳🇴', team:'Manchester City', ovr:91, st:[89,95,79], f:"36 buts en Premier League en 2022-23, record sur une saison à 38 matchs.", news:"Défaite 2-1 de City à Aston Villa (24 oct.)"},
  {id:'p-dembele', n:'Ousmane Dembélé', pos:'AD', nat:'🇫🇷', ovr:90, st:[92,88,92], f:"Ballon d'Or 2025 après une saison exceptionnelle avec le PSG."},
  {id:'p-raphinha', n:'Raphinha', pos:'AG', nat:'🇧🇷', team:'FC Barcelone', ovr:88, st:[91,86,88], f:"Passé par Rennes en Ligue 1 avant de rejoindre Leeds puis le Barça.", news:"Buteur dans le Clasico perdu 1-2 (25 oct.)"},
  {id:'p-rudiger', n:'Antonio Rüdiger', pos:'DC', nat:'🇩🇪', team:'Real Madrid', ovr:86, st:[82,55,70], f:"Vainqueur de la Ligue des champions avec Chelsea (2021) et le Real (2024)."},
  {id:'p-cubarsi', n:'Pau Cubarsí', pos:'DC', nat:'🇪🇸', team:'FC Barcelone', ovr:85, st:[76,40,72], f:"2e du Trophée Kopa 2026, derrière son coéquipier Lamine Yamal."},
  {id:'p-zaire', n:'W. Zaïre-Emery', pos:'MC', nat:'🇫🇷', ovr:83, st:[80,74,82], f:"Buteur pour sa première sélection en équipe de France, à 17 ans, en 2023. 3e du Kopa 2026."},
  {id:'p-zidane', n:'Zinédine Zidane', pos:'MO', nat:'🇫🇷', team:'Icône', ovr:96, r:'i', st:[80,90,97], f:"Deux buts de la tête en finale de la Coupe du monde 1998."},
  {id:'p-messi', n:'Lionel Messi', pos:'AD', nat:'🇦🇷', team:'Icône', ovr:97, r:'i', st:[88,94,99], f:"Record de 8 Ballons d'Or, champion du monde 2022."},
  {id:'p-cr7', n:'Cristiano Ronaldo', pos:'BU', nat:'🇵🇹', team:'Icône', ovr:96, r:'i', st:[90,97,88], f:"Meilleur buteur de l'histoire des sélections nationales."}
 ],
 matches:[
  {d:'30 oct.',comp:'Ligue 1',a:'Le Havre',b:'PSG',sa:1,sb:5},
  {d:'30 oct.',comp:'Ligue 1',a:'Nice',b:'Rennes',sa:5,sb:2},
  {d:'30 oct.',comp:'Ligue 1',a:'Lille',b:'Lens',sa:1,sb:0},
  {d:'25 oct.',comp:'LaLiga',a:'FC Barcelone',b:'Real Madrid',sa:1,sb:2,note:'Mbappé 41e, 87e · Raphinha 61e'},
  {d:'24 oct.',comp:'Premier League',a:'Aston Villa',b:'Manchester City',sa:2,sb:1},
  {d:'24 oct.',comp:'Premier League',a:'Arsenal',b:'Everton',sa:2,sb:0},
  {d:'17 oct.',comp:'Premier League',a:'Brentford',b:'Liverpool',sa:1,sb:2},
  {d:'11 oct.',comp:'Premier League',a:'Liverpool',b:'Manchester City',sa:0,sb:3}
 ],
 news:[['26 oct.','Ballon d’Or 2026 : Harry Kane, devant Kylian Mbappé'],['26 oct.','Trophée Kopa : Lamine Yamal, 3e sacre de suite'],['26 oct.','Real Madrid de José Mourinho : 1re victoire au Camp Nou depuis 3 ans']]
 },
{id:'nba', cat:'Sport', name:'NBA', icon:'🏀', c:'#ff8a3d', stl:['TIR','PAS','DÉF'], levels:[{name:'Parcours', chapters:[
  ch('nb1','Les règles',[['Durée d’un match NBA','4 × 12 minutes'],['Temps pour tirer (shot clock)','24 secondes'],['Fautes avant exclusion','6'],['Joueurs sur le terrain par équipe','5'],['Hauteur du panier','3,05 m'],['Ligne à 3 points (au sommet)','7,24 m'],['Lancers après une faute sur un tir à 3 points','3'],['Temps pour passer la ligne médiane','8 secondes']]),
  ch('nb2','Le vocabulaire',[['Triple-double','10 ou plus dans 3 catégories de stats'],['Alley-oop','Passe en l’air reprise directement au panier'],['Pick and roll','Écran puis coupe vers le panier'],['Buzzer beater','Panier marqué à la sirène'],['And-one','Panier + faute, avec un lancer franc bonus'],['Rookie','Joueur en 1re saison'],['Sixth man','Meilleur remplaçant'],['Airball','Tir qui ne touche ni le cercle ni la planche']]),
  ch('nb3','L’histoire',[['Franchise la plus titrée','Boston Celtics'],['Record de points en un match','100, Wilt Chamberlain (1962)'],['Champion NBA 2025','Oklahoma City Thunder'],['MVP 2025','Shai Gilgeous-Alexander'],['1er Français drafté en n°1','Victor Wembanyama (2023)'],['Surnom de Michael Jordan','His Airness'],['Meilleur marqueur de l’histoire','LeBron James'],['Dream Team','Équipe olympique américaine de 1992']]),
  ch('nb4','Actu 2026-27',[['Nouveau club de LeBron James','Philadelphia 76ers'],['Nouveau club de Giannis Antetokounmpo','Miami Heat'],['Points de Giannis pour ses débuts à Miami','35'],['1er choix de la draft 2025','Cooper Flagg'],['Vainqueur de Spurs–Thunder en ouverture','Thunder, 116-104'],['Retard comblé par les Warriors face aux Lakers (30 oct.)','25 points'],['Score de Mavericks–Rockets (30 oct.)','116-111'],['Tournoi de début de saison','NBA Cup']],1)]}],
 coll:[
  {id:'p-wemby', n:'Victor Wembanyama', pos:'PIV', nat:'🇫🇷', team:'San Antonio Spurs', ovr:93, st:[86,78,98], f:"Rookie de l'année 2024 à l'unanimité. 2,24 m.", news:"Battu 116-104 par le Thunder en ouverture, revanche le 31 oct."},
  {id:'p-sga', n:'Shai Gilgeous-Alexander', pos:'MEN', nat:'🇨🇦', team:'OKC Thunder', ovr:95, st:[95,84,86], f:"MVP de la saison et MVP des Finales en 2025, champion avec le Thunder.", news:"Victoire 116-104 à San Antonio en ouverture"},
  {id:'p-jokic', n:'Nikola Jokić', pos:'PIV', nat:'🇷🇸', ovr:95, st:[90,98,78], f:"Triple MVP (2021, 2022, 2024), champion NBA 2023."},
  {id:'p-giannis', n:'Giannis Antetokounmpo', pos:'AIL', nat:'🇬🇷', team:'Miami Heat', ovr:93, st:[80,84,90], f:"MVP 2019 et 2020, champion 2021 avec Milwaukee. 35 pts pour ses débuts à Miami, record de franchise.", news:"31 pts dans la victoire 145-125 contre Indiana (30 oct.)"},
  {id:'p-lebron', n:'LeBron James', pos:'AIL', nat:'🇺🇸', team:'Philadelphia 76ers', ovr:89, st:[86,92,78], f:"Meilleur marqueur de l'histoire de la NBA. Signé à Philadelphie à 41 ans.", news:"Victoire 98-93 contre les Knicks avec Maxey (30 oct.)"},
  {id:'p-curry', n:'Stephen Curry', pos:'MEN', nat:'🇺🇸', team:'Golden State Warriors', ovr:91, st:[99,88,70], f:"Meilleur tireur à 3 points de l'histoire, 4 titres NBA.", news:"Retour de 25 points contre les Lakers (30 oct.)"},
  {id:'p-luka', n:'Luka Dončić', pos:'MEN', nat:'🇸🇮', ovr:93, st:[91,94,70], f:"Champion d'Europe et MVP de l'Euroligue avec le Real Madrid à 19 ans (2018)."},
  {id:'p-edwards', n:'Anthony Edwards', pos:'ARR', nat:'🇺🇸', ovr:89, st:[89,78,82], f:"1er choix de la draft 2020, champion olympique à Paris en 2024."},
  {id:'p-flagg', n:'Cooper Flagg', pos:'AIL', nat:'🇺🇸', team:'Dallas Mavericks', ovr:86, st:[82,80,88], f:"1er choix de la draft 2025.", news:"33 pts dans la victoire 116-111 contre Houston (30 oct.)"},
  {id:'p-cade', n:'Cade Cunningham', pos:'MEN', nat:'🇺🇸', team:'Detroit Pistons', ovr:87, st:[85,89,78], f:"1er choix de la draft 2021.", news:"20 pts dans la victoire 110-94 à Brooklyn (30 oct.)"},
  {id:'p-maxey', n:'Tyrese Maxey', pos:'MEN', nat:'🇺🇸', team:'Philadelphia 76ers', ovr:87, st:[88,82,74], f:"Élu meilleure progression de la NBA en 2024.", news:"Décisif contre les Knicks en NBA Cup (30 oct.)"},
  {id:'p-jordan', n:'Michael Jordan', pos:'ARR', nat:'🇺🇸', team:'Icône', ovr:99, r:'i', st:[96,85,95], f:"6 titres NBA et 6 fois MVP des Finales."},
  {id:'p-parker', n:'Tony Parker', pos:'MEN', nat:'🇫🇷', team:'Icône', ovr:94, r:'i', st:[86,90,74], f:"4 titres avec les Spurs, MVP des Finales 2007."},
  {id:'p-kobe', n:'Kobe Bryant', pos:'ARR', nat:'🇺🇸', team:'Icône', ovr:97, r:'i', st:[95,84,90], f:"81 points contre Toronto en 2006, 2e plus gros total de l'histoire."}
 ],
 matches:[
  {d:'30 oct.',comp:'NBA',a:'Dallas Mavericks',b:'Houston Rockets',sa:116,sb:111,note:'Irving 35 pts, Flagg 33 pts'},
  {d:'30 oct.',comp:'NBA',a:'Miami Heat',b:'Indiana Pacers',sa:145,sb:125,note:'Giannis 31 pts'},
  {d:'30 oct.',comp:'NBA Cup',a:'Philadelphia 76ers',b:'New York Knicks',sa:98,sb:93},
  {d:'30 oct.',comp:'NBA Cup',a:'Boston Celtics',b:'Chicago Bulls',sa:125,sb:111},
  {d:'30 oct.',comp:'NBA Cup',a:'Minnesota Timberwolves',b:'LA Clippers',sa:127,sb:101},
  {d:'30 oct.',comp:'NBA',a:'Detroit Pistons',b:'Brooklyn Nets',sa:110,sb:94,note:'Cunningham 20 pts'},
  {d:'Ouverture',comp:'NBA',a:'OKC Thunder',b:'San Antonio Spurs',sa:116,sb:104,note:'À San Antonio'}
 ],
 news:[['30 oct.','Les Warriors reviennent de 25 points et battent les Lakers, menés par Stephen Curry'],['31 oct.','Nouveau duel Spurs – Thunder, revanche de l’ouverture'],['Saison 2026-27','Giannis : 35 pts pour ses débuts avec Miami, record de franchise']]
 },
{id:'te', cat:'Sport', name:'Tennis', icon:'🎾', c:'#c9de2f', stl:['SRV','CDF','MEN'], levels:[{name:'Parcours', chapters:[
  ch('te1','Les règles',[['Points d’un jeu','15, 30, 40, jeu'],['40-40','Égalité'],['Tie-break gagné à','7 points avec 2 d’écart'],['Let','Service à rejouer, la balle a touché le filet'],['Ace','Service gagnant non touché'],['Double faute','Deux services manqués'],['Sets gagnants en Grand Chelem (hommes)','3'],['Surface de Roland-Garros','Terre battue']]),
  ch('te2','Les Grands Chelems',[['Open d’Australie','Melbourne, en janvier'],['Wimbledon','Londres, sur gazon'],['US Open','New York, Flushing Meadows'],['Record de titres à Roland-Garros','Rafael Nadal (14)'],['Tenue obligatoire à Wimbledon','Blanche'],['Trophée des femmes à Roland-Garros','Coupe Suzanne-Lenglen'],['Dernier Français titré en Grand Chelem','Yannick Noah (1983)'],['Grand Chelem calendaire en 1969','Rod Laver']]),
  ch('te3','Actu & légendes',[['Plus jeune n°1 mondial ATP','Carlos Alcaraz'],['Forfait pour Paris 2026 (genou)','Jannik Sinner'],['Lieu des WTA Finals 2026','Indian Wells'],['Vainqueur du Masters de Paris 2025','Jannik Sinner'],['A conservé son titre à Miami en 2026','Aryna Sabalenka'],['Vainqueure de Roland-Garros 2025','Coco Gauff'],['Record de titres à Wimbledon (hommes)','Roger Federer (8)'],['Dates du Masters de Paris 2026','2 au 8 novembre']],1)]}],
 coll:[
  {id:'p-sinner', n:'Jannik Sinner', pos:'ATP', nat:'🇮🇹', ovr:95, st:[90,96,95], f:"Vainqueur de l'Open d'Australie 2024 et 2025, puis de Wimbledon 2025.", news:"Saison terminée (genou), forfait au Masters de Paris"},
  {id:'p-alcaraz', n:'Carlos Alcaraz', pos:'ATP', nat:'🇪🇸', ovr:95, st:[88,97,93], f:"Plus jeune n°1 mondial de l'histoire, à 19 ans (2022).", news:"De retour de blessure, en demi-finale à Vienne (30 oct.)"},
  {id:'p-djoko', n:'Novak Djokovic', pos:'ATP', nat:'🇷🇸', ovr:91, st:[88,90,99], f:"Record de 428 semaines à la 1re place mondiale.", news:"Inscrit au Masters de Paris (2-8 nov.)"},
  {id:'p-zverev', n:'Alexander Zverev', pos:'ATP', nat:'🇩🇪', ovr:89, st:[95,85,84], f:"Champion olympique à Tokyo (2021).", news:"Bat Griekspoor, en demi-finale à Vienne (30 oct.)"},
  {id:'p-faa', n:'F. Auger-Aliassime', pos:'ATP', nat:'🇨🇦', ovr:85, st:[92,84,80], f:"Finaliste du Masters de Paris 2025, battu par Sinner.", news:"Inscrit au Masters de Paris 2026"},
  {id:'p-fils', n:'Arthur Fils', pos:'ATP', nat:'🇫🇷', ovr:84, st:[88,90,78], f:"Vainqueur de l'ATP 500 de Hambourg en 2024.", news:"Abandon sur blessure à Bâle (fin oct.)"},
  {id:'p-sabalenka', n:'Aryna Sabalenka', pos:'WTA', nat:'🇧🇾', ovr:94, st:[94,95,88], f:"A conservé son titre à Miami en 2026 en battant Coco Gauff en finale."},
  {id:'p-swiatek', n:'Iga Świątek', pos:'WTA', nat:'🇵🇱', ovr:90, st:[82,94,90], f:"Titrée à Roland-Garros en 2020, 2022, 2023 et 2024."},
  {id:'p-gauff', n:'Coco Gauff', pos:'WTA', nat:'🇺🇸', ovr:89, st:[86,84,90], f:"Vainqueure de l'US Open 2023 puis de Roland-Garros 2025, face à Sabalenka."},
  {id:'p-rybakina', n:'Elena Rybakina', pos:'WTA', nat:'🇰🇿', ovr:87, st:[96,88,80], f:"Vainqueure de Wimbledon 2022."},
  {id:'p-federer', n:'Roger Federer', pos:'ATP', nat:'🇨🇭', team:'Icône', ovr:99, r:'i', st:[96,98,97], f:"20 titres du Grand Chelem, dont un record de 8 Wimbledon."},
  {id:'p-nadal', n:'Rafael Nadal', pos:'ATP', nat:'🇪🇸', team:'Icône', ovr:99, r:'i', st:[85,99,99], f:"14 Roland-Garros, record absolu pour un même Grand Chelem."},
  {id:'p-serena', n:'Serena Williams', pos:'WTA', nat:'🇺🇸', team:'Icône', ovr:99, r:'i', st:[99,95,98], f:"23 titres du Grand Chelem en simple."}
 ],
 matches:[
  {d:'30 oct.',comp:'ATP 500 Vienne',a:'Alexander Zverev',fa:'🇩🇪',b:'Tallon Griekspoor',fb:'🇳🇱',w:'a',note:'Quart de finale'},
  {d:'30 oct.',comp:'ATP 500 Vienne',a:'Carlos Alcaraz',fa:'🇪🇸',b:'Nikoloz Basilashvili',fb:'🇬🇪',w:'a',note:'Quart de finale'}
 ],
 news:[['Fin oct.','Jannik Sinner arrête sa saison (genou) et déclare forfait à Paris'],['Fin oct.','Bâle : Arthur Fils abandonne sur blessure'],['2-8 nov.','Masters de Paris avec Alcaraz, Djokovic, Zverev et Auger-Aliassime'],['8-15 nov.','WTA Finals, à Indian Wells cette année']]
 },
{id:'ru', cat:'Sport', name:'Course à pied', icon:'🏃', c:'#ffc53d', levels:[{name:'Parcours', chapters:[
  ch('ru1','Les bases',[['VMA','Vitesse maximale aérobie'],['Fractionné','Alterner efforts rapides et récupérations'],['Endurance fondamentale','Allure facile où l’on peut parler'],['Durée d’échauffement conseillée','10 à 15 minutes'],['Footing','Course lente et régulière'],['Séance de côtes','Montées pour renforcer les jambes'],['Cadence souvent visée','Environ 170 à 180 pas/min'],['Retour au calme','Quelques minutes de trot après l’effort']]),
  ch('ru2','Le corps',[['FC max (formule simple)','220 moins l’âge'],['VO2 max','Consommation maximale d’oxygène'],['Carburants d’un effort long','Glycogène et graisses'],['Surcompensation','Le corps progresse pendant la récupération'],['Tendon souvent blessé chez le coureur','Tendon d’Achille'],['Muscle du mollet','Triceps sural'],['FC au repos d’un sportif entraîné','Souvent sous 60 bpm'],['Lactate','Produit lors d’efforts intenses']]),
  ch('ru3','Courses mythiques',[['Distance du marathon','42,195 km'],['Distance du semi-marathon','21,097 km'],['Record du monde du marathon (Kiptum, 2023)','2 h 00 min 35 s'],['Premier humain sous les 4 min au mile','Roger Bannister'],['Record du monde du 100 m','Usain Bolt, 9,58 s'],['Plus ancien marathon annuel','Boston (1897)'],['Ultra-trail autour du Mont-Blanc','UTMB'],['Un 10 km en miles','Environ 6,2 miles']],1)]}],
 coll:[
  {id:'ru-a', n:'Les baskets', art:'👟', r:'c', f:"On change en général ses chaussures de running tous les 600 à 1 000 km."},
  {id:'ru-b', n:'La gourde', art:'💧', r:'c', f:"Perdre 2 % de son poids en eau suffit à faire baisser nettement la performance."},
  {id:'ru-c', n:'Les 42,195 km', art:'🛣️', r:'r', f:"La distance du marathon a été fixée aux Jeux de Londres en 1908, puis officialisée en 1921."},
  {id:'ru-d', n:'Le mile de 1954', art:'⏱️', r:'r', f:"Roger Bannister a couru le mile en 3 min 59 s 4 le 6 mai 1954 à Oxford."},
  {id:'ru-e', n:'Philippidès', art:'🏛️', r:'e', f:"Selon la légende, ce messager courut de Marathon à Athènes pour annoncer la victoire."},
  {id:'ru-f', n:'Kipchoge', art:'🦅', r:'l', f:"En 2019 à Vienne, il a couru un marathon en 1 h 59 min 40 s, hors homologation officielle."}
 ]},
/* ---------- CULTURE ---------- */
{id:'ci', cat:'Culture', name:'Films & séries', icon:'🎬', c:'#e05bff', stl:['CHA','DRA','COM'], levels:[{name:'Parcours', chapters:[
  ch('ci1','Séries cultes',[['Un prof de chimie devient fabricant de drogue','Breaking Bad'],['Six amis à New York et le café Central Perk','Friends'],['Le Professeur organise un braquage à Madrid','La Casa de Papel'],['Thomas Shelby et son gang à Birmingham','Peaky Blinders'],['Hawkins, années 80 et le Monde à l’envers','Stranger Things'],['Michael Scott dirige Dunder Mifflin','The Office'],['Tony Soprano, mafieux du New Jersey','Les Soprano'],['Assane Diop, gentleman cambrioleur à Paris','Lupin']]),
  ch('ci2','Acteurs & rôles',[['Jack Sparrow','Johnny Depp'],['Iron Man (Marvel)','Robert Downey Jr.'],['Le Joker dans The Dark Knight','Heath Ledger'],['Forrest Gump','Tom Hanks'],['Jack dans Titanic','Leonardo DiCaprio'],['Hermione Granger','Emma Watson'],['Tony Montana dans Scarface','Al Pacino'],['Amélie Poulain','Audrey Tautou']]),
  ch('ci3','Films cultes',[['Réalisateur de Pulp Fiction','Quentin Tarantino'],['Réalisateur d’Inception','Christopher Nolan'],['Réalisateur du Parrain (1972)','Francis Ford Coppola'],['Plus gros succès mondial au box-office','Avatar (2009)'],['Duo des Intouchables','Omar Sy et François Cluzet'],['Film français le plus vu en France','Bienvenue chez les Ch’tis'],['1er film non anglophone Oscar du meilleur film','Parasite (2020)'],['Film de la réplique « Je suis ton père »','L’Empire contre-attaque']]),
  ch('ci4','Répliques cultes',[['« I’ll be back »','Terminator'],['« Why so serious? »','The Dark Knight'],['« Winter is coming »','Game of Thrones'],['« Say my name »','Breaking Bad'],['« Que la Force soit avec toi »','Star Wars'],['« Houston, on a un problème »','Apollo 13'],['« How you doin’? »','Friends'],['« Je s’appelle Groot »','Les Gardiens de la Galaxie']],1)]}],
 coll:[
  {id:'a-dicaprio', n:'Leonardo DiCaprio', pos:'ACTEUR', nat:'🇺🇸', team:'The Revenant', ovr:93, st:[95,96,80], f:"Oscar du meilleur acteur en 2016 pour The Revenant, après 5 nominations."},
  {id:'a-streep', n:'Meryl Streep', pos:'ACTRICE', nat:'🇺🇸', team:'Le Diable s’habille en Prada', ovr:95, st:[92,99,90], f:"Record de 21 nominations aux Oscars, pour 3 statuettes."},
  {id:'a-hanks', n:'Tom Hanks', pos:'ACTEUR', nat:'🇺🇸', team:'Forrest Gump', ovr:92, st:[94,93,91], f:"Oscar du meilleur acteur deux années de suite, en 1994 et 1995."},
  {id:'a-cranston', n:'Bryan Cranston', pos:'ACTEUR', nat:'🇺🇸', team:'Breaking Bad', ovr:90, st:[88,96,86], f:"4 Emmy Awards pour son rôle de Walter White."},
  {id:'a-murphy', n:'Cillian Murphy', pos:'ACTEUR', nat:'🇮🇪', team:'Peaky Blinders', ovr:89, st:[93,95,60], f:"Oscar du meilleur acteur 2024 pour Oppenheimer."},
  {id:'a-cotillard', n:'Marion Cotillard', pos:'ACTRICE', nat:'🇫🇷', team:'La Môme', ovr:89, st:[90,95,78], f:"Oscar 2008 pour son rôle d'Édith Piaf dans La Môme, un rôle en français."},
  {id:'a-omarsy', n:'Omar Sy', pos:'ACTEUR', nat:'🇫🇷', team:'Lupin', ovr:88, st:[97,82,95], f:"César du meilleur acteur 2012 pour Intouchables, premier acteur noir récompensé dans cette catégorie."},
  {id:'a-zendaya', n:'Zendaya', pos:'ACTRICE', nat:'🇺🇸', team:'Euphoria', ovr:87, st:[95,90,80], f:"Deux Emmy de la meilleure actrice dramatique pour Euphoria, la plus jeune à réussir ce doublé."},
  {id:'a-dujardin', n:'Jean Dujardin', pos:'ACTEUR', nat:'🇫🇷', team:'The Artist', ovr:86, st:[92,80,96], f:"Premier Français Oscar du meilleur acteur, en 2012."},
  {id:'a-pascal', n:'Pedro Pascal', pos:'ACTEUR', nat:'🇨🇱', team:'The Last of Us', ovr:85, st:[94,86,84], f:"Révélé par Game of Thrones dans le rôle d'Oberyn Martell, puis The Mandalorian."},
  {id:'a-chaplin', n:'Charlie Chaplin', pos:'ACTEUR', nat:'🇬🇧', team:'Icône', ovr:98, r:'i', st:[96,90,99], f:"Il écrivait, réalisait et composait la musique de ses propres films."},
  {id:'a-monroe', n:'Marilyn Monroe', pos:'ACTRICE', nat:'🇺🇸', team:'Icône', ovr:96, r:'i', st:[99,85,94], f:"Golden Globe 1960 pour Certains l'aiment chaud."},
  {id:'a-belmondo', n:'Jean-Paul Belmondo', pos:'ACTEUR', nat:'🇫🇷', team:'Icône', ovr:95, r:'i', st:[97,86,92], f:"Révélé en 1960 par À bout de souffle de Jean-Luc Godard."}
 ]}
];

const CATS = ['Langues','Métier','Sport','Culture'];
const RAR = {c:{n:'Commune',w:55,dup:10,col:'#c3cad5',sup:1000}, r:{n:'Rare',w:28,dup:20,col:'#3d7bff',sup:100}, e:{n:'Épique',w:12,dup:40,col:'#a35bff',sup:25}, l:{n:'Légendaire',w:4,dup:80,col:'#f2b318',sup:10}, i:{n:'Icône',w:1.2,dup:150,col:'#ff6fd2',sup:1}};
const RORDER = ['c','r','e','l','i'];
const rarOf = c=>c.r || (c.ovr>=92?'l':c.ovr>=89?'e':c.ovr>=85?'r':'c');
DOMAINS.forEach(d=>d.coll.forEach(c=>{ c.r=rarOf(c); c.dom=d; }));
const IV = [0,1,2,4,7,15];
const BOSS_NEED = 3;
const PACK_PRICE = 80, DPACK_PRICE = 110, FREEZE_PRICE = 150;
const QPOOL = [
 {t:'xp', n:[40,80], txt:n=>`Gagne ${n} XP`, r:30},
 {t:'lessons', n:[2,3], txt:n=>`Termine ${n} leçons`, r:30},
 {t:'maxCombo', n:[5,8], txt:n=>`Atteins un combo de ${n}`, r:25},
 {t:'perfect', n:[1], txt:()=>`Finis une leçon sans perdre de cœur`, r:35},
 {t:'review', n:[6,10], txt:n=>`Révise ${n} cartes`, r:25},
 {t:'memory', n:[1,2], txt:n=>`Gagne ${n} Memory`, r:20},
 {t:'correct', n:[20,30], txt:n=>`Donne ${n} bonnes réponses`, r:25},
 {t:'typed', n:[5,8], txt:n=>`Écris ${n} bonnes réponses en langue étrangère`, r:30},
 {t:'games', n:[1,2], txt:n=>`Joue ${n} mini-jeu${n>1?'x':''}`, r:25}
];
const BADGES = [
 {id:'first', n:'Premier pas', i:'🎯', d:'Terminer une leçon'},
 {id:'perfect', n:'Sans faute', i:'💎', d:'3 étoiles sur une leçon'},
 {id:'combo10', n:'Combo ×10', i:'⚡', d:'10 bonnes réponses d’affilée'},
 {id:'streak3', n:'Bien lancé', i:'🔥', d:'Série de 3 jours'},
 {id:'streak7', n:'Semaine de feu', i:'🌋', d:'Série de 7 jours'},
 {id:'coll10', n:'Collectionneur', i:'🃏', d:'10 cartes différentes'},
 {id:'legend', n:'Légende', i:'👑', d:'Une carte légendaire'},
 {id:'icon', n:'Icône', i:'🌟', d:'Une carte Icône'},
 {id:'boss', n:'Tombeur de boss', i:'🗝️', d:'Réussir un chapitre boss'},
 {id:'advanced', n:'Niveau avancé', i:'🎓', d:'Réussir un chapitre avancé'},
 {id:'polyglot', n:'Polyglotte', i:'🗣️', d:'Une étoile en anglais et en espagnol'},
 {id:'scanner', n:'Œil de lynx', i:'📸', d:'Traduire une photo'},
 {id:'creator', n:'Créateur', i:'✏️', d:'Créer son propre domaine'},
 {id:'gamer', n:'Joueur', i:'🎮', d:'Gagner un duel de cartes'},
 {id:'blitz20', n:'Éclair', i:'⏱️', d:'20 points au Défi minute'},
 {id:'picker', n:'Pro du picking', i:'🛒', d:'9 étoiles à la Tournée de picking'},
 {id:'tactician', n:'Tacticien', i:'♟️', d:'Gagner un duel tactique 5-0'},
 {id:'xp1000', n:'Mille XP', i:'🚀', d:'Atteindre 1 000 XP'}
];
const SCAN_LANGS = [['en','Anglais','en-GB','🇬🇧'],['es','Espagnol','es-ES','🇪🇸'],['it','Italien','it-IT','🇮🇹'],['de','Allemand','de-DE','🇩🇪'],['pt','Portugais','pt-PT','🇵🇹'],['ja','Japonais','ja-JP','🇯🇵']];

const SEASON='2026-27';
const TEAMS={
 'Real Madrid':{s:'RMA',c1:'#f1f1f1',c2:'#c9a227',l:'LaLiga'}, 'FC Barcelone':{s:'FCB',c1:'#a50044',c2:'#004d98',l:'LaLiga'},
 'Bayern Munich':{s:'BAY',c1:'#dc052d',c2:'#ffffff',l:'Bundesliga'}, 'Manchester City':{s:'MCI',c1:'#6cabdd',c2:'#1c2c5b',l:'Premier League'},
 'PSG':{s:'PSG',c1:'#004170',c2:'#da291c',l:'Ligue 1'}, 'Le Havre':{s:'HAC',c1:'#80b4e3',c2:'#002d62',l:'Ligue 1'}, 'Nice':{s:'OGCN',c1:'#c8102e',c2:'#111111',l:'Ligue 1'},
 'Rennes':{s:'SRFC',c1:'#e13327',c2:'#111111',l:'Ligue 1'}, 'Lille':{s:'LOSC',c1:'#e01e13',c2:'#24216a',l:'Ligue 1'}, 'Lens':{s:'RCL',c1:'#ffd200',c2:'#e30613',l:'Ligue 1'},
 'Aston Villa':{s:'AVL',c1:'#670e36',c2:'#95bfe5',l:'Premier League'}, 'Arsenal':{s:'ARS',c1:'#ef0107',c2:'#ffffff',l:'Premier League'}, 'Everton':{s:'EVE',c1:'#003399',c2:'#ffffff',l:'Premier League'},
 'Brentford':{s:'BRE',c1:'#e30613',c2:'#ffffff',l:'Premier League'}, 'Liverpool':{s:'LIV',c1:'#c8102e',c2:'#00b2a9',l:'Premier League'},
 'San Antonio Spurs':{s:'SAS',c1:'#c4ced4',c2:'#111111',l:'NBA'}, 'OKC Thunder':{s:'OKC',c1:'#007ac1',c2:'#ef3b24',l:'NBA'}, 'Miami Heat':{s:'MIA',c1:'#98002e',c2:'#f9a01b',l:'NBA'},
 'Philadelphia 76ers':{s:'PHI',c1:'#006bb6',c2:'#ed174c',l:'NBA'}, 'Golden State Warriors':{s:'GSW',c1:'#1d428a',c2:'#ffc72c',l:'NBA'}, 'Dallas Mavericks':{s:'DAL',c1:'#00538c',c2:'#b8c4ca',l:'NBA'},
 'Detroit Pistons':{s:'DET',c1:'#c8102e',c2:'#1d42ba',l:'NBA'}, 'Houston Rockets':{s:'HOU',c1:'#ce1141',c2:'#c4ced4',l:'NBA'}, 'Indiana Pacers':{s:'IND',c1:'#002d62',c2:'#fdbb30',l:'NBA'},
 'New York Knicks':{s:'NYK',c1:'#006bb6',c2:'#f58426',l:'NBA'}, 'Boston Celtics':{s:'BOS',c1:'#007a33',c2:'#ffffff',l:'NBA'}, 'Chicago Bulls':{s:'CHI',c1:'#ce1141',c2:'#111111',l:'NBA'},
 'Minnesota Timberwolves':{s:'MIN',c1:'#0c2340',c2:'#78be20',l:'NBA'}, 'LA Clippers':{s:'LAC',c1:'#c8102e',c2:'#1d428a',l:'NBA'}, 'Brooklyn Nets':{s:'BKN',c1:'#111111',c2:'#ffffff',l:'NBA'}
};
const NAT={'🇫🇷':['France','#1e3a8a','#ef4135'],'🇪🇸':['Espagne','#aa151b','#f1bf00'],'🇮🇹':['Italie','#009246','#ce2b37'],'🇷🇸':['Serbie','#c6363c','#0c4076'],
 '🇩🇪':['Allemagne','#1a1a1a','#dd0000'],'🇨🇦':['Canada','#d52b1e','#ffffff'],'🇧🇾':['Biélorussie','#c8313e','#4aa657'],'🇵🇱':['Pologne','#dc143c','#ffffff'],
 '🇺🇸':['États-Unis','#3c3b6e','#b22234'],'🇰🇿':['Kazakhstan','#00afca','#fec50c'],'🇨🇭':['Suisse','#d52b1e','#ffffff'],'🇳🇴':['Norvège','#ba0c2f','#00205b'],
 '🇧🇷':['Brésil','#009c3b','#ffdf00'],'🇦🇷':['Argentine','#74acdf','#ffffff'],'🇵🇹':['Portugal','#006600','#ff0000'],'🇬🇷':['Grèce','#0d5eaf','#ffffff'],
 '🇸🇮':['Slovénie','#005da4','#ed1c24'],'🇨🇱':['Chili','#0039a6','#d52b1e'],'🇮🇪':['Irlande','#169b62','#ff883e'],'🇬🇧':['Royaume-Uni','#012169','#c8102e'],
 '🏴󠁧󠁢󠁥󠁮󠁧󠁿':['Angleterre','#f4f4f4','#ce1124'],'🇳🇱':['Pays-Bas','#ae1c28','#21468b'],'🇬🇪':['Géorgie','#ff0000','#ffffff']};
const COMP_ICON={'Ligue 1':'🇫🇷','LaLiga':'🇪🇸','Premier League':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Bundesliga':'🇩🇪','NBA':'🇺🇸','NBA Cup':'🏆','ATP 500 Vienne':'🇦🇹'};
