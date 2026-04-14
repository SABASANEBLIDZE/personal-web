'use strict';

const STORAGE_KEY = 'saba-portfolio-language';
const THEME_STORAGE_KEY = 'saba-portfolio-theme';
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_THEME = 'dark';
const EMAIL_ADDRESS = 'saba.saneblidze.it@gmail.com';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const THEMES = { dark: '#14100f', light: '#f4ede2' };

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const state = {
  language: getStoredLanguage(),
  theme: getStoredTheme(),
  phraseIndex: 0,
  phraseTimer: null,
  countStarted: false,
  parallaxItems: [],
  rafId: null,
};

/* ═══════════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════════ */
const translations = {

  /* ─────────────────── ENGLISH ─────────────────── */
  en: {
    meta: {
      title: 'Saba Saneblidze | Cinematic Portfolio',
      description: 'Portfolio of Saba Saneblidze, an IT student and junior developer creating premium, responsive digital experiences.',
      locale: 'en_US',
    },
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      experience: 'Experience',
      contact: 'Contact',
      downloadCv: 'Download CV',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    theme: { dark: 'Dark', light: 'Light' },
    hero: {
      eyebrow: 'IT Student • Junior Developer • IT Support',
      titleMain: 'Saba Saneblidze',
      titlePrefix: 'Crafting',
      description: 'I design and build responsive websites with a premium feel, blending clean front-end execution with practical problem solving and modern digital presentation.',
      ctaProjects: 'View Projects',
      ctaContact: 'Contact Me',
      stats: {
        projects: 'Projects Delivered',
        study: 'BTU Year',
        work: 'Years Experience',
      },
      captionLabel: 'Based in',
      cardLabel: 'Current Focus',
      cardValue: 'Junior web roles, IT support, and premium front-end work.',
      codeRole: '"Junior Developer"',
      codeUniversity: '"BTU"',
      codeStatus: '"Available"',
      chipSupport: 'IT Support',
      scrollCue: 'Scroll to explore',
      rotating: [
        'cinematic web experiences.',
        'responsive front-end work.',
        'polished digital presentation.',
        'calm, premium interfaces.',
      ],
    },
    about: {
      kicker: 'About',
      title: 'A grounded builder with a visual eye.',
      intro: 'I combine technical curiosity, practical work ethic, and a growing front-end craft to build websites that feel thoughtful, responsive, and reliable.',
      summaryTitle: 'Profile Snapshot',
      summaryText: 'Business and Technology University student with hands-on project work, customer-facing experience, and a strong focus on front-end quality.',
      lead: 'I am an IT student at Business and Technology University, currently developing my skills in web development, digital problem solving, and polished user-focused interfaces.',
      body1: 'My foundation includes HTML, CSS, JavaScript, SQL, networking, and core computer systems knowledge. I enjoy turning ideas into practical digital experiences that feel clean, smooth, and easy to use.',
      body2: 'Alongside my studies, I keep building real projects, improving my workflow, and learning how to create websites that are not only functional, but also visually intentional and professional.',
      meta: {
        location: 'Location',
        education: 'Education',
        availability: 'Availability',
        focus: 'Focus',
      },
      locationValue: 'Tbilisi, Georgia',
      educationValue: 'Business and Technology University',
      availabilityValue: 'Open to opportunities',
      focusValue: 'Premium responsive websites',
      photoAlt: 'Saba Saneblidze portrait',
    },
    skills: {
      kicker: 'Capabilities',
      title: 'A practical stack with a premium presentation mindset.',
      intro: 'I focus on clear front-end execution, thoughtful layout work, and dependable collaboration rooted in real-world discipline.',
      service1: { title: 'Responsive Front-End', body: 'Building visually polished pages that work across desktop, tablet, and mobile.' },
      service2: { title: 'Structured Problem Solving', body: 'Approaching technical tasks carefully, keeping the experience clean, stable, and usable.' },
      service3: { title: 'Support + Communication', body: 'Bringing customer-facing experience, teamwork, and practical support habits into digital work.' },
      stackTitle: 'Core Stack',
      stackIntro: 'Tools and fundamentals I use most often.',
      networking: 'Networking',
      strengthsTitle: 'Working Style',
      strengthsIntro: 'Traits that shape how I approach projects.',
      tags: {
        detail: 'Attention to detail',
        responsive: 'Responsive design',
        teamwork: 'Teamwork',
        communication: 'Communication',
        reliability: 'Reliability',
        learning: 'Continuous learning',
      },
      languagesTitle: 'Languages',
      languages: { georgian: 'Georgian', english: 'English', russian: 'Russian' },
      languageNative: 'Native',
      languageAdvanced: 'Working proficiency',
      languageBasic: 'Basic',
    },
    services: {
      kicker: 'Services',
      title: 'What I can build for you.',
      intro: 'From personal portfolios to full business websites — each project receives the same attention to layout, responsiveness, and polished presentation.',
      item1: { title: 'Portfolio Websites', body: 'Clean, premium personal or creative portfolios built to impress employers and clients at first scroll.' },
      item2: { title: 'Business & Restaurant Websites', body: 'Hospitality and small-business sites with structured content, visual warmth, and clear calls-to-action.' },
      item3: { title: 'Responsive Front-End Development', body: 'Pixel-precise layouts that adapt beautifully from desktop to tablet to mobile without compromise.' },
      item4: { title: 'Redesign & Modernization', body: 'Taking existing sites and elevating them — improving hierarchy, visual language, and overall feel.' },
      item5: { title: 'Bug Fixing & Improvements', body: 'Diagnosing layout issues, broken responsiveness, or front-end inconsistencies and delivering clean solutions.' },
      item6: { title: 'Landing Pages', body: 'High-impact single-page experiences focused on conversion, clarity, and a strong first impression.' },
    },
    projects: {
      kicker: 'Selected Work',
      title: 'Projects presented like a curated portfolio, not a simple list.',
      intro: 'A mix of redesigns, personal builds, and presentation-focused web work with attention to layout, responsiveness, and polish.',
      featured: {
        label: 'Featured Project',
        title: 'Austrian Brewery Restaurant Website',
        body: 'A hospitality-focused landing experience with a stronger premium mood, structured content, and responsive layout presentation.',
        alt: 'Austrian Brewery website preview',
      },
      clientWork: 'Client Work',
      redesign: 'Redesign',
      concept: 'Concept Build',
      personalBuild: 'Personal Build',
      template: 'Template',
      viewLive: 'View Live',
      viewMore: 'View More',
      previewSoon: 'Preview Soon',
      project1: { title: 'Personal Website - Salome G.', body: 'A clean personal website designed to feel approachable, elegant, and easy to navigate.', alt: 'Salome personal website preview' },
      project2: { title: 'FC Batumi Website Redesign', body: 'A modernized football club concept with improved visual hierarchy and a stronger responsive structure.', alt: 'FC Batumi redesign preview' },
      project3: { title: 'Animall Landing Page', body: 'A playful landing concept focused on branding clarity, engagement, and simple responsive structure.' },
      project4: { title: 'Delivery Website', body: 'Fully responsive delivery website with login/sign-up, support chat, checkout, delivery tracking, and product filtering. Built for a smooth, clean, and user-friendly experience on all devices.', alt: 'Delivery Website' },
      project5: { title: 'Website Template System', body: 'A reusable starter structure prepared for rapid setup, clean sections, and project-ready customization.', alt: 'Website template preview' },
    },
    process: {
      kicker: 'How I Work',
      title: 'From idea to a live, polished result.',
      intro: "Every project follows a clear, deliberate flow — no guesswork, no surprises. Just structured progress toward something you'll be proud of.",
      step1: { title: 'Discovery', body: 'Understanding your goals, audience, and what success looks like before a single line is written.' },
      step2: { title: 'Planning', body: 'Mapping out the structure, content sections, and visual direction so the project has a clear roadmap.' },
      step3: { title: 'Design Refinement', body: 'Refining the layout, typography, spacing, and visual hierarchy until the feel is exactly right.' },
      step4: { title: 'Development', body: 'Building the site with clean, semantic HTML/CSS and smooth JavaScript — pixel-precise and stable.' },
      step5: { title: 'Testing', body: 'Cross-browser and cross-device testing to make sure every screen delivers the same quality experience.' },
      step6: { title: 'Launch', body: 'Deploying confidently, with a final review pass and continued availability for post-launch adjustments.' },
    },
    experience: {
      kicker: 'Experience',
      title: 'Work ethic built through real responsibility.',
      intro: 'My background combines hands-on work, customer communication, and growing technical practice, which helps me stay practical and dependable in digital projects.',
      item1: { date: '2024 - Present', title: 'Courier', company: 'Wolt', body: 'Working in a fast-paced environment that demands discipline, time awareness, and consistent communication.' },
      item2: { date: '2023 - 2024', title: 'Sales Consultant', company: 'Retail', body: 'Supported customers directly, improved communication habits, and learned how presentation affects trust.' },
      item3: { date: '2023 - Present', title: 'IT Student', company: 'Business and Technology University', body: 'Building knowledge in programming, web development, databases, systems, and networking while creating projects.' },
    },
    whyMe: {
      kicker: 'Why Choose Me',
      title: 'Motivated, visual, and dependably thorough.',
      intro: 'Beyond the technical skills — here is what you actually get when we work together.',
      item1: { title: 'Responsive by Default', body: "Every site I build works beautifully on every device. Responsive design is not an afterthought — it's built in from the first line of code." },
      item2: { title: 'Strong Visual Polish', body: 'I care about the details: typography, spacing, colour, hover states. The result is work that looks considered and professional, not generic.' },
      item3: { title: 'Practical Problem Solving', body: "I approach challenges methodically. When something breaks or doesn't fit the vision, I find a clean solution rather than a workaround." },
      item4: { title: 'Motivated & Growing Fast', body: 'As a junior developer who is actively building real projects and studying full-time, my skills are sharp, current, and improving every week.' },
    },
    testimonials: {
      kicker: 'Testimonials',
      title: "Words from people I've worked with.",
      intro: 'Honest feedback from clients and collaborators. More will follow as projects grow.',
      item1: {
        quote: 'Saba built my personal website exactly how I envisioned it. He was patient, precise, and genuinely cared about making it look polished. I would recommend his work to anyone looking for a clean, professional online presence.',
        name: 'Salome G.',
        role: 'Client — Personal Website',
      },
      item2: {
        quote: 'Saba has a sharp eye for design and a strong work ethic. When we collaborated on a university project, his attention to visual detail and clean code made a real difference in the final quality of the result.',
        name: 'Nino Ch.',
        role: 'BTU Classmate — University Project',
      },
      placeholder: "Your testimonial could be here. I'm actively building and delivering quality work — reach out if you'd like to collaborate and share your experience.",
      placeholderCta: 'Work with me',
    },
    cta: {
      kicker: 'Ready to collaborate?',
      title: "Let's build something you'll be proud of.",
      body: "Whether it's a portfolio, a business site, or a front-end project — I'm available, motivated, and ready to deliver quality work.",
      ctaBtn: 'Start a Conversation',
      cvBtn: 'Download CV',
    },
    contact: {
      kicker: 'Contact',
      title: "Let's build something polished and useful.",
      intro: "If you need a junior developer, an IT-minded collaborator, or someone who cares about clean presentation, I'd love to hear about it.",
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      github: 'GitHub',
      copyEmail: 'Copy Email',
      copied: 'Email copied.',
      note: 'Open to junior web, support, and creative digital roles.',
      form: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' },
      placeholders: { name: 'Your name', email: 'your@email.com', subject: 'Project or role', message: 'Tell me about your project, role, or idea.' },
      send: 'Send Message',
      formSuccess: 'Opening your email app...',
      formError: 'Please complete all required fields.',
    },
    footer: {
      copy: 'Cinematic front-end portfolio built for clarity, polish, and steady growth.',
      projects: 'Projects',
      services: 'Services',
      contact: 'Contact',
      downloadCv: 'Download CV',
    },
    cmdPalette: {
      placeholder: 'Search sections...',
      hint: 'Quick Nav',
      navigate: 'navigate',
      select: 'go',
      close: 'close',
      sections: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        services: 'Services',
        projects: 'Projects',
        process: 'How I Work',
        experience: 'Experience',
        whyMe: 'Why Hire Me',
        testimonials: 'Testimonials',
        contact: 'Contact',
      },
    },
  },

  /* ─────────────────── GEORGIAN ─────────────────── */
  ka: {
    meta: {
      title: 'საბა სანებლიძე | კინემატოგრაფიული პორტფოლიო',
      description: 'საბა სანებლიძის პორტფოლიო - IT სტუდენტი და ჯუნიორ დეველოპერი, რომელიც ქმნის პრემიუმ და ადაპტირებად ციფრულ გამოცდილებებს.',
      locale: 'ka_GE',
    },
    nav: {
      home: 'მთავარი',
      about: 'ჩემს შესახებ',
      skills: 'უნარები',
      projects: 'პროექტები',
      experience: 'გამოცდილება',
      contact: 'კონტაქტი',
      downloadCv: 'CV-ის ჩამოტვირთვა',
      menuOpen: 'მენიუს გახსნა',
      menuClose: 'მენიუს დახურვა',
    },
    theme: { dark: 'მუქი', light: 'ღია' },
    hero: {
      eyebrow: 'IT სტუდენტი • ჯუნიორ დეველოპერი • IT მხარდაჭერა',
      titleMain: 'საბა სანებლიძე',
      titlePrefix: 'ვქმნი',
      description: 'ვქმნი ადაპტირებად ვებსაიტებს პრემიუმ შეგრძნებით, სადაც სუფთა front-end შესრულება ერთიანდება პრაქტიკულ აზროვნებასა და თანამედროვე ციფრულ პრეზენტაციასთან.',
      ctaProjects: 'პროექტების ნახვა',
      ctaContact: 'დამიკავშირდი',
      stats: {
        projects: 'დასრულებული პროექტი',
        study: 'BTU კურსი',
        work: 'გამოცდილების წელი',
      },
      captionLabel: 'ლოკაცია',
      cardLabel: 'მიმდინარე ფოკუსი',
      cardValue: 'ჯუნიორ ვებ პოზიციები, IT მხარდაჭერა და პრემიუმ front-end ნამუშევრები.',
      codeRole: '"ჯუნიორ დეველოპერი"',
      codeUniversity: '"BTU"',
      codeStatus: '"ხელმისაწვდომი"',
      chipSupport: 'IT მხარდაჭერა',
      scrollCue: 'სქროლე ქვემოთ',
      rotating: [
        'კინემატოგრაფიულ ვებ გამოცდილებებს.',
        'ადაპტირებად front-end ნამუშევრებს.',
        'დახვეწილ ციფრულ პრეზენტაციას.',
        'წყნარ და პრემიუმ ინტერფეისებს.',
      ],
    },
    about: {
      kicker: 'ჩემს შესახებ',
      title: 'მიწიერად მოაზროვნე შემქმნელი ძლიერი ვიზუალური ხედვით.',
      intro: 'ვაერთიანებ ტექნიკურ ინტერესს, პრაქტიკულ შრომის ეთიკას და მზარდ front-end ოსტატობას, რათა შევქმნა საიტები, რომლებიც არის გააზრებული, ადაპტირებადი და სანდო.',
      summaryTitle: 'მოკლე პროფილი',
      summaryText: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტის სტუდენტი რეალური პროექტებით, მომხმარებელთან ურთიერთობის გამოცდილებით და ძლიერი ყურადღებით front-end ხარისხზე.',
      lead: 'ვარ ბიზნესისა და ტექნოლოგიების უნივერსიტეტის IT სტუდენტი და აქტიურად ვავითარებ უნარებს ვებ დეველოპმენტში, ციფრულ პრობლემების გადაჭრაში და დახვეწილ, მომხმარებელზე ორიენტირებულ ინტერფეისებში.',
      body1: 'ჩემი საფუძველი მოიცავს HTML, CSS, JavaScript, SQL, ქსელებსა და კომპიუტერული სისტემების საბაზისო ცოდნას. მიყვარს იდეების გარდაქმნა პრაქტიკულ ციფრულ გამოცდილებად, რომელიც სუფთა, რბილი და მარტივად გამოსაყენებელია.',
      body2: 'სწავლის პარალელურად მუდმივად ვქმნი რეალურ პროექტებს, ვაუმჯობესებ სამუშაო პროცესს და ვსწავლობ, როგორ შევქმნა ვებსაიტები, რომლებიც არა მხოლოდ ფუნქციურია, არამედ ვიზუალურად გააზრებული და პროფესიონალურიც.',
      meta: {
        location: 'ლოკაცია',
        education: 'განათლება',
        availability: 'ხელმისაწვდომობა',
        focus: 'ფოკუსი',
      },
      locationValue: 'თბილისი, საქართველო',
      educationValue: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი',
      availabilityValue: 'ღია ვარ შესაძლებლობებისთვის',
      focusValue: 'პრემიუმ ადაპტირებადი ვებსაიტები',
      photoAlt: 'საბა სანებლიძის პორტრეტი',
    },
    skills: {
      kicker: 'შესაძლებლობები',
      title: 'პრაქტიკული ტექნიკური ბაზა პრემიუმ პრეზენტაციის ხედვით.',
      intro: 'ვფოკუსირდები სუფთა front-end შესრულებაზე, გააზრებულ layout-ებზე და სანდო თანამშრომლობაზე, რომელიც რეალური გამოცდილებით არის გამყარებული.',
      service1: { title: 'ადაპტირებადი Front-End', body: 'ვქმნი ვიზუალურად დახვეწილ გვერდებს, რომლებიც გამართულად მუშაობს დესკტოპზე, ტაბლეტზე და მობილურზე.' },
      service2: { title: 'სტრუქტურირებული პრობლემის გადაჭრა', body: 'ტექნიკურ ამოცანებს ფრთხილად ვუდგები, რათა გამოცდილება იყოს სუფთა, სტაბილური და მოსახერხებელი.' },
      service3: { title: 'მხარდაჭერა და კომუნიკაცია', body: 'მომხმარებელთან მუშაობის გამოცდილება, გუნდურობა და პრაქტიკული მხარდაჭერის ჩვევები ჩემს ციფრულ მუშაობაშიც გადმომაქვს.' },
      stackTitle: 'ძირითადი სტეკი',
      stackIntro: 'ინსტრუმენტები და საფუძვლები, რომლებსაც ყველაზე ხშირად ვიყენებ.',
      networking: 'ქსელები',
      strengthsTitle: 'სამუშაო სტილი',
      strengthsIntro: 'ხარისხები, რომლებიც ჩემს მუშაობის მიდგომას ქმნის.',
      tags: {
        detail: 'დეტალებზე ყურადღება',
        responsive: 'ადაპტირებადი დიზაინი',
        teamwork: 'გუნდურობა',
        communication: 'კომუნიკაცია',
        reliability: 'სანდოობა',
        learning: 'განვითარებაზე ფოკუსი',
      },
      languagesTitle: 'ენები',
      languages: { georgian: 'ქართული', english: 'ინგლისური', russian: 'რუსული' },
      languageNative: 'მშობლიური',
      languageAdvanced: 'სამუშაო დონე',
      languageBasic: 'საწყისი',
    },
    services: {
      kicker: 'სერვისები',
      title: 'რა შემიძლია შენთვის ავაშენო.',
      intro: 'პირადი პორტფოლიოდან ბიზნეს საიტებამდე — ყოველ პროექტს ვუდგები ერთნაირი ყურადღებით layout-ის, ადაპტირებადობისა და polish-ის მხრივ.',
      item1: { title: 'პორტფოლიო ვებსაიტები', body: 'სუფთა, პრემიუმ პირადი ან შემოქმედებითი პორტფოლიოები, რომლებიც დამსაქმებლებს პირველი სქროლიდანვე მოხიბლავს.' },
      item2: { title: 'ბიზნეს და რესტორნის ვებსაიტები', body: 'ჰოსპიტალიტისა და მცირე ბიზნეს საიტები გამართული კონტენტით, ვიზუალური სითბოთი და მკაფიო call-to-action ელემენტებით.' },
      item3: { title: 'ადაპტირებადი Front-End დეველოპმენტი', body: 'პიქსელ-ზუსტი layout-ები, რომლებიც გამართულად ადაპტირდება დესკტოპიდან ტაბლეტამდე და მობილურამდე.' },
      item4: { title: 'რედიზაინი და მოდერნიზაცია', body: 'არსებული საიტების განახლება — იერარქიის, ვიზუალური ენის და ზოგადი განწყობის გაუმჯობესება.' },
      item5: { title: 'ბაგების გამოსწორება', body: 'layout-ის პრობლემების, გატეხილი ადაპტირებადობის ან front-end შეუსაბამობების დიაგნოსტიკა და სუფთა გადაწყვეტა.' },
      item6: { title: 'Landing Page-ები', body: 'მაღალი ეფექტის ერთგვერდიანი გამოცდილებები, ფოკუსირებული კონვერსიაზე, სიცხადეზე და ძლიერ პირველ შთაბეჭდილებაზე.' },
    },
    projects: {
      kicker: 'რჩეული ნამუშევრები',
      title: 'პროექტები წარმოდგენილია როგორც კურირებული პორტფოლიო და არა უბრალოდ სია.',
      intro: 'რედიზაინების, პირადი ნამუშევრების და პრეზენტაციაზე ორიენტირებული ვებ პროექტების შერწყმა.',
      featured: {
        label: 'მთავარი პროექტი',
        title: 'Austrian Brewery რესტორნის ვებსაიტი',
        body: 'ჰოსპიტალითიზე ორიენტირებული landing გამოცდილება უფრო პრემიუმ განწყობით, გამართული სტრუქტურით და ადაპტირებადი განლაგებით.',
        alt: 'Austrian Brewery საიტის პრევიუ',
      },
      clientWork: 'კლიენტის პროექტი',
      redesign: 'რედიზაინი',
      concept: 'კონცეფცია',
      personalBuild: 'პირადი ნამუშევარი',
      template: 'შაბლონი',
      viewLive: 'ნახე ლაივ',
      viewMore: 'მეტის ნახვა',
      previewSoon: 'პრევიუ მალე',
      project1: { title: 'პერსონალური ვებსაიტი - სალომე გ.', body: 'სუფთა პერსონალური ვებსაიტი, რომელიც იგრძნობა მეგობრულად, ელეგანტურად და მარტივად სანავიგაციოდ.', alt: 'სალომეს საიტის პრევიუ' },
      project2: { title: 'FC Batumi-ის ვებსაიტის რედიზაინი', body: 'ფეხბურთის კლუბის მოდერნიზებული კონცეფცია გაუმჯობესებული იერარქიითა და ადაპტირებადი სტრუქტურით.', alt: 'FC Batumi-ის რედიზაინის პრევიუ' },
      project3: { title: 'animall ზოომაღაზია', body: 'ბრენდინგის სიცხადეზე და ადაპტირებად სტრუქტურაზე დაფუძნებული playful landing კონცეფცია.' },
      project4: { title: 'დელივერის საიტი', body: 'სრულად ადაპტირებადი მიტანის ვებსაიტი შესვლის/რეგისტრაციის, მხარდაჭერის ჩატის, შეკვეთის დადასტურების, მიტანის დროის თვალთვალის და პროდუქტის ფილტრაციის ფუნქციებით. შექმნილია გლუვი, სუფთა და ყველა მოწყობილობისთვის მოსახერხებელი გამოცდილებისთვის.', alt: 'მიტანის ვებსაიტის პრევიუ' },
      project5: { title: 'ვებსაიტის შაბლონის სისტემა', body: 'მრავალჯერადი გამოყენების starter სტრუქტურა სწრაფი setup-ისთვის, სუფთა სექციებითა და კონფიგურირებადი საფუძვლით.', alt: 'ვებსაიტის შაბლონის პრევიუ' },
    },
    process: {
      kicker: 'სამუშაო პროცესი',
      title: 'იდეიდან მზა, დახვეწილ შედეგამდე.',
      intro: 'ყოველი პროექტი მიჰყვება მკაფიო, გააზრებულ ნაკადს — შემთხვევითობა გამორიცხულია. მხოლოდ სტრუქტურირებული წინსვლა საიმედო შედეგისკენ.',
      step1: { title: 'შესწავლა', body: 'მიზნების, აუდიტორიის და წარმატების კრიტერიუმების გაგება კოდის პირველ ხაზამდე.' },
      step2: { title: 'დაგეგმვა', body: 'სტრუქტურის, კონტენტ სექციების და ვიზუალური მიმართულების გარკვევა — პროექტს ეძლევა მკაფიო roadmap.' },
      step3: { title: 'დიზაინის დახვეწა', body: 'layout-ის, ტიპოგრაფიის, spacing-ის და ვიზუალური იერარქიის დახვეწა სწორი შეგრძნების მისღებამდე.' },
      step4: { title: 'დეველოპმენტი', body: 'საიტის აშენება სუფთა, სემანტიკური HTML/CSS-ით და გლუვი JavaScript-ით — პიქსელ-ზუსტი და სტაბილური.' },
      step5: { title: 'ტესტირება', body: 'Cross-browser და cross-device ტესტირება, რათა ყველა ეკრანი ერთნაირ ხარისხს გადმოსცემდეს.' },
      step6: { title: 'გაშვება', body: 'კონფიდენციურად deployment, საბოლოო შემოწმებით და ხელმისაწვდომობით post-launch კორექტირებებისთვის.' },
    },
    experience: {
      kicker: 'გამოცდილება',
      title: 'შრომის ეთიკა რეალური პასუხისმგებლობიდან მოდის.',
      intro: 'ჩემი გამოცდილება აერთიანებს პრაქტიკულ სამუშაოს, მომხმარებელთან კომუნიკაციას და მზარდ ტექნიკურ პრაქტიკას, რაც მეხმარება ციფრულ პროექტებში ვიყო მიწიერი და სანდო.',
      item1: { date: '2024 - დღემდე', title: 'კურიერი', company: 'Wolt', body: 'მუშაობა სწრაფ გარემოში, რომელიც მოითხოვს დისციპლინას, დროის სწორ მართვას და მუდმივ კომუნიკაციას.' },
      item2: { date: '2023 - 2024', title: 'გაყიდვების კონსულტანტი', company: 'Retail', body: 'პირდაპირი მუშაობა მომხმარებლებთან, კომუნიკაციის გაუმჯობესება და იმის სწავლა, თუ როგორ ქმნის პრეზენტაცია ნდობას.' },
      item3: { date: '2023 - დღემდე', title: 'IT სტუდენტი', company: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი', body: 'ვიღრმავებ ცოდნას პროგრამირებაში, ვებ დეველოპმენტში, ბაზებში, სისტემებსა და ქსელებში.' },
    },
    whyMe: {
      kicker: 'რატომ ვარ შენი არჩევანი?',
      title: 'მოტივირებული, ვიზუალური და პასუხისმგებლიანი.',
      intro: 'ტექნიკური უნარების მიღმა — ეს არის ის, რასაც ჩვენი თანამშრომლობისგან ნამდვილად მიიღებ.',
      item1: { title: 'ადაპტირებადობა სტანდარტულია', body: 'ჩემი ყოველი საიტი ლამაზად მუშაობს ყოველ მოწყობილობაზე. Responsive დიზაინი არ არის დამატება — ის კოდის პირველი ხაზიდანვე არის ჩადებული.' },
      item2: { title: 'ძლიერი ვიზუალური polish', body: 'ყურადღება მაქვს დეტალებზე: ტიპოგრაფია, spacing, ფერი, hover states. შედეგი — სამუშაო, რომელიც გააზრებულ და პროფესიონალურ შთაბეჭდილებას ტოვებს.' },
      item3: { title: 'პრაქტიკული პრობლემის გადაჭრა', body: 'გამოწვევებს მეთოდურად ვუდგები. როდესაც რაიმე ტყდება ან ხედვას არ შეესაბამება, ვპოულობ სუფთა გადაწყვეტას და არა workaround-ს.' },
      item4: { title: 'მოტივირებული და სწრაფად მზარდი', body: 'როგორც ჯუნიორ დეველოპერი, რომელიც აქტიურად ქმნის რეალურ პროექტებს და სრული განაკვეთით სწავლობს, ჩემი უნარები კვირიდან კვირამდე იზრდება.' },
    },
    testimonials: {
      kicker: 'გამოხმაურებები',
      title: 'სიტყვები ადამიანებისგან, ვისთანაც ვიმუშავე.',
      intro: 'გულწრფელი გამოხმაურება კლიენტებისა და კოლეგებისგან. პროექტების ზრდასთან ერთად, მეტი იქნება.',
      item1: {
        quote: 'საბამ ჩემი პერსონალური ვებსაიტი ზუსტად ისე ააშენა, როგორც წარმომედგინა. ის იყო მოთმინებული, ზუსტი და ნამდვილად ზრუნავდა, რომ ყველაფერი polished გამოვიდეს. ნებისმიერ ადამიანს, ვისაც სუფთა, პროფესიონალური ვებსაიტი სჭირდება, მის ნამუშევარს ვურჩევ.',
        name: 'სალომე გ.',
        role: 'კლიენტი — პერსონალური ვებსაიტი',
      },
      item2: {
        quote: 'საბას დიზაინზე მახვილი თვალი და ძლიერი შრომის ეთიკა აქვს. სტუდენტური პროექტის დროს, ვიზუალური დეტალებისადმი მისი ყურადღება და სუფთა კოდი საბოლოო შედეგის ხარისხს ნამდვილად განაპირობებდა.',
        name: 'ნინო ჩ.',
        role: 'BTU კოლეგა — სტუდენტური პროექტი',
      },
      placeholder: 'შენი გამოხმაურება შეიძლება აქ იყოს. აქტიურად ვქმნი და ვაწვდი ხარისხიან ნამუშევარს — დამიკავშირდი, თუ გინდა ვითანამშრომლოთ.',
      placeholderCta: 'ვითანამშრომლოთ',
    },
    cta: {
      kicker: 'მზად ხარ თანამშრომლობისთვის?',
      title: 'მოდი ავაშენოთ რაიმე, რასაც ამაყობ.',
      body: 'იქნება ეს პორტფოლიო, ბიზნეს საიტი თუ front-end პროექტი — ვარ ხელმისაწვდომი, მოტივირებული და მზადა ხარისხიანი ნამუშევრის შესაქმნელად.',
      ctaBtn: 'საუბრის დაწყება',
      cvBtn: 'CV-ის ჩამოტვირთვა',
    },
    contact: {
      kicker: 'კონტაქტი',
      title: 'მოდი ერთად შევქმნათ რაიმე დახვეწილი და გამოსადეგი.',
      intro: 'თუ გჭირდება ჯუნიორ დეველოპერი, IT ხედვის მქონე კოლაბორატორი ან ადამიანი, რომელსაც სუფთა პრეზენტაცია მართლა აინტერესებს, სიამოვნებით მოგისმენ.',
      email: 'ელფოსტა',
      phone: 'ტელეფონი',
      location: 'ლოკაცია',
      github: 'GitHub',
      copyEmail: 'მეილის კოპირება',
      copied: 'მეილი დაკოპირდა.',
      note: 'ღია ვარ junior web, support და creative digital პოზიციებისთვის.',
      form: { name: 'სახელი', email: 'ელფოსტა', subject: 'თემა', message: 'მესიჯი' },
      placeholders: { name: 'შენი სახელი', email: 'your@email.com', subject: 'პროექტი ან პოზიცია', message: 'მომიყევი პროექტის, როლის ან იდეის შესახებ.' },
      send: 'მესიჯის გაგზავნა',
      formSuccess: 'იხსნება ელფოსტის აპლიკაცია...',
      formError: 'გთხოვ, შეავსე ყველა აუცილებელი ველი.',
    },
    footer: {
      copy: 'კინემატოგრაფიული front-end პორტფოლიო სიცხადისთვის, polish-ისთვის და სტაბილური ზრდისთვის.',
      projects: 'პროექტები',
      services: 'სერვისები',
      contact: 'კონტაქტი',
      downloadCv: 'CV-ის ჩამოტვირთვა',
    },
    cmdPalette: {
      placeholder: 'სექციების ძებნა...',
      hint: 'სწრაფი ნავიგაცია',
      navigate: 'ნავიგაცია',
      select: 'გადასვლა',
      close: 'დახურვა',
      sections: {
        home: 'მთავარი',
        about: 'ჩემს შესახებ',
        skills: 'უნარები',
        services: 'სერვისები',
        projects: 'პროექტები',
        process: 'პროცესი',
        experience: 'გამოცდილება',
        whyMe: 'რატომ მე?',
        testimonials: 'გამოხმაურებები',
        contact: 'კონტაქტი',
      },
    },
  },
};

