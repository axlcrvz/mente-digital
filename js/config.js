
// Configuration file for easy customization
const CONFIG = {
    // Company Information
    company: {
        name: "Mente Digital Qro",
        tagline: "Conecta. Crea. Crece.",
        email: "info@mentedigitalqro.com",
        phone: "+52 *** *** ****",
        location: "Querétaro, México",
        website: "https://www.mentedigitalqro.com/",
        linkedIn: "https://www.linkedin.com/company/mente-digital-qro"
    },

    // Form Configuration
    form: {
        scriptURL: 'your-google-apps-script-url-here', // Replace with your actual URL
        thankYouPage: 'https://www.mentedigitalqro.com/gracias', // Replace with your thank you page
        fields: {
            name: { required: true, label: "Tu Nombre" },
            email: { required: true, label: "Tu Correo Electrónico" },
            company: { required: false, label: "Nombre de tu Empresa" }
        }
    },

    // Animation Settings
    animations: {
        scrollOffset: 100, // Pixels from bottom before triggering animations
        floatingSpeed: 20, // Seconds for floating animation cycle
        brandScrollSpeed: 20, // Seconds for brand scroll cycle
        shimmerSpeed: 7 // Seconds for shimmer effect cycle
    },

    // Layout Settings
    layout: {
        maxWidth: "1400px",
        headerPadding: "1.5rem 5%",
        sectionPadding: "6rem 5%"
    },

    // Color Themes (can be easily switched)
    themes: {
        default: {
            neon: "#ddf344",
            purple: "#382bf0",
            dark: "#191919",
            white: "#ffffff"
        },
        blue: {
            neon: "#00d4ff",
            purple: "#1e40af",
            dark: "#0f172a",
            white: "#ffffff"
        },
        green: {
            neon: "#10b981",
            purple: "#059669",
            dark: "#064e3b",
            white: "#ffffff"
        }
    },

    // Current active theme
    activeTheme: 'default',

    // Services Configuration
    services: [
        {
            number: 1,
            title: "Publicidad Digital",
            description: "Google Ads, Meta Ads, TikTok Ads y campañas optimizadas para maximizar tu ROI"
        },
        {
            number: 2,
            title: "Posicionamiento SEO",
            description: "SEO local y nacional para posicionar tu empresa en los primeros lugares de Google"
        },
        {
            number: 3,
            title: "Gestión de Redes Sociales",
            description: "Estrategias de contenido y community management para todas las plataformas"
        },
        {
            number: 4,
            title: "Diseño y Desarrollo Web",
            description: "Sitios web optimizados para SEO, velocidad y conversión"
        },
        {
            number: 5,
            title: "Email Marketing",
            description: "Automatización y campañas de email marketing personalizadas"
        },
        {
            number: 6,
            title: "Análisis y Reportes",
            description: "Medición de resultados con informes claros y métricas relevantes"
        }
    ],

    // Why Choose Us Configuration
    reasons: [
        {
            number: 1,
            title: "Experiencia Comprobada",
            description: "Somos una agencia de publicidad y marketing con años de experiencia acumulativa en el mercado local"
        },
        {
            number: 2,
            title: "Estrategias Personalizadas",
            description: "Expertos en estrategias personalizadas para empresas de todos los tamaños"
        },
        {
            number: 3,
            title: "Resultados Medibles",
            description: "Atención personalizada, informes claros y resultados medibles"
        }
    ],

    // Brand Logos
    brands: [
        { src: "images/mrtaco.PNG", alt: "Mr. Taco" },
        { src: "images/milkshake.JPG", alt: "Milkshake" },
        { src: "images/codigo-min.png", alt: "Código" }
    ]
};

// Function to apply theme
function applyTheme(themeName) {
    const theme = CONFIG.themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
    });
    
    CONFIG.activeTheme = themeName;
}

// Function to update company info
function updateCompanyInfo(newInfo) {
    Object.assign(CONFIG.company, newInfo);
    // Update DOM elements if needed
    updateDOMElements();
}

// Function to update DOM elements with config values
function updateDOMElements() {
    // Update footer company info
    const companyElements = {
        email: document.querySelector('[href^="mailto:"]'),
        phone: document.querySelector('[href^="tel:"]'),
        linkedin: document.querySelector('[href*="linkedin"]')
    };

    if (companyElements.email) {
        companyElements.email.href = `mailto:${CONFIG.company.email}`;
        companyElements.email.textContent = CONFIG.company.email;
    }
    
    if (companyElements.phone) {
        companyElements.phone.href = `tel:${CONFIG.company.phone}`;
        companyElements.phone.textContent = CONFIG.company.phone;
    }
    
    if (companyElements.linkedin) {
        companyElements.linkedin.href = CONFIG.company.linkedIn;
    }
}

// Export config for use in other files
window.CONFIG = CONFIG;
window.applyTheme = applyTheme;
window.updateCompanyInfo = updateCompanyInfo;
