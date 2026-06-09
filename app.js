// Page loader fade-out logic
const hideLoader = () => {
  const loader = document.getElementById('page-loader');
  if (loader && !loader.classList.contains('fade-out')) {
    loader.classList.add('fade-out');
  }
};
window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 2500); // 2.5s safety fallback

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. GLOBAL HEADER & MOBILE NAVIGATION
     ========================================================================== */
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      const isActive = navMenu.classList.contains('active');
      navToggle.innerHTML = isActive 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
           </svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
           </svg>`;
    });
  }

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
      if (navToggle) {
        navToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
           </svg>`;
      }
    });
  });


  /* ==========================================================================
     2. ABOUT US TABS SWITCHING (Only runs on about.html)
     ========================================================================== */
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutContents = document.querySelectorAll('.about-tab-content');

  if (aboutTabs.length > 0) {
    aboutTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        aboutTabs.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        aboutContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const contentId = tab.getAttribute('aria-controls');
        const contentEl = document.getElementById(contentId);
        if (contentEl) {
          contentEl.classList.add('active');
        }
      });
    });
  }


  /* ==========================================================================
     3. FINANCIAL CALCULATORS (Only runs on calculators.html)
     ========================================================================== */
  const calcTabs = document.querySelectorAll('.calc-tab-btn');
  const calcSections = document.querySelectorAll('.calc-section');

  if (calcTabs.length > 0) {
    calcTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        calcTabs.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        calcSections.forEach(sec => sec.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const sectionId = tab.getAttribute('aria-controls');
        const sectionEl = document.getElementById(sectionId);
        if (sectionEl) {
          sectionEl.classList.add('active');
        }
      });
    });
  }

  // -- Income Tax Calculator Logic --
  const taxGrossInput = document.getElementById('tax-gross-income');
  const taxOtherInput = document.getElementById('tax-other-income');
  const taxDeductionsInput = document.getElementById('tax-deductions');
  const oldRegimeOutput = document.getElementById('old-regime-value');
  const newRegimeOutput = document.getElementById('new-regime-value');
  const recommendationOutput = document.getElementById('tax-regime-recommendation');

  function formatRupees(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateIncomeTax() {
    if (!taxGrossInput) return;

    const gross = parseFloat(taxGrossInput.value) || 0;
    const other = parseFloat(taxOtherInput.value) || 0;
    const deductions = parseFloat(taxDeductionsInput.value) || 0;

    const totalGross = gross + other;

    // --- OLD REGIME ---
    const oldStandardDeduction = 50000;
    const taxableOld = Math.max(0, totalGross - deductions - oldStandardDeduction);
    let taxOld = 0;

    if (taxableOld <= 500000) {
      taxOld = 0;
    } else {
      if (taxableOld > 1000000) {
        taxOld += (taxableOld - 1000000) * 0.30;
        taxOld += 500000 * 0.20;
        taxOld += 250000 * 0.05;
      } else if (taxableOld > 500000) {
        taxOld += (taxableOld - 500000) * 0.20;
        taxOld += 250000 * 0.05;
      } else if (taxableOld > 250000) {
        taxOld += (taxableOld - 250000) * 0.05;
      }
      taxOld = taxOld * 1.04;
    }

    // --- NEW REGIME (FY 2024-25 / 2025-26 slabs) ---
    const newStandardDeduction = 75000;
    const taxableNew = Math.max(0, totalGross - newStandardDeduction);
    let taxNew = 0;

    if (taxableNew <= 700000) {
      taxNew = 0;
    } else {
      if (taxableNew > 1500000) {
        taxNew += (taxableNew - 1500000) * 0.30;
        taxNew += 300000 * 0.20;
        taxNew += 300000 * 0.15;
        taxNew += 300000 * 0.10;
        taxNew += 300000 * 0.05;
      } else if (taxableNew > 1200000) {
        taxNew += (taxableNew - 1200000) * 0.20;
        taxNew += 300000 * 0.15;
        taxNew += 300000 * 0.10;
        taxNew += 300000 * 0.05;
      } else if (taxableNew > 900000) {
        taxNew += (taxableNew - 900000) * 0.15;
        taxNew += 300000 * 0.10;
        taxNew += 300000 * 0.05;
      } else if (taxableNew > 600000) {
        taxNew += (taxableNew - 600000) * 0.10;
        taxNew += 300000 * 0.05;
      } else if (taxableNew > 300000) {
        taxNew += (taxableNew - 300000) * 0.05;
      }
      taxNew = taxNew * 1.04;
    }

    // Render outputs
    if (oldRegimeOutput) oldRegimeOutput.textContent = formatRupees(taxOld);
    if (newRegimeOutput) newRegimeOutput.textContent = formatRupees(taxNew);

    if (recommendationOutput) {
      if (taxNew < taxOld) {
        recommendationOutput.textContent = "New Regime";
        recommendationOutput.style.color = "var(--secondary)";
      } else if (taxOld < taxNew) {
        recommendationOutput.textContent = "Old Regime";
        recommendationOutput.style.color = "var(--accent-hover)";
      } else {
        recommendationOutput.textContent = "Equal Benefit";
        recommendationOutput.style.color = "var(--primary)";
      }
    }
  }

  // Bind Tax inputs
  if (taxGrossInput) {
    [taxGrossInput, taxOtherInput, taxDeductionsInput].forEach(input => {
      if (input) {
        input.addEventListener('input', calculateIncomeTax);
      }
    });
    calculateIncomeTax();
  }

  // -- GST Calculator Logic --
  const gstAmountInput = document.getElementById('gst-amount');
  const gstRateSelect = document.getElementById('gst-rate');
  const gstModeRadios = document.getElementsByName('gst-mode');
  const gstNetOutput = document.getElementById('gst-net-value');
  const gstTaxOutput = document.getElementById('gst-tax-value');
  const gstTotalOutput = document.getElementById('gst-total-value');

  function calculateGST() {
    if (!gstAmountInput) return;

    const amount = parseFloat(gstAmountInput.value) || 0;
    const rate = parseFloat(gstRateSelect.value) || 18;
    
    let mode = 'add';
    for (const radio of gstModeRadios) {
      if (radio.checked) {
        mode = radio.value;
        break;
      }
    }

    let netAmount = 0;
    let gstTax = 0;
    let totalAmount = 0;

    if (mode === 'add') {
      netAmount = amount;
      gstTax = amount * (rate / 100);
      totalAmount = netAmount + gstTax;
    } else {
      netAmount = amount / (1 + (rate / 100));
      gstTax = amount - netAmount;
      totalAmount = amount;
    }

    if (gstNetOutput) gstNetOutput.textContent = formatRupees(netAmount);
    if (gstTaxOutput) gstTaxOutput.textContent = formatRupees(gstTax);
    if (gstTotalOutput) gstTotalOutput.textContent = formatRupees(totalAmount);
  }

  if (gstAmountInput) {
    gstAmountInput.addEventListener('input', calculateGST);
    if (gstRateSelect) gstRateSelect.addEventListener('change', calculateGST);
    gstModeRadios.forEach(radio => {
      radio.addEventListener('change', calculateGST);
    });
    calculateGST();
  }


  /* ==========================================================================
     4. SECURE CLIENT PORTAL (Only runs on portal.html)
     ========================================================================== */
  const loginForm = document.getElementById('portal-login-form');
  const authView = document.getElementById('portal-auth-view');
  const dashboardView = document.getElementById('portal-dashboard-view');
  const statusLabel = document.getElementById('portal-status-label');
  const logoutBtn = document.getElementById('portal-logout-btn');
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('portal-file-input');
  const fileContainer = document.getElementById('uploaded-files-container');
  const fileIndicator = document.getElementById('file-count-indicator');
  const syncBtn = document.getElementById('portal-sync-btn');

  let uploadedFiles = [];

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('portal-email').value;
      const password = document.getElementById('portal-password').value;

      if (email === 'client@tax.com' && password === 'secure123') {
        if (authView) authView.style.display = 'none';
        if (dashboardView) dashboardView.style.display = 'block';
        if (statusLabel) {
          statusLabel.textContent = 'AUTHENTICATED';
          statusLabel.classList.add('authenticated');
        }
        const userDisplay = document.getElementById('portal-user-name');
        if (userDisplay) userDisplay.textContent = 'Vikas Nair (InnovateTech)';
        loginForm.reset();
      } else {
        alert('Invalid email or password! Please use the demo credentials provided.');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (dashboardView) dashboardView.style.display = 'none';
      if (authView) authView.style.display = 'block';
      if (statusLabel) {
        statusLabel.textContent = 'NOT LOGGED IN';
        statusLabel.classList.remove('authenticated');
      }
      uploadedFiles = [];
      renderFilesList();
    });
  }

  if (dropzone) {
    dropzone.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      }, false);
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 25MB limit.`);
        continue;
      }

      const fileObj = {
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatBytes(file.size),
        progress: 0
      };

      uploadedFiles.push(fileObj);
      renderFilesList();
      simulateUpload(fileObj.id);
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function simulateUpload(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      file.progress = progress;
      const bar = document.querySelector(`[data-file-progress="${fileId}"]`);
      if (bar) {
        bar.style.width = progress + '%';
      }
    }, 150);
  }

  window.removePortalFile = function(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
    renderFilesList();
  };

  function renderFilesList() {
    if (!fileIndicator || !fileContainer) return;
    
    fileIndicator.textContent = `${uploadedFiles.length} File${uploadedFiles.length === 1 ? '' : 's'}`;
    
    if (uploadedFiles.length === 0) {
      fileContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1.5rem 0;">No documents uploaded yet.</p>`;
      return;
    }

    fileContainer.innerHTML = uploadedFiles.map(file => `
      <div class="file-item" id="file-${file.id}">
        <span class="file-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        <div class="file-info">
          <div class="file-name" title="${file.name}">${file.name}</div>
          <div class="file-size">${file.size}</div>
        </div>
        <button class="file-remove-btn" onclick="removePortalFile('${file.id}')" aria-label="Remove File">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <div class="file-progress" data-file-progress="${file.id}" style="width: ${file.progress}%"></div>
      </div>
    `).join('');
  }

  // Trigger uploader list on portal load
  if (fileContainer) {
    renderFilesList();
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      if (uploadedFiles.length === 0) {
        alert('Please upload files first before syncing!');
        return;
      }
      alert('Documents synced successfully to Apex Partners Secure Portal Vault.');
    });
  }


  /* ==========================================================================
     5. CONSULTATION SCHEDULER WIZARD FLOW (Only runs on contact.html)
     ========================================================================== */
  const bookingForm = document.getElementById('booking-flow-form');
  const bookingViews = document.querySelectorAll('.booking-view');
  const stepNavs = document.querySelectorAll('.booking-step-item');
  const serviceOptions = document.querySelectorAll('.booking-service-option');
  const timeSlots = document.querySelectorAll('.time-slot');
  const dateInput = document.getElementById('booking-date');

  let bookingState = {
    service: 'Income Tax Filing',
    date: '',
    slot: '',
    name: '',
    email: '',
    message: ''
  };

  let currentStep = 1;

  if (dateInput) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  if (serviceOptions.length > 0) {
    serviceOptions.forEach(option => {
      option.addEventListener('click', () => {
        serviceOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        bookingState.service = option.getAttribute('data-value');
      });
    });

    // Parse URL parameter to pre-select a service
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
      const serviceMap = {
        'tax': 'Income Tax Filing',
        'gst': 'GST Registration & Returns',
        'incorporation': 'Company Incorporation',
        'audit': 'Audit & Assurance',
        'accounting': 'Accounting & Bookkeeping',
        'tds': 'TDS Compliance',
        'advisory': 'Business Advisory',
        'roc': 'ROC Compliance'
      };
      const targetValue = serviceMap[serviceParam.toLowerCase()] || serviceParam;
      let found = false;
      
      serviceOptions.forEach(opt => {
        const optVal = opt.getAttribute('data-value');
        if (optVal && optVal.toLowerCase() === targetValue.toLowerCase()) {
          serviceOptions.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          bookingState.service = optVal;
          found = true;
        }
      });
      
      // Fallback substring matching
      if (!found) {
        serviceOptions.forEach(opt => {
          const optVal = opt.getAttribute('data-value');
          if (optVal && optVal.toLowerCase().includes(targetValue.toLowerCase())) {
            serviceOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            bookingState.service = optVal;
          }
        });
      }
    } else {
      // Set initial state service to the pre-selected option in HTML
      const selectedOpt = document.querySelector('.booking-service-option.selected');
      if (selectedOpt) {
        bookingState.service = selectedOpt.getAttribute('data-value');
      }
    }
  }

  if (timeSlots.length > 0) {
    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        if (slot.classList.contains('disabled')) return;
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        bookingState.slot = slot.getAttribute('data-slot');
      });
    });
  }

  function updateStepNav() {
    if (stepNavs.length === 0) return;
    stepNavs.forEach((nav, idx) => {
      const stepNum = idx + 1;
      nav.classList.remove('active', 'completed');
      
      if (stepNum === currentStep) {
        nav.classList.add('active');
      } else if (stepNum < currentStep) {
        nav.classList.add('completed');
      }
    });
  }

  function switchStepView(step) {
    if (bookingViews.length === 0) return;
    bookingViews.forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(`booking-view-${step}`);
    if (targetView) targetView.classList.add('active');
    
    currentStep = step;
    updateStepNav();
  }

  document.getElementById('booking-next-1')?.addEventListener('click', () => {
    switchStepView(2);
  });

  document.getElementById('booking-prev-2')?.addEventListener('click', () => {
    switchStepView(1);
  });

  document.getElementById('booking-next-2')?.addEventListener('click', () => {
    if (dateInput) bookingState.date = dateInput.value;
    
    if (!bookingState.date) {
      alert('Please choose a valid date for consultation.');
      return;
    }
    if (!bookingState.slot) {
      alert('Please choose an available time slot.');
      return;
    }
    switchStepView(3);
  });

  document.getElementById('booking-prev-3')?.addEventListener('click', () => {
    switchStepView(2);
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      bookingState.name = document.getElementById('booking-name').value.trim();
      bookingState.email = document.getElementById('booking-email').value.trim();
      bookingState.message = document.getElementById('booking-message').value.trim();

      if (!bookingState.name || !bookingState.email) {
        alert('Please fill out your name and email address.');
        return;
      }

      const summaryService = document.getElementById('summary-service');
      const summaryDate = document.getElementById('summary-date');
      const summarySlot = document.getElementById('summary-slot');
      const summaryName = document.getElementById('summary-name');

      if (summaryService) summaryService.textContent = bookingState.service;
      
      if (summaryDate && bookingState.date) {
        const d = new Date(bookingState.date);
        summaryDate.textContent = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      }
      if (summarySlot) summarySlot.textContent = bookingState.slot;
      if (summaryName) summaryName.textContent = bookingState.name;

      switchStepView(4);
      
      stepNavs.forEach(nav => {
        nav.classList.remove('active');
        nav.classList.add('completed');
      });

      startBookingRedirectTimer();
    });
  }

  let bookingRedirectInterval = null;

  function startBookingRedirectTimer() {
    stopBookingRedirectTimer();
    const redirectBtn = document.getElementById('booking-home-redirect-btn');
    if (!redirectBtn) return;
    
    let secondsLeft = 10;
    redirectBtn.textContent = `Go back to Home Page (${secondsLeft}s)`;
    
    bookingRedirectInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(bookingRedirectInterval);
        window.location.href = 'index.html';
      } else {
        redirectBtn.textContent = `Go back to Home Page (${secondsLeft}s)`;
      }
    }, 1000);
  }

  function stopBookingRedirectTimer() {
    if (bookingRedirectInterval) {
      clearInterval(bookingRedirectInterval);
      bookingRedirectInterval = null;
    }
  }

  document.getElementById('booking-reset-btn')?.addEventListener('click', () => {
    stopBookingRedirectTimer();
    if (bookingForm) bookingForm.reset();
    
    bookingState = {
      service: 'Income Tax Filing',
      date: '',
      slot: '',
      name: '',
      email: '',
      message: ''
    };

    timeSlots.forEach(s => s.classList.remove('selected'));
    serviceOptions.forEach(opt => opt.classList.remove('selected'));
    if (serviceOptions[0]) serviceOptions[0].classList.add('selected');

    switchStepView(1);
  });


  /* ==========================================================================
     6. CLIENT TESTIMONIALS SLIDER (Only runs on index.html)
     ========================================================================== */
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let testimonialTimer;

  function setSlide(index) {
    if (!track) return;
    
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  if (dots.length > 0 && track) {
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        setSlide(idx);
        resetSlideTimer();
      });
    });

    function startSlideTimer() {
      testimonialTimer = setInterval(() => {
        let nextIndex = (currentSlide + 1) % dots.length;
        setSlide(nextIndex);
      }, 5000);
    }

    function resetSlideTimer() {
      clearInterval(testimonialTimer);
      startSlideTimer();
    }

    startSlideTimer();
  }


  /* ==========================================================================
     7. CONTACT FORM SUBMISSION & NEWSLETTER (Runs on contact.html & footers)
     ========================================================================== */
  const contactForm = document.getElementById('contact-inquiry-form');
  const contactStatusBox = document.getElementById('contact-form-status-box');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('contact-submit-btn');
      const name = document.getElementById('contact-name').value.trim();
      
      if (!submitBtn) return;
      const prevBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = prevBtnText;
        
        if (contactStatusBox) {
          contactStatusBox.textContent = `Thank you, ${name}! Your inquiry has been successfully transmitted. Our partners will reach out to you shortly.`;
          contactStatusBox.className = 'contact-form-status success';
          contactStatusBox.style.display = 'block';
        }

        contactForm.reset();
        
        setTimeout(() => {
          if (contactStatusBox) contactStatusBox.style.display = 'none';
        }, 8000);
        
      }, 1500);
    });
  }

  // 7a. Service Choice Chips interaction (on contact.html)
  const choiceChips = document.querySelectorAll('.inquiry-chip');
  const hiddenSelect = document.getElementById('contact-subject');
  const requirementsTextarea = document.getElementById('contact-msg');

  if (choiceChips.length > 0 && hiddenSelect) {
    choiceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        // Remove active class from all chips
        choiceChips.forEach(c => c.classList.remove('active'));
        
        // Add active to current
        chip.classList.add('active');
        
        // Sync select value
        const val = chip.getAttribute('data-value');
        hiddenSelect.value = val;
        
        // Sync textarea with preset message
        const preset = chip.getAttribute('data-preset');
        if (requirementsTextarea && preset) {
          requirementsTextarea.value = preset;
        }
      });
    });
  }

  // 7b. Clipboard Copy Action (on contact.html)
  const copyButtons = document.querySelectorAll('.copy-btn');
  if (copyButtons.length > 0) {
    copyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-copy-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const textToCopy = targetEl.textContent.trim();
          navigator.clipboard.writeText(textToCopy).then(() => {
            btn.classList.add('copied');
            const tooltip = btn.querySelector('.copy-tooltip');
            if (tooltip) {
              const origText = tooltip.textContent;
              tooltip.textContent = 'Copied!';
              setTimeout(() => {
                btn.classList.remove('copied');
                tooltip.textContent = origText;
              }, 2000);
            }
          }).catch(err => {
            console.error('Failed to copy: ', err);
          });
        }
      });
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailEl = document.getElementById('newsletter-email');
      if (emailEl) {
        alert(`Subscription successful! ${emailEl.value} has been registered to receive notifications.`);
      }
      newsletterForm.reset();
    });
  }


  /* ==========================================================================
     8. PERFORMANT SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-reveal');
          // Once revealed, unobserve to free memory and speed up scroll triggers
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // use viewport
      threshold: 0.08, // trigger when 8% is visible
      rootMargin: "0px 0px -40px 0px" // trigger slightly before entry
    });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ==========================================================================
     9. FAQ ACCORDION LOGIC
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        const answer = btn.nextElementSibling;
        const isOpen = parent.classList.contains('open');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('open');
          const ans = item.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        });
        
        if (!isOpen) {
          parent.classList.add('open');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

});