/* ═══════════════════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════════════════ */
function getStoredLanguage() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s && translations[s] ? s : DEFAULT_LANGUAGE; } catch { return DEFAULT_LANGUAGE; }
}
function getStoredTheme() {
  try { const s = localStorage.getItem(THEME_STORAGE_KEY); return s && THEMES[s] ? s : DEFAULT_THEME; } catch { return DEFAULT_THEME; }
}
function storeLanguage(lang) { try { localStorage.setItem(STORAGE_KEY, lang); } catch { } }
function storeTheme(theme) { try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { } }

function getByPath(obj, path) {
  return path.split('.').reduce((cur, k) => (cur != null ? cur[k] : undefined), obj);
}
function getLanguagePack() {
  return translations[state.language] || translations[DEFAULT_LANGUAGE];
}

/* ═══════════════════════════════════════════════════════
   APPLY TRANSLATIONS
═══════════════════════════════════════════════════════ */
function applyTranslations() {
  const pack = getLanguagePack();
  document.documentElement.lang = state.language === 'ka' ? 'ka' : 'en';
  document.title = pack.meta.title;

  const el = (id) => document.getElementById(id);
  if (el('pageTitle')) el('pageTitle').textContent = pack.meta.title;
  if (el('metaDescription')) el('metaDescription').setAttribute('content', pack.meta.description);
  if (el('ogTitle')) el('ogTitle').setAttribute('content', pack.meta.title);
  if (el('ogDescription')) el('ogDescription').setAttribute('content', pack.meta.description);
  if (el('ogLocale')) el('ogLocale').setAttribute('content', pack.meta.locale);

  $$('[data-i18n]').forEach(node => {
    const v = getByPath(pack, node.dataset.i18n);
    if (typeof v === 'string') node.textContent = v;
  });
  $$('[data-i18n-placeholder]').forEach(node => {
    const v = getByPath(pack, node.dataset.i18nPlaceholder);
    if (typeof v === 'string') node.setAttribute('placeholder', v);
  });
  $$('[data-i18n-aria]').forEach(node => {
    const v = getByPath(pack, node.dataset.i18nAria);
    if (typeof v === 'string') node.setAttribute('aria-label', v);
  });
  $$('[data-i18n-alt]').forEach(node => {
    const v = getByPath(pack, node.dataset.i18nAlt);
    if (typeof v === 'string') node.setAttribute('alt', v);
  });

  $$('[data-lang-switch]').forEach(btn => {
    const active = btn.dataset.langSwitch === state.language;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  $$('[data-theme-switch]').forEach(btn => {
    const active = btn.dataset.themeSwitch === state.theme;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  syncMenuLabel();
  updateRotatingText(true);
  updateCmdPaletteLabels();
}

/* ═══════════════════════════════════════════════════════
   THEME
═══════════════════════════════════════════════════════ */
function applyTheme() {
  const root = document.documentElement;
  const meta = document.getElementById('themeColorMeta');
  root.dataset.theme = state.theme;
  root.style.colorScheme = state.theme;
  if (meta) meta.setAttribute('content', THEMES[state.theme] || THEMES[DEFAULT_THEME]);
  $$('[data-theme-switch]').forEach(btn => {
    const active = btn.dataset.themeSwitch === state.theme;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

/* ═══════════════════════════════════════════════════════
   SETTERS
═══════════════════════════════════════════════════════ */
function setLanguage(lang) {
  if (!translations[lang]) return;
  state.language = lang;
  storeLanguage(lang);
  applyTranslations();
}

function setTheme(theme) {
  if (!THEMES[theme]) return;
  state.theme = theme;
  storeTheme(theme);
  applyTheme();
}

/* ═══════════════════════════════════════════════════════
   MENU
═══════════════════════════════════════════════════════ */
function syncMenuLabel() {
  const toggle = document.getElementById('menuToggle');
  if (!toggle) return;
  const isOpen = document.body.classList.contains('menu-open');
  const v = getByPath(getLanguagePack(), isOpen ? 'nav.menuClose' : 'nav.menuOpen');
  if (v) toggle.setAttribute('aria-label', v);
  toggle.setAttribute('aria-expanded', String(isOpen));
}

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  syncMenuLabel();
}

/* ═══════════════════════════════════════════════════════
   SCROLL / HEADER / NAV ACTIVE
═══════════════════════════════════════════════════════ */
function getHeaderOffset() {
  const h = document.getElementById('siteHeader');
  return (h ? h.offsetHeight : 0) + 14;
}

function scrollToHash(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({ top, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
}

function updateHeaderAndProgress() {
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const y = window.scrollY;
  if (header) header.classList.toggle('is-scrolled', y > 18);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${clamp(max > 0 ? (y / max) * 100 : 0, 0, 100)}%`;
  }
}

function updateActiveNav() {
  const links = $$('.nav-link');
  const sections = $$('main section[id]');
  const position = window.scrollY + getHeaderOffset() + 80;
  let currentId = sections[0] ? sections[0].id : '';

  sections.forEach(sec => { if (position >= sec.offsetTop) currentId = sec.id; });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

/* ═══════════════════════════════════════════════════════
   CMD HINT VISIBILITY (shows after 2 s of being on page)
═══════════════════════════════════════════════════════ */
function showCmdHint() {
  const hint = document.getElementById('cmdHint');
  if (!hint) return;
  setTimeout(() => hint.classList.add('is-visible'), 2000);
}

/* ═══════════════════════════════════════════════════════
   COMMAND PALETTE
═══════════════════════════════════════════════════════ */
const CMD_SECTIONS = [
  { id: 'home', icon: 'fa-house' },
  { id: 'about', icon: 'fa-user' },
  { id: 'skills', icon: 'fa-layer-group' },
  { id: 'services', icon: 'fa-briefcase' },
  { id: 'projects', icon: 'fa-folder-open' },
  { id: 'process', icon: 'fa-list-check' },
  { id: 'experience', icon: 'fa-timeline' },
  { id: 'why-me', icon: 'fa-star' },
  { id: 'testimonials', icon: 'fa-quote-left' },
  { id: 'contact', icon: 'fa-envelope' },
];

// Map section id → translation key (why-me → whyMe)
const CMD_SECTION_KEY = {
  'home': 'home', 'about': 'about', 'skills': 'skills', 'services': 'services',
  'projects': 'projects', 'process': 'process', 'experience': 'experience',
  'why-me': 'whyMe', 'testimonials': 'testimonials', 'contact': 'contact',
};

let cmdActiveIndex = -1;

function getCmdLabel(id) {
  const key = CMD_SECTION_KEY[id] || id;
  return getByPath(getLanguagePack(), `cmdPalette.sections.${key}`) || id;
}

function updateCmdPaletteLabels() {
  const input = document.getElementById('cmdInput');
  if (input) {
    const ph = getByPath(getLanguagePack(), 'cmdPalette.placeholder');
    if (ph) input.setAttribute('placeholder', ph);
  }
  renderCmdList('');
}

function renderCmdList(query) {
  const list = document.getElementById('cmdList');
  if (!list) return;

  const q = query.toLowerCase().trim();
  const filtered = CMD_SECTIONS.filter(s => {
    const label = getCmdLabel(s.id).toLowerCase();
    return !q || label.includes(q) || s.id.includes(q);
  });

  list.innerHTML = filtered.map((s, i) => `
    <li class="cmd-item${i === cmdActiveIndex ? ' is-active' : ''}"
        role="option"
        data-section-id="${s.id}"
        tabindex="-1">
      <span class="cmd-item-icon"><i class="fa-solid ${s.icon}"></i></span>
      <span class="cmd-item-label">${getCmdLabel(s.id)}</span>
    </li>
  `).join('');

  list.querySelectorAll('.cmd-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.sectionId;
      closeCmdPalette();
      setTimeout(() => scrollToHash(`#${id}`), 60);
    });
    item.addEventListener('mouseenter', () => {
      list.querySelectorAll('.cmd-item').forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      cmdActiveIndex = Array.from(list.children).indexOf(item);
    });
  });
}

function openCmdPalette() {
  const palette = document.getElementById('cmdPalette');
  const input = document.getElementById('cmdInput');
  if (!palette) return;
  cmdActiveIndex = -1;
  renderCmdList('');
  palette.classList.add('is-open');
  palette.setAttribute('aria-hidden', 'false');
  if (input) { input.value = ''; setTimeout(() => input.focus(), 80); }
}

function closeCmdPalette() {
  const palette = document.getElementById('cmdPalette');
  if (!palette) return;
  palette.classList.remove('is-open');
  palette.setAttribute('aria-hidden', 'true');
}

function initCmdPalette() {
  const palette = document.getElementById('cmdPalette');
  const backdrop = document.getElementById('cmdBackdrop');
  const input = document.getElementById('cmdInput');
  const hint = document.getElementById('cmdHint');
  if (!palette) return;

  // Hint button opens palette
  if (hint) hint.addEventListener('click', openCmdPalette);

  // Backdrop closes it
  if (backdrop) backdrop.addEventListener('click', closeCmdPalette);

  // Keyboard inside the palette
  if (input) {
    input.addEventListener('input', () => {
      cmdActiveIndex = -1;
      renderCmdList(input.value);
    });

    input.addEventListener('keydown', e => {
      const list = document.getElementById('cmdList');
      const items = list ? Array.from(list.querySelectorAll('.cmd-item')) : [];

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex + 1) % items.length;
        items.forEach((item, i) => item.classList.toggle('is-active', i === cmdActiveIndex));
        items[cmdActiveIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex - 1 + items.length) % items.length;
        items.forEach((item, i) => item.classList.toggle('is-active', i === cmdActiveIndex));
        items[cmdActiveIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const active = items[cmdActiveIndex] || items[0];
        if (active) {
          const id = active.dataset.sectionId;
          closeCmdPalette();
          setTimeout(() => scrollToHash(`#${id}`), 60);
        }
      } else if (e.key === 'Escape') {
        closeCmdPalette();
      }
    });
  }

  // Global keyboard shortcut: Cmd/Ctrl+K  or  /
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    const inField = tag === 'INPUT' || tag === 'TEXTAREA';

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('is-open') ? closeCmdPalette() : openCmdPalette();
      return;
    }
    if (e.key === 'Escape' && palette.classList.contains('is-open')) {
      closeCmdPalette();
      return;
    }
    // Press "/" when not in an input to open palette
    if (e.key === '/' && !inField && !palette.classList.contains('is-open')) {
      e.preventDefault();
      openCmdPalette();
    }
  });
}

