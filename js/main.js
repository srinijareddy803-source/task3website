document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ==========================================
  const themeToggle = document.querySelector('.theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-theme');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
    });
  }

  // ==========================================
  // 2. MOBILE NAVIGATION DRAWER
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'translateY(9px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Active link highlighters based on URL
  const currentUrl = window.location.pathname;
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentUrl.endsWith(linkPath) || (currentUrl.endsWith('/') && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 4. TESTIMONIALS SLIDER
  // ==========================================
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (carouselTrack && slides.length > 0) {
    let currentSlideIndex = 0;
    let autoplayTimer = null;
    
    // Create dots dynamically
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      currentSlideIndex = index;
      carouselTrack.style.transform = `translateX(-${index * 100}%)`;
      
      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex + 1);
        resetAutoplay();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlideIndex - 1);
        resetAutoplay();
      });
    }
    
    // Autoplay setup
    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
      }, 5000); // changes slides every 5s
    }
    
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }
    
    startAutoplay();
    
    // Swipe/Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoplayTimer);
    }, { passive: true });
    
    carouselTrack.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (swipeDistance < -50) {
        goToSlide(currentSlideIndex + 1); // Swipe left -> Next
      } else if (swipeDistance > 50) {
        goToSlide(currentSlideIndex - 1); // Swipe right -> Prev
      }
    }
  }

  // ==========================================
  // 5. SERVICES FILTER & DETAILED MODAL
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');
  
  if (filterBtns.length > 0 && courseCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active button styles toggle
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterCategory = btn.getAttribute('data-filter');
        
        courseCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.classList.remove('hide');
            // Re-trigger visual fade-in animation
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.4s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }

  // Dynamic course detailed info database
  const coursesDb = {
    'webdev': {
      title: 'Full-Stack Web Development',
      badge: 'Development',
      badgeClass: 'badge-dev',
      duration: '16 Weeks',
      lessons: '48 Lectures',
      price: '$499',
      desc: 'Master frontend and backend technologies including HTML5, CSS3, JavaScript, React, Node.js, Express, and MongoDB. Learn database design, server architectures, deployment, and build real-world products.',
      curriculum: [
        'Web Architecture & Advanced HTML5/CSS3',
        'JavaScript Core & Modern ES6+ Paradigms',
        'Building User Interfaces with ReactJS',
        'Backend Foundations using Node.js & Express',
        'Databases & APIs: MongoDB & SQL Systems',
        'DevOps Basics: CI/CD, Git, & Cloud Deployments'
      ]
    },
    'uiux': {
      title: 'UI/UX Design Masterclass',
      badge: 'Design',
      badgeClass: 'badge-design',
      duration: '10 Weeks',
      lessons: '30 Lectures',
      price: '$349',
      desc: 'Dive deep into user-centered design methodologies, research techniques, and UI craft. Learn to create responsive layout wireframes, high-fidelity prototypes, and perform usability testing with Figma, Adobe XD, and Miro.',
      curriculum: [
        'Design Thinking & User Research Methods',
        'Information Architecture & Flowcharts',
        'Wireframing & UI Layout Grid System',
        'Figma Tools: Components, Auto Layout, Variables',
        'Interactive Prototyping & Micro-animations',
        'Usability Testing, Iteration & Developer Handoff'
      ]
    },
    'ai': {
      title: 'AI & Machine Learning Boot Camp',
      badge: 'Development',
      badgeClass: 'badge-dev',
      duration: '20 Weeks',
      lessons: '60 Lectures',
      price: '$699',
      desc: 'Equip yourself with python mathematical tools for data science. Learn predictive modeling, classical machine learning algorithms, deep learning neural networks, natural language processing, and generative AI models.',
      curriculum: [
        'Python Programming & Scientific Computing (NumPy/Pandas)',
        'Data Visualization & Feature Engineering',
        'Supervised & Unsupervised Machine Learning (Scikit-Learn)',
        'Neural Networks and Deep Learning with TensorFlow',
        'Computer Vision & Natural Language Processing (NLP)',
        'Generative AI Foundations & LLM fine-tuning'
      ]
    },
    'biz': {
      title: 'Digital Business Strategy',
      badge: 'Business',
      badgeClass: 'badge-biz',
      duration: '8 Weeks',
      lessons: '24 Lectures',
      price: '$299',
      desc: 'Build foundational entrepreneurship skills. Analyze digital business disruption patterns, construct agile workflows, execute product growth strategies, and apply metrics dashboards to scale commercial models.',
      curriculum: [
        'Principles of Digital Business Transformation',
        'Lean Startup & Customer Development Methods',
        'Product-Market Fit & Value Proposition Canvas',
        'Key Performance Indicators (KPIs) & Analytics',
        'Growth Hacking & Digital Revenue Models',
        'Pitching, Capital Fundraising & Scaling Teams'
      ]
    },
    'mkt': {
      title: 'Growth Marketing Strategy',
      badge: 'Marketing',
      badgeClass: 'badge-mkt',
      duration: '12 Weeks',
      lessons: '36 Lectures',
      price: '$249',
      desc: 'Acquire modern marketing knowledge to drive user retention. Master Search Engine Optimization (SEO), programmatic advertising campaigns, automated CRM messaging, funnel design, and social media copywriting.',
      curriculum: [
        'The Growth Marketing Framework & Funnel',
        'SEO Strategy & Content Generation Engine',
        'Paid Media Campaigns: Google Ads & Socials',
        'Email Marketing Campaigns & Marketing Automation',
        'Conversion Rate Optimization (A/B Testing)',
        'Marketing Attribution & Performance Metrics'
      ]
    },
    'data': {
      title: 'Data Science & Analytics',
      badge: 'Development',
      badgeClass: 'badge-dev',
      duration: '14 Weeks',
      lessons: '42 Lectures',
      price: '$399',
      desc: 'Transition from spreadsheets to programmatic analysis. Master SQL queries, data warehousing, python dashboards, exploratory data analysis, statistics models, and interactive visualizations with Tableau and PowerBI.',
      curriculum: [
        'Structured Query Language (SQL) Foundations',
        'Exploratory Data Analysis (EDA) in Python',
        'Probability, Hypothesis Testing & Inference',
        'Interactive Reporting using PowerBI & Tableau',
        'Statistical Modeling & Regression Analysis',
        'Data Storytelling & Corporate Reporting Structures'
      ]
    }
  };

  const modalOverlay = document.getElementById('courseModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.querySelector('.modal-close');
  
  if (modalOverlay && openModalBtns.length > 0) {
    function fillModalContent(courseId) {
      const course = coursesDb[courseId];
      if (!course) return;
      
      const badgeEl = modalOverlay.querySelector('.modal-badge');
      const titleEl = modalOverlay.querySelector('.modal-title');
      const durationEl = modalOverlay.querySelector('.modal-duration');
      const lessonsEl = modalOverlay.querySelector('.modal-lessons');
      const priceEl = modalOverlay.querySelector('.modal-price');
      const descEl = modalOverlay.querySelector('.modal-desc');
      const curriculumList = modalOverlay.querySelector('.curriculum-list');
      
      // Reset classes & text
      badgeEl.className = 'modal-badge ' + course.badgeClass;
      badgeEl.textContent = course.badge;
      titleEl.textContent = course.title;
      durationEl.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${course.duration}`;
      lessonsEl.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg> ${course.lessons}`;
      priceEl.textContent = course.price;
      descEl.textContent = course.desc;
      
      // Fill curriculum items
      curriculumList.innerHTML = '';
      course.curriculum.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          <span>${item}</span>
        `;
        curriculumList.appendChild(li);
      });
    }

    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const courseId = btn.getAttribute('data-course-id');
        fillModalContent(courseId);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      });
    });
    
    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scroll
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay clicking
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ==========================================
  // 6. CONTACT FORM VALIDATIONS & AJAX SIMULATION
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('successAlert');
  
  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Validate individual field functions
    function showError(input, message) {
      const parent = input.parentElement;
      parent.classList.add('error');
      const errEl = parent.querySelector('.error-message');
      if (errEl) errEl.textContent = message;
    }
    
    function clearError(input) {
      const parent = input.parentElement;
      parent.classList.remove('error');
    }
    
    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-w\-0-9]+\.)+[a-zA-w]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    
    // Instant feedback on input typing
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          clearError(input);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // Name validation
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Name is required.');
        isValid = false;
      } else {
        clearError(nameInput);
      }
      
      // Email validation
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email is required.');
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput);
      }
      
      // Subject validation
      if (!subjectInput.value.trim()) {
        showError(subjectInput, 'Subject is required.');
        isValid = false;
      } else {
        clearError(subjectInput);
      }
      
      // Message validation
      if (!messageInput.value.trim()) {
        showError(messageInput, 'Message is required.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters long.');
        isValid = false;
      } else {
        clearError(messageInput);
      }
      
      if (isValid) {
        // Submit simulation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="animation: spin 1s linear infinite; margin-right: 8px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
          Sending...
        `;
        
        // Add CSS spinner style inline for form spinner
        if (!document.getElementById('spinner-style')) {
          const style = document.createElement('style');
          style.id = 'spinner-style';
          style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
          document.head.appendChild(style);
        }
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          
          // Show success alert
          if (successAlert) {
            successAlert.classList.add('active');
            setTimeout(() => {
              successAlert.classList.remove('active');
            }, 6000);
          }
          
          contactForm.reset();
        }, 1500);
      }
    });
  }

  // ==========================================
  // 7. FAQ ACCORDION EXPAND
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other active FAQs for clean interactions
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = null;
          }
        });
        
        item.classList.toggle('active');
        
        if (!isActive) {
          // Open
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          // Close
          content.style.maxHeight = null;
        }
      });
    });
  }
});
