export interface Project {
    id: string;
    title: string;
    industry: string;
    date: string;
    cover: string;
    brief: string;
    gallery: string[];
}

export const PROJECTS: Project[] = [
    {
        id: 'vanella',
        title: "Vanèlla",
        industry: "Design de Packaging",
        date: "Mars 2024",
        cover: "/vanella.png",
        brief: "Une refonte complète de l'identité visuelle et du packaging pour une marque de luxe. L'objectif était de créer une expérience sensorielle unique à travers des matériaux nobles et une typographie minimaliste.",
        gallery: ["/vanella.png", "/sac GM.png", "/vanella.png", "/sac GM.png", "/vanella.png"]
    },
    {
        id: 'valgrand',
        title: "Valgrand",
        industry: "Stratégie d'Identité",
        date: "Janvier 2024",
        cover: "/valgrand.png",
        brief: "Développement d'une stratégie de marque globale pour un cabinet d'architecture. Nous avons mis l'accent sur la précision structurelle et l'esthétique intemporelle.",
        gallery: ["/valgrand.png", "/valgrand 01.png", "/valgrand.png", "/valgrand 01.png"]
    },
    {
        id: 'diolata',
        title: "Diolata",
        industry: "Expérience Digitale",
        date: "Décembre 2023",
        cover: "/diolata.png",
        brief: "Conception d'une plateforme e-commerce haut de gamme. L'interface utilisateur a été pensée pour être aussi fluide qu'élégante, favorisant l'immersion dans l'univers produit.",
        gallery: ["/diolata.png", "/cirum.png", "/diolata.png", "/cirum.png"]
    },
    {
        id: 'vitalys',
        title: "Vitalys Pro",
        industry: "Écosystème de Marque",
        date: "Octobre 2023",
        cover: "/vitalyspro.png",
        brief: "Accompagnement d'un leader du bien-être pour la création de son écosystème de marque. Du logo à la stratégie de contenu, chaque point de contact a été optimisé.",
        gallery: ["/vitalyspro.png", "/vanella.png", "/vitalyspro.png", "/vanella.png"]
    },
    {
        id: 'aurora',
        title: "Aurora Labs",
        industry: "Innovation Digitale",
        date: "Août 2023",
        cover: "/boxes.png",
        brief: "Identité visuelle pour une startup tech. Le concept repose sur l'innovation modulaire et la transparence, reflétées par des formes géométriques pures.",
        gallery: ["/boxes.png", "/diolata.png", "/boxes.png", "/diolata.png"]
    },
    {
        id: 'cirum',
        title: "Cirum",
        industry: "Arts Visuels",
        date: "Juin 2023",
        cover: "/cirum.png",
        brief: "Direction artistique pour une galerie d'art contemporain. Une approche minimaliste qui laisse toute la place à l'expression artistique.",
        gallery: ["/cirum.png", "/valgrand 01.png", "/cirum.png", "/valgrand 01.png"]
    }
];