/* ═══════════════════════════════════════════════════════
   CURSOR SPOTLIGHT
═══════════════════════════════════════════════════════ */
function initCursorSpotlight() {
  if (REDUCED_MOTION || window.matchMedia('(hover: none)').matches) return;

  const spotlight = document.createElement('div');
  spotlight.className = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  let tx = -500, ty = -500;
  let cx = -500, cy = -500;
  let raf = null;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  function tick() {
    raf = null;
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    spotlight.style.left = `${cx}px`;
    spotlight.style.top = `${cy}px`;
    if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
      raf = requestAnimationFrame(tick);
    }
  }
}

/* ═══════════════════════════════════════════════════════
   SKILL BAR ANIMATION (animate in on reveal)
═══════════════════════════════════════════════════════ */
function initSkillBars() {
  const bars = $$('.skill-track span');
  if (!bars.length) return;

  // Store target widths, reset to 0
  bars.forEach(bar => {
    bar.dataset.targetWidth = bar.style.width;
    if (!REDUCED_MOTION) bar.style.width = '0%';
  });

  if (REDUCED_MOTION) return;

  const stackPanel = $('.stack-panel');
  if (!stackPanel) return;

  const observer = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      bars.forEach((bar, i) => {
        setTimeout(() => {
          bar.style.transition = 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.width = bar.dataset.targetWidth || '0%';
        }, i * 120);
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(stackPanel);
}

/* ═══════════════════════════════════════════════════════
   ROTATING HERO TEXT
═══════════════════════════════════════════════════════ */
function updateRotatingText(reset = false) {
  const node = document.getElementById('heroRotatingText');
  const phrases = getByPath(getLanguagePack(), 'hero.rotating') || [];
  if (!node || !phrases.length) return;

  if (reset) state.phraseIndex = 0;
  node.textContent = phrases[state.phraseIndex] || phrases[0];

  if (state.phraseTimer) clearInterval(state.phraseTimer);
  if (phrases.length < 2 || REDUCED_MOTION) return;

  state.phraseTimer = setInterval(() => {
    node.classList.add('is-switching');
    setTimeout(() => {
      state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
      node.textContent = phrases[state.phraseIndex];
      node.classList.remove('is-switching');
    }, 200);
  }, 2800);
}

/* ═══════════════════════════════════════════════════════
   COUNT-UP ANIMATION
═══════════════════════════════════════════════════════ */
function initCountUp() {
  const stats = $$('.hero-stat-number');
  const hero = document.getElementById('home');
  if (!stats.length || !hero) return;

  const animate = () => {
    if (state.countStarted) return;
    state.countStarted = true;
    const duration = 1400;
    const start = performance.now();

    const frame = (now) => {
      const progress = clamp((now - start) / duration, 0, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      stats.forEach(node => {
        const target = Number(node.dataset.count || '0');
        node.textContent = String(Math.round(target * eased));
      });
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  if (REDUCED_MOTION) { animate(); return; }

  new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { animate(); }
  }, { threshold: 0.4 }).observe(hero);
}

/* ═══════════════════════════════════════════════════════
   PARALLAX
═══════════════════════════════════════════════════════ */
function updateParallax() {
  if (!state.parallaxItems.length) return;
  const vhCenter = window.innerHeight / 2;

  state.parallaxItems.forEach(item => {
    const strength = Number(item.dataset.parallax || '12');
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const distance = (center - vhCenter) / window.innerHeight;
    const movement = clamp(-distance * strength, -strength, strength);
    item.style.setProperty('--parallax', `${movement.toFixed(2)}px`);
  });
}

function initParallax() {
  if (REDUCED_MOTION || window.innerWidth < 861) {
    state.parallaxItems = [];
    $$('[data-parallax]').forEach(item => item.style.setProperty('--parallax', '0px'));
    return;
  }
  state.parallaxItems = $$('[data-parallax]');
  updateParallax();
}

/* ═══════════════════════════════════════════════════════
   RAF TICK
═══════════════════════════════════════════════════════ */
function requestTick() {
  if (state.rafId) return;
  state.rafId = requestAnimationFrame(() => {
    state.rafId = null;
    updateHeaderAndProgress();
    updateActiveNav();
    updateParallax();
  });
}

/* ═══════════════════════════════════════════════════════
   REVEAL ANIMATIONS
═══════════════════════════════════════════════════════ */
function initRevealAnimations() {
  const items = $$('[data-reveal]');
  if (!items.length || REDUCED_MOTION) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  items.forEach(item => observer.observe(item));
}

/* ═══════════════════════════════════════════════════════
   COPY EMAIL
═══════════════════════════════════════════════════════ */
function copyEmailToClipboard() {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(EMAIL_ADDRESS);
  return new Promise((resolve, reject) => {
    const area = document.createElement('textarea');
    area.value = EMAIL_ADDRESS;
    area.style.cssText = 'position:absolute;left:-9999px';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); resolve(); }
    catch (err) { reject(err); }
    finally { document.body.removeChild(area); }
  });
}

function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  const feedback = document.getElementById('copyEmailFeedback');
  if (!btn || !feedback) return;

  btn.addEventListener('click', async () => {
    try {
      await copyEmailToClipboard();
      feedback.textContent = getLanguagePack().contact.copied;
      setTimeout(() => { feedback.textContent = getLanguagePack().contact.note; }, 2000);
    } catch {
      feedback.textContent = EMAIL_ADDRESS;
    }
  });
}

