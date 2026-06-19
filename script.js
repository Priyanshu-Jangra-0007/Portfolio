// Active Navigation Links interaction & Header scroll class
const navLinks = document.querySelectorAll('.nav-links a');
const header = document.querySelector('.app-header');

// Handle header scroll style change
function handleHeaderScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (scrollTop > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // Call once on load to initialize state

// Intersection Observer to update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
  root: null,
  rootMargin: '-30% 0px -60% 0px', // Trigger when section is in active view area
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Click smooth scrolling override
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      e.preventDefault();
      // Temporarily disable observer to prevent flickering during scroll transition
      sections.forEach(s => observer.unobserve(s));
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      targetSection.scrollIntoView({ behavior: 'smooth' });
      
      // Re-enable observer after smooth scroll completes
      setTimeout(() => {
        sections.forEach(s => observer.observe(s));
      }, 850);
    }
  });
});

// Start on load and init custom cursor
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navRightGroup = document.getElementById('nav-right-group');
  
  if (menuToggle && navRightGroup) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('active');
      navRightGroup.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking links
    const mobileNavLinks = navRightGroup.querySelectorAll('.nav-links a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navRightGroup.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navRightGroup.contains(e.target) && navRightGroup.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        navRightGroup.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Shared Application Tooltip
  const tooltip = document.createElement('div');
  tooltip.id = 'app-tooltip';
  tooltip.className = 'app-tooltip';
  document.body.appendChild(tooltip);

  // Custom Blue Cursor
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path class="cursor-left" d="M2 2 L11 13 L6 20 Z" />
    <path class="cursor-right" d="M2 2 L18 12 L11 13 Z" />
    <path class="cursor-outline" d="M2 2 L18 12 L11 13 L6 20 Z" />
  </svg>`;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    // Custom Cursor positioning
    cursor.style.opacity = '1';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  // Typewriter effect using recursive DOM crawler
  function typeWriterNode(sourceNode, targetNode, speed, callback) {
    let nodes = Array.from(sourceNode.childNodes);
    let nodeIndex = 0;

    function typeNextNode() {
      if (nodeIndex >= nodes.length) {
        if (callback) callback();
        return;
      }

      let currentNode = nodes[nodeIndex];
      if (currentNode.nodeType === Node.TEXT_NODE) {
        let text = currentNode.textContent;
        let charIndex = 0;
        let textNode = document.createTextNode("");
        targetNode.appendChild(textNode);

        function typeChar() {
          if (charIndex < text.length) {
            textNode.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, speed);
          } else {
            nodeIndex++;
            typeNextNode();
          }
        }
        typeChar();
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        let elementCopy = document.createElement(currentNode.tagName);
        Array.from(currentNode.attributes).forEach(attr => {
          elementCopy.setAttribute(attr.name, attr.value);
        });
        targetNode.appendChild(elementCopy);

        typeWriterNode(currentNode, elementCopy, speed, () => {
          nodeIndex++;
          typeNextNode();
        });
      } else {
        nodeIndex++;
        typeNextNode();
      }
    }

    typeNextNode();
  }

  let compilerStarted = false;
  let compilerComplete = false;
  let terminalRunning = false;
  let isHovered = false;

  function startCompiler() {
    if (compilerStarted) return;
    compilerStarted = true;

    const source = document.getElementById('code-source');
    const target = document.getElementById('code-target');

    typeWriterNode(source, target, 22, () => {
      compilerComplete = true;
      const terminalBody = document.getElementById('terminal-target');
      terminalBody.innerHTML = '<div class="terminal-line success">&gt; Code typing completed. Ready to compile.</div>';

      // If user is currently hovering, run execution!
      if (isHovered) {
        runCompilation();
      }
    });
  }

  function runCompilation() {
    if (terminalRunning || !compilerComplete) return;
    terminalRunning = true;

    const terminalTarget = document.getElementById('terminal-target');
    terminalTarget.innerHTML = '';

    const lines = [
      { text: '$ node developer.js', type: 'cmd' },
      { text: 'Compiling profile...', type: 'muted' },
      { text: '✔ Parsed Developer Profile successfully.', type: 'success' },
      { text: 'Priyanshu is ready to build premium frontend experiences!', type: 'info' }
    ];

    let lineIndex = 0;
    function printNextLine() {
      if (lineIndex >= lines.length) {
        return;
      }

      const line = lines[lineIndex];
      const lineDiv = document.createElement('div');
      if (line.type === 'cmd') {
        lineDiv.className = 'terminal-line cmd';
      } else if (line.type === 'success') {
        lineDiv.className = 'terminal-line success';
      } else if (line.type === 'muted') {
        lineDiv.className = 'terminal-line muted';
      } else {
        lineDiv.className = 'terminal-line';
      }

      terminalTarget.appendChild(lineDiv);

      let charIndex = 0;
      function typeTerminalChar() {
        if (charIndex < line.text.length) {
          lineDiv.textContent += line.text.charAt(charIndex);
          charIndex++;
          terminalTarget.scrollTop = terminalTarget.scrollHeight; // Auto-scroll to show latest text
          setTimeout(typeTerminalChar, 12);
        } else {
          lineIndex++;
          terminalTarget.scrollTop = terminalTarget.scrollHeight; // Scroll after line is done
          setTimeout(printNextLine, 250);
        }
      }
      typeTerminalChar();
    }

    printNextLine();
  }

  const compilerCard = document.getElementById('compiler-card');
  if (compilerCard) {
    compilerCard.addEventListener('mouseenter', () => {
      isHovered = true;
      if (!compilerStarted) {
        startCompiler();
      } else if (compilerComplete) {
        runCompilation();
      }
    });

    compilerCard.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Trigger typing automatically after 1 second
    setTimeout(() => {
      if (!compilerStarted) {
        startCompiler();
      }
    }, 1000);
  }
  // Hover feedback for all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .social-link-btn, .compiler-card, .info-pill, .github-stat-card, .github-matrix-card, .footer-metric, .cp-flip-card-front, .cp-flip-card-back, .conn-icon, .back-stat-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });

  // Load GitHub activity details in real-time (Total, Streaks, and the dynamic grid board)
  async function loadGitHubActivity(username) {
    try {
      // 1. Fetch contributions data from Jogruber API (CORS-friendly)
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
      if (!response.ok) throw new Error('Failed to fetch GitHub contributions data');
      const data = await response.json();

      // Calculate Total Contributions
      let totalContributions = 0;
      if (data.total) {
        totalContributions = Object.values(data.total).reduce((sum, val) => sum + val, 0);
      }

      const contributions = data.contributions;
      if (!contributions || contributions.length === 0) return;

      // Sort chronologically ascending to fix streak calculations
      contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

      // 2. Calculate Longest Streak
      let longestStreak = 0;
      let tempStreak = 0;
      contributions.forEach(day => {
        if (day.count > 0) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      });

      // 3. Calculate Current Streak (Backwards check)
      let currentStreak = 0;
      const today = new Date();
      // Adjust timezone offset to get local YYYY-MM-DD
      const offset = today.getTimezoneOffset();
      const localToday = new Date(today.getTime() - (offset * 60 * 1000));
      const todayStr = localToday.toISOString().split('T')[0];
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const localYesterday = new Date(yesterday.getTime() - (offset * 60 * 1000));
      const yesterdayStr = localYesterday.toISOString().split('T')[0];

      let lastActiveIndex = -1;
      for (let i = contributions.length - 1; i >= 0; i--) {
        const dateStr = contributions[i].date;
        if (dateStr === todayStr || dateStr === yesterdayStr) {
          if (contributions[i].count > 0) {
            lastActiveIndex = i;
            break;
          }
        }
        if (dateStr < yesterdayStr) {
          break; // Gone past yesterday and no commits found, current streak is 0
        }
      }

      if (lastActiveIndex !== -1) {
        currentStreak = 0;
        for (let i = lastActiveIndex; i >= 0; i--) {
          if (contributions[i].count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Update the DOM cards with real-time extracted data
      const totalCardNum = document.querySelector('.github-stats-grid .github-stat-card:nth-child(1) .git-stat-num');
      const longestCardNum = document.querySelector('.github-stats-grid .github-stat-card:nth-child(2) .git-stat-num');
      const currentCardNum = document.querySelector('.github-stats-grid .github-stat-card:nth-child(3) .git-stat-num');

      if (totalCardNum) totalCardNum.textContent = totalContributions.toLocaleString() + '+';
      if (longestCardNum) longestCardNum.textContent = longestStreak + ' Days';
      if (currentCardNum) currentCardNum.textContent = currentStreak + ' Days';

      // 4. Generate the Contributions Matrix Grid
      // Slice contributions to start on a Sunday approximately 1 year ago (53 columns x 7 days)
      const totalDays = 53 * 7;
      let startIndex = contributions.length - totalDays;
      if (startIndex < 0) startIndex = 0;

      // Align start index to Sunday
      while (startIndex < contributions.length) {
        const dateObj = new Date(contributions[startIndex].date);
        if (dateObj.getDay() === 0) { // 0 is Sunday
          break;
        }
        startIndex++;
      }

      const displayContributions = contributions.slice(startIndex);
      const gridContainer = document.getElementById('github-matrix-grid');
      
      if (gridContainer) {
        gridContainer.innerHTML = '';
        
        displayContributions.forEach(day => {
          const cell = document.createElement('div');
          cell.className = 'github-matrix-cell';
          
          // Map levels to background shades matching the theme
          const level = day.level || 0;
          if (level === 0) {
            cell.style.background = 'rgba(255, 255, 255, 0.05)';
          } else if (level === 1) {
            cell.style.background = 'rgba(75, 116, 159, 0.25)';
          } else if (level === 2) {
            cell.style.background = 'rgba(75, 116, 159, 0.50)';
          } else if (level === 3) {
            cell.style.background = 'rgba(75, 116, 159, 0.75)';
          } else {
            cell.style.background = 'rgba(75, 116, 159, 1.00)';
          }

          // Tooltip details (commits on date)
          const dateObj = new Date(day.date);
          const options = { month: 'short', day: 'numeric', year: 'numeric' };
          const formattedDate = dateObj.toLocaleDateString('en-US', options);
          const commitsText = day.count === 1 ? '1 contribution' : `${day.count} contributions`;
          cell.setAttribute('data-tooltip', `${commitsText} on ${formattedDate}`);

          // Hover custom cursor effects
          cell.addEventListener('mouseenter', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) cursor.classList.add('hover');
          });
          cell.addEventListener('mouseleave', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) cursor.classList.remove('hover');
          });

          gridContainer.appendChild(cell);
        });

        // Event delegation for fast, instant tooltip on hover
        gridContainer.addEventListener('mouseover', (e) => {
          const cell = e.target.closest('.github-matrix-cell');
          if (!cell) return;

          const text = cell.getAttribute('data-tooltip');
          if (!text) return;

          tooltip.textContent = text;
          tooltip.classList.add('show');

          // Position the tooltip dynamically above the cell
          const rect = cell.getBoundingClientRect();
          const left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + window.scrollX;
          const top = rect.top - tooltip.offsetHeight - 8 + window.scrollY;
          
          tooltip.style.left = `${left}px`;
          tooltip.style.top = `${top}px`;
        });

        gridContainer.addEventListener('mouseout', (e) => {
          const cell = e.target.closest('.github-matrix-cell');
          if (!cell) return;
          tooltip.classList.remove('show');
        });
      }

    } catch (e) {
      console.error('Failed to load GitHub activity details in real-time:', e);
    }
  }

  loadGitHubActivity('Priyanshu-Jangra-0007');

  // Toggle flip card on click/tap for both desktop and mobile
  const flipCardContainer = document.querySelector('.cp-flip-card-container');
  if (flipCardContainer) {
    flipCardContainer.addEventListener('click', () => {
      flipCardContainer.classList.toggle('clicked');
    });
  }

});

