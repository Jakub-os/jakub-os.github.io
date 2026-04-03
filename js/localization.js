(function () {
  var STORAGE_KEY = "yabi-language";
  var DEFAULT_LANGUAGE = "sk";
  var SUPPORTED_LANGUAGES = ["sk", "en"];
  var currentLanguage = DEFAULT_LANGUAGE;
  var state = {
    pageKey: null,
    pageSlug: null,
    mappings: [],
    mappingSnapshots: {},
    metaSnapshot: null,
    structuredDataElements: [],
    structuredDataSnapshots: []
  };

  var MONTH_NAMES = {
    január: "January",
    február: "February",
    marec: "March",
    apríl: "April",
    máj: "May",
    jún: "June",
    júl: "July",
    august: "August",
    september: "September",
    október: "October",
    november: "November",
    december: "December"
  };

  var translations = {
    sk: {
      common: {
        a11y: {
          mainNavigation: "Hlavná navigácia",
          openMenu: "Otvoriť menu",
          closeMenu: "Zavrieť menu",
          languageSwitcher: "Prepínač jazyka",
          homeLogo: "Prejsť na domovskú stránku",
          emailAddress: "E-mailová adresa",
          message: "Správa",
          moreAboutProjectPrefix: "Viac o projekte ",
          viewAllProjects: "Zobraziť všetky projekty",
          backToProjects: "Späť na stránku projektov",
          backToBlog: "Späť na prehľad blogových článkov",
          nextPage: "Ďalšia strana"
        },
        validation: {
          nameRequired: "Zadajte prosím meno.",
          emailRequired: "Zadajte prosím e-mailovú adresu.",
          emailInvalid: "Zadajte prosím platnú e-mailovú adresu.",
          messageRequired: "Napíšte prosím správu.",
          consentRequired: "Zaškrtnite prosím povinný súhlas.",
          genericRequired: "Vyplňte prosím toto pole."
        },
        alts: {
          logo: "Logo YABI Studio v tvare origami vtáka"
        },
        chipLabels: {
          yabiStudio: "Yabi Studio",
          projects: "Projekty",
          faq: "FAQ",
          contact: "Kontakt",
          about: "o nás",
          values: "naše hodnoty",
          tools: "nástroje",
          location: "Lokácia",
          services: "Služby",
          blog: "Blog",
          dictionary: "Slovník",
          webDesign: "Web dizajn",
          beginner: "Začiatočníci",
          advanced: "Pokročilý",
          business: "Biznis",
          launch: "Launch",
          performance: "Performance",
          seo: "SEO",
          content: "Obsah",
          automation: "Automatizácia",
          development: "Development",
          design: "Dizajn",
          analytics: "Analytics",
          maintenance: "Údržba",
          webflow: "Webflow",
          ai: "AI",
          ux: "UX",
          accessibility: "Prístupnosť",
          localization: "Lokalizácia",
          cms: "CMS",
          migration: "Migrácia",
          copy: "Copy",
          conversions: "Konverzie",
          uxUiDesign: "UX / UI dizajn",
          responsiveDesign: "Responzívny dizajn",
          uxResearch: "UX výskum",
          appDesign: "Dizajn aplikácií",
          productDesign: "Produktový dizajn",
          newsletter: "newsletter"
        }
      }
    },
    en: {
      common: {
        nav: {
          about: "About us",
          contact: "Contact",
          projects: "Projects",
          services: "Services",
          blog: "Blog",
          menu: "MENU"
        },
        footer: {
          terms: "Terms and conditions"
        },
        cta: {
          contactUs: "Contact us",
          moreProjects: "More projects",
          moreAboutProject: "More about the project",
          contactForm: "Contact form",
          back: "Back",
          subscribe: "Subscribe",
          send: "Send"
        },
        newsletter: {
          label: "newsletter",
          heading: "Do not miss news from the world of web design"
        },
        contactFooter: {
          label: "Contact",
          heading: "Let us connect"
        },
        projectCards: {
          clientLabel: "Client",
          timelineLabel: "Timeline",
          titles: ["Devio Website", "Lumi App", "Pathfinder App"],
          descriptions: [
            "A responsive website for Devio, an educational platform for aspiring developers that makes programming fundamentals accessible and easy to follow.",
            "An app for ordering refreshments at the cinema that makes the movie experience smoother and more enjoyable.",
            "A socially impactful app that connects people looking for work experience with companies and non-profit organizations."
          ],
          chips: [
            "UX / UI design",
            "Web design",
            "Responsive design",
            "UX research",
            "UX / UI design",
            "App design",
            "UX research",
            "Product design",
            "UX / UI design",
            "App design",
            "UX research",
            "Product design"
          ],
          alts: [
            "Preview of the Devio Website project",
            "Preview of the Lumi App project",
            "Preview of the Pathfinder App project"
          ]
        },
        faq: {
          label: "FAQ",
          heading: "Answers you are looking for",
          questions: [
            "How much does a website cost?",
            "How long does it take to build a website?",
            "Why use Webflow?",
            "Will I be able to edit the website myself?",
            "Is the website optimized for SEO?",
            "Do you also redesign existing websites?",
            "Will you help me after the website launches?",
            "What do you need from me at the start?"
          ],
          answers: [
            "The price depends on the scope, features and complexity of the design. Simple websites start in the low hundreds of euros, while larger projects are priced individually.",
            "Usually 2 to 6 weeks. It depends on the size of the project and the speed of feedback.",
            "Webflow makes it possible to build a fast, modern and fully responsive website without relying on developers, with easy content management.",
            "Yes. Webflow has an intuitive editor where you can update text, images and even your blog without technical knowledge.",
            "Yes. Every website is built with a solid SEO foundation, including metadata, speed and clean code.",
            "Yes. We can modernize your current website and improve both UX and performance.",
            "Yes. We offer support, maintenance and ongoing project development.",
            "Basic information about your business, your website goals and the content itself, such as copy and images. If you do not have it yet, we can help create it."
          ]
        },
        forms: {
          emailPlaceholder: "Your email",
          newsletterWait: "Please wait...",
          submitWait: "Please wait...",
          success: "Thank you. Your message was sent successfully.",
          error: "The submission failed. Please try again."
        },
        a11y: {
          mainNavigation: "Main navigation",
          openMenu: "Open menu",
          closeMenu: "Close menu",
          languageSwitcher: "Language switcher",
          homeLogo: "Go to homepage",
          emailAddress: "Email address",
          message: "Message",
          moreAboutProjectPrefix: "More about the project ",
          viewAllProjects: "View all projects",
          backToProjects: "Back to the projects page",
          backToBlog: "Back to the blog overview",
          nextPage: "Next page"
        },
        alts: {
          logo: "YABI Studio logo shaped like an origami bird"
        },
        chipLabels: {
          yabiStudio: "Yabi Studio",
          projects: "Projects",
          faq: "FAQ",
          contact: "Contact",
          about: "about us",
          values: "our values",
          tools: "tools",
          location: "Location",
          services: "Services",
          blog: "Blog",
          dictionary: "Dictionary",
          webDesign: "Web design",
          beginner: "Beginner",
          advanced: "Advanced",
          business: "Business",
          launch: "Launch",
          performance: "Performance",
          seo: "SEO",
          content: "Content",
          automation: "Automation",
          development: "Development",
          design: "Design",
          analytics: "Analytics",
          maintenance: "Maintenance",
          webflow: "Webflow",
          ai: "AI",
          ux: "UX",
          accessibility: "Accessibility",
          localization: "Localization",
          cms: "CMS",
          migration: "Migration",
          copy: "Copy",
          conversions: "Conversions",
          uxUiDesign: "UX / UI design",
          responsiveDesign: "Responsive design",
          uxResearch: "UX research",
          appDesign: "App design",
          productDesign: "Product design",
          newsletter: "newsletter"
        }
      },
      pages: {        index: {
          meta: {
            title: "YABI STUDIO - Custom Webflow websites | Design, strategy and delivery",
            description: "We design and build modern websites in Webflow. We combine strategy, UX design and performance so your website can grow with your business."
          },
          heroTag: "Yabi Studio",
          heroHeadingHtml: '<span class="hero-heading-line"><span class="hero-heading-word" style="--hero-word-delay: 0ms;">We build</span><span class="hero-heading-separator"> </span><span class="hero-heading-word text-span-3" style="--hero-word-delay: 90ms;">websites</span></span><span class="hero-heading-line"><span class="hero-heading-word" style="--hero-word-delay: 180ms;">that</span><span class="hero-heading-separator"> </span><span class="hero-heading-word" style="--hero-word-delay: 270ms;">work</span></span><span class="hero-heading-line"><span class="hero-heading-word text-span-2" style="--hero-word-delay: 360ms;">for</span><span class="hero-heading-separator"> </span><span class="hero-heading-word text-span-2" style="--hero-word-delay: 450ms;">you!</span></span>',
          heroDescription: "We create websites that combine aesthetics, strategy and top-tier UX design. From concept to launch, we deliver solutions that drive results.",
          projectsHeading: "See what we have<br>worked on"
        },
        about: {
          meta: {
            title: "YABI Studio - About us | Webflow studio focused on strategy and growth",
            description: "We are YABI Studio, a Webflow studio based in Bratislava. We combine strategy, UX and precise delivery so websites look great and drive results."
          },
          heroTag: "about us",
          heroTitle: "Design that drives results",
          heroDescription: "Hi, we are YABI Studio. We believe great design connects function with emotion.<br><br>With an eye for detail and a passion for story, we turn ideas into intuitive and engaging experiences.<br><br>We create websites and design that not only look good, but also feel natural and make sense.",
          valuesTag: "our values",
          valuesHeading: "Why an origami bird?",
          valuesDescription: "Every project we create is backed by a thoughtful, precise and technically solid process that turns a simple foundation into a clean, functional and visually strong result.<br><br>We design websites not just to look good, but above all to deliver real results. Every detail has a clear purpose and everything works in favor of your business.",
          toolsTag: "tools",
          toolsHeading: "We build your website<br>in Webflow",
          toolTitles: ["Everything under one roof", "Full control over content", "Speed as a foundation"],
          toolDescriptions: [
            "Update your website easily on your own. <br>Without a developer, without the stress.",
            "From idea to launch. Everything under one roof, without compromises.",
            "A clean solution without unnecessary extras. <br>Speed, optimization and conversions."
          ],
          locationTag: "Location",
          locationHeading: "Where are we based?",
          locationDescription: "We are a digital studio based in Bratislava, but our playground is the whole world. Thanks to our online way of working, we are close to you no matter where you are located. <br><br>Even under your bed?",
          alts: {
            values: "Collage of YABI Studio values and process",
            tools: "Preview of YABI Studio tools and Webflow workflow",
            location: "Photo of the YABI Studio location in Bratislava"
          }
        },
        services: {
          meta: {
            title: "YABI Studio - Services | Webflow websites, UX design and strategy",
            description: "We design and deliver websites in Webflow, UX design and digital strategy. We build solutions that support growth and conversions."
          },
          heroTag: "Services",
          heroTitle: "We turn ideas into timeless work",
          heroDescription: "We provide tailored services that combine our experience with innovative solutions and deliver exceptional results.",
          claimTag: "Projects",
          claimHeading: "We design digital solutions that feel natural and human.",
          serviceTitles: ["Web Design", "UX Design", "Interaction Design", "UI Design", "Graphic Design", "Illustrations"],
          serviceDescriptions: [
            "We design websites that combine aesthetics with functionality and deliver a real outcome.",
            "We design user interfaces that make even complex products simple and intuitive.",
            "We fine-tune every step so interactions feel intuitive.",
            "We turn pixels into intuitive and visually clean interfaces that work at first glance.",
            "We shape a distinctive visual identity that grabs attention and communicates instantly.",
            "We create illustrations and visuals that strengthen the brand atmosphere and complete the overall experience."
          ]
        },
        projects: {
          meta: {
            title: "YABI Studio - Projects | Websites and digital solutions in Webflow",
            description: "Explore examples of websites and digital solutions by YABI Studio. Our projects combine strategy, UX and visual design with a focus on outcomes."
          },
          heroTag: "Projects",
          heroTitle: "A selection of our most distinctive projects",
          heroDescription: "Browse our portfolio and discover bold, distinctive projects that reflect our expertise.",
          projectsHeading: "See what we have<br>worked on"
        },
        contact: {
          meta: {
            title: "YABI STUDIO - Contact | Let us start your new Webflow website",
            description: "Get in touch with YABI Studio and let us start your new Webflow website. We will turn your vision into a functional digital solution."
          },
          heroTag: "Contact",
          heroTitle: "Let us connect and turn your vision into reality.",
          heroDescription: "Let us turn your vision into reality together. Reach out and find out how we can create innovative and functional solutions that exceed your expectations.",
          formHeading: "Share your vision with us.",
          nameLabel: "Name",
          namePlaceholder: "Stefan Example",
          emailLabel: "Email address",
          emailPlaceholder: "stefan@example.com",
          messageLabel: "Message",
          messagePlaceholder: "Your message goes here",
          consentLabels: [
            'I consent to the <strong>processing of my personal data</strong> for the purpose of responding to my message in accordance with the <strong>privacy policy</strong>.',
            "I consent to the processing of my personal data for the purpose of receiving updates and marketing information."
          ]
        },
        blogList: {
          meta: {
            title: "Everything you need to know about web design | YABI Studio",
            description: "We help you understand web design in a simple and practical way. From the basics to more advanced tips that improve your website and your business."
          },
          heroTag: "Blog",
          heroTitle: "Everything you need to know about web design",
          heroDescription: "We help you understand web design in a simple and practical way. From the basics to more advanced tips that improve your website and your business.",
          featuredTitle: "Web Design Dictionary",
          featuredDescription: "The web design dictionary clearly explains the most common terms you will come across when building a website. From basics like layout and wireframe, through UX and UI, to technical topics such as SEO or CMS, everything is explained in one clear place.",
          featuredChips: ["Dictionary", "Web design"],
          featuredAlt: "Cover image for the article Web Design Dictionary",
          articleTitles: [
            "What to prepare before a web project so you do not lose time in revisions",
            "The cost of a slow website: lost leads, trust and SEO positions",
            "Blog as a growth engine: articles for relevant traffic",
            "Forms, CRM and automations: what happens after submission",
            "Design system in Webflow: why it saves time during updates",
            "How to measure website success: 7 metrics after launch"
          ],
          articleDescriptions: [
            "Goals, content, references, approvals and responsibilities — what to clarify in advance so the project runs more smoothly.",
            "A slow website is not just a technical problem. It is a quiet killer of conversions, trust and long-term growth.",
            "How to combine SEO, brand expertise and readability so a blog becomes a growth channel rather than just another website section.",
            "A good form is backed by an entire process — the right fields, lead routing, notifications and follow-up automations.",
            "Classes, components, naming and consistent decisions that keep a website from falling apart after the third revision.",
            "Traffic is not enough. We look at metrics that better reveal website quality, audience interest and business impact."
          ],
          articleChips: [
            "Beginner", "Business", "Launch",
            "Performance", "SEO", "Business",
            "Content", "SEO", "Business",
            "Advanced", "Automation", "Development",
            "Advanced", "Webflow", "Design",
            "Business", "Analytics", "Launch"
          ],
          articleAlts: [
            "Thumbnail for the article What to prepare before a web project so you do not lose time in revisions",
            "Thumbnail for the article The cost of a slow website: lost leads, trust and SEO positions",
            "Thumbnail for the article Blog as a growth engine: articles for relevant traffic",
            "Thumbnail for the article Forms, CRM and automations: what happens after submission",
            "Thumbnail for the article Design system in Webflow: why it saves time during updates",
            "Thumbnail for the article How to measure website success: 7 metrics after launch"
          ],
          nextPage: "Next"
        }
      }
    }
  };

  translations.sk.common.alts.articleImage = "Ilustračný obrázok {index} k článku {title}";
  translations.sk.common.alts.blogCover = "Titulný obrázok článku {title}";
  translations.sk.common.alts.blogThumbnail = "Náhľad článku {title}";
  translations.sk.common.alts.projectDetail = "Detail {index} rozhrania projektu {title}";

  translations.en.common.projectsSection = {
    label: "Projects",
    heading: "See what we have<br>worked on"
  };
  translations.en.common.alts.articleImage = "Illustration {index} for the article {title}";
  translations.en.common.alts.blogCover = "Cover image for the article {title}";
  translations.en.common.alts.blogThumbnail = "Thumbnail for the article {title}";
  translations.en.common.alts.projectDetail = "Interface detail {index} of the {title} project";

  var CHIP_LABEL_KEY_BY_TEXT = {
    'yabi studio': 'yabiStudio',
    'projekty': 'projects',
    'projects': 'projects',
    'faq': 'faq',
    'kontakt': 'contact',
    'contact': 'contact',
    'o nás': 'about',
    'about us': 'about',
    'naše hodnoty': 'values',
    'our values': 'values',
    'nástroje': 'tools',
    'tools': 'tools',
    'lokácia': 'location',
    'location': 'location',
    'služby': 'services',
    'services': 'services',
    'blog': 'blog',
    'slovník': 'dictionary',
    'dictionary': 'dictionary',
    'webdizajn': 'webDesign',
    'web dizajn': 'webDesign',
    'web design': 'webDesign',
    'začiatočníci': 'beginner',
    'začiatocníci': 'beginner',
    'začiatočníi': 'beginner',
    'beginner': 'beginner',
    'pokročilý': 'advanced',
    'advanced': 'advanced',
    'biznis': 'business',
    'business': 'business',
    'launch': 'launch',
    'performance': 'performance',
    'seo': 'seo',
    'obsah': 'content',
    'content': 'content',
    'automatizácia': 'automation',
    'automation': 'automation',
    'development': 'development',
    'delopment': 'development',
    'dizajn': 'design',
    'design': 'design',
    'analytics': 'analytics',
    'údržba': 'maintenance',
    'maintenance': 'maintenance',
    'webflow': 'webflow',
    'ai': 'ai',
    'ux': 'ux',
    'prístupnosť': 'accessibility',
    'accessibility': 'accessibility',
    'lokalizácia': 'localization',
    'localization': 'localization',
    'cms': 'cms',
    'migrácia': 'migration',
    'migration': 'migration',
    'copy': 'copy',
    'konverzie': 'conversions',
    'conversions': 'conversions',
    'ux / ui dizajn': 'uxUiDesign',
    'ux / ui design': 'uxUiDesign',
    'responzívny dizajn': 'responsiveDesign',
    'responsive design': 'responsiveDesign',
    'ux výskum': 'uxResearch',
    'ux research': 'uxResearch',
    'dizajn aplikácií': 'appDesign',
    'app design': 'appDesign',
    'produktový dizajn': 'productDesign',
    'product design': 'productDesign',
    'newsletter': 'newsletter'
  };

  translations.sk.blog = {
    pagination: {
      ariaLabel: "Stránkovanie blogu",
      previousAria: "Predchádzajúca strana blogu",
      nextAria: "Ďalšia strana blogu",
      previous: "späť",
      next: "ďalej"
    },
    featured: {
      slug: "webdesign-dictionary",
      href: "/articles/webdesign-dictionary.html",
      image: "../images/articles/webdesign-dictionary/webdesign-dictionary-thumbnail.jpg",
      title: "Slovník webdesignu",
      description: "Slovník webdesignu ti jednoducho vysvetlí najčastejšie pojmy, s ktorými sa stretneš pri tvorbe webu. Od základov ako layout či wireframe, cez UX a UI až po technické veci ako SEO či CMS, všetko prehľadne a zrozumiteľne na jednom mieste.",
      chips: ["Slovník", "Webdizajn"],
      date: "2026-03-12T00:00:00.000Z"
    },
    articles: []
  };

  translations.en.blog = {
    pagination: {
      ariaLabel: "Blog pagination",
      previousAria: "Previous blog page",
      nextAria: "Next blog page",
      previous: "Back",
      next: "Next"
    },
    featured: {
      slug: "webdesign-dictionary",
      href: "/articles/webdesign-dictionary.html",
      image: "../images/articles/webdesign-dictionary/webdesign-dictionary-thumbnail.jpg",
      title: "Web Design Dictionary",
      description: "The web design dictionary clearly explains the most common terms you will come across when building a website. From basics like layout and wireframe, through UX and UI, to technical topics such as SEO or CMS, everything is explained in one clear place.",
      chips: ["Dictionary", "Web design"],
      date: "2026-03-12T00:00:00.000Z"
    },
    articles: []
  };

  translations.sk.blog.articles = translations.sk.blog.articles.concat([
    {
      slug: "wordpress-to-webflow",
      href: "/articles/wordpress-to-webflow.html",
      image: "../images/articles/wordpress-to-webflow/wordpress-to-webflow-thumbnail.jpg",
      title: "Migrácia z WordPressu do Webflow: čo si premyslieť pred presunom",
      description: "Obsah, SEO, URL štruktúra aj workflow tímu — čo ovplyvní hladký presun do Webflow.",
      chips: ["Pokročilý", "Migrácia", "Webflow"],
      date: "2026-03-27T18:01:30.061Z"
    },
    {
      slug: "webflow-animation",
      href: "/articles/webflow-animation.html",
      image: "../images/articles/webflow-animation/webflow-animation-thumbnail.jpg",
      title: "Webflow animácie: wow efekt bez spomalenia",
      description: "Kedy motion pomáha brandu a kedy len ruší, spomaľuje a zhoršuje použiteľnosť.",
      chips: ["Pokročilý", "Performance", "Development"],
      date: "2026-03-27T18:01:24.758Z"
    },
    {
      slug: "web-maitenence",
      href: "/articles/web-maitenence.html",
      image: "../images/articles/website-maintenance/web-maitenence-thumbnail.jpg",
      title: "Mesačná údržba webu: čo robiť, aby ste predišli problémom",
      description: "Obsah, formuláre, SEO hygiena aj technické kontroly, ktoré sa oplatí riešiť pravidelne.",
      chips: ["Údržba", "Performance", "Biznis"],
      date: "2026-03-27T18:01:20.130Z"
    },
    {
      slug: "web-redesign",
      href: "/articles/web-redesign.html",
      image: "../images/articles/web-redesign/web-redesign-thumbnail.jpg",
      title: "Kedy je čas na redesign webu: 9 signálov, že brzdí biznis",
      description: "Signály, že z vizuálneho problému sa stáva obchodná brzda a redesign už netreba odkladať.",
      chips: ["Biznis", "UX", "Dizajn"],
      date: "2026-03-27T18:01:14.914Z"
    },
    {
      slug: "hero-section",
      href: "/articles/hero-section.html",
      image: "../images/articles/hero-section/hero-section-thumbnail.jpg",
      title: "Dizajn, ktorý vedie ku kliknutiu: hero sekcia, CTA a flow",
      description: "Ako poskladať prvú sekciu tak, aby jasne komunikovala hodnotu a viedla ku kliknutiu.",
      chips: ["Začiatočníci", "Dizajn", "Konverzie"],
      date: "2026-03-27T18:01:09.725Z"
    },
    {
      slug: "webflow-cms",
      href: "/articles/webflow-cms.html",
      image: "../images/articles/webflow-cms/webflow-cms-thumbnail.jpg",
      title: "Ako navrhnúť CMS vo Webflow, aby blog nebol chaos",
      description: "Collections, polia a workflow, ktoré udržia blog prehľadný aj pri raste obsahu.",
      chips: ["Pokročilý", "CMS", "Webflow"],
      date: "2026-03-27T18:01:04.877Z"
    }
  ]);

  translations.en.blog.articles = translations.en.blog.articles.concat([
    {
      slug: "wordpress-to-webflow",
      href: "/articles/wordpress-to-webflow.html",
      image: "../images/articles/wordpress-to-webflow/wordpress-to-webflow-thumbnail.jpg",
      title: "Migration from WordPress to Webflow: what to think through before the move",
      description: "Content, SEO, URL structure and team workflow: what influences a smooth move to Webflow.",
      chips: ["Advanced", "Migration", "Webflow"],
      date: "2026-03-27T18:01:30.061Z"
    },
    {
      slug: "webflow-animation",
      href: "/articles/webflow-animation.html",
      image: "../images/articles/webflow-animation/webflow-animation-thumbnail.jpg",
      title: "Webflow animations: wow effect without the slowdown",
      description: "When motion helps the brand and when it only distracts, slows the site down and hurts usability.",
      chips: ["Advanced", "Performance", "Development"],
      date: "2026-03-27T18:01:24.758Z"
    },
    {
      slug: "web-maitenence",
      href: "/articles/web-maitenence.html",
      image: "../images/articles/website-maintenance/web-maitenence-thumbnail.jpg",
      title: "Monthly website maintenance: what to do to prevent problems",
      description: "Content, forms, SEO hygiene and technical checks that are worth handling regularly.",
      chips: ["Maintenance", "Performance", "Business"],
      date: "2026-03-27T18:01:20.130Z"
    },
    {
      slug: "web-redesign",
      href: "/articles/web-redesign.html",
      image: "../images/articles/web-redesign/web-redesign-thumbnail.jpg",
      title: "When is it time for a website redesign: 9 signs it is holding the business back",
      description: "Signals that a visual problem is becoming a business bottleneck and a redesign should no longer be postponed.",
      chips: ["Business", "UX", "Design"],
      date: "2026-03-27T18:01:14.914Z"
    },
    {
      slug: "hero-section",
      href: "/articles/hero-section.html",
      image: "../images/articles/hero-section/hero-section-thumbnail.jpg",
      title: "Design that leads to a click: hero section, CTA and flow",
      description: "How to build the first section so it clearly communicates value and leads to a click.",
      chips: ["Beginner", "Design", "Conversions"],
      date: "2026-03-27T18:01:09.725Z"
    },
    {
      slug: "webflow-cms",
      href: "/articles/webflow-cms.html",
      image: "../images/articles/webflow-cms/webflow-cms-thumbnail.jpg",
      title: "How to structure a CMS in Webflow so your blog does not become chaos",
      description: "Collections, fields and workflows that keep a blog organized as content grows.",
      chips: ["Advanced", "CMS", "Webflow"],
      date: "2026-03-27T18:01:04.877Z"
    }
  ]);

  translations.sk.blog.articles = translations.sk.blog.articles.concat([
    {
      slug: "seo-webflow",
      href: "/articles/seo-webflow.html",
      image: "../images/articles/seo-webflow/seo-webflow-thumbnail.jpg",
      title: "SEO vo Webflow: launch checklist bez zbytočnej teórie",
      description: "Praktický checklist pred launchom, aby bol web čistý, indexovateľný a pripravený rásť.",
      chips: ["Začiatočníci", "Performance", "Konverzie"],
      date: "2026-03-27T18:01:00.259Z"
    },
    {
      slug: "increasing-conversion",
      href: "/articles/increasing-conversion.html",
      image: "../images/articles/increasing-conversion/zvysovanie-konverzie-thumbnail.jpg",
      title: "11 chýb, ktoré spomaľujú web a znižujú konverzie",
      description: "Konkrétne chyby, ktoré spomaľujú web, znižujú dôveru a oberajú ho o konverzie.",
      chips: ["Začiatočníci", "Performance", "Konverzie"],
      date: "2026-03-27T18:00:56.632Z"
    },
    {
      slug: "webflow-no-code",
      href: "/articles/webflow-no-code.html",
      image: "../images/articles/webflow-no-code/webflow-no-code-thumbnail.jpg",
      title: "Čo je Webflow a prečo už nie je len no-code nástroj",
      description: "Kde Webflow zrýchľuje proces a prečo dnes funguje aj mimo nálepky no-code.",
      chips: ["Pokročilý", "Webflow", "Development"],
      date: "2026-03-27T18:00:52.547Z"
    },
    {
      slug: "live-launch",
      href: "/articles/live-launch.html",
      image: "../images/articles/live-launch/live-launch-thumbnail.jpg",
      title: "Ako vzniká moderný web: od prvého callu po launch",
      description: "Čo sa deje medzi prvým callom a hotovým webom — stratégia, wireframy, dizajn aj launch.",
      chips: ["Začiatočníci", "Webflow", "Launch"],
      date: "2026-03-27T18:00:47.969Z"
    },
    {
      slug: "web-accessibility",
      href: "/articles/web-accessibility.html",
      image: "../images/articles/web-accessibility/web-accessibility-thumbnail.jpg",
      title: "Prístupnosť webu: malé úpravy pre lepší UX a výkon",
      description: "Kontrast, focus states, alt texty a čitateľnosť — malé úpravy s veľkým dopadom.",
      chips: ["Začiatočníci", "Prístupnosť", "UX"],
      date: "2026-03-27T18:00:43.927Z"
    },
    {
      slug: "web-ai-chatbot",
      href: "/articles/web-ai-chatbot.html",
      image: "../images/articles/web-ai-chatbot/web-ai-chatbot-thumbnail.jpg",
      title: "Kde vie AI pri tvorbe webu naozaj ušetriť čas",
      description: "Kde AI pri tvorbe webu šetrí čas a kde stále potrebuje pevnú ruku dizajnéra a developera.",
      chips: ["Pokročilý", "AI", "Biznis"],
      date: "2026-03-27T18:00:40.490Z"
    }
  ]);

  translations.en.blog.articles = translations.en.blog.articles.concat([
    {
      slug: "seo-webflow",
      href: "/articles/seo-webflow.html",
      image: "../images/articles/seo-webflow/seo-webflow-thumbnail.jpg",
      title: "SEO in Webflow: a launch checklist without unnecessary theory",
      description: "A practical pre-launch checklist so the website is clean, indexable and ready to grow.",
      chips: ["Beginner", "Performance", "Conversions"],
      date: "2026-03-27T18:01:00.259Z"
    },
    {
      slug: "increasing-conversion",
      href: "/articles/increasing-conversion.html",
      image: "../images/articles/increasing-conversion/zvysovanie-konverzie-thumbnail.jpg",
      title: "11 mistakes that slow down websites and hurt conversions",
      description: "Specific mistakes that slow websites down, reduce trust and cost them conversions.",
      chips: ["Beginner", "Performance", "Conversions"],
      date: "2026-03-27T18:00:56.632Z"
    },
    {
      slug: "webflow-no-code",
      href: "/articles/webflow-no-code.html",
      image: "../images/articles/webflow-no-code/webflow-no-code-thumbnail.jpg",
      title: "What is Webflow and why it is no longer just a no-code tool",
      description: "Where Webflow speeds up the process and why it now works far beyond the no-code label.",
      chips: ["Advanced", "Webflow", "Development"],
      date: "2026-03-27T18:00:52.547Z"
    },
    {
      slug: "live-launch",
      href: "/articles/live-launch.html",
      image: "../images/articles/live-launch/live-launch-thumbnail.jpg",
      title: "How a modern website is made: from the first call to launch",
      description: "What happens between the first call and a finished website: strategy, wireframes, design and launch.",
      chips: ["Beginner", "Webflow", "Launch"],
      date: "2026-03-27T18:00:47.969Z"
    },
    {
      slug: "web-accessibility",
      href: "/articles/web-accessibility.html",
      image: "../images/articles/web-accessibility/web-accessibility-thumbnail.jpg",
      title: "Website accessibility: small improvements for better UX and performance",
      description: "Contrast, focus states, alt text and readability: small adjustments with a big impact.",
      chips: ["Beginner", "Accessibility", "UX"],
      date: "2026-03-27T18:00:43.927Z"
    },
    {
      slug: "web-ai-chatbot",
      href: "/articles/web-ai-chatbot.html",
      image: "../images/articles/web-ai-chatbot/web-ai-chatbot-thumbnail.jpg",
      title: "Where AI can really save time in web creation",
      description: "Where AI saves time in web creation and where it still needs the steady hand of a designer and developer.",
      chips: ["Advanced", "AI", "Business"],
      date: "2026-03-27T18:00:40.490Z"
    }
  ]);

  translations.sk.blog.articles = translations.sk.blog.articles.concat([
    {
      slug: "web-locale",
      href: "/articles/web-locale.html",
      image: "../images/articles/web-locale/web-locale-thumbnail.jpg",
      title: "Multijazyčný web vo Webflow: SEO, workflow bez duplicít",
      description: "Ako uchopiť lokalizáciu tak, aby ste neduplikovali chaos a nestratili organickú viditeľnosť.",
      chips: ["Pokročilý", "Lokalizácia", "SEO"],
      date: "2026-03-27T18:00:27.222Z"
    },
    {
      slug: "measuring-web-success",
      href: "/articles/measuring-web-success.html",
      image: "../images/articles/measuring-web-success/measuring-web-success-thumbnail.png",
      title: "Ako merať úspech webu: 7 metrík po launche",
      description: "Návštevnosť nestačí — metriky, ktoré lepšie ukazujú kvalitu webu a obchodný efekt.",
      chips: ["Biznis", "Analytics", "Launch"],
      date: "2026-03-27T18:00:18.108Z"
    },
    {
      slug: "design-systemin-webflow",
      href: "/articles/design-systemin-webflow.html",
      image: "../images/articles/design-system-in-webflow/design-system-in-webflow-thumbnail.jpg",
      title: "Design systém vo Webflow: prečo šetrí čas pri úpravách",
      description: "Triedy, komponenty a naming, ktoré šetria čas pri úpravách a držia web konzistentný.",
      chips: ["Pokročilý", "Webflow", "Dizajn"],
      date: "2026-03-27T18:00:13.747Z"
    },
    {
      slug: "forms-crm",
      href: "/articles/forms-crm.html",
      image: "../images/articles/forms-crm/forms-crm-thumbnail.jpg",
      title: "Formuláre, CRM a automatizácie: čo sa deje po odoslaní",
      description: "Čo sa deje po odoslaní formulára — routing leadov, notifikácie a nadväzujúce automatizácie.",
      chips: ["Pokročilý", "Automatizácia", "Development"],
      date: "2026-03-27T18:00:09.204Z"
    },
    {
      slug: "creating-blogs",
      href: "/articles/creating-blogs.html",
      image: "../images/articles/creating-blogs/creating-blogs-thumbnail.jpg",
      title: "Blog ako growth engine: články pre relevantnú návštevnosť",
      description: "Ako spojiť SEO, expertízu značky a čitateľnosť tak, aby blog fungoval ako rastový kanál.",
      chips: ["Obsah", "SEO", "Biznis"],
      date: "2026-03-27T18:00:03.325Z"
    },
    {
      slug: "performance-optimalization",
      href: "/articles/performance-optimalization.html",
      image: "../images/articles/performance-optimization/performance-optimalization-thumbnail.jpg",
      title: "Koľko stojí pomalý web: strata leadov, dôvery a SEO pozícií",
      description: "Pomalý web nie je len technický problém — stojí leady, dôveru aj SEO pozície.",
      chips: ["Performance", "SEO", "Biznis"],
      date: "2026-03-27T17:59:58.344Z"
    },
    {
      slug: "start-web-project",
      href: "/articles/start-web-project.html",
      image: "../images/articles/start-web-project/start-web-project-thumbnail.jpg",
      title: "Čo pripraviť pred web projektom, aby ste nestrácali čas v revíziách",
      description: "Ciele, obsah, referencie a schvaľovanie — čo si ujasniť vopred, aby projekt nestrácal tempo.",
      chips: ["Začiatočníci", "Biznis", "Launch"],
      date: "2026-03-27T17:59:54.883Z"
    },
    {
      slug: "landing-page",
      href: "/articles/landing-page.html",
      image: "../images/articles/landing-page/landing-page-thumbnail.jpg",
      title: "Landing page, ktorá konvertuje: štruktúra, copy a prvky dôvery",
      description: "Štruktúra, copy a prvky dôvery, ktoré pomáhajú landing page prirodzene konvertovať.",
      chips: ["Začiatočníci", "Copy", "Konverzie"],
      date: "2026-03-18T20:14:54.833Z"
    }
  ]);

  translations.en.blog.articles = translations.en.blog.articles.concat([
    {
      slug: "web-locale",
      href: "/articles/web-locale.html",
      image: "../images/articles/web-locale/web-locale-thumbnail.jpg",
      title: "Multilingual website in Webflow: SEO and workflow without duplication",
      description: "How to approach localization without duplicating chaos or losing organic visibility.",
      chips: ["Advanced", "Localization", "SEO"],
      date: "2026-03-27T18:00:27.222Z"
    },
    {
      slug: "measuring-web-success",
      href: "/articles/measuring-web-success.html",
      image: "../images/articles/measuring-web-success/measuring-web-success-thumbnail.png",
      title: "How to measure website success: 7 metrics after launch",
      description: "Traffic is not enough: metrics that better reflect website quality and business impact.",
      chips: ["Business", "Analytics", "Launch"],
      date: "2026-03-27T18:00:18.108Z"
    },
    {
      slug: "design-systemin-webflow",
      href: "/articles/design-systemin-webflow.html",
      image: "../images/articles/design-system-in-webflow/design-system-in-webflow-thumbnail.jpg",
      title: "Design system in Webflow: why it saves time during updates",
      description: "Classes, components and naming that save time during updates and keep the website consistent.",
      chips: ["Advanced", "Webflow", "Design"],
      date: "2026-03-27T18:00:13.747Z"
    },
    {
      slug: "forms-crm",
      href: "/articles/forms-crm.html",
      image: "../images/articles/forms-crm/forms-crm-thumbnail.jpg",
      title: "Forms, CRM and automations: what happens after submission",
      description: "What happens after a form is submitted: lead routing, notifications and follow-up automations.",
      chips: ["Advanced", "Automation", "Development"],
      date: "2026-03-27T18:00:09.204Z"
    },
    {
      slug: "creating-blogs",
      href: "/articles/creating-blogs.html",
      image: "../images/articles/creating-blogs/creating-blogs-thumbnail.jpg",
      title: "Blog as a growth engine: articles for relevant traffic",
      description: "How to combine SEO, brand expertise and readability so the blog works as a growth channel.",
      chips: ["Content", "SEO", "Business"],
      date: "2026-03-27T18:00:03.325Z"
    },
    {
      slug: "performance-optimalization",
      href: "/articles/performance-optimalization.html",
      image: "../images/articles/performance-optimization/performance-optimalization-thumbnail.jpg",
      title: "The cost of a slow website: lost leads, trust and SEO rankings",
      description: "A slow website is not just a technical issue: it costs leads, trust and SEO rankings.",
      chips: ["Performance", "SEO", "Business"],
      date: "2026-03-27T17:59:58.344Z"
    },
    {
      slug: "start-web-project",
      href: "/articles/start-web-project.html",
      image: "../images/articles/start-web-project/start-web-project-thumbnail.jpg",
      title: "What to prepare before a web project so you do not lose time in revisions",
      description: "Goals, content, references and approvals: what to clarify upfront so the project does not lose momentum.",
      chips: ["Beginner", "Business", "Launch"],
      date: "2026-03-27T17:59:54.883Z"
    },
    {
      slug: "landing-page",
      href: "/articles/landing-page.html",
      image: "../images/articles/landing-page/landing-page-thumbnail.jpg",
      title: "Landing page that converts: structure, copy and trust elements",
      description: "Structure, copy and trust elements that help a landing page convert naturally.",
      chips: ["Beginner", "Copy", "Conversions"],
      date: "2026-03-18T20:14:54.833Z"
    }
  ]);

  translations.en.projectDetails = {
    "devio-website": {
      meta: {
        title: "Devio Website | Project YABI Studio",
        description: "Responsive educational platform for aspiring developers that makes programming fundamentals accessible through clear UX and structured content."
      },
      title: "Devio Website",
      labels: {
        client: "Client",
        timeline: "Project timeline",
        goal: "Our goal",
        overview: "Overview",
        tags: "Tags"
      },
      client: "Google Certificate",
      timeline: "7 September 2023",
      goal: "Our goal with Devio was to make programming accessible to complete beginners and remove the fear barrier around code.",
      overview: "An interactive learning tool for aspiring developers that makes programming easier to approach through structured lessons and a gamified learning flow.",
      chips: ["UX / UI design", "Web design", "Responsive design", "UX research"]
    },
    "lumi-app": {
      meta: {
        title: "Lumi App | Project YABI Studio",
        description: "Mobile cinema app that lets visitors pre-order and customize refreshments, shortens waiting time and improves the movie-going experience."
      },
      title: "Lumi App",
      labels: {
        client: "Client",
        timeline: "Project timeline",
        goal: "Our goal",
        overview: "Overview",
        tags: "Tags"
      },
      client: "Google Certificate",
      timeline: "August 2024",
      goal: "Our goal with Lumi was to simplify and improve the whole cinema experience, from arrival to the first scene of the film.",
      overview: "A mobile app that lets cinema visitors pre-order and customize refreshments, reducing waiting time and improving the overall visit experience.",
      chips: ["UX / UI design", "App design", "UX research", "Product design"]
    },
    "pathfinder-app": {
      meta: {
        title: "Pathfinder App | Project YABI Studio",
        description: "Pathfinder connects job seekers, interns and volunteers with relevant opportunities through intuitive product design."
      },
      title: "Pathfinder App",
      labels: {
        client: "Client",
        timeline: "Project timeline",
        goal: "Our goal",
        overview: "Overview",
        tags: "Tags"
      },
      client: "Google Certificate",
      timeline: "July 2023",
      goal: "Our goal was to design a platform that clearly connects people looking for work, internships or volunteering with relevant opportunities.",
      overview: "A socially impactful platform concept that connects people looking for experience with companies and non-profit organizations through an intuitive product flow.",
      chips: ["UX / UI design", "App design", "UX research", "Product design"]
    }
  };

  translations.en.articleContent = {};

  translations.en.articleContent["webdesign-dictionary"] = [
    `<p>Web design has its own language. If you are not familiar with it, terms like <strong><em>wireframe</em></strong>, <strong><em>hero section</em> or <em>CTA</em></strong> can sound fairly unclear.<br>The good news is that most of these terms are actually simple. Once you understand them, the whole website creation process starts to make much more sense.</p><p>&zwj;</p><h2>Basic terms you will encounter on almost every website</h2><p>&zwj;</p><p><strong>Layout</strong><br>&rarr; <em>page arrangement</em><br>The way content is arranged on a website - it determines where the header, text, images or buttons are placed.<br>It helps the user quickly understand the structure and the important elements.</p><p>&zwj;</p><p><strong>Wireframe</strong><br>&rarr; <em>page skeleton / structural draft</em><br>A simple website draft without colors or visual detail.<br>It serves as the basic structure that shows what will go where before the final design is created.</p><p>&zwj;</p><p><strong>Hero section</strong><br>&rarr; <em>main opening section</em><br>The top part of a page, most often on the homepage, that the user sees first.<br>It usually contains a headline, short text, visuals and often a call to action.</p><p>&zwj;</p><p><strong>CTA (Call to Action)</strong><br>&rarr; <em>prompt to take action</em><br>An element, most often a button, that leads the user to the next step<br>- for example "Contact us", "Learn more" or "Order now".</p>`,
    `<h2>2. Terms related to user experience</h2><p>&zwj;</p><p>In web design, it is not enough for a page to simply look good. It also has to be easy to use.</p><p>This is where <strong>UX</strong>, or <em>User Experience</em>, comes in. The term describes the overall experience a user has with a website</p><p>- whether they can orient themselves on the page, whether they can quickly find information and whether nothing gets in their way unnecessarily.</p><p>&zwj;</p><p><strong>UI (User Interface)</strong><br>&rarr; <em>the user-facing interface</em><br>The visual form of the website - including colors, typography, buttons, icons and the overall style. In simple terms: UI determines what the website looks like.</p><p>&zwj;</p><p><strong>Responsiveness (Responsive design)</strong><br>&rarr; <em>responsive behavior / responsive design</em><br>The ability of a website to adapt to different devices - mobile, tablet and desktop.<br>It ensures that the website remains usable on every screen size.</p><p>&zwj;</p><p><strong>User flow</strong><br>&rarr; <em>the user's path</em><br>The journey a user takes through the website from the first visit to the goal, for example from opening a page to making a purchase or submitting a form. A logical flow improves the overall usability of the website.</p>`,
    `<h2>3. Technical terms worth knowing</h2><p>&zwj;</p><p><strong>CMS (Content Management System)</strong><br>&rarr; <em>content management system</em><br>A tool used to manage website content without coding. It allows you to edit text, images or blog posts. Example: WordPress.</p><p>&zwj;</p><p><strong>SEO (Search Engine Optimization)</strong><br>&rarr; <em>search engine optimization</em><br>A set of practices that help a website appear higher in search results.<br>It includes quality content, correct structure, website speed and technical setup.</p><p>&zwj;</p><p><strong>Loading speed</strong><br>&rarr; <em>load speed</em><br>The time it takes for a website to load. Slow loading can cause users to leave the page before they even explore it.</p><p>&zwj;</p><p><strong>Conversion</strong><br>&rarr; <em>conversion</em><br>The moment when a user performs a desired action - for example submitting a form, buying a product or booking a service.</p><p>&zwj;</p><p>&zwj;</p><h2>Conclusion</h2><p>&zwj;</p><p>A web design dictionary may feel complicated at first glance, but most of these terms have a very practical meaning.<br>When you understand the basic vocabulary, it becomes much easier to communicate with designers, developers and the marketing team.<br>And most importantly - you understand much better what makes a website truly functional.</p>`
  ];

  translations.en.articleContent["wordpress-to-webflow"] = [
    `<h3>Why a migration from WordPress to Webflow is not just a technical move</h3><p>&zwj;</p><p>Migrating a website from WordPress to Webflow often looks like a simple transfer of content from one platform to another. In reality, it is a much more important decision. It is not only about moving pages, blog posts and images, but about how the new website will work, how it will be managed and whether it will support brand growth better. That is exactly why it makes sense to think about migration strategically, not only technically.</p><p>&zwj;</p><p>WordPress has been a very widespread solution for years, but many projects eventually start running into limits. The website becomes dependent on plugins, maintenance gets more complicated, performance drops and even smaller edits often take more time than they should. Webflow is attractive for many brands precisely because it offers a cleaner workflow, greater visual control and easier content management without an unnecessary layer of chaos.</p><p>&zwj;</p><p>Before the move itself, it is important to understand what is actually being migrated. Some companies only want to preserve the existing website in a more modern system. Others want to improve the design, structure, SEO or CMS model at the same time. And this is exactly where the difference appears between a simple migration and a true redesign combined with a platform move. If a brand does not realize this at the beginning, the project can very quickly become unclear, slow and full of unnecessary compromises.</p><p>&zwj;</p><p>A good migration therefore does not start with exporting data. It starts with an audit of what should stay, what should disappear and what the new Webflow website should do better than the old one.</p>`,
    `<h3>What to review before migrating content, SEO and CMS structure</h3><p>&zwj;</p><p>One of the most important things before migration is content. An older WordPress site often contains pages, articles, categories or sections that no longer make much sense but are still online. Moving everything without thinking would be a mistake. It is worth reviewing the entire content set first and deciding what is still valuable, what should be rewritten, what can be merged and what no longer needs to be transferred at all. Migration is an ideal moment for content cleanup.</p><p>&zwj;</p><p>The SEO layer is just as important. If the website already has positions in search, there is no reason to put them at risk during the move. That means checking existing URLs, indexed pages, meta titles, meta descriptions, internal linking and important landing pages. If the structure changes, redirects have to be planned so that organic traffic is not lost and users do not end up on a 404 page. A migration without an SEO plan can look clean on the surface while doing serious damage in search results.</p><p>&zwj;</p><p>The CMS structure also deserves close attention. WordPress and Webflow work differently, so it is rarely worth mechanically copying the old system. It is much better to look at the content from scratch and think through how blog posts, categories, tags, authors, case studies or other dynamic sections should work in Webflow. A well-designed Webflow CMS can significantly simplify content operations after migration and prepare the website for future growth.</p><p>&zwj;</p><p>This phase is exactly what determines whether the new website is merely transferred or genuinely rebuilt in a better way.</p>`,
    `<h3>How to handle a migration to Webflow so the new website is faster and easier to maintain</h3><p>&zwj;</p><p>The goal of migration should not only be to make the website work inside a new tool. The goal should be to build a better system. That means a website that is visually consistent, technically cleaner, faster and easier to manage. If the move is handled well, the result is not just a new platform, but a stronger digital foundation for the coming years.</p><p>&zwj;</p><p>During migration, it is therefore worth addressing things that may not have worked well on the old website. That can include a weak mobile version, confusing navigation, slow loading, an awkward editor workflow or an inconsistent design. Moving to Webflow is a great opportunity not to carry these weaknesses over, but to remove them. Otherwise, the brand simply transfers old problems into a new environment.</p><p>&zwj;</p><p>It is also important to think about the future. The new website should be ready for easier publishing, faster landing page creation, service expansion and ongoing updates without unnecessary technical friction. This is exactly where Webflow can bring a big advantage. If the website is built well, the team can work faster, marketing becomes more flexible and the brand looks more professional.</p><p>&zwj;</p><p>A migration from WordPress to Webflow therefore makes the most sense when it is not treated only as a technical platform swap. The best results come when content clarity, SEO discipline, strong design and thoughtful development work together. Then the new site does not just replace the old one - it moves it to a clearly higher level.</p>`
  ];

  translations.en.articleContent["webflow-animation"] = [
    `<h3>Why animations on a website only help when they have a clear purpose</h3><p>&zwj;</p><p>Animations are one of those elements that can quickly elevate a website. They can improve the first impression, direct the user's attention and give the page a more modern, refined feel. At the same time, animations are also one of the most common reasons a website starts feeling exaggerated, distracting or unnecessarily slow. The difference between quality motion design and chaos lies in whether every movement has a reason.</p><p>&zwj;</p><p>On a good website, animation should never exist only for effect. It should support orientation, highlight an important element or make an interaction more pleasant. When content gently appears on scroll, the user understands the hierarchy of the page more easily. When a button reacts on hover, it gives a clear signal that it is interactive. When transitions between states are handled with care, the whole site feels more polished and professional.</p><p>&zwj;</p><p>The problem begins when animations are used without a system. Suddenly everything moves, every section has a different motion style, elements arrive too late and instead of a smooth experience the visitor feels delay. The site then stops feeling premium and starts feeling overcomplicated. The visual effect may look striking for a moment, but functionally the page loses pace and readability.</p><p>That is why Webflow animations should be part of the design strategy, not a last-minute add-on at the end of the project. Used with restraint, motion can help a lot. Overused, it starts working against the page.</p>`,
    `<h3>How to set up Webflow animations so they support UX without slowing the website down</h3><p>&zwj;</p><p>Webflow gives you a lot of freedom with animation, and that is exactly why it is important to know where to hold back. Not every section needs its own choreography and not every element needs movement. The best animations are the ones the user feels but that do not shout for attention. They are natural, fast and support the flow of the page instead of disrupting it.</p><p>&zwj;</p><p>Subtle reveal animations, restrained hover effects and smooth transitions between states tend to work especially well. Movements like these make a website feel more alive without reducing performance. The key is consistency. If too many different motion styles appear on one page, the user starts to feel visual restlessness. A website should feel like one coherent system, not a collection of unrelated effects.</p><p>&zwj;</p><p>When designing animations, performance has to stay in focus as well. Heavy parallax effects, overly complex scroll interactions or too many elements animating at once can slow down loading and hurt the actual use of the website. This matters especially on mobile, where the margin for error is even smaller. What looks good on a powerful desktop may not work the same way on a weaker device. That is why motion design requires not only aesthetics, but technical discipline too.</p><p>&zwj;</p><p>The best animations are therefore not the most visible ones. They are the ones that help users move through the page naturally, without friction and without the feeling that the website is holding them back.</p>`,
    `<h2>When animations create a wow effect and when they start harming the website</h2><p>&zwj;</p><p>A wow effect on a website does not happen because everything moves. It happens when motion is timed correctly, visually clean and embedded in strong design. Animation should support the moment, not overpower it. It can emphasize a hero section, guide attention toward a CTA or give a brand more character. But it still has to stay under control.</p><p>&zwj;</p><p>When motion becomes excessive, the website starts losing its main purpose. A visitor should be able to get to information quickly and clearly. If they have to wait for something to scroll in, fade in or finish moving, the page may look impressive in a portfolio, but in reality it reduces comfort. That quickly turns into weaker conversions, a poorer impression and lower trust.</p><p>That is why the best approach to Webflow animations is a simple one: use them intentionally, consistently and with respect for both content and performance. A modern website does not need to impress at every step. It only needs to handle detail in the right way. That feeling of quality is built in the details.</p><p>&zwj;</p><p>Used with restraint, Webflow animations can turn an ordinary page into a stronger digital experience. But their real power is not in the number of effects. It is in how precisely they support the brand, the UX and the flow of the whole page. That is when they work best.</p>`
  ];

  translations.en.articleContent["web-maitenence"] = [
    `<h3>Why regular website maintenance matters even after launch</h3><p>&zwj;</p><p>Many companies treat a website launch as the finish line. The site goes live, everything looks fine and the care stops there. In reality, however, a quality website needs ongoing maintenance just like any other important business tool. If nobody takes care of it regularly, problems do not appear all at once. They appear quietly. A broken form, outdated content, a layout issue on mobile or slower loading often become visible only when they have already cost leads, trust or performance.</p><p>&zwj;</p><p>Monthly website maintenance is not only a technical check. It is a systematic way to keep the site functional, current and ready to support the business. A website is a living environment. Content changes, services change, user behavior changes and search engine requirements change. That means even a well-built site needs to be reviewed, adjusted and improved over time.</p><p>&zwj;</p><p>The greatest benefit of regular maintenance is that it prevents stress. Instead of putting out fires at the last minute, small issues are handled continuously while they are still small. That is cheaper, faster and much safer for the brand. The website then stops feeling like something that merely exists online and starts behaving like an active tool kept in good condition.</p>`,
    `<h3>What a monthly review of content, functionality and performance should include</h3><p>&zwj;</p><p>One of the first areas worth checking every month is content. A site can be technically fine, but if the content grows stale it stops being persuasive. It is worth checking whether services are up to date, whether contact information is correct and whether the site contains invalid details, old references or outdated CTAs. In a blog or CMS section, it is also important to verify that everything displays properly and that filters, categories and internal links still work as intended.</p><p>&zwj;</p><p>Functionality matters just as much. Forms, buttons, external links, booking tools or newsletter flows all need to work reliably. Many companies assume that if something worked at launch, it will keep working forever. But websites change, integrations change and issues can appear without anyone noticing immediately. A monthly review of these elements can catch problems before users run into them.</p><p>&zwj;</p><p>The third area is performance. This is not only about loading speed, but also about the overall technical condition of the page. It is worth checking whether the site has slowed down, whether any sections broke on mobile, whether images became too heavy and whether new edits disrupted design consistency. Regular performance checks are exactly what help keep a website in a state that feels good for the user and healthy for SEO.</p>`,
    `<h3>How website maintenance supports SEO, trust and long-term brand growth</h3><p>&zwj;</p><p>A well-maintained website does not only support technical function. It has a strong effect on brand trust as well. When a visitor encounters outdated content, broken elements or obvious mistakes, trust drops immediately. On the other hand, when the site feels current, clean and reliable, it strengthens the professional impression and increases the chance that the user will take the next step.</p><p>&zwj;</p><p>Ongoing maintenance also has a major impact on SEO. Search engines prefer websites that are technically healthy, logically structured and updated over time. That does not mean redesigning the whole website every week. It means improving content continuously, fixing small technical issues and keeping the site in good condition. Even small recurring updates are stronger in the long run than one big intervention once a year.</p><p>&zwj;</p><p>Monthly website maintenance is therefore mainly about prevention. It helps the brand preserve performance, protect conversions and build a stable foundation for further growth. When the website is reviewed continuously, chaos does not build up, unnecessary outages do not happen and the whole digital system works more smoothly. That is exactly why maintenance should not be the last thing on the list, but a natural part of working with a quality website.</p>`
  ];

  translations.en.articleContent["web-redesign"] = [
    `<p><em>A website redesign is not only about no longer liking the visual style. The real problem starts when the page stops supporting the business and no longer creates the right impression.</em></p><p>&zwj;</p><h5>1. The website looks outdated and lowers trust</h5><p><strong>&zwj;</strong>A first impression is formed within a few seconds. If the site looks old, confusing or technically weak, visitors may subconsciously connect that feeling with the quality of your services.</p><p>&zwj;</p><h5>2. Your brand has moved forward, but the website has not</h5><p><strong>&zwj;</strong>The company may have grown, improved its offer, found a clearer positioning or changed its visual identity, yet the website still communicates the old version of the brand. That creates unnecessary mismatch.</p><p>&zwj;</p><h5>3. The website is hard to edit and every change becomes a problem</h5><p><strong>&zwj;</strong>If every text change, new section or small update takes too long, the website stops being a growth tool and becomes a bottleneck. A modern website should be flexible and maintainable.</p>`,
    `<p><em>Even if a website seems to work at first glance, it may hide problems that reduce performance and conversions.</em></p><p>&zwj;</p><h5>4. Visitors cannot orient themselves quickly</h5><p><strong>&zwj;</strong>If it is not immediately clear what you do, who you help and what the user should do next, the page loses its power. Weak flow and poor structure are common reasons why people leave.</p><p>&zwj;</p><h5>5. The website gets traffic but does not bring inquiries</h5><p><strong>&zwj;</strong>If people arrive on the site but forms, clicks and leads do not follow, the problem is often not the service itself, but the way the website communicates value and leads toward conversion.</p><p>&zwj;</p><h5>6. The website is slow or works badly on mobile</h5><p><strong>&zwj;</strong>Today it is not enough for a website to just "sort of work". If it loads slowly, breaks on mobile or feels uncomfortable to use, you lose both users and trust.</p>`,
    `<p><em>When these issues keep piling up, the website no longer slows down only marketing. It starts slowing down the entire digital growth of the brand.</em></p><p>&zwj;</p><h5>7. The website does not support your current business goals</h5><p><strong>&zwj;</strong>You may have added new services, changed your target audience or want more leads from a specific offer. If the website is not adapted to that, it stops being a relevant business tool.</p><p>&zwj;</p><h5>8. The site is not ready for more content and expansion</h5><p><strong>&zwj;</strong>If adding new landing pages, a blog, case studies or CMS expansion is difficult, the website will not be able to grow with the brand. That is a strong sign that its foundation is no longer enough.</p><p>&zwj;</p><h5>9. Competitors feel far more convincing online</h5><p><strong>&zwj;</strong>If competitors communicate more clearly, more credibly and more modernly, your site may be losing even before a client decides to get in touch. Not because you are worse, but because the website cannot show your real value.</p><p>A redesign therefore makes sense not only when you want something "prettier". It makes sense when your website stops reflecting the quality of your brand, lowers trust or slows down results. That is the moment when a visual update becomes a real business decision.</p>`
  ];

  translations.en.articleContent["hero-section"] = [
    `<h3>Why good web design is not only about looks, but also about user decision-making</h3><p>&zwj;</p><p>Many people still think that good web design mainly means a beautiful visual style. In reality, however, a successful website does not make an impression only through colors, typography or animation. Its real strength lies in how it guides the user in the right direction. It helps people quickly understand where they are, what the brand offers and what the next step should be. This is exactly where design stops being just an aesthetic layer and becomes a conversion tool.</p><p>&zwj;</p><p>There is always a small decision process happening on every page. Within a few seconds, the visitor is subconsciously evaluating whether the page is trustworthy, relevant and worth continuing with. If the website cannot answer that clearly, the user leaves. Not because the service is weak, but because the page failed to communicate value well enough. Good design therefore does not only present content. It helps people understand content.</p><p>&zwj;</p><p>The first thing a user usually sees is the hero section. And that is often where the decision to stay or leave is made. A hero section should answer three questions very quickly: what do you do, who do you help and why should the visitor care. If the headline is too generic, the visual is unclear or the CTA is weak, the first impression starts falling apart. A good hero section does not have to be complicated. It has to be clear, strong and easy to understand.</p><p>&zwj;</p><p>When design is built correctly, the user does not have to think about where to look or what to do next. The website guides them naturally. And that is exactly the difference between a site that only looks modern and a site that truly works.</p>`,
    `<h3>How the hero section, CTA and natural page flow work together</h3><p>&zwj;</p><p>The hero section is the entry point of the entire page. It is not just a place for a nice headline and image. It is the place where clear value, visual credibility and the first action have to connect quickly. When that works, the user has a reason to continue. If it does not, even strong content lower on the page often cannot save the experience. That is why a hero section should not only be eye-catching. It has to be functional.</p><p>&zwj;</p><p>Right after the hero section comes page flow. That means how individual sections connect and how they build a convincing story together. A good landing page or company website does not present information randomly. First it explains value, then it builds trust, later it answers questions and finally it leads naturally to conversion. When this flow does not work, the page can feel chaotic even if it looks attractive.</p><p>&zwj;</p><p>CTA, or call to action, plays a major role in this. A CTA should not just be a button glued somewhere to the end of a section. It has to appear at the right moment, use the right wording and be visually strong enough. If it comes too early, the user is not ready to click. If it comes too late, they may already be ready to leave. That is why good pages work with multiple CTA points that respect the visitor's stage of decision-making.</p><p>&zwj;</p><p>Page flow is essentially an invisible system that holds the website together. Users may not consciously notice it, but they feel it. When the page is logical, smooth and well structured, they keep moving without friction. When it is not, they stop, hesitate and leave. That is why flow is one of the most important parts of conversion-focused web design.</p>`,
    `<h3>What makes a website convincing and ready for the click</h3><h3>&zwj;</h3><p>A convincing website does not happen just because you add nice sections, testimonials and a button. It has to work as one whole. Every element on the page should have a reason to exist and should support the main goal of the page. That means the headline has to communicate value, visuals have to support trust, content has to answer questions and the CTA has to feel like the natural outcome of the entire experience.</p><p>&zwj;</p><p>Consistency matters a lot here as well. If the page keeps changing tone, visual style or logic from section to section, users lose confidence. It is also a problem when the page is overloaded with too many ideas at once. Every brand wants to say a lot, but a good website knows how to choose the most important points and present them in the right order. That discipline is what makes a page feel professional and easy to read.</p><p>A strong website also builds trust before the click happens. Testimonials, results, work examples, clear copywriting and a solid visual system all help with that. The user does not need to see everything. They need to see enough to understand that they are in the right place. Once the page creates that confidence, the click no longer feels forced. It feels like the natural next step.</p><p>&zwj;</p><p>Design that leads to a click is therefore not about one magical element. It is a combination of strategy, content, visuals and the right flow. When those things work together, the website does not just look good. It feels convincing, clear and effective. And that is when it starts working not only for the brand, but also for the results it wants to achieve.</p>`
  ];

  translations.en.articleContent["webflow-cms"] = [
    `<h3>Why a good CMS structure is the foundation of every quality blog</h3><p>&zwj;</p><p>When a blog or content section is first created, everything often feels simple. You add a few fields, create some posts and publish. The problem comes later. After a few weeks or months, content starts growing, new categories appear, as well as tags, authors, featured posts and related articles. Suddenly it becomes clear that the original CMS structure was too simple or not thought through well enough. The result is editing chaos, confusing collections and unnecessarily complicated updates.</p><p>&zwj;</p><p>That is why a well-designed CMS in Webflow is not just a technical detail, but a strategic foundation for the entire content system. Right from the start, it is important to think about what type of content will be created, how it will be organized, what will repeat and what will need filtering. A blog is not just a list of articles. Over time it often becomes a knowledge base, an SEO channel, a place for case studies or a content ecosystem that needs much more logic than it first seems.</p><p>&zwj;</p><p>If Webflow CMS is meant to stay usable in the long term, it has to be clear which fields are truly necessary and which ones only complicate the editor workflow. Every field should have a reason. Article title, slug, excerpt, cover image, author, category, tags, SEO fields or publish date all have to be structured so they work well not only for the first article, but for the fiftieth one too. That is the difference between a CMS that stays functional and a CMS that starts slowing the whole content process down after a few months.</p>`,
    `<h3>How to structure a blog, categories and tags in Webflow without future chaos</h3><p>&zwj;</p><p>One of the most common mistakes in CMS design is modeling content too quickly. Someone creates a collection for blog posts, adds a few basic fields and stops there. But soon there is a need to filter posts by topic, show recommended articles, connect content pieces together or create different layouts for different post types. If that is not considered up front, the whole CMS starts bending under workarounds.</p><p>&zwj;</p><p>That is why it pays to think about content relationships from the start. Categories should have a clear purpose and should not overlap with tags. Tags should help with filtering and linking themes across the blog. Once those two ideas get mixed together, both the user and the editor quickly get lost. It is just as important to think about how featured posts, related articles and recommended content by similar topic will be displayed.</p><p>&zwj;</p><p>Webflow is powerful precisely because its CMS can be flexible, but that flexibility only works when there is strong logic behind it. If naming is inconsistent, fields are duplicated unnecessarily or different content types are forced into one collection without a system, it becomes visible in every future edit. A good CMS must be understandable not only for the developer, but also for the client or marketer who will work with it every week. The easier it is to manage content, the greater the chance the blog will actually grow.</p>`,
    `<h3>Webflow CMS as a system ready for content growth and SEO</h3><h3>&zwj;</h3><p>The best way to avoid chaos six months from now is to design CMS not for today's state, but for future growth. That means assuming that more content will come, the structure will expand and the website will need more than a basic blog listing. New content pillars, landing pages, case studies, FAQ sections or multiple authors may appear. If the CMS is built well, these things can be added smoothly. If not, every change starts becoming painful.</p><p>&zwj;</p><p>From an SEO point of view, a good CMS structure is a huge advantage. It helps maintain consistent URLs, clear internal linking, better topic organization and easier publication of new content. When a blog is properly divided into categories, tags and related sections, both user orientation and the overall logic of the website for search engines improve. Content then stops feeling like isolated articles and starts feeling like one connected system.</p><p>&zwj;</p><p>A well-designed CMS in Webflow is therefore not only about making the blog work today. It is about keeping it maintainable, scalable and ready for brand growth. When the structure is thought through correctly from the beginning, the client gets a system where publishing is fast, orientation is easy and content can evolve over time without chaos. That is exactly the goal of a strong content-driven website.</p>`
  ];

  translations.en.articleContent["seo-webflow"] = [
    `<h3>What to set up in Webflow before launching a website for SEO</h3><p>&zwj;</p><p><em>SEO does not begin after launch. A strong foundation has to be prepared before the website goes live. This is exactly the phase where it is decided whether the site will be readable for search engines, technically clean and ready to gain organic traffic. The benefit of Webflow websites is that many important SEO settings can be handled directly and clearly, but they still have to be done carefully.</em></p><p><em>&zwj;</em></p><h5>1. Set correct title tags and meta descriptions</h5><p><strong>&zwj;</strong>Every important page should have a unique SEO title and meta description. The title should clearly describe the page content and the meta description should improve the chance of getting a click from search results.</p><p>&zwj;</p><h5>2. Review the structure of H1, H2 and H3 headings</h5><p><strong>&zwj;</strong>Every page should have one clear H1. Other headings should create a logical hierarchy of content. This helps both users and search engines understand the page better.</p><p>&zwj;</p><h5>3. Adjust slugs and page URLs</h5><p><strong>&zwj;</strong>URLs should be short, readable and relevant. Chaotic or unnecessarily long slugs look unprofessional and make the website less clear.</p><p>&zwj;</p><h5>4. Fill in alt text for images</h5><p><strong>&zwj;</strong>Alt text is not just a technical detail. It helps both accessibility and SEO. Every important image should have a short and descriptive text alternative.</p>`,
    `<h3>Technical SEO in Webflow worth checking before launch</h3><p>&zwj;</p><p><em>A website can have strong content and still not be ready to rank well. Technical SEO is the quiet foundation without which a page can lose performance before it even starts getting real traffic.</em></p><p>&zwj;</p><h5>5. Verify page indexation</h5><p><strong>&zwj;</strong>Before launch, it is important to check which pages should be indexable and which should not. Test pages, thank-you pages or duplicate versions should not end up in search results unnecessarily.</p><p>&zwj;</p><h5>6. Review the sitemap and robots.txt</h5><p><strong>&zwj;</strong>Webflow generates a sitemap automatically, but it is still worth making sure it is set up correctly. The same goes for robots.txt, so you do not accidentally block important pages.</p><p>&zwj;</p><h5>7. Connect Google Search Console and Analytics</h5><p><strong>&zwj;</strong>Without data, you do not know what is happening on the site. Right after launch, the website should be connected to tools that show indexation, technical issues and traffic development.</p><p>&zwj;</p><h5>8. Test speed and the mobile version</h5><p><strong>&zwj;</strong>SEO today is tightly connected to user experience. If the site is slow or hard to use on mobile, organic performance can suffer. That is why it is worth checking loading speed and responsiveness before launch.</p>`,
    `<h3>The SEO launch checklist every new website should have</h3><p>&zwj;</p><p><em>Before publishing, it is worth going through a final checklist and making sure nothing important is missing. Often the issue is not one huge mistake, but small overlooked details that can later cost traffic and leads.</em></p><p>&zwj;</p><h5>9. Set Open Graph images and social sharing properly</h5><p><strong>&zwj;</strong>When someone shares your page, it should also look good on social media. Open Graph is not a direct SEO factor, but it helps visibility and the quality of brand presentation.</p><p>&zwj;</p><h5>10. Check internal linking</h5><p><strong>&zwj;</strong>Every important page should be naturally linked to other relevant pages. This helps navigation, SEO and longer time on site.</p><p>&zwj;</p><h5>11. Review the 404 page and redirects</h5><p><strong>&zwj;</strong>If you are migrating an older website or changing URLs, redirects are essential. Without them, you can lose rankings, traffic and users who end up on broken pages.</p><p>&zwj;</p><h5>12. Make sure the website is ready for further content growth</h5><p><strong>&zwj;</strong>SEO is not a one-time task. The site should be ready for blog content, new landing pages, CMS content and future expansion. That is the only way it can grow into a strong organic channel.</p><p>&zwj;</p><p>SEO in Webflow does not have to be complicated if you have a clear pre-launch checklist. When the content, technical base and page structure are set up properly, a new website will not only look good - it will also be ready to grow in search.</p>`
  ];

  translations.en.articleContent["increasing-conversion"] = [
    `<p><em>A slow website is rarely caused by one big mistake. Most often, it is the result of a series of poor decisions that keep piling up. Here are the first four problems we see most often.</em></p><p>&zwj;</p><h5>1. Unoptimized images</h5><p><strong>&zwj;</strong>Large images in the wrong format are among the most common reasons for slow loading. If a website uses unnecessarily heavy PNGs or huge photos without compression, performance drops immediately.</p><p>&zwj;</p><h5>2. Too many videos and heavy visual assets</h5><p><strong>&zwj;</strong>Autoplay videos, large background videos or too many visual elements on one page can significantly increase loading weight. Visuals should help, not hold the website back.</p><p>&zwj;</p><h5>3. Excessive animations and effects</h5><p><strong>&zwj;</strong>Animations can bring a website to life, but if there are too many of them, the page starts feeling slow and distracting. Every movement should have a reason, not be decoration only.</p><p>&zwj;</p><h5>4. An overly complicated page structure</h5><p><strong>&zwj;</strong>If a landing page is overloaded with sections, embeds, sliders, popups and other layers, the result is both a slower website and worse user orientation.</p>`,
    `<p><em>Technical performance and user experience are tightly connected. When a website is built badly, people feel it immediately, even if they cannot clearly explain why.</em></p><p>&zwj;</p><h5>5. A poorly handled mobile version</h5><p><strong>&zwj;</strong>Many websites look good on desktop but fall apart on mobile. Weak breakpoints, oversized elements and a cluttered layout slow down both use and loading.</p><h5>&zwj;</h5><h5>6. Unnecessarily heavy development</h5><p><strong>&zwj;</strong>Too many nested elements, messy classes, overly complicated components and a weak CMS structure can slow the website down and make maintenance harder.</p><p>&zwj;</p><h5>7. Weak content hierarchy</h5><p><strong>&zwj;</strong>If users cannot quickly understand what matters most, they have to think more while browsing. That may not be a technical error, but it strongly reduces the chance of conversion.</p><p>&zwj;</p><h5>8. Unclear CTA elements</h5><p><strong>&zwj;</strong>If a button is not visible enough, the text is weak or CTAs are placed chaotically, users do not know what to do next. And once they hesitate, they often leave.</p>`,
    `<p><em>Some mistakes are not obvious at first glance, but in the long run they become very expensive. These are often the issues that decide whether a website truly performs.</em></p><p>&zwj;</p><h5>9. Slow loading above the fold</h5><p><strong>&zwj;</strong>The first screen has to work instantly. If the hero section loads slowly, users can lose patience before they even form a first impression.</p><p>&zwj;</p><h5>10. Neglected technical SEO</h5><p><strong>&zwj;</strong>Poor meta data, missing alt text, weak heading structure or technical issues reduce the chance that the website will rank well and bring organic traffic.</p><p>&zwj;</p><h5>11. A website without ongoing optimization</h5><p><strong>&zwj;</strong>Even a good website ages over time. If performance is not monitored, content is not optimized and changes are not tested, the site gradually loses both speed and effectiveness.</p><p>A slow website is therefore not only a technical issue. It is a business, trust and conversion problem. The sooner these mistakes are removed, the greater the chance the website will be not only attractive, but also truly high-performing.</p>`
  ];

  translations.en.articleContent["webflow-no-code"] = [
    `<h3>What Webflow is and why it is no longer just a no-code tool</h3><p>&zwj;</p><p>When people hear Webflow, many still imagine a simple no-code builder for smaller websites. The reality today is very different. Over the last few years, Webflow has moved from being a tool for quickly assembling pages to a platform where thoughtful, high-performing and professional websites can be built for brands, startups and established companies. That is why Webflow is no longer just a no-code solution, but a serious stack for modern websites.</p><p>&zwj;</p><p>The biggest advantage of Webflow is that it connects design, development and content management into one system. Instead of designing in one app, coding manually in another and then connecting everything to a CMS, Webflow allows you to build the website directly as a working product. That significantly speeds up website production and reduces the space for mistakes between the design and the final version.</p><p>&zwj;</p><p>That does not mean Webflow is an "easy" version of development. Quite the opposite. To create a quality result, you still need to understand layout, responsiveness, typography, content hierarchy, accessibility, SEO and the technical structure of the page. Webflow does not change what makes a good website good. It simply gives the team a more efficient way to build it.</p><p>&zwj;</p><p>For clients, the key benefit is that a Webflow website can be visually strong, technically clean and still easy to edit. That is a major difference compared to older solutions where even small text changes often required a developer. This is exactly where Webflow becomes interesting not only for designers, but also for companies that want to manage their website quickly and without unnecessary chaos.</p>`,
    `<h3>When Webflow makes the most sense for a company website and marketing</h3><p>&zwj;</p><p>Webflow is strongest where speed, flexibility and high visual quality need to work together. It works very well for company websites, landing pages, product presentations, marketing microsites and content-driven projects with a blog or CMS structure. If a brand needs a modern website that will be updated and expanded often, Webflow makes a lot of sense.</p><p>One of the big advantages is that a marketing team can work more independently on a well-built website. They can update content, add articles, create new landing pages or edit CMS items without waiting a week for every change. That accelerates campaigns, experimentation and the growth of the site itself. For a business, this matters because the website stops being a bottleneck and becomes an active growth tool.</p><p>&zwj;</p><p>From a design perspective, Webflow is strong because it does not lock the team into rigid templates. It makes it possible to build a custom visual system, consistent components and a unique brand presentation without making the website feel generic. That is why it is also suitable for studios and brands that want differentiation, not just a functional baseline.</p><p>&zwj;</p><p>It is still important to say that Webflow is not an automatic solution for everything. It does not guarantee good UX, a fast website or high conversion rates on its own. Strategy, content structure, design and the quality of development still matter. When those things are handled well, Webflow can be extremely effective. When they are neglected, even the best tool will not save the result.</p>`,
    `<h3>Why Webflow is a serious stack for modern websites</h3><p>&zwj;</p><p>Today, companies are no longer looking only for a website that is simply online. They are looking for a system that is fast, scalable, easy to manage and ready for change. That is exactly why Webflow is so interesting for modern websites. It lets teams combine a high-quality front-end result with easier content management, a clearer workflow and less dependence on complex technical interventions for every small update.</p><p>&zwj;</p><p>A serious stack today does not only mean "hard coding". It means having a reliable system that a team can work on efficiently, expand and maintain without unnecessary time loss. In that sense, Webflow brings a very practical balance between creativity and technical control. It can be an excellent solution for projects that need performance, clarity and flexibility without unnecessary complexity.</p><p>&zwj;</p><p>From the client's point of view, the biggest benefit is that a well-built Webflow website can grow with the brand. It can be expanded with new pages, CMS sections, language versions, campaign landing pages and additional content layers. That makes it a strong foundation for long-term digital growth, not just a quickly assembled site for a few months.</p><p>&zwj;</p><p>That is why Webflow is no longer worth seeing as an alternative for people who "do not want to code". It is a professional tool that, when used properly, can deliver a quality result for both the brand and the user. And that is where its real strength lies - not in replacing the process, but in making that process faster, cleaner and more effective.</p><p>If you want, I can also prepare a third blog post in the same format right away.</p>`
  ];

  translations.en.articleContent["live-launch"] = [
    `<h3>How the process of creating a modern website works</h3><p>&zwj;</p><p>A modern website does not come to life simply because someone "designed a nice page" and then published it online. Quality website creation is a process that combines strategy, UX, visual design, development and content. If the result should be a website that not only looks good but also works, it needs a clear system from the first call all the way to the live launch.</p><p>&zwj;</p><p>At the beginning of every project is an understanding of the goal. A website can have many roles - bringing in leads, selling services, building trust, explaining a product or supporting the brand. That is why the first phase is not about colors or animations, but about questions. Who is the website for? What should the visitor do? What is the main value of the brand? And how is it different from the competition? Without these answers, it is very easy for a website to look nice while delivering weak results.</p><p>&zwj;</p><p>After the initial call comes the strategy and structure phase. This is where the content map is assembled, main pages are defined and user flow is designed. In other words, the team decides what goes where, why it belongs there and how a person naturally gets closer to conversion through the site. This is the stage where it is decided whether the website will feel logical, clear and professional.</p><p>Content is also a very important part of this. Copywriting, headlines, CTA elements and text structure are not extra details - they are part of the foundation of a functional website. Even the best Webflow website will feel weak if it cannot clearly say what it offers, who it helps and why the visitor should trust it.</p>`,
    `<h3>Web design and Webflow development: what follows strategy</h3><p>&zwj;</p><p>Once the strategy is clear, the next steps are the wireframe and then the design. A wireframe is a simple layout proposal without final colors and visual detail. It is the skeleton of the website, where content hierarchy, section placement and the logic of the whole page are tested. This is the moment when many problems can be uncovered before time is invested into visuals and development.</p><p>&zwj;</p><p>In the visual phase, the brand, typography, colors, spacing, components and the overall feel of the site come into play. Good design is not only about making the page look modern. It should support trust, readability and orientation. Every element should have a reason. The hero section should capture attention and explain value. The CTA should be clear. Testimonials should build credibility. Sections should connect in a logical order.</p><p>&zwj;</p><p>Only then does development begin. In the case of Webflow, that means turning the design into a functional, responsive and technically clean website. This is where layout precision, CMS structure, animations, forms, technical SEO and performance are handled. Development is not just "redrawing the design inside a builder". It is the stage where it is decided whether the website will be fast, ready for mobile, easy to edit and sustainable in the long term.</p>`,
    `<h3>Website launch, testing and what comes after going live</h3><p>&zwj;</p><p>Before launch comes one of the most underestimated stages - testing and launch preparation. At this point, responsiveness, form behavior, page linking, loading speed, SEO basics, meta titles, meta descriptions, alt text, Open Graph settings and correct indexation are all reviewed. A live launch should never be just a click on publish.</p><p>&zwj;</p><p>After launch, the project is not over. In fact, that is when the website really starts working. It is worth monitoring user behavior, the performance of individual pages, conversion rates and the technical condition of the site. A modern website is not a static poster. It is a living tool that is tuned, improved and developed together with the business.</p><p>&zwj;</p><p>The entire website creation process therefore looks roughly like this: first strategy, then structure, followed by wireframe, design, development, testing and live launch. When every one of these phases is handled properly, the result is not just a beautiful page, but a website with a clear goal, a strong user experience and a solid technical foundation.</p>`
  ];

  translations.en.articleContent["web-accessibility"] = [
    `<h3>Why website accessibility matters for both users and the brand</h3><p>&zwj;</p><p>Website accessibility is often wrongly treated as an extra topic that concerns only a small group of people. In reality, it is part of the foundation of a quality digital experience. An accessible website is easier to use, clearer, more readable and more reliable for a much wider audience than it may seem at first glance. It is not only about users with disabilities, but also about people on mobile, in difficult lighting conditions, with temporary limitations or simply anyone who appreciates a clear and comfortable website.</p><p>&zwj;</p><p>When a page is built accessibly, users can orient themselves more quickly, read content more easily and complete the intended action with less friction. That has a direct effect on both UX and conversion. Many accessibility principles are, in reality, principles of good design. Clear hierarchy, readable text, understandable buttons, sufficient contrast and predictable interface behavior help everyone, not only a small part of the audience.</p><p>&zwj;</p><p>From the brand's point of view, accessibility also has a reputational dimension. A website that feels clean, logical and free of unnecessary barriers automatically creates more trust. On the other hand, a page where text is hard to read, buttons disappear or navigation feels awkward lowers the professional impression. Accessibility is therefore not just a technical discipline. It is part of the brand's quality online.</p><p>That is exactly why it is worth addressing accessibility already during the design phase, not only once problems begin to appear. Small changes often make a very big difference.</p>`,
    `<h3>Which small improvements make the biggest difference in readability and orientation</h3><p>&zwj;</p><p>A large part of accessibility can be improved through very practical decisions. One of the most important is contrast between text and background. If text is too light, too thin or placed on a distracting visual, reading becomes unnecessarily demanding. Font size, line spacing and the overall visual hierarchy matter just as much. Content should be easy to scan so users do not have to fight the form before they can even get to the message.</p><p>&zwj;</p><p>The structure of headings and sections also plays a major role. When a page uses clear H1, H2 and H3 headings, people orient themselves faster and understand what is primary and what is supporting information. The same applies to buttons and links. CTA elements need to be understandable, visually distinct and must not rely only on color as the single signifier. Users should immediately understand what is clickable and what will happen after interaction.</p><p>&zwj;</p><p>Keyboard navigation and clear focus states are equally important. Many websites neglect these details, even though they strongly affect usability. When someone moves through the page using a keyboard or needs a visual cue showing where they currently are, focus state is essential. It is a detail that many brands overlook, but from the perspective of comfort it matters a lot.</p><p>&zwj;</p><p>These updates may not look dramatic at first glance. But thanks to them, the website becomes clearer, calmer and more professional. And that is a huge advantage for good UX.</p>`,
    `<h3>How accessibility supports performance, SEO and long-term website quality</h3><p>&zwj;</p><p>Accessibility is not separate from website performance. Very often, the two go hand in hand. When a website is cleaner, simpler and designed more logically, both user experience and the technical quality of the page improve. Better structured content, correct headings, described images and a clear interface help not only people, but also search engines understand the content more easily. That is why accessibility also has a positive effect on SEO.</p><p>&zwj;</p><p>It is just as important that accessible websites are often more performant as well. When the design process focuses on simplicity, readability and clarity, there is less need for unnecessary effects, complicated solutions and distracting layers. The result can be a faster, more stable and easier-to-maintain website. Accessibility is therefore not only about rules. It is also about discipline in design and development.</p><p>In the long term, accessibility is a sign that the brand thinks in a high-quality, systematic way. It is not only concerned with how the website looks during the first impression, but also with how it is actually used. That is exactly what separates average websites from truly thoughtful ones. Small changes in contrast, navigation, structure and readability often bring not only a better feeling, but better results too.</p><p>&zwj;</p><p>In practice, website accessibility is not a complicated topic reserved for specialists. It is a set of reasonable decisions that make a website better for everyone. And that is exactly why it is worth addressing from the beginning, not only as a fix at the end.</p>`
  ];

  translations.en.articleContent["web-ai-chatbot"] = [
    `<h3>Where AI can genuinely save time in website creation</h3><p>&zwj;</p><p>Artificial intelligence is now influencing website creation quite strongly as well. For many teams, it is attractive mainly because it can speed up research, content preparation, idea exploration and some production tasks. In those areas, it can be very useful. When used correctly, AI does not lower the quality of the project - it shortens the time between an idea and the first usable output.</p><p>&zwj;</p><p>It works especially well during early research. It can help with building content outlines, first headline drafts, section ideas, naming services or exploring different communication angles. It can also speed up SEO preparation when the team needs to quickly map topics, user questions or possible content clusters. For a studio or marketer, it is a powerful tool for accelerating preparation, not a replacement for strategy.</p><p>&zwj;</p><p>AI can also help during the visual and production phases. It can generate moodboard directions, illustration suggestions, working copy for wireframes or microcopy drafts. Thanks to that, the team can get to a testable concept more quickly. This matters especially in early phases of a project, when the goal is direction and decision-making rather than final polish.</p><p>&zwj;</p><p>The biggest benefit of AI is therefore not that it can make the entire website for a person. Its real value lies in accelerating the first layers of work and freeing up more time for what truly matters - strategy, UX decisions, strong design and precise development.</p>`,
    `<h3>Where AI runs into limits in web design and development</h3><h3>&zwj;</h3><p>Even though AI can speed up many tasks, it still has very clear limits. The biggest problem starts when it is treated as a tool for final decisions instead of a supporting assistant. A website is not only a set of texts and nice-looking sections. It is a system</p><p>that has to reflect the brand, business goals, user behavior, technical constraints and long-term content management.</p><p>And that is exactly where AI often falls short.</p><p>&zwj;</p><p>In copywriting, AI can create a fast draft, but it also very often produces text that sounds generic, too broad or disconnected from a real brand identity. The same applies to visual direction. AI may suggest something attractive at first glance, but without deep understanding of the brand, market and positioning, the result tends to stay superficial. In practice, that leads to websites that look "modern" but do not feel distinctive, trustworthy or persuasive.</p><p>&zwj;</p><p>The same is true in development. AI can help with solution ideas, explaining logic or creating a quick code draft, but it often does not understand the full context of the project. It does not see future maintenance, system consistency, naming, performance or how other people will work with the website later. If its outputs are used without review, technical decisions may look fast in the beginning but end up costing time and money later on.</p><p>&zwj;</p><p>AI itself is therefore not the problem. The problem starts when more is expected from it than it is actually suited for.</p>`,
    `<h3>How to use AI in website creation wisely and without expensive mistakes</h3><p>&zwj;</p><p>The best way to work with AI in website creation is to treat it as an assistant, not as the author of the whole solution. It can be excellent for accelerating first drafts, exploring ideas and removing the fear of the blank page. But final decisions still have to be made by people who understand the brand, the user and the technical context of the project.</p><p>&zwj;</p><p>Using AI wisely means that every output still goes through a strategy and quality filter. A headline still has to make sense for a specific target group. A page structure still has to support conversion. A design still has to stay consistent with the brand. Development still has to be clean, maintainable and ready for real-world use.</p><p>AI can help prepare these things faster, but it cannot guarantee them on its own.</p><p>&zwj;</p><p>A major advantage appears when a studio or team clearly knows what AI should be used for and what it should not be used for. For ideation, yes. For final positioning, no. For a content draft, yes. For the final brand voice, no. For support with technical ideas, yes. For uncontrolled production output, no. This kind of discipline is exactly what separates useful AI support from cheap-looking results.</p><p>&zwj;</p><p>AI in website creation can therefore be a huge accelerator, but only when it is placed inside a strong process. It will not save weak strategy, invent a strong brand or replace experienced judgment. But in the hands of a good team, it can shorten the path to a better result. And that is exactly where it belongs.</p>`
  ];

  translations.en.articleContent["web-locale"] = [
    `<h3><strong>Why a multilingual website is more than just content translation</strong></h3><h3>&zwj;</h3><p>When a brand enters multiple markets, the need for a website in several languages naturally appears. Many companies initially think that translating the text is enough. In reality, however, a multilingual website is much more complex. It is not only about language itself, but also about content structure, SEO logic, the management of each version and the overall workflow so that the website does not slowly fall apart into an unclear system full of duplication.</p><p>&zwj;</p><p>Every language version has to work like a full website, not like a weaker copy of the original. That means it is necessary to think through not only the text, but also URLs, navigation, CMS content, internal linking and user experience. Visitors in every language expect to move through the site naturally and feel that the content is relevant for their market. A good multilingual website therefore does not come from mechanical copying, but from systematic design.</p><p>&zwj;</p><p>In Webflow, this topic is especially interesting because, with the right setup, a multilingual website can stay clean, flexible and maintainable over time. At the same time, if language versions are set up too quickly, chaos appears very fast. Pages start drifting apart, SEO weakens and the content team begins struggling with which version is actually current.</p><p>That is why it makes sense to treat a multilingual website as part of the strategy, not as an extra add-on. The earlier its logic is designed properly, the easier it becomes to expand and manage later on.</p>`,
    `<h3>How to set up content and workflow in Webflow without chaos and duplication</h3><p>&zwj;</p><p>The biggest problem with multilingual websites usually does not appear at the first launch, but during everyday content work. When a new article is published, a service page is updated or a CTA changes, the team suddenly has to deal with what should be updated in every language, who is responsible and how consistency across versions will be maintained. If there is no clear workflow for this, a multilingual website quickly turns into an unclear system.</p><p>&zwj;</p><p>That is why it is important to define from the start which parts of the website will always stay the same and which parts should be localized more freely for each market. Not all content has to be translated literally. Sometimes it makes much more sense to adjust the headline, CTA or the entire section so it works better for the local audience. The difference between translation and localization is very important for a high-quality website.</p><p>&zwj;</p><p>In Webflow, the CMS logic also matters. The blog, categories, tags, landing pages or case studies should be structured so they can be managed without duplicating work unnecessarily. When the CMS is designed intelligently, the team can add content more efficiently and has a clearer overview of what is published, what is missing and what still needs to be updated. If not, every new page or article starts adding another layer of chaos.</p><p>&zwj;</p><p>A well-designed workflow therefore does not only save time. It also protects website quality, brand consistency and the long-term maintainability of all content.</p>`,
    `<h3>How to handle SEO on a multilingual website so languages do not compete with each other</h3><p>&zwj;</p><p>On a multilingual website, SEO is one of the most sensitive layers. If it is set up incorrectly, language versions can start competing with one another, search engines may not understand which page to show to which audience and organic performance can suffer unnecessarily. That is why each language version needs its own clear structure, relevant URLs and correctly prepared content.</p><p>&zwj;</p><p>A strong focus should also be placed on the uniqueness of each page. Even when it is the same service or article in another language, each version should have its own title tag, meta description and naturally adapted content. Mechanical copying without localization logic often leads to weaker results. Both the search engine and the user need to feel that the page was prepared for a specific language and a specific market.</p><p>&zwj;</p><p>The overall architecture of the website matters just as much. Navigation between languages has to be clear, internal linking has to stay logical and the content structure has to remain consistent. When this is done well, a multilingual website does not feel like a set of disconnected copies, but like one strong system that can grow across markets without unnecessary complications.</p><p>A multilingual website in Webflow therefore works best when good SEO, a clean workflow and content without duplication come together. Then the brand does not get only a translated website, but a full digital system prepared for growth across languages and countries.</p>`
  ];

  translations.en.articleContent["measuring-web-success"] = [
    `<p><em>After a website launches, it is not enough to say the page is done. And it is definitely not enough to look only at whether someone visits it.</em></p><p><em>What matters is whether the website attracts relevant people and whether it can keep them engaged long enough to move them further.</em></p><p>&zwj;</p><h5>1. Quality traffic</h5><p><strong>&zwj;</strong>It is not only about the number of visits. What matters is where people come from and whether they are relevant for your business.</p><p>A random visit has a very different value from a visit by someone actively looking for your service.</p><p>&zwj;</p><h5>2. Engagement rate</h5><p><strong>&zwj;</strong>This metric shows whether visitors actually interact with the website. If people arrive and leave immediately,</p><p>the website is probably not communicating value clearly enough.</p><p>&zwj;</p><h5>3. Time spent on key pages</h5><p><strong>&zwj;</strong>Not every page needs a long visit duration, but on service pages, case studies or landing pages it is an important signal.</p><p>It shows whether the content truly interests people or whether they only skim it quickly.</p>`,
    `<p><em>A good website should not only capture attention. It should move people through content, build trust and guide them toward a concrete action.</em></p><p><em>This is exactly where you see whether the page flow has been set up correctly.</em></p><p>&zwj;</p><h5>4. CTA click-through rate</h5><p><strong>&zwj;</strong>If people are not clicking the main buttons, something is off. It may be a weak headline, unclear value, poor CTA placement or not enough trust.</p><p>&zwj;</p><h5>5. Movement between key pages</h5><p><strong>&zwj;</strong>It is important to track whether visitors move from the homepage to services, from blog posts to landing pages or from case studies to the contact page.</p><p>If people do not move through the website naturally, the page is not guiding them well enough.</p>`,
    `<p><em>At the end of the day, the most important thing is whether the website brings results. Beautiful design and good traffic are only the foundation.</em></p><p><em>Real success becomes visible only when the website starts supporting the business goal.</em></p><p>&zwj;</p><h5>6. Conversion rate</h5><p><strong>&zwj;</strong>This is one of the most important post-launch metrics. It shows how many people complete the desired action</p><p>- submit a form, book a call, click an important next step or sign up.</p><p>&zwj;</p><h5>7. Number and quality of leads</h5><p><strong>&zwj;</strong>It is not enough just to collect contacts. What matters is whether they are relevant people with real interest in your service.</p><p>A website can generate many forms, but if it does not bring qualified leads, it is not doing its job.</p><p>&zwj;</p><p>Website success is therefore not measured by one number. The best approach is a combination of metrics that show traffic,</p><p>user behavior and actual business impact.</p><p>When these signals are reviewed regularly, the website can be improved much more precisely and intelligently after launch.</p>`
  ];

  translations.en.articleContent["design-systemin-webflow"] = [
    `<h3>Why a design system is the foundation</h3><h3>of a consistent and maintainable website</h3><p>&zwj;</p><p>Many websites are created fairly quickly at the beginning. Sections are designed, components are added, the visual style is polished and the site goes live. The problem often appears later, when the website needs to be updated, expanded or extended with new landing pages. Suddenly it becomes clear that buttons do not have one consistent style, spacing changes from section to section, headings are inconsistent and every new edit creates more chaos.</p><p>This is exactly where a design system becomes extremely important.</p><p>&zwj;</p><p>A design system is not only a set of nicely named styles. It is the logic by which the whole website is built. It defines how colors, typography, buttons, forms, cards, sections and overall spacing work. When this system is set up well, the website does not only look more polished outwardly, it also becomes much easier to manage. Every next decision is made faster because the team does not have to keep rethinking how each element should look.</p><p>&zwj;</p><p>In Webflow, a design system matters even more because it directly affects the development workflow itself. When classes, components and recurring patterns are set up consistently, edits can be made more precisely and with much less risk of breaking something elsewhere. That is a major difference compared with a website that looks good at launch but slowly loses order after a few months of edits.</p><p>&zwj;</p><p><em>That is why a design system is not a luxury only for large projects. It is a practical foundation for every website that should remain high quality even after the tenth update.</em></p>`,
    `<h3>How a design system in Webflow speeds up edits and reduces chaos</h3><p>&zwj;</p><p>The biggest advantage of a design system shows up in everyday work. When a button style needs to change,</p><p>spacing between sections needs adjustment or a new content block has to be added, a well-built system makes those changes fast and consistent. Instead of manually fixing details across the entire site, the team works with clearly defined rules and repeatable components.</p><p>&zwj;</p><p>In Webflow, that means classes have their own logic, components are reusable and visual decisions are not being recreated from zero for every new section. The team does not have to wonder how large a headline should be, what padding belongs to a layout or how a card component should behave in another context. These things are already solved in advance. The result is a faster workflow, fewer mistakes and much less space for inconsistency.</p><p>&zwj;</p><p>A design system also saves time for the client or marketer who works with the website after launch.</p><p>If the system is clean and understandable, new sections are easier to build, content is added more smoothly and the whole site stays visually stable for longer. Without a system, every future update increases the risk that the website starts falling apart into a set of unrelated solutions. A well-structured Webflow project is therefore not only about having an attractive final result.</p><p>It is also about having an internal logic that supports speed, order and long-term maintainability.</p>`,
    `<h3>Why a design system helps a website grow without losing quality</h3><p>&zwj;</p><p><em>A website that should grow with the brand needs more than just a strong first design.</em></p><p>&zwj;</p><p>It needs a system that can support new pages, campaigns, sections and content expansion without reducing quality. That is exactly where the real value of a design system becomes clear. It helps maintain visual consistency even as the project expands and evolves. When a brand later needs a new landing page, case study,</p><p>blog template or a new service section, the design system provides a clear framework to build from. Instead of improvising, the team works with proven components and rules.</p><p>&zwj;</p><p>Thanks to that, new parts of the website do not feel like foreign additions, but like a natural continuation of the original system.</p><p>This matters not only for visual quality, but also for user trust.</p><p>&zwj;</p><p>In the long run, a design system also saves budget. Less time is wasted on fixes, less energy goes into debating small details and the whole team can work more efficiently. The website stays flexible, but also structurally solid. And that is an ideal state for a modern content-driven or marketing website in Webflow.</p><p>A design system in Webflow is therefore not only internal order for the designer or developer.</p><p>It is a way to keep the website easy to update, consistent and ready for growth without chaos.</p><p>&zwj;</p><p><strong>And the more the website is worked on, the more valuable that system becomes.</strong></p>`
  ];

  translations.en.articleContent["forms-crm"] = [
    `<h3>Why a website form is not the goal,</h3><h3>but the beginning of the whole process</h3><p>&zwj;</p><p>Many companies focus mainly on making a form look good and making it easy to submit. That matters, but it is only the first layer. The real value of a form appears after the user clicks the submit button. That is the moment when it is decided whether the website becomes a working lead generation tool or just a place where contacts get lost in an inbox.</p><p>&zwj;</p><p>Every form should be tied to a clear process. That means it should be obvious where the inquiry goes after submission, who receives it, how quickly it should be processed and what is supposed to happen next. If a company has not solved that, the problem is not the form itself, but the whole follow-up flow. The lead may arrive, but without a system it can easily be lost, left unanswered or handled too late.</p><p>&zwj;</p><p>A good website therefore does not end at form submission. That is where the connection between the website, CRM, notifications, internal workflow and further automation actually begins.</p><p>The goal is not only to collect contacts, but to work with them quickly and reliably. When this system is set up well, the website stops being only a presentation page and becomes an active part of the sales process. That is the difference between a form that only exists and a form that genuinely supports the business.</p>`,
    `<h3>How forms, CRM and automations work together in practice</h3><p>&zwj;</p><p>When a user submits a form, the process should ideally not rely only on a single email reaching someone's inbox. That is the simplest solution, but also one of the least reliable if the brand wants to grow. It works much better when form data is automatically written into a CRM system, where the lead is assigned to a specific status, segment or person in the team.</p><p>This creates order, clarity and less risk that something gets forgotten.</p><p>&zwj;</p><p>In this process, the CRM acts as the central place for lead management. It makes it possible to track where the lead came from, which service they were interested in, which communication stage they are in and what should happen next. That is a huge difference compared to handling everything manually through emails and spreadsheets. Automations can speed up the whole flow even further. They can send internal alerts to the team, confirmation emails to the user, create a task in a system or route the lead based on inquiry type. The important thing is that this flow should not become unnecessarily complicated. Automation should not create chaos - it should remove manual steps that take time and increase the chance of error. When the whole system is thought through well, forms, CRM and automations work together as one logical layer. The user submits the inquiry, the team gets an immediate overview and the next step happens without unnecessary delay.</p><p>&zwj;</p><p>That is what a website looks like when it is not only attractive, but truly connected to how the company operates.</p>`,
    `<h3>What makes a form flow reliable,</h3><h3>fast and ready for growth</h3><p>&zwj;</p><p>A quality form system does not stand only on technical integration. It also depends on how well the fields themselves,</p><p>the logic of questions and the follow-up communication are designed. If a form asks for too much information, users often do not complete it. If it asks for too little, the team may not get enough context to respond well. Finding the right balance matters for both UX and lead quality.</p><p>&zwj;</p><p>The feedback after submission matters just as much. Users should know that the form went through successfully, what will happen next and when they can expect a response. This small communication layer strongly increases trust and professionalism.</p><p>On the internal side, it must be clear who takes ownership of the lead, how it is prioritized and which additional automated steps are triggered.</p><p>The fewer uncertainties there are in the process, the better the whole system works.</p><p>&zwj;</p><p>When a form flow is built well, the company responds faster, keeps better order in its contacts and scales its processes more easily. This becomes especially important once the number of inquiries grows and manual handling starts becoming unsustainable.</p><p>The website, CRM and automation layer then stop being three separate parts and start working as one connected growth system.</p><p>A form is therefore not just a detail on the contact page. It is the entry point into the whole sales process.</p><p>And when that process is designed correctly, every click on "Submit" can be the beginning of a well-handled lead,</p><p>not a missed opportunity.</p>`
  ];

  translations.en.articleContent["creating-blogs"] = [
    `<h3>Why a blog is not just extra content,</h3><h3>but a real growth channel</h3><p>&zwj;</p><p>Many companies treat a blog as an add-on to the website. Something that is nice to have, but not particularly important. In reality, however, a blog can become one of the strongest growth channels if it is built correctly. It supports not only SEO, but also trust, expert positioning and the brand's ability to capture people at different stages of decision-making. That is why a blog is not just a place for publishing articles, but a space where a brand systematically builds both traffic and authority.</p><p>&zwj;</p><p>The biggest mistake is writing a blog without a clear purpose. If articles are created only according to whatever someone happens to think of, the result is fragmented content without strategy. One article is too broad, another too technical and a third has no connection to the services or the target audience. A blog like that may have content, but it has no direction. And without direction, it is very hard for it to become a growth tool. A strong blog has to connect to what the brand does, who it does it for and what questions those people are actually asking.</p><p>That means articles should not only inform, but intentionally capture relevant demand. When someone is looking for an answer, a comparison, an explanation or a solution, the blog should be able to meet them there. That is exactly when it starts working like a growth engine. Once content is created systematically, the blog stops being a passive section on the website and starts becoming an active channel that brings the right people in.</p>`,
    `<h3>How to write blog articles that attract relevant traffic</h3><p>&zwj;</p><p>Relevant traffic does not come from adding a few keywords to an article. It comes from the topic, headline, structure and the content itself matching what the user is actually searching for. A good article therefore does not begin with writing. It begins with understanding search intent. The team has to know whether the person is looking for a basic explanation, a comparison, a practical guide or an expert point of view. Only then can content be prepared that has a real chance to perform.</p><p>&zwj;</p><p>Topic selection is also extremely important. The strongest topics sit at the intersection of three things - what people are truly searching for, what the brand genuinely understands and what naturally connects to its services or expertise. When those three layers meet, the result is an article with not only SEO potential, but business value too. Content like that does not bring only clicks. It also builds trust and qualified interest.</p><p>&zwj;</p><p>The writing itself then has to be clear, readable and well structured. The headline should capture attention and describe the value of the piece. The introduction should quickly confirm that the reader is in the right place. Subheadings should help with scanning and the text should naturally move the user forward. It is equally important to avoid unnecessary filler. People are not searching for a long text at any price. They are looking for a good answer.</p><p>&zwj;</p><p>When an article combines the right topic, clear search intent and quality execution, it has a much better chance of bringing in people who are truly relevant for the brand.</p>`,
    `<h3>How to turn a blog into a system</h3><h3>that supports both SEO and the business</h3><p>&zwj;</p><p>A strong blog is not created by one good article. It is created by a system where topics support one another, content is logically connected and every new publication strengthens the whole. That means thinking in terms of content pillars, internal linking, consistent tagging and a clear plan for which topics will be covered. The blog then stops feeling like a series of isolated texts and starts feeling like a content ecosystem.</p><p>&zwj;</p><p>From an SEO point of view, this kind of connection is extremely important. When articles are linked by theme, it becomes easier to build authority in a specific area and search engines understand more clearly where the website is strong. It also helps users. From one article they can naturally move to another related piece, stay on the website longer and gradually go deeper into the topic and closer to the service.</p><p>&zwj;</p><p>This is exactly where the blog connects to the business. Not every article has to sell directly, but it should help build a path toward trust and decision-making. Sometimes through education, sometimes through a show of expertise, sometimes through a link to a relevant service.</p><p>If a blog only gathers traffic without strategic connection to the brand, most of its potential stays unused.</p><p>A blog as a growth engine works when it combines SEO, expertise and a systematic content plan. Then it brings not only more visits, but a better audience, stronger trust and a better foundation for long-term brand growth.</p>`
  ];

  translations.en.articleContent["performance-optimalization"] = [
    `<h3>Why a slow website is not just a technical problem, </h3><h3>but a business problem</h3><p>&zwj;</p><p>A slow website is often treated as a technical detail that can be solved later. In reality, however, it is one of those problems with a direct impact on the business. When a page loads slowly, the visitor does not see it as a minor flaw. They read it as a signal. The website feels less professional, less reliable and less ready. And that can weaken trust before the person even gets to read what you offer.</p><p>&zwj;</p><p>Today, people expect speed from a website by default. When a page responds slowly, the first impression suffers at the most basic level.</p><p>The user does not want to wait for the hero section, heavy images or delayed loading of elements. They want to understand immediately that they are in the right place. If the website cannot provide that certainty quickly, it starts losing before the visitor even reaches the content, the CTA or the references.</p><p>&zwj;</p><p>That is exactly why a slow website is more expensive than it may seem. It does not only take seconds away. It takes attention, patience and trust.</p><p>And when a website loses trust at the beginning, the chance that a visitor will take the next step drops significantly as well. That is why website performance cannot be separated from business results. Speed is therefore not only a technical optimization. It is part of how the brand appears, communicates and sells online.</p>`,
    `<h3>How a slow website reduces leads, </h3><h3>conversions and the overall performance of the page</h3><p>&zwj;</p><p>When a website loads content slowly or feels heavy, users are much more likely to leave.</p><p>That is a huge problem especially for landing pages, company websites and service pages where the goal is to guide a person toward a specific action. The more friction appears during the visit, the lower the willingness to click, move to the next section or submit a form.</p><p>&zwj;</p><p>A slow website also disrupts the flow of the page itself. The hero section should capture attention immediately. The CTA should be quickly available.</p><p>The content should build trust without distracting moments. But if sections load with delay,</p><p>the layout jumps around or the website reacts uncertainly, the user loses their rhythm. The page then no longer feels smooth and convincing, but uncomfortable. That translates very quickly into lower conversion, even when the offer itself is strong.</p><p>&zwj;</p><p>Another major issue is that a slow website often does not cause visible damage all at once. Leads do not drop to zero overnight.</p><p>Instead, potential is lost gradually. Fewer people stay on the site, fewer click deeper and a smaller share of visitors reach out. That is exactly why website performance tends to be underestimated. Its impact shows up quietly, but very systematically.</p><p>So when a website slows down, you are not only paying for extra loading seconds. You are paying with fewer inquiries,</p><p>a weaker user experience and a smaller business result.</p>`,
    `<h3>Why a slow website also harms SEO and the long-term growth of the brand</h3><p>&zwj;</p><p>A slow website does not only affect users who have already arrived on the page. It also weakens the website's ability to gain new organic traffic. Search engines today pay much closer attention to the quality of the user experience, the technical state of the page and overall usability. If a website loads slowly, is unstable or does not perform well on mobile, its visibility in search can suffer too.</p><p>&zwj;</p><p>That matters especially because SEO is not a one-time task, but a long-term system. If a website is meant to grow through content, landing pages or a blog, it needs a healthy technical foundation. Otherwise every new article or page rests on weaker performance than it could. The site then loses not only current effectiveness, but future potential as well. And for a brand, that is far more expensive than one technical fix.</p><p>&zwj;</p><p>In the long run, a slow website also weakens the overall impression of the brand. A visitor may not be able to name exactly what felt wrong, but they will remember the discomfort. And in the online space, these small signals often decide who earns trust and who does not. A fast website does not only feel better technically. It feels more confident, more professional and more prepared for real business.</p><p>&zwj;</p><p>So how much does a slow website cost? More than it seems at first glance. It costs trust, leads and search visibility. That is exactly why performance is one of the most important layers of every quality website, not just a technical detail at the end of the project.</p>`
  ];

  translations.en.articleContent["start-web-project"] = [
    `<h3>Why many website projects slow down even before </h3><h3>they truly get moving</h3><p>&zwj;</p><p>Many website projects do not slow down because the designer, developer or client is weak. They slow down because essential inputs and clear decisions are missing at the beginning.</p><p>&zwj;</p><p>The project may officially kick off, but it very quickly becomes obvious that it is unclear what the website is actually supposed to achieve, who approves outputs, what content already exists and what still needs to be prepared. The result is not a smooth process,</p><p>but a constant need to step back.</p><p>&zwj;</p><p>That is exactly why preparation before the start of a website project matters so much. If the brand knows what it wants the website to achieve, who it is for and what its priorities are, the whole process becomes much more precise. The team does not have to guess the direction, fewer uncertainties appear and decisions are made faster. On the other hand, if the project starts without a solid foundation, revisions pile up, feedback tends to be vague and every next phase gets unnecessarily extended.</p><p>&zwj;</p><p>A website project is not only about a nice visual. It is a chain of decisions that build on one another. If the beginning is handled poorly,</p><p>problems carry over into strategy, content, design and development. And that is exactly when those unnecessary extra weeks appear,</p><p>which could have been saved with better preparation. A good project therefore does not begin with the first homepage design. It begins with quality setup before anyone starts designing or building.</p>`,
    `<h3>What inputs should be ready before a website project even begins</h3><p>&zwj;</p><p>One of the most important things is clarity around goals. A website cannot do everything equally well at the same time. You need to know whether its main job is to generate leads, explain a service, build trust, support sales or function as a content platform.</p><p>When that goal is clear, it becomes much easier to make decisions about structure, content and the priorities of individual pages.</p><p>&zwj;</p><p>The content foundation is just as important. It does not have to be finished down to the last sentence, but the project needs to know which services will be presented, what materials already exist, which references will be used and who will deliver copy, images or other assets.</p><p>A lot of delay appears exactly when content is handled only on the fly without a clear plan. Design and development then wait for inputs and the project loses momentum.</p><p>&zwj;</p><p>It also helps a lot when the client has references prepared and can describe what they like about them. That does not mean the new website should look the same, but those examples make expectations much easier to understand. It is also important to be clear on the brand, the tone of communication and what the website should say about the company. The fewer uncertainties there are at the start, the fewer unnecessary edits there will be later. When these inputs are prepared in advance, the project does not run on improvisation, but on a clear framework.</p><p>&zwj;</p><p>And that is one of the biggest differences between a smooth process and endless revisions.</p>`,
    `<h3>How to set up feedback and approvals </h3><h3>so the project does not stall on unnecessary revisions</h3><p>&zwj;</p><p>Even a very well-prepared website project can get stuck if it is not clear how feedback and approvals will work.</p><p>This is often one of the most underestimated parts of the whole collaboration. When too many people weigh in without clear roles,</p><p>comments often contradict one another, the project direction becomes blurred and the team no longer knows which decisions are truly final.</p><p>The result is more revision rounds that slow the project down more than the actual production itself.</p><p>&zwj;</p><p>That is why it is very helpful to have one main decision maker on the client side, or at least a clearly defined approval process. The team then knows from whom to collect feedback, who gives the final yes and when a phase is closed.</p><p>It is just as important that feedback is not only subjective in the style of &bdquo;I do not like it,&ldquo; but tied to the website goal, the target audience and business needs. Feedback like that is far more useful and leads to better decisions.</p><p>&zwj;</p><p>The project also benefits a lot from a realistic expectation that not everything should be refined at once. First the direction is solved, then the structure,</p><p>then the visual layer, then the details. When these layers get mixed together, chaos appears and the team keeps circling back unnecessarily.</p><p>A good process therefore does not rely only on creativity, but also on discipline in what gets approved and when.</p><p>&zwj;</p><p>So if the right inputs, content, responsibilities and feedback process are prepared before the website project begins,</p><p>the entire brief moves faster and with more confidence. Instead of losing weeks in revisions, there is room for what really matters</p><p>- building a quality website that works for the brand and for its clients.</p>`
  ];

  translations.en.articleContent["landing-page"] = [
    `<h3><strong>Why a good landing page does not begin with design, but with clear value</strong></h3><p>&zwj;</p><p>A landing page has a very specific job. It is not only supposed to look good or present the brand in a general way. It needs to convince the visitor that they are in the right place and lead them toward one clear action. That is exactly why a successful landing page does not begin with colors or animations, but with understanding what the person is looking for, what they are worried about and what value they need to see immediately.</p><p>The most important part of the whole page is usually the first screen. This is where it is decided very quickly whether the user stays or leaves. The headline has to be clear, specific and relevant. It must not speak only in general terms about quality or creativity. It has to say what you offer and who it is for. The subheadline should expand that value and the CTA should show the person what to do next. If that combination is weak, the rest of the page often never gets a real chance.</p><p>A good landing page therefore works like a precisely targeted answer to a specific need. It does not say everything about the company. It says what the person needs to hear to move closer to a decision. The more precisely the page can communicate the problem, the solution and the benefit, the higher the chance of conversion.</p><p>When the core value is communicated clearly, the landing page gains the most important thing - attention and a reason to keep going.</p>`,
    `<h3><strong>How the structure of a landing page should be built so it naturally leads to conversion</strong></h3><h3>&zwj;</h3><p>A strong landing page does not feel like randomly assembled sections. It has a clear flow. First it needs to attract attention and explain the value, then build trust, then answer questions and only after that push toward action. When the order of these parts is wrong, the visitor gets lost in the page or does not feel there is a strong enough reason to take the next step.</p><p>After the introduction usually comes the section that develops the main benefit. Here it is important to show what the user actually gains, not only list the features of a service or product. The following sections should gradually reduce uncertainty. This may include a short explanation of the process, examples of results, answers to common questions or a comparison with alternatives. Every section should have its place and its reason.</p><p>Copywriting plays a major role in this too. Text on a landing page has to be precise, easy to read and focused on the user's decision-making. Too many generic phrases weaken the page. On the contrary, concrete language, clear benefits and understandable wording help build confidence. The visitor should not have to wonder what you meant. They should understand it immediately.</p><p>When a landing page has a good structure, the user moves through it naturally. They are not pushed, but guided. And that is exactly the difference between a page that only informs and a page that truly converts.</p>`,
    `<h3>What trust elements increase the chance that a visitor will actually click</h3><h3>&zwj;</h3><p>Even if a landing page is visually strong and well written, without trust it will still be weak. Most people do not make a decision only because of a nice headline or CTA. They need to feel that the brand knows what it is doing, that the result will be worth it and that clicking is a safe next step. That is why trust elements are one of the most important layers of the entire landing page.</p><p>Trust is built mainly through references, concrete results, work samples, client logos or clearly stated experience. Transparency also works strongly. When the page openly communicates the process, expectations or the next step after form submission, the user feels more confident. The overall consistency of the page matters just as much. Professional visuals, clear copywriting and logical structure together create the feeling that the brand has things under control.</p><p>Trust elements, however, should not be only an extra section somewhere at the bottom of the page. They should be naturally distributed across the landing page so they support decision-making at the right moments. When a person sees a benefit, they need confirmation. When they are considering a click, they need certainty. When they hesitate, proof that it worked for others can help.</p><p>A landing page that converts is therefore not the result of one strong element. It is a combination of clear value, a well-built structure, precise copywriting and trust that is developed step by step. When these layers work together, the page does not only feel convincing. It feels like the visitor naturally understands why they should click.</p>`
  ];

  window.YabiTranslations = translations;

  var commonMappings = [
    { selector: '.nav_section a[href="/o-nas.html"] .link_header', key: 'common.nav.about' },
    { selector: '.nav_section a[href="/kontaktujte-nas.html"] .link_header', key: 'common.nav.contact' },
    { selector: '.nav_section a[href="/projekty.html"] .link_header', key: 'common.nav.projects' },
    { selector: '.nav_section a[href="/sluzby.html"] .link_header', key: 'common.nav.services' },
    { selector: '.nav_section a[href="/blogs/blog-list.html"] .link_header', key: 'common.nav.blog' },
    { selector: '.footer_link_wrap a[href="/o-nas.html"]', key: 'common.nav.about' },
    { selector: '.footer_link_wrap a[href="/kontaktujte-nas.html"]', key: 'common.nav.contact' },
    { selector: '.footer_link_wrap a[href="/projekty.html"]', key: 'common.nav.projects' },
    { selector: '.footer_link_wrap a[href="/sluzby.html"]', key: 'common.nav.services' },
    { selector: '.footer_link_wrap a[href="/blogs/blog-list.html"]', key: 'common.nav.blog' },
    { selector: '.footer_link_wrap .inactive-link', key: 'common.footer.terms' },
    { selector: '.link-3', key: 'common.nav.menu' },
    { selector: '.projects_wrapper > .chips .medium-uppercase-xs', key: 'common.projectsSection.label' },
    { selector: '.projects_wrapper > .h3.centered', key: 'common.projectsSection.heading', type: 'html' },
    { selector: '.projects_wrapper > .primary_button.primary-white .first-button-text', key: 'common.cta.moreProjects' },
    { selector: '.projects_wrapper > .primary_button.primary-white .second-button-text', key: 'common.cta.moreProjects' },
    { selector: '.projects_wrap .project_card_title .h4', valuesPath: 'common.projectCards.titles' },
    { selector: '.projects_wrap .paragraph_project_card', valuesPath: 'common.projectCards.descriptions' },
    { selector: '.projects_wrap .project_labels_wrap .cms_label_block:first-child .label:not(.lowercase)', key: 'common.projectCards.clientLabel' },
    { selector: '.projects_wrap .project_labels_wrap .cms_label_block:nth-child(2) .label:not(.lowercase)', key: 'common.projectCards.timelineLabel' },
    { selector: '.projects_wrap .cms_chips .medium-uppercase-xs', valuesPath: 'common.projectCards.chips' },
    { selector: '.projects_wrap .cms_thumbnail', valuesPath: 'common.projectCards.alts', type: 'attr', attrName: 'alt' },
    { selector: '.contact_footer_card .chips .medium-uppercase-xs', key: 'common.contactFooter.label' },
    { selector: '.contact_footer_card .h3.centered', key: 'common.contactFooter.heading' },
    { selector: '.contact_footer_card .first-button-text', key: 'common.cta.contactForm' },
    { selector: '.contact_footer_card .second-button-text', key: 'common.cta.contactForm' },
    { selector: '.newsletter_form input[type="email"]', key: 'common.forms.emailPlaceholder', type: 'attr', attrName: 'placeholder' },
    { selector: '.newsletter_form input[type="submit"]', key: 'common.cta.subscribe', type: 'attr', attrName: 'value' },
    { selector: '.newsletter_form input[type="submit"]', key: 'common.forms.newsletterWait', type: 'attr', attrName: 'data-wait' },
    { selector: '.subscribe .white-chips .medium-uppercase-xs', key: 'common.newsletter.label' },
    { selector: '.subscribe .h3.centered', key: 'common.newsletter.heading' },
    { selector: '.success-message-2 > div', key: 'common.forms.success' },
    { selector: '.w-form-done .success_message_block', key: 'common.forms.success' },
    { selector: '.error_message_2 > div', key: 'common.forms.error' },
    { selector: '.error_message > div', key: 'common.forms.error' },
    { selector: '.secondary_button-2 .link-2', key: 'common.cta.back' },
    { selector: '.secondary_button_white .link-2', key: 'common.cta.back' },
    { selector: '.project_catd_cta_wrap .first-button-text', key: 'common.cta.moreAboutProject' },
    { selector: '.project_catd_cta_wrap .second-button-text', key: 'common.cta.moreAboutProject' }
  ];

  var pageMappings = {    index: [
      { selector: '.hero_title.homepage .chips.primary-chips .medium-uppercase-xs', key: 'pages.index.heroTag' },
      { selector: '.h1_primary.hero-heading-stagger', key: 'pages.index.heroHeadingHtml', type: 'html' },
      { selector: '.hero_description.homepage', key: 'pages.index.heroDescription' },
      { selector: '.hero_paragraph_div .first-button-text', key: 'common.cta.contactUs' },
      { selector: '.hero_paragraph_div .second-button-text', key: 'common.cta.contactUs' },
      { selector: '.projects_wrapper > .chips .medium-uppercase-xs', key: 'common.nav.projects' },
      { selector: '.projects_wrapper > .h3.centered', key: 'pages.index.projectsHeading', type: 'html' },
      { selector: '.projects_wrapper > .primary_button.primary-white .first-button-text', key: 'common.cta.moreProjects' },
      { selector: '.projects_wrapper > .primary_button.primary-white .second-button-text', key: 'common.cta.moreProjects' },
      { selector: '.projects_wrap .project_card_title .h4', valuesPath: 'common.projectCards.titles' },
      { selector: '.projects_wrap .paragraph_project_card', valuesPath: 'common.projectCards.descriptions' },
      { selector: '.projects_wrap .project_labels_wrap .cms_label_block:first-child .label:not(.lowercase)', key: 'common.projectCards.clientLabel' },
      { selector: '.projects_wrap .project_labels_wrap .cms_label_block:nth-child(2) .label:not(.lowercase)', key: 'common.projectCards.timelineLabel' },
      { selector: '.projects_wrap .cms_chips .medium-uppercase-xs', valuesPath: 'common.projectCards.chips' },
      { selector: '.projects_wrap .cms_thumbnail', valuesPath: 'common.projectCards.alts', type: 'attr', attrName: 'alt' },
      { selector: '.highlights_wraper .chips .medium-uppercase-xs', key: 'common.faq.label' },
      { selector: '.highlights_wraper .h3.horizontal', key: 'common.faq.heading' },
      { selector: '.faq-question-text', valuesPath: 'common.faq.questions' },
      { selector: '.faq-answer-text', valuesPath: 'common.faq.answers' }
    ],
    about: [
      { selector: '.hero_title > .chips.primary-chips .medium-uppercase-xs', key: 'pages.about.heroTag' },
      { selector: '.hero_title .h1_secondary', key: 'pages.about.heroTitle' },
      { selector: '.hero_title .hero_description', key: 'pages.about.heroDescription', type: 'html' },
      { selector: '.values_wraper .chips .medium-uppercase-xs', key: 'pages.about.valuesTag' },
      { selector: '.values_wraper .h3.centered', key: 'pages.about.valuesHeading' },
      { selector: '.values_wraper .paragraph.centered', key: 'pages.about.valuesDescription', type: 'html' },
      { selector: '.yabi_values_image', key: 'pages.about.alts.values', type: 'attr', attrName: 'alt' },
      { selector: '.tools_wrap_2 .tools_wraper .chips .medium-uppercase-xs', key: 'pages.about.toolsTag' },
      { selector: '.tools_wrap_2 .h3.centered', key: 'pages.about.toolsHeading', type: 'html' },
      { selector: '.tools_wrap_2 .label.white', valuesPath: 'pages.about.toolTitles' },
      { selector: '.tools_wrap_2 .paragraph.white.centered', valuesPath: 'pages.about.toolDescriptions', type: 'html' },
      { selector: '.yabi_tools_image', key: 'pages.about.alts.tools', type: 'attr', attrName: 'alt' },
      { selector: '.location_wrap .chips .medium-uppercase-xs', key: 'pages.about.locationTag' },
      { selector: '.location_wrap .h3.centered', key: 'pages.about.locationHeading' },
      { selector: '.location_wrap .paragraph.centered', key: 'pages.about.locationDescription', type: 'html' },
      { selector: '.yabi_location_image', key: 'pages.about.alts.location', type: 'attr', attrName: 'alt' }
    ],
    services: [
      { selector: '.hero_title > .chips.primary-chips .medium-uppercase-xs', key: 'pages.services.heroTag' },
      { selector: '.hero_title .h1_secondary', key: 'pages.services.heroTitle' },
      { selector: '.hero_title .hero_description', key: 'pages.services.heroDescription' },
      { selector: '.claim_section .chips .medium-uppercase-xs', key: 'pages.services.claimTag' },
      { selector: '.claim_section .h3.dark.centered', key: 'pages.services.claimHeading' },
      { selector: '.services_grid h5', valuesPath: 'pages.services.serviceTitles' },
      { selector: '.services_grid .service_card_wrap > div > div', valuesPath: 'pages.services.serviceDescriptions' }
    ],
    projects: [
      { selector: '.hero_title > .chips.primary-chips .medium-uppercase-xs', key: 'pages.projects.heroTag' },
      { selector: '.hero_title .h1_secondary', key: 'pages.projects.heroTitle' },
      { selector: '.hero_title .hero_description', key: 'pages.projects.heroDescription' },
      { selector: '.projects_wrapper > .chips .medium-uppercase-xs', key: 'common.nav.projects' },
      { selector: '.projects_wrapper > .h3.centered', key: 'pages.projects.projectsHeading', type: 'html' },
      { selector: '.projects_wrap .project_card_title .h4', valuesPath: 'common.projectCards.titles' },
      { selector: '.projects_wrap .paragraph_project_card', valuesPath: 'common.projectCards.descriptions' },
      { selector: '.projects_wrap .project_labels_wrap .cms_label_block:first-child .label:not(.lowercase)', key: 'common.projectCards.clientLabel' },
      { selector: '.projects_wrap .project_labels_wrap .cms_label_block:nth-child(2) .label:not(.lowercase)', key: 'common.projectCards.timelineLabel' },
      { selector: '.projects_wrap .cms_chips .medium-uppercase-xs', valuesPath: 'common.projectCards.chips' },
      { selector: '.projects_wrap .cms_thumbnail', valuesPath: 'common.projectCards.alts', type: 'attr', attrName: 'alt' }
    ],
    contact: [
      { selector: '.hero_title > .chips.primary-chips .medium-uppercase-xs', key: 'pages.contact.heroTag' },
      { selector: '.hero_title .h1_secondary', key: 'pages.contact.heroTitle' },
      { selector: '.hero_title .hero_description', key: 'pages.contact.heroDescription' },
      { selector: '.form_wraper .h2', key: 'pages.contact.formHeading' },
      { selector: 'label[for="name"]', key: 'pages.contact.nameLabel' },
      { selector: '#name', key: 'pages.contact.namePlaceholder', type: 'attr', attrName: 'placeholder' },
      { selector: 'label[for="email"]', key: 'pages.contact.emailLabel' },
      { selector: '#email', key: 'pages.contact.emailPlaceholder', type: 'attr', attrName: 'placeholder' },
      { selector: 'label[for="field"]', key: 'pages.contact.messageLabel' },
      { selector: 'textarea[name="field"]', key: 'pages.contact.messagePlaceholder', type: 'attr', attrName: 'placeholder' },
      { selector: '.checkbox_label.w-form-label', valuesPath: 'pages.contact.consentLabels', type: 'html' },
      { selector: '.primary_button.streched.w-button', key: 'common.cta.send', type: 'attr', attrName: 'value' },
      { selector: '.primary_button.streched.w-button', key: 'common.forms.submitWait', type: 'attr', attrName: 'data-wait' }
    ],
    blogList: [
      { selector: '.container.blog .chips.primary-chips .medium-uppercase-xs', key: 'pages.blogList.heroTag' },
      { selector: '.h1_secondary_blog', key: 'pages.blogList.heroTitle' },
      { selector: '.container.blog .hero_title .hero_description', key: 'pages.blogList.heroDescription' },
      { selector: '.collection-list-5 .h3', key: 'pages.blogList.featuredTitle' },
      { selector: '.collection-list-5 .article_description', key: 'pages.blogList.featuredDescription' },
      { selector: '.collection-list-5 .blog_chip_wrap .medium-uppercase-xs', valuesPath: 'pages.blogList.featuredChips' },
      { selector: '.collection-list-5 .featured_article_image', key: 'pages.blogList.featuredAlt', type: 'attr', attrName: 'alt' },
      { selector: '.collection-list-4 .h4', valuesPath: 'pages.blogList.articleTitles' },
      { selector: '.collection-list-4 .article_description.dark', valuesPath: 'pages.blogList.articleDescriptions' },
      { selector: '.collection-list-4 .blog_chip_wrap .medium-uppercase-xs', valuesPath: 'pages.blogList.articleChips' },
      { selector: '.collection-list-4 .article_image', valuesPath: 'pages.blogList.articleAlts', type: 'attr', attrName: 'alt' },
      { selector: '.w-pagination-next.next .link', key: 'pages.blogList.nextPage' }
    ]
  };

  function getStoredLanguage() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.indexOf(stored) > -1 ? stored : DEFAULT_LANGUAGE;
    } catch (error) {
      return DEFAULT_LANGUAGE;
    }
  }

  function persistLanguage(language) {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      return;
    }
  }

  function getNestedValue(source, path) {
    return path.split('.').reduce(function (current, key) {
      if (current === undefined || current === null) {
        return undefined;
      }
      return current[key];
    }, source);
  }

  function t(path, fallback) {
    var dictionary = currentLanguage === 'en' ? translations.en : translations.sk;
    var value = getNestedValue(dictionary, path);
    return value !== undefined ? value : fallback;
  }

  window.t = t;

  function getPageKey() {
    var path = (window.location.pathname || '/').replace(/\\/g, '/').replace(/\/+/g, '/');
    var segments = path.split('/').filter(Boolean);
    var lastOne = segments.slice(-1)[0] || '';
    var lastTwo = segments.slice(-2).join('/');

    if (!segments.length || path === '/' || lastOne === 'index.html') {
      return 'index';
    }
    if (lastOne === 'o-nas.html') {
      return 'about';
    }
    if (lastOne === 'sluzby.html') {
      return 'services';
    }
    if (lastOne === 'projekty.html') {
      return 'projects';
    }
    if (lastOne === 'kontaktujte-nas.html') {
      return 'contact';
    }
    if (lastTwo === 'blogs/blog-list.html' || lastOne === 'blog-list.html') {
      return 'blogList';
    }
    if (segments[0] === 'articles') {
      return 'article';
    }
    if (segments[0] === 'featured-projects') {
      return 'projectDetail';
    }
    return null;
  }

  function getPageSlug() {
    var path = (window.location.pathname || '/').replace(/\\/g, '/').replace(/\/+/g, '/');
    var segments = path.split('/').filter(Boolean);
    var lastOne = segments.slice(-1)[0] || '';
    return document.documentElement.getAttribute('data-wf-item-slug') || lastOne.replace(/\.html$/, '');
  }

  function formatString(template, replacements) {
    var result = template || '';
    Object.keys(replacements || {}).forEach(function (key) {
      result = result.replace(new RegExp('\\{' + key + '\\}', 'g'), replacements[key]);
    });
    return result;
  }

  function getBlogEntries(language) {
    var blog = getNestedValue(translations[language], 'blog') || {};
    var entries = [];
    if (blog.featured) {
      entries.push(blog.featured);
    }
    return entries.concat(blog.articles || []);
  }

  function findArticleBySlug(language, slug) {
    return getBlogEntries(language).find(function (article) {
      return article.slug === slug;
    }) || null;
  }

  function findArticleByHref(language, href) {
    var normalizedHref = (href || '').split('?')[0];
    return getBlogEntries(language).find(function (article) {
      return article.href === normalizedHref;
    }) || null;
  }

  function buildProjectDetailAlts(title, language) {
    var template = getNestedValue(translations[language], 'common.alts.projectDetail') || '';
    return Array.prototype.slice.call(document.querySelectorAll('.image_cms_large')).map(function (element, index) {
      return formatString(template, {
        index: String(index + 1),
        title: title
      });
    });
  }

  function buildArticleImageAlts(title, language) {
    var template = getNestedValue(translations[language], 'common.alts.articleImage') || '';
    return Array.prototype.slice.call(document.querySelectorAll('.article_image_1-2')).map(function (element, index) {
      return formatString(template, {
        index: String(index + 1),
        title: title
      });
    });
  }

  function buildProjectDetailMappings(slug) {
    var project = getNestedValue(translations.en, 'projectDetails.' + slug);
    if (!project) {
      return [];
    }

    return [
      { selector: '.h1_secondary_cms', value: project.title },
      { selector: '.project_parameters_wrap .label.projects', values: [project.labels.client, project.labels.timeline, project.labels.goal] },
      { selector: '.project_parameters_wrap .paragraph.dark', values: [project.client, project.timeline, project.goal] },
      { selector: '.overview_wrap .label.white', values: [project.labels.overview, project.labels.tags] },
      { selector: '.overview_wrap .paragraph', values: [project.overview] },
      { selector: '.overview_wrap .chip_block .medium-uppercase-xs', values: project.chips },
      { selector: '.image_cms_large', values: buildProjectDetailAlts(project.title, 'en'), type: 'attr', attrName: 'alt' }
    ];
  }

  function buildArticleMappings(slug) {
    var article = findArticleBySlug('en', slug);
    var articleContent = getNestedValue(translations.en, 'articleContent.' + slug) || [];
    var relatedAnchors;

    if (!article) {
      return [];
    }

    relatedAnchors = Array.prototype.slice.call(document.querySelectorAll('.collection-list-6 a[href]'));

    return [
      { selector: '.container.article .blog_chip_wrap .medium-uppercase-xs', values: article.chips },
      { selector: '.h1_secondary_dropshadow', value: article.title },
      { selector: '.main_content_wrap-2 > .w-richtext', values: articleContent.slice(0, 2), type: 'html' },
      { selector: '.main_content_wrap-2 > .rich-text-block.w-richtext', values: articleContent.slice(2, 3), type: 'html' },
      { selector: '.article_image_1-2', values: buildArticleImageAlts(article.title, 'en'), type: 'attr', attrName: 'alt' },
      {
        selector: '.collection-list-6 .h4',
        values: relatedAnchors.map(function (anchor) {
          var related = findArticleByHref('en', anchor.getAttribute('href'));
          return related ? related.title : null;
        })
      },
      {
        selector: '.collection-list-6 .article_image',
        values: relatedAnchors.map(function (anchor) {
          var related = findArticleByHref('en', anchor.getAttribute('href'));
          return related ? formatString(getNestedValue(translations.en, 'common.alts.blogThumbnail') || '', { title: related.title }) : null;
        }),
        type: 'attr',
        attrName: 'alt'
      }
    ];
  }

  function buildDynamicMappings(pageKey, slug) {
    if (pageKey === 'projectDetail') {
      return buildProjectDetailMappings(slug);
    }
    if (pageKey === 'article') {
      return buildArticleMappings(slug);
    }
    return [];
  }

  function buildMappings(pageKey, slug) {
    return commonMappings
      .concat(pageMappings[pageKey] || [])
      .concat(buildDynamicMappings(pageKey, slug))
      .map(function (mapping, index) {
        var clone = Object.assign({}, mapping);
        clone.uid = 'map-' + index;
        return clone;
      });
  }

  function getElementValue(element, mapping) {
    if (mapping.type === 'html') {
      return element.innerHTML;
    }
    if (mapping.type === 'attr') {
      return element.getAttribute(mapping.attrName);
    }
    if (element.hasAttribute('data-hero-heading-original')) {
      return element.getAttribute('data-hero-heading-original');
    }
    return element.textContent;
  }

  function setElementValue(element, mapping, value) {
    if (mapping.type === 'html') {
      element.innerHTML = value || '';
      return;
    }
    if (mapping.type === 'attr') {
      if (value === null || value === undefined || value === '') {
        element.removeAttribute(mapping.attrName);
        return;
      }
      if (mapping.attrName === 'value') {
        element.value = value;
      }
      if (mapping.attrName === 'placeholder') {
        element.placeholder = value;
      }
      element.setAttribute(mapping.attrName, value);
      return;
    }
    element.textContent = value || '';
    if (element.matches('.hero_title h1, .hero_title-2 h1')) {
      element.setAttribute('data-hero-heading-original', value || '');
    }
  }

  function captureMappingSnapshots() {
    state.mappings.forEach(function (mapping) {
      state.mappingSnapshots[mapping.uid] = Array.prototype.slice.call(document.querySelectorAll(mapping.selector)).map(function (element) {
        return getElementValue(element, mapping);
      });
    });
  }

  function getMetaContent(selector) {
    var element = document.querySelector(selector);
    return element ? element.getAttribute('content') : null;
  }

  function setMetaContent(selector, value) {
    document.querySelectorAll(selector).forEach(function (element) {
      if (value === null || value === undefined) {
        return;
      }
      element.setAttribute('content', value);
    });
  }

  function captureMetaSnapshot() {
    state.structuredDataElements = Array.prototype.slice.call(document.querySelectorAll('script[type="application/ld+json"]'));
    state.structuredDataSnapshots = state.structuredDataElements.map(function (element) {
      return element.textContent;
    });
    state.metaSnapshot = {
      title: document.title,
      description: getMetaContent('meta[name="description"]'),
      ogTitle: getMetaContent('meta[property="og:title"]'),
      ogDescription: getMetaContent('meta[property="og:description"]'),
      twitterTitle: getMetaContent('meta[property="twitter:title"]'),
      twitterDescription: getMetaContent('meta[property="twitter:description"]')
    };
  }

  function restoreSnapshots() {
    state.mappings.forEach(function (mapping) {
      var values = state.mappingSnapshots[mapping.uid] || [];
      Array.prototype.slice.call(document.querySelectorAll(mapping.selector)).forEach(function (element, index) {
        setElementValue(element, mapping, values[index]);
      });
    });
  }

  function applyEnglishTranslations() {
    state.mappings.forEach(function (mapping) {
      var elements = Array.prototype.slice.call(document.querySelectorAll(mapping.selector));
      var values = Array.isArray(mapping.values) ? mapping.values : (mapping.valuesPath ? getNestedValue(translations.en, mapping.valuesPath) || [] : null);
      var value = Object.prototype.hasOwnProperty.call(mapping, 'value') ? mapping.value : (mapping.key ? getNestedValue(translations.en, mapping.key) : null);

      elements.forEach(function (element, index) {
        var nextValue = Array.isArray(values) ? values[index] : value;
        if (nextValue === undefined || nextValue === null) {
          nextValue = (state.mappingSnapshots[mapping.uid] || [])[index];
        }
        setElementValue(element, mapping, nextValue);
      });
    });
  }

  function normalizeChipText(text) {
    return (text || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function updateChipLabels() {
    document.querySelectorAll('.medium-uppercase-xs').forEach(function (element) {
      var originalText;
      var lookupKey;
      var translated;

      if (!element.closest('.descriptive-chips, .chips, .cms_chips, .chip_block')) {
        return;
      }

      originalText = element.getAttribute('data-i18n-chip-original');
      if (!originalText) {
        originalText = element.textContent.trim();
        element.setAttribute('data-i18n-chip-original', originalText);
      }

      if (currentLanguage === 'sk') {
        element.textContent = originalText;
        return;
      }

      lookupKey = CHIP_LABEL_KEY_BY_TEXT[normalizeChipText(originalText)] || CHIP_LABEL_KEY_BY_TEXT[normalizeChipText(element.textContent)];
      if (!lookupKey) {
        return;
      }

      translated = getNestedValue(translations.en, 'common.chipLabels.' + lookupKey);
      if (translated) {
        element.textContent = translated;
      }
    });
  }

  function translateMonthNames(text) {
    var translated = text;
    Object.keys(MONTH_NAMES).forEach(function (month) {
      translated = translated.replace(new RegExp(month, 'gi'), function (match) {
        var replacement = MONTH_NAMES[month];
        return match.charAt(0) === match.charAt(0).toUpperCase() ? replacement : replacement.toLowerCase();
      });
    });
    return translated;
  }

  function updateDateLabels() {
    document.querySelectorAll('.date_label, .project_labels_wrap .label.lowercase').forEach(function (element) {
      var original = element.getAttribute('data-i18n-original');
      if (!original) {
        original = element.textContent.trim();
        element.setAttribute('data-i18n-original', original);
      }
      element.textContent = currentLanguage === 'en' ? translateMonthNames(original) : original;
    });
  }

  function setStructuredDataLanguage(node) {
    if (Array.isArray(node)) {
      node.forEach(setStructuredDataLanguage);
      return;
    }
    if (!node || typeof node !== 'object') {
      return;
    }
    if (Object.prototype.hasOwnProperty.call(node, 'inLanguage')) {
      node.inLanguage = currentLanguage;
    }
    Object.keys(node).forEach(function (key) {
      setStructuredDataLanguage(node[key]);
    });
  }

  function getPageContent(language) {
    if (!state.pageKey) {
      return null;
    }
    if (state.pageKey === 'article') {
      return findArticleBySlug(language, state.pageSlug);
    }
    if (state.pageKey === 'projectDetail') {
      return getNestedValue(translations[language], 'projectDetails.' + state.pageSlug) || null;
    }
    return getNestedValue(translations[language], 'pages.' + state.pageKey) || null;
  }

  function getPageMeta(language) {
    var pageContent = getPageContent(language);
    if (!pageContent) {
      return null;
    }
    if (pageContent.meta) {
      return pageContent.meta;
    }
    if (state.pageKey === 'article') {
      return {
        title: pageContent.title,
        description: pageContent.description
      };
    }
    if (state.pageKey === 'projectDetail') {
      return {
        title: pageContent.title,
        description: pageContent.overview || pageContent.goal || ''
      };
    }
    return null;
  }

  function updateMetadata() {
    var pageMeta = currentLanguage === 'en' ? getPageMeta('en') : null;
    var pageContent = currentLanguage === 'en' ? getPageContent('en') : null;
    var structuredTitle = pageContent && pageContent.title ? pageContent.title : (pageMeta ? pageMeta.title : null);

    document.documentElement.lang = currentLanguage;
    document.documentElement.setAttribute('data-language', currentLanguage);

    if (currentLanguage === 'sk' || !pageMeta) {
      document.title = state.metaSnapshot.title;
      setMetaContent('meta[name="description"]', state.metaSnapshot.description);
      setMetaContent('meta[property="og:title"]', state.metaSnapshot.ogTitle);
      setMetaContent('meta[property="og:description"]', state.metaSnapshot.ogDescription);
      setMetaContent('meta[property="twitter:title"]', state.metaSnapshot.twitterTitle);
      setMetaContent('meta[property="twitter:description"]', state.metaSnapshot.twitterDescription);
      state.structuredDataElements.forEach(function (element, index) {
        element.textContent = state.structuredDataSnapshots[index];
      });
      return;
    }

    document.title = pageMeta.title;
    setMetaContent('meta[name="description"]', pageMeta.description);
    setMetaContent('meta[property="og:title"]', pageMeta.title);
    setMetaContent('meta[property="og:description"]', pageMeta.description);
    setMetaContent('meta[property="twitter:title"]', pageMeta.title);
    setMetaContent('meta[property="twitter:description"]', pageMeta.description);

    state.structuredDataElements.forEach(function (element, index) {
      var original = state.structuredDataSnapshots[index];
      var data;
      try {
        data = JSON.parse(original);
      } catch (error) {
        element.textContent = original;
        return;
      }

      setStructuredDataLanguage(data);

      if (structuredTitle && typeof data.name === 'string') {
        data.name = structuredTitle;
      }
      if (structuredTitle && typeof data.headline === 'string') {
        data.headline = structuredTitle;
      }
      if (typeof data.description === 'string') {
        data.description = pageMeta.description;
      }
      if (state.pageKey === 'index' && Array.isArray(data.mainEntity)) {
        var questions = getNestedValue(translations.en, 'common.faq.questions') || [];
        var answers = getNestedValue(translations.en, 'common.faq.answers') || [];
        data.mainEntity = data.mainEntity.map(function (item, itemIndex) {
          var nextItem = Object.assign({}, item);
          if (questions[itemIndex]) {
            nextItem.name = questions[itemIndex];
          }
          if (nextItem.acceptedAnswer && answers[itemIndex]) {
            nextItem.acceptedAnswer = Object.assign({}, nextItem.acceptedAnswer, {
              text: answers[itemIndex]
            });
          }
          return nextItem;
        });
      }

      element.textContent = JSON.stringify(data, null, 2);
    });
  }
  function updateAccessibilityLabels() {
    document.querySelectorAll('.nav_container').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.mainNavigation', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('.link-3').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.openMenu', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('.close_div').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.closeMenu', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('.language_switcher').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.languageSwitcher', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('.menu_mobile .image-4').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.homeLogo', element.getAttribute('aria-label')));
      element.setAttribute('alt', t('common.alts.logo', element.getAttribute('alt')));
    });
    document.querySelectorAll('.newsletter_form input[type="email"], #email').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.emailAddress', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('textarea[name="field"]').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.message', element.getAttribute('aria-label')));
    });
    document.querySelectorAll('.w-pagination-next.next').forEach(function (element) {
      element.setAttribute('aria-label', t('common.a11y.nextPage', element.getAttribute('aria-label')));
    });
  }

  function updateGeneratedAriaLabels() {
    document.querySelectorAll('.project').forEach(function (project) {
      var title = project.querySelector('.project_card_title .h4');
      var link = project.querySelector('.project_catd_cta_wrap a.primary_button');
      if (title && link) {
        link.setAttribute('aria-label', t('common.a11y.moreAboutProjectPrefix', '') + title.textContent.trim());
      }
    });
    document.querySelectorAll('.projects_wrapper > .primary_button.primary-white').forEach(function (link) {
      link.setAttribute('aria-label', t('common.a11y.viewAllProjects', link.getAttribute('aria-label')));
    });
    document.querySelectorAll('.secondary_button_white').forEach(function (link) {
      link.setAttribute('aria-label', t('common.a11y.backToProjects', link.getAttribute('aria-label')));
    });
    document.querySelectorAll('.secondary_button-2.secondary_dark').forEach(function (link) {
      link.setAttribute('aria-label', t('common.a11y.backToBlog', link.getAttribute('aria-label')));
    });
  }

  function bindValidationMessages() {
    document.querySelectorAll('input, textarea').forEach(function (field) {
      if (field.dataset.i18nValidationBound === 'true') {
        return;
      }
      field.dataset.i18nValidationBound = 'true';

      field.addEventListener('invalid', function () {
        var message = '';
        if (field.validity.valueMissing) {
          if (field.id === 'name') {
            message = t('common.validation.nameRequired', '');
          } else if (field.type === 'email') {
            message = t('common.validation.emailRequired', '');
          } else if (field.name === 'field') {
            message = t('common.validation.messageRequired', '');
          } else if (field.type === 'checkbox') {
            message = t('common.validation.consentRequired', '');
          } else {
            message = t('common.validation.genericRequired', '');
          }
        } else if (field.validity.typeMismatch && field.type === 'email') {
          message = t('common.validation.emailInvalid', '');
        }
        field.setCustomValidity(message);
      });

      field.addEventListener('input', function () {
        field.setCustomValidity('');
      });
      field.addEventListener('change', function () {
        field.setCustomValidity('');
      });
    });
  }

  function updateLanguageSwitchers() {
    document.querySelectorAll('.language_switcher').forEach(function (switcher) {
      var buttons = switcher.querySelectorAll('.language_switch_link');
      buttons.forEach(function (button) {
        var language = button.textContent.trim().toLowerCase() === 'en' ? 'en' : 'sk';
        var isActive = language === currentLanguage;
        button.dataset.language = language;
        button.removeAttribute('disabled');
        button.removeAttribute('aria-disabled');
        button.tabIndex = 0;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });
    });
  }

  function applyLanguage() {
    if (currentLanguage === 'en') {
      applyEnglishTranslations();
    } else {
      restoreSnapshots();
    }

    if (window.YabiHeroHeadings && typeof window.YabiHeroHeadings.refresh === 'function') {
      window.YabiHeroHeadings.refresh();
    }

    updateDateLabels();
    updateMetadata();
    updateAccessibilityLabels();
    updateGeneratedAriaLabels();
    updateLanguageSwitchers();
    updateChipLabels();
    bindValidationMessages();
  }

  function setLanguage(language) {
    if (SUPPORTED_LANGUAGES.indexOf(language) === -1) {
      return;
    }
    currentLanguage = language;
    persistLanguage(language);
    applyLanguage();
    document.dispatchEvent(new CustomEvent('yabi:languagechange', {
      detail: {
        language: currentLanguage
      }
    }));
  }

  function bindLanguageSwitchers() {
    document.querySelectorAll('.language_switch_link').forEach(function (button) {
      if (button.dataset.i18nBound === 'true') {
        return;
      }
      button.dataset.i18nBound = 'true';
      button.dataset.language = button.textContent.trim().toLowerCase() === 'en' ? 'en' : 'sk';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        setLanguage(button.dataset.language);
      });
    });
  }

  function initialize() {
    state.pageKey = getPageKey();
    state.pageSlug = getPageSlug();
    state.mappings = buildMappings(state.pageKey, state.pageSlug);
    captureMappingSnapshots();
    captureMetaSnapshot();
    bindLanguageSwitchers();
    currentLanguage = getStoredLanguage();
    applyLanguage();
  }

  window.YabiLocalization = {
    getLanguage: function () {
      return currentLanguage;
    },
    setLanguage: setLanguage,
    refresh: applyLanguage,
    t: t
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