/* ═══════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pack = getLanguagePack();
    if (!form.reportValidity()) { status.textContent = pack.contact.formError; return; }

    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    const body = [`Name: ${name}`, `Email: ${email}`, '', message].join('\n');
    status.textContent = pack.contact.formSuccess;
    const mailto = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setTimeout(() => { window.location.href = mailto; }, 140);
  });
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION INIT
═══════════════════════════════════════════════════════ */
function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const links = $$('a[href^="#"]');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      setMenu(!document.body.classList.contains('menu-open'));
    });
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      if (!document.querySelector(hash)) return;
      e.preventDefault();
      setMenu(false);
      scrollToHash(hash);
      if (history.pushState) history.pushState(null, '', hash);
    });
  });

  document.addEventListener('click', e => {
    const nav = document.getElementById('siteNav');
    const tog = document.getElementById('menuToggle');
    if (!nav || !tog) return;
    if (!nav.contains(e.target) && !tog.contains(e.target)) {
      setMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) setMenu(false);
    initParallax();
    requestTick();
  });
}

function initLanguageSwitcher() {
  $$('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.langSwitch));
  });
}

function initThemeSwitcher() {
  $$('[data-theme-switch]').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeSwitch));
  });
}

function initInitialHash() {
  if (!window.location.hash) return;
  setTimeout(() => scrollToHash(window.location.hash), 80);
}

/* ═══════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════ */
function init() {
  applyTheme();
  applyTranslations();
  initNavigation();
  initLanguageSwitcher();
  initThemeSwitcher();
  initRevealAnimations();
  initCountUp();
  initSkillBars();
  initParallax();
  initCopyEmail();
  initContactForm();
  initCmdPalette();
  initCursorSpotlight();
  showCmdHint();
  initInitialHash();
  requestTick();

  window.addEventListener('scroll', requestTick, { passive: true });
}

init();
