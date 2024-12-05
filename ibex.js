// Typing effect for the welcome script
document.addEventListener('DOMContentLoaded', function() {
  const welcomeScript = document.querySelector('.welcome-text p');  
  const message = "እንኳን ደህና መጡ! Welcome to Ibex! 🦓 Let's embark on a journey of learning together! 💫";
  let index = 0;

  function typeText() {
      if (index < message.length) {
          welcomeScript.innerHTML += message[index];
          index++;
          setTimeout(typeText, 55); 
      }
  }

  typeText(); 
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.hero-content, .feature-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); 

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Animate text content on load
    const textContent = document.querySelector('.text-content');
    if (textContent) {
        textContent.classList.add('animate-in');
    }

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });

    // Add Ethiopian pattern border animation
    const features = document.querySelector('.features');
    if (features) {
        window.addEventListener('scroll', () => {
            const rect = features.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                features.classList.add('pattern-animate');
            }
        });
    }

    // Navbar color transition on scroll
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll) {
            nav.style.background = 'linear-gradient(90deg, rgba(7, 134, 65, 0.95), rgba(254, 221, 0, 0.95), rgba(238, 27, 36, 0.95))';
        } else {
            nav.style.background = 'linear-gradient(90deg, rgba(7, 134, 65, 0.8), rgba(254, 221, 0, 0.8), rgba(238, 27, 36, 0.8))';
        }
        
        if (currentScroll === 0) {
            nav.style.background = 'linear-gradient(90deg, rgba(7, 134, 65, 0.8), rgba(254, 221, 0, 0.8), rgba(238, 27, 36, 0.8))';
        }
        
        lastScroll = currentScroll;
    });
});
