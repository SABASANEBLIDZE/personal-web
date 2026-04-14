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
      description: 'Portfolio of Saba Saneblidze, a frontend developer creating polished, responsive websites with strong visual presentation and clean implementation.',
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
      eyebrow: 'Frontend Developer • Responsive Websites • UI-Focused Builds',
      titleMain: 'Saba Saneblidze',
      titlePrefix: 'Building',
      description: 'I design and develop polished websites that combine clean front-end execution, thoughtful user experience, and strong visual presentation across every screen.',
      ctaProjects: 'View Work',
      ctaContact: 'Start a Project',
      stats: {
        projects: 'Projects Delivered',
        study: 'Years in Tech',
        work: 'Client-Facing Roles',
      },
      captionLabel: 'Based in',
      cardLabel: 'Current Focus',
      cardValue: 'Responsive websites, landing pages, redesigns, and polished front-end implementation.',
      codeRole: '"Frontend Developer"',
      codeUniversity: '"Tbilisi, Georgia"',
      codeStatus: '"Available"',
      chipSupport: 'Responsive UX',
      scrollCue: 'Scroll to explore',
      rotating: [
        'modern websites with polished detail.',
        'responsive interfaces that feel intentional.',
        'clean front-end experiences for real brands.',
        'high-quality digital presentation.',
      ],
    },
    about: {
      kicker: 'Profile',
      title: 'Front-end work shaped by clarity, polish, and execution.',
      intro: 'I build modern websites that balance strong visual presentation with clean implementation, responsive structure, and an experience that feels considered from the first scroll.',
      summaryTitle: 'Professional Summary',
      summaryText: 'Frontend developer focused on polished interfaces, responsive layouts, and digital presentation that feels credible, modern, and ready for real use.',
      lead: 'My work is centered on building websites that look refined, feel smooth to use, and communicate clearly across desktop, tablet, and mobile.',
      body1: 'I work with HTML, CSS, JavaScript, SQL, and core technical fundamentals to turn ideas into structured, responsive interfaces with strong hierarchy and visual consistency.',
      body2: 'Whether the goal is a portfolio, a business website, or a landing page, I focus on clean front-end execution, clear usability, and details that make the final result feel professionally built.',
      meta: {
        location: 'Location',
        education: 'Education',
        availability: 'Availability',
        focus: 'Focus',
      },
      locationValue: 'Tbilisi, Georgia',
      educationValue: 'Business and Technology University',
      availabilityValue: 'Available for freelance and contract work',
      focusValue: 'Responsive websites and polished interfaces',
      photoAlt: 'Saba Saneblidze portrait',
    },
    skills: {
      kicker: 'Expertise',
      title: 'A front-end skill set built around responsive quality and visual precision.',
      intro: 'I focus on clean implementation, interface clarity, and dependable execution so the final product feels polished, stable, and client-ready.',
      service1: { title: 'Responsive UI Development', body: 'Building interfaces that stay clear, balanced, and polished across desktop, tablet, and mobile.' },
      service2: { title: 'Layout & Interaction Precision', body: 'Refining structure, spacing, and on-screen flow so each section feels deliberate and easy to use.' },
      service3: { title: 'Clear Delivery & Communication', body: 'Bringing consistency, responsiveness, and practical collaboration into every stage of the work.' },
      stackTitle: 'Core Stack',
      stackIntro: 'Tools and technologies I rely on for modern, responsive front-end work.',
      networking: 'Networking',
      strengthsTitle: 'Delivery Principles',
      strengthsIntro: 'The standards that shape how I approach every build.',
      tags: {
        detail: 'Detail-oriented',
        responsive: 'Responsive systems',
        teamwork: 'UX awareness',
        communication: 'Communication',
        reliability: 'Reliable execution',
        learning: 'Performance-aware',
      },
      languagesTitle: 'Languages',
      languages: { georgian: 'Georgian', english: 'English', russian: 'Russian' },
      languageNative: 'Native',
      languageAdvanced: 'Working proficiency',
      languageBasic: 'Basic',
    },
    services: {
      kicker: 'Services',
      title: 'Websites built to look sharp and work clearly.',
      intro: 'From portfolio websites to business pages and landing experiences, each build is shaped around strong presentation, responsive structure, and clean front-end detail.',
      item1: { title: 'Portfolio Websites', body: 'Personal and creative portfolios with stronger hierarchy, polished presentation, and a credible first impression.' },
      item2: { title: 'Business & Restaurant Websites', body: 'Structured, high-trust websites that present services, menus, and brand identity with clarity and confidence.' },
      item3: { title: 'Responsive Front-End Development', body: 'Modern interfaces built to stay consistent, usable, and visually balanced across every screen size.' },
      item4: { title: 'Redesign & Modernization', body: 'Refreshing outdated websites with cleaner hierarchy, stronger visuals, and a more current digital presence.' },
      item5: { title: 'Front-End Fixes & Refinement', body: 'Resolving layout issues, broken responsiveness, and UI inconsistencies with clean, production-ready solutions.' },
      item6: { title: 'Landing Pages', body: 'Focused single-page builds designed for strong messaging, clean flow, and a more refined first impression.' },
    },
    projects: {
      kicker: 'Selected Projects',
      title: 'Curated work focused on presentation, usability, and front-end quality.',
      intro: 'A selection of builds and redesigns shaped around responsive structure, stronger hierarchy, and digital presentation that feels intentional and refined.',
      featured: {
        label: 'Featured Build',
        title: 'Austrian Brewery Restaurant Website',
        body: 'A restaurant website designed to feel premium and editorial, with stronger hierarchy, appetite-driven visuals, and a responsive layout that stays refined across devices.',
        alt: 'Austrian Brewery website preview',
      },
      clientWork: 'Client Website',
      redesign: 'Strategic Redesign',
      concept: 'Brand Concept',
      personalBuild: 'Independent Build',
      template: 'Template System',
      viewLive: 'View Live',
      viewMore: 'View Full Portfolio',
      previewSoon: 'Preview Soon',
      project1: { title: 'Salome G. Personal Website', body: 'A personal brand website shaped around clarity, elegance, and calm visual rhythm, giving the content a more polished and credible digital presence.', alt: 'Salome personal website preview' },
      project2: { title: 'FC Batumi Website Redesign', body: 'A concept redesign focused on stronger hierarchy, cleaner navigation, and a more modern responsive structure for sports-focused content.', alt: 'FC Batumi redesign preview' },
      project3: { title: 'Animall Landing Page', body: 'A branded landing page concept for a pet store, built with brighter identity cues, clearer section flow, and responsive presentation that keeps the experience approachable and organized.' },
      project4: { title: 'CS2 Fan', body: 'CS2 Fan Website' },
      project5: { title: 'Delivery Website', body: 'A delivery platform concept with account flow, live support, checkout, tracking, and filtering, designed to feel fast, structured, and easy to use across screens.', alt: 'Delivery Website' },
      project6: { title: 'Website Template System', body: 'A reusable website starter system designed for faster launches, consistent sections, and clean front-end customization.', alt: 'Website template preview' },
    },
    process: {
      kicker: 'Process',
      title: 'A clear build process from direction to launch.',
      intro: "Every project moves through a structured flow focused on clarity, quality, and a final result that feels resolved rather than rushed.",
      step1: { title: 'Discovery', body: 'Clarifying goals, audience, and priorities before structure or visuals begin to take shape.' },
      step2: { title: 'Planning', body: 'Defining layout direction, content flow, and page structure so the build has a strong foundation.' },
      step3: { title: 'UI Refinement', body: 'Sharpening hierarchy, spacing, and visual rhythm so the interface feels clean, intentional, and consistent.' },
      step4: { title: 'Development', body: 'Building the experience with semantic structure, responsive behavior, and front-end precision.' },
      step5: { title: 'Testing', body: 'Reviewing layout behavior, responsiveness, and visual consistency across devices and browsers.' },
      step6: { title: 'Launch', body: 'Preparing the final handoff or deployment with a last polish pass and room for thoughtful refinements.' },
    },
    experience: {
      kicker: 'Background',
      title: 'A work style shaped by execution, communication, and consistency.',
      intro: 'My background combines fast-paced responsibility, customer-facing communication, and technical foundation, which translates into practical, dependable digital work.',
      item1: { date: '2024 - Present', title: 'Operations & Logistics', company: 'Wolt', body: 'Working in a fast-moving environment that depends on consistency, time awareness, and reliable execution under pressure.' },
      item2: { date: '2023 - 2024', title: 'Client-Facing Sales', company: 'Retail', body: 'Built stronger communication habits, handled real customer needs directly, and learned how presentation influences trust.' },
      item3: { date: '2023 - Present', title: 'Technical Foundation', company: 'Business and Technology University', body: 'Built a strong base in programming, web development, systems, databases, and networking through formal training and project work.' },
    },
    whyMe: {
      kicker: 'What I Bring',
      title: 'Design sensitivity backed by reliable front-end execution.',
      intro: 'The value is not only in writing code. It is in making the final product feel clear, polished, and trustworthy from the first interaction.',
      item1: { title: 'Responsive Precision', body: 'Layouts are built to stay balanced and usable across desktop, tablet, and mobile rather than being adjusted as an afterthought.' },
      item2: { title: 'Visual Consistency', body: 'Typography, spacing, rhythm, and component behavior are treated as part of the build quality, not decoration.' },
      item3: { title: 'Clean Problem Solving', body: 'When something needs fixing or refining, I work toward a stable, readable solution rather than a temporary patch.' },
      item4: { title: 'Professional Communication', body: 'Clear communication, dependable follow-through, and attention to detail help keep the work aligned from start to finish.' },
    },
    testimonials: {
      kicker: 'Feedback',
      title: "What people say about the work.",
      intro: 'Selected feedback from people who have seen the process and the final result up close.',
      item1: {
        quote: 'Saba built my personal website exactly how I envisioned it. The result felt polished, clean, and professionally presented, and the attention to detail made a real difference throughout the project.',
        name: 'Salome G.',
        role: 'Client — Personal Website',
      },
      item2: {
        quote: 'Saba has a sharp eye for presentation and a strong sense of structure. In a collaborative project, his attention to layout detail and clean front-end work noticeably raised the quality of the final result.',
        name: 'Nino Ch.',
        role: 'Project Collaborator',
      },
      placeholder: 'Additional client and collaborator feedback will appear here as new projects are completed and delivered.',
      placeholderCta: 'Start a project',
    },
    cta: {
      kicker: 'Ready to build something stronger?',
      title: 'Let’s create a website that feels polished from the first scroll.',
      body: 'If you need a modern portfolio, business website, landing page, or front-end refinement, I’m available to help shape a cleaner and more credible digital presence.',
      ctaBtn: 'Discuss Your Project',
      cvBtn: 'Download CV',
    },
    contact: {
      kicker: 'Contact',
      title: 'Let’s build something clear, polished, and useful.',
      intro: 'If you need a responsive website, a stronger visual presentation, or front-end refinement for an existing project, I’d be glad to hear what you’re building.',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      github: 'GitHub',
      copyEmail: 'Copy Email',
      copied: 'Email copied.',
      note: 'Available for freelance projects, redesign work, and front-end collaborations.',
      form: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message' },
      placeholders: { name: 'Your name', email: 'your@email.com', subject: 'Project or role', message: 'Tell me about your project, role, or idea.' },
      send: 'Send Message',
      formSuccess: 'Opening your email app...',
      formError: 'Please complete all required fields.',
    },
    footer: {
      copy: 'Frontend portfolio focused on polished websites, responsive quality, and modern digital presentation.',
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
      description: 'საბა სანებლიძის პორტფოლიო - front-end დეველოპერი, რომელიც ქმნის დახვეწილ, ადაპტირებად ვებსაიტებს ძლიერი ვიზუალური პრეზენტაციით და სუფთა შესრულებით.',
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
      eyebrow: 'Frontend დეველოპერი • ადაპტირებადი ვებსაიტები • UI-ზე ორიენტირებული ნამუშევრები',
      titleMain: 'საბა სანებლიძე',
      titlePrefix: 'ვაშენებ',
      description: 'ვქმნი დახვეწილ ვებსაიტებს, სადაც სუფთა front-end შესრულება, გააზრებული UX და ძლიერი ვიზუალური პრეზენტაცია ერთიანდება ყველა ეკრანზე.',
      ctaProjects: 'ნამუშევრების ნახვა',
      ctaContact: 'პროექტის დაწყება',
      stats: {
        projects: 'დასრულებული პროექტი',
        study: 'ტექში გატარებული წელი',
        work: 'კლიენტთან სამუშაო როლი',
      },
      captionLabel: 'ლოკაცია',
      cardLabel: 'მიმდინარე ფოკუსი',
      cardValue: 'ადაპტირებადი ვებსაიტები, landing page-ები, რედიზაინი და დახვეწილი front-end შესრულება.',
      codeRole: '"Frontend დეველოპერი"',
      codeUniversity: '"თბილისი, საქართველო"',
      codeStatus: '"ხელმისაწვდომი"',
      chipSupport: 'Responsive UX',
      scrollCue: 'სქროლე ქვემოთ',
      rotating: [
        'თანამედროვე ვებსაიტებს დახვეწილი დეტალებით.',
        'ადაპტირებად ინტერფეისებს გააზრებული შეგრძნებით.',
        'რეალური ბრენდებისთვის სუფთა front-end გამოცდილებებს.',
        'ძლიერ ციფრულ პრეზენტაციას.',
      ],
    },
    about: {
      kicker: 'პროფილი',
      title: 'Front-end ნამუშევარი, რომელიც დაფუძნებულია სიცხადეზე, polish-ზე და შესრულებაზე.',
      intro: 'ვქმნი თანამედროვე ვებსაიტებს, სადაც ძლიერი ვიზუალური პრეზენტაცია ერთიანდება სუფთა შესრულებასთან, ადაპტირებად სტრუქტურასთან და ეკრანიდან ეკრანზე გააზრებულ გამოცდილებასთან.',
      summaryTitle: 'პროფესიული შეჯამება',
      summaryText: 'Frontend დეველოპერი, ფოკუსირებული დახვეწილ ინტერფეისებზე, ადაპტირებად layout-ებზე და ციფრულ პრეზენტაციაზე, რომელიც გამოიყურება სანდოდ, თანამედროვედ და რეალური გამოყენებისთვის მზად.',
      lead: 'ჩემი ნამუშევარი ორიენტირებულია ვებსაიტებზე, რომლებიც გამოიყურება გამართულად, მუშაობს რბილად და კომუნიკაციას მკაფიოდ გადმოსცემს დესკტოპზე, ტაბლეტზე და მობილურზე.',
      body1: 'ვმუშაობ HTML, CSS, JavaScript, SQL და ტექნიკური საფუძვლების გამოყენებით, რათა იდეები ვაქციო სტრუქტურირებულ, ადაპტირებად ინტერფეისებად ძლიერი იერარქიით და ვიზუალური თანმიმდევრულობით.',
      body2: 'იქნება ეს პორტფოლიო, ბიზნეს საიტი თუ landing page, ჩემი ფოკუსი არის სუფთა front-end შესრულება, მკაფიო usability და ისეთი დეტალები, რომლებიც საბოლოო შედეგს პროფესიონალურად აგრძნობინებს.',
      meta: {
        location: 'ლოკაცია',
        education: 'განათლება',
        availability: 'ხელმისაწვდომობა',
        focus: 'ფოკუსი',
      },
      locationValue: 'თბილისი, საქართველო',
      educationValue: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი',
      availabilityValue: 'ხელმისაწვდომი ვარ freelance და contract პროექტებისთვის',
      focusValue: 'ადაპტირებადი ვებსაიტები და დახვეწილი ინტერფეისები',
      photoAlt: 'საბა სანებლიძის პორტრეტი',
    },
    skills: {
      kicker: 'ექსპერტიზა',
      title: 'Front-end უნარები, რომლებიც აგებულია ადაპტირებად ხარისხსა და ვიზუალურ სიზუსტეზე.',
      intro: 'ვფოკუსირდები სუფთა შესრულებაზე, ინტერფეისის სიცხადეზე და საიმედო მიწოდებაზე, რათა საბოლოო შედეგი გამოიყურებოდეს დახვეწილად, სტაბილურად და კლიენტისთვის მზად.',
      service1: { title: 'Responsive UI Development', body: 'ვქმნი ინტერფეისებს, რომლებიც რჩება მკაფიოდ, დაბალანსებულად და დახვეწილად დესკტოპზე, ტაბლეტზე და მობილურზე.' },
      service2: { title: 'Layout და Interaction სიზუსტე', body: 'ვხვეწავ სტრუქტურას, spacing-ს და ეკრანულ ნაკადს, რათა თითოეული სექცია იგრძნობოდეს გააზრებულად და მარტივად გამოსაყენებლად.' },
      service3: { title: 'მკაფიო კომუნიკაცია და მიწოდება', body: 'ყოველ ეტაპზე შემაქვს თანმიმდევრულობა, რეაგირების სისწრაფე და პრაქტიკული თანამშრომლობა.' },
      stackTitle: 'ძირითადი სტეკი',
      stackIntro: 'ინსტრუმენტები და ტექნოლოგიები, რომლებსაც თანამედროვე, ადაპტირებადი front-end ნამუშევრებისთვის ვიყენებ.',
      networking: 'ქსელები',
      strengthsTitle: 'სამუშაო პრინციპები',
      strengthsIntro: 'სტანდარტები, რომლებიც ჩემს თითოეულ build-ს განსაზღვრავს.',
      tags: {
        detail: 'დეტალებზე ორიენტირებული',
        responsive: 'Responsive სისტემები',
        teamwork: 'UX ხედვა',
        communication: 'კომუნიკაცია',
        reliability: 'საიმედო შესრულება',
        learning: 'Performance-aware',
      },
      languagesTitle: 'ენები',
      languages: { georgian: 'ქართული', english: 'ინგლისური', russian: 'რუსული' },
      languageNative: 'მშობლიური',
      languageAdvanced: 'სამუშაო დონე',
      languageBasic: 'საწყისი',
    },
    services: {
      kicker: 'სერვისები',
      title: 'ვებსაიტები, რომლებიც გამოიყურება მკაფიოდ და მუშაობს გამართულად.',
      intro: 'პორტფოლიო საიტებიდან ბიზნეს გვერდებამდე და landing გამოცდილებებამდე, თითოეული build ყალიბდება ძლიერი პრეზენტაციის, ადაპტირებადი სტრუქტურისა და სუფთა front-end დეტალების გარშემო.',
      item1: { title: 'პორტფოლიო ვებსაიტები', body: 'პირადი და შემოქმედებითი პორტფოლიოები ძლიერი იერარქიით, დახვეწილი პრეზენტაციით და სანდო პირველი შთაბეჭდილებით.' },
      item2: { title: 'ბიზნეს და რესტორნის ვებსაიტები', body: 'გამართული, მაღალი ნდობის ვებსაიტები, რომლებიც სერვისებს, მენიუს და ბრენდულ იდენტობას მკაფიოდ აჩვენებს.' },
      item3: { title: 'Responsive Front-End დეველოპმენტი', body: 'თანამედროვე ინტერფეისები, რომლებიც ყველა ეკრანზე ინარჩუნებს თანმიმდევრულობას, მოხერხებულობას და ვიზუალურ ბალანსს.' },
      item4: { title: 'რედიზაინი და მოდერნიზაცია', body: 'მოძველებული საიტების განახლება უფრო სუფთა იერარქიით, ძლიერი ვიზუალით და თანამედროვე ციფრული იმიჯით.' },
      item5: { title: 'Front-End გამოსწორება და დახვეწა', body: 'layout-ის პრობლემების, გატეხილი responsiveness-ის და UI შეუსაბამობების მოგვარება სუფთა, production-ready გადაწყვეტებით.' },
      item6: { title: 'Landing Page-ები', body: 'ფოკუსირებული ერთგვერდიანი build-ები ძლიერი მესიჯინგით, მკაფიო flow-ით და მეტად დახვეწილი პირველი შთაბეჭდილებით.' },
    },
    projects: {
      kicker: 'რჩეული პროექტები',
      title: 'კურირებული ნამუშევრები, ფოკუსირებული პრეზენტაციაზე, მოხერხებულობასა და front-end ხარისხზე.',
      intro: 'build-ებისა და რედიზაინების შერჩევა, რომელიც აგებულია ადაპტირებად სტრუქტურაზე, ძლიერ იერარქიასა და გააზრებულ ციფრულ პრეზენტაციაზე.',
      featured: {
        label: 'გამორჩეული build',
        title: 'Austrian Brewery რესტორნის ვებსაიტი',
        body: 'რესტორნის ვებსაიტი, შექმნილი პრემიუმ და editorial შეგრძნებით, ძლიერი იერარქიით, მადისაღმძვრელი ვიზუალებით და responsive layout-ით, რომელიც ყველა მოწყობილობაზე დახვეწილად რჩება.',
        alt: 'Austrian Brewery საიტის პრევიუ',
      },
      clientWork: 'კლიენტის ვებსაიტი',
      redesign: 'სტრატეგიული რედიზაინი',
      concept: 'ბრენდ კონცეფცია',
      personalBuild: 'დამოუკიდებელი build',
      template: 'შაბლონის სისტემა',
      viewLive: 'ნახე ლაივ',
      viewMore: 'სრული პორტფოლიოს ნახვა',
      previewSoon: 'პრევიუ მალე',
      project1: { title: 'Salome G. პერსონალური ვებსაიტი', body: 'პირადი ბრენდის ვებსაიტი, შექმნილი სიცხადის, ელეგანტურობის და მშვიდი ვიზუალური რიტმის ირგვლივ, რათა კონტენტს უფრო დახვეწილი და სანდო ციფრული სახე მიეცეს.', alt: 'სალომეს საიტის პრევიუ' },
      project2: { title: 'FC Batumi-ის ვებსაიტის რედიზაინი', body: 'კონცეფტუალური რედიზაინი უფრო ძლიერი იერარქიით, სუფთა ნავიგაციით და თანამედროვე responsive სტრუქტურით სპორტული კონტენტისთვის.', alt: 'FC Batumi-ის რედიზაინის პრევიუ' },
      project3: { title: 'Animall Landing Page', body: 'ზოომაღაზიის ბრენდული landing page კონცეფცია, შექმნილი უფრო ცოცხალი ვიზუალური იდენტობით, მკაფიო სექციური flow-ით და responsive პრეზენტაციით, რომელიც გამოცდილებას მეგობრულად და ორგანიზებულად ტოვებს.' },
      project4: { title: 'CS2 Fan', body: 'cs2 ფან ვებსაიტი' },
      project5: { title: 'Delivery Website', body: 'მიტანის პლატფორმის კონცეფცია account flow-ით, live support-ით, checkout-ით, tracking-ით და filtering-ით, შექმნილი სწრაფი, სტრუქტურირებული და ყველა ეკრანზე მარტივად გამოსაყენებელი გამოცდილებისთვის.', alt: 'მიტანის ვებსაიტის პრევიუ' },
      project6: { title: 'ვებსაიტის შაბლონის სისტემა', body: 'მრავალჯერადი გამოყენების starter სისტემა, შექმნილი უფრო სწრაფი launch-ებისთვის, თანმიმდევრული სექციებისთვის და სუფთა front-end კონფიგურაციისთვის.', alt: 'ვებსაიტის შაბლონის პრევიუ' },
    process: {
      kicker: 'პროცესი',
      title: 'მკაფიო build პროცესი მიმართულებიდან launch-მდე.',
      intro: 'თითოეული პროექტი მიჰყვება სტრუქტურირებულ ნაკადს, რომელიც ფოკუსირებულია სიცხადეზე, ხარისხზე და შედეგზე, რომელიც დასრულებულად იგრძნობა და არა ნაჩქარევად.',
      step1: { title: 'შესწავლა', body: 'მიზნების, აუდიტორიის და პრიორიტეტების გარკვევა მანამდე, სანამ სტრუქტურა ან ვიზუალი აშენდება.' },
      step2: { title: 'დაგეგმვა', body: 'layout მიმართულების, კონტენტის ნაკადისა და გვერდის სტრუქტურის განსაზღვრა ძლიერი საფუძვლისთვის.' },
      step3: { title: 'UI დახვეწა', body: 'იერარქიის, spacing-ის და ვიზუალური რიტმის გამკაცრება, რათა ინტერფეისი იგრძნობოდეს სუფთად, გააზრებულად და თანმიმდევრულად.' },
      step4: { title: 'დეველოპმენტი', body: 'გამოცდილების აშენება სემანტიკური სტრუქტურით, responsive ქცევით და front-end სიზუსტით.' },
      step5: { title: 'ტესტირება', body: 'layout ქცევის, responsiveness-ის და ვიზუალური თანმიმდევრულობის შემოწმება სხვადასხვა მოწყობილობასა და ბრაუზერში.' },
      step6: { title: 'გაშვება', body: 'საბოლოო handoff-ის ან deployment-ის მომზადება ბოლო polish pass-ით და დამატებითი კორექტირებების სივრცით.' },
    },
    experience: {
      kicker: 'ფონი',
      title: 'სამუშაო სტილი, რომელიც აგებულია შესრულებაზე, კომუნიკაციასა და თანმიმდევრულობაზე.',
      intro: 'ჩემი გამოცდილება აერთიანებს სწრაფ გარემოში პასუხისმგებლობას, მომხმარებელთან პირდაპირ კომუნიკაციას და ტექნიკურ საფუძველს, რაც ციფრულ მუშაობაში პრაქტიკულ და სანდო მიდგომად გადადის.',
      item1: { date: '2024 - დღემდე', title: 'ოპერაციები და ლოჯისტიკა', company: 'Wolt', body: 'მუშაობა სწრაფ გარემოში, რომელიც დამოკიდებულია თანმიმდევრულობაზე, დროის სწორ მართვასა და ზეწოლის ქვეშ საიმედო შესრულებაზე.' },
      item2: { date: '2023 - 2024', title: 'კლიენტთან კომუნიკაცია და გაყიდვები', company: 'Retail', body: 'გამოვიმუშავე უფრო ძლიერი კომუნიკაცია, ვმართავდი რეალურ მომხმარებელთა საჭიროებებს და დავინახე, როგორ ქმნის პრეზენტაცია ნდობას.' },
      item3: { date: '2023 - დღემდე', title: 'ტექნიკური საფუძველი', company: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი', body: 'შევქმენი ძლიერი ბაზა პროგრამირებაში, ვებ დეველოპმენტში, სისტემებში, ბაზებსა და ქსელებში ფორმალური განათლებისა და პროექტული მუშაობის გზით.' },
    },
    whyMe: {
      kicker: 'რას ვაძლევ პროექტს',
      title: 'დიზაინის შეგრძნება, გამყარებული საიმედო front-end შესრულებით.',
      intro: 'ღირებულება მხოლოდ კოდში არ არის. ის არის საბოლოო შედეგში, რომელიც პირველივე ინტერაქციიდან მკაფიოდ, დახვეწილად და სანდოდ იგრძნობა.',
      item1: { title: 'Responsive სიზუსტე', body: 'layout-ები შენდება ისე, რომ დესკტოპზე, ტაბლეტზე და მობილურზე დაბალანსებულად და მოსახერხებლად დარჩეს და არა მხოლოდ ბოლოს მოერგოს.' },
      item2: { title: 'ვიზუალური თანმიმდევრულობა', body: 'ტიპოგრაფია, spacing, რიტმი და კომპონენტების ქცევა არის build-ის ხარისხის ნაწილი და არა უბრალოდ დეკორაცია.' },
      item3: { title: 'სუფთა პრობლემის გადაჭრა', body: 'როდესაც რაიმე გამოსასწორებელია ან დასახვეწი, ვმუშაობ სტაბილურ, წაკითხვად გადაწყვეტაზე და არა დროებით workaround-ზე.' },
      item4: { title: 'პროფესიული კომუნიკაცია', body: 'მკაფიო კომუნიკაცია, საიმედო follow-through და დეტალებზე ყურადღება ხელს უწყობს, რომ მუშაობა თავიდან ბოლომდე სწორად იყოს აწყობილი.' },
    },
    testimonials: {
      kicker: 'გამოხმაურება',
      title: 'რას ამბობენ ადამიანები ნამუშევარზე.',
      intro: 'შერჩეული გამოხმაურება მათგან, ვინც პროცესი და საბოლოო შედეგი ახლოდან ნახა.',
      item1: {
        quote: 'საბამ ჩემი პერსონალური ვებსაიტი ზუსტად ისე ააშენა, როგორც წარმომედგინა. შედეგი გამოიყურებოდა დახვეწილად, სუფთად და პროფესიონალურად, ხოლო დეტალებზე ყურადღებამ მთელ პროცესში დიდი განსხვავება შექმნა.',
        name: 'სალომე გ.',
        role: 'კლიენტი — პერსონალური ვებსაიტი',
      },
      item2: {
        quote: 'საბას პრეზენტაციაზე მახვილი თვალი და სტრუქტურის კარგი შეგრძნება აქვს. კოლაბორაციულ პროექტში, layout-ის დეტალებზე მისმა ყურადღებამ და სუფთა front-end მუშაობამ საბოლოო ხარისხი აშკარად გააუმჯობესა.',
        name: 'ნინო ჩ.',
        role: 'პროექტის კოლაბორატორი',
      },
      placeholder: 'დამატებითი კლიენტური და კოლაბორაციული გამოხმაურებები აქ დაემატება ახალი პროექტების დასრულებასთან ერთად.',
      placeholderCta: 'პროექტის დაწყება',
    },
    cta: {
      kicker: 'მზად ხარ უფრო ძლიერი შედეგისთვის?',
      title: 'მოდი შევქმნათ ვებსაიტი, რომელიც პირველივე სქროლიდან დახვეწილად იგრძნობა.',
      body: 'თუ გჭირდება თანამედროვე პორტფოლიო, ბიზნეს ვებსაიტი, landing page ან front-end დახვეწა, მზად ვარ დაგეხმარო უფრო სუფთა და სანდო ციფრული სახის შექმნაში.',
      ctaBtn: 'პროექტზე საუბარი',
      cvBtn: 'CV-ის ჩამოტვირთვა',
    },
    contact: {
      kicker: 'კონტაქტი',
      title: 'მოდი ერთად შევქმნათ რაიმე მკაფიო, დახვეწილი და გამოსადეგი.',
      intro: 'თუ გჭირდება ადაპტირებადი ვებსაიტი, უფრო ძლიერი ვიზუალური პრეზენტაცია ან უკვე არსებული პროექტის front-end დახვეწა, სიამოვნებით მოვისმენ რას აშენებ.',
      email: 'ელფოსტა',
      phone: 'ტელეფონი',
      location: 'ლოკაცია',
      github: 'GitHub',
      copyEmail: 'მეილის კოპირება',
      copied: 'მეილი დაკოპირდა.',
      note: 'ხელმისაწვდომი ვარ freelance პროექტებისთვის, რედიზაინისთვის და front-end კოლაბორაციებისთვის.',
      form: { name: 'სახელი', email: 'ელფოსტა', subject: 'თემა', message: 'მესიჯი' },
      placeholders: { name: 'შენი სახელი', email: 'your@email.com', subject: 'პროექტი ან პოზიცია', message: 'მომიყევი პროექტის, როლის ან იდეის შესახებ.' },
      send: 'მესიჯის გაგზავნა',
      formSuccess: 'იხსნება ელფოსტის აპლიკაცია...',
      formError: 'გთხოვ, შეავსე ყველა აუცილებელი ველი.',
    },
    footer: {
      copy: 'Front-end პორტფოლიო, ფოკუსირებული დახვეწილ ვებსაიტებზე, responsive ხარისხზე და თანამედროვე ციფრულ პრეზენტაციაზე.',
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
