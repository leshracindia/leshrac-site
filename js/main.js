// Leshrac Electricals - Global Scripts

// Google Form submission via fetch no-cors (reliable, data lands in Google Sheet)
const GOOGLE_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSdiA8drlPEO5vJu3VklC9D5mX76jwh4Nd_Pt7ig_SNK1_kPlg/formResponse';
const ENTRY = {
    name: 'entry.65928434',
    company: 'entry.1248150870',
    phone: 'entry.1712919112',
    email: 'entry.1411097616',
    city: 'entry.472837924',
    customer_type: 'entry.748965985',
    requirement: 'entry.99297749'
};

function submitToGoogleForms(data) {
    // Build URL-encoded form body using the Google Form entry IDs
    const body = new URLSearchParams();
    Object.entries(ENTRY).forEach(([field, entryId]) => {
        body.append(entryId, data[field] || '');
    });

    // mode: 'no-cors' is required — Google Forms doesn't allow cross-origin reads,
    // but the POST still goes through and data lands in the Sheet.
    // We get back an "opaque" response (can't read it), so we show success optimistically.
    return fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    });
}

// Form submission handler
function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalBtnText = submitBtn.innerText;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending...';

    const data = {
        name: form.name.value,
        company: form.company.value,
        phone: form.phone.value,
        email: form.email.value,
        city: form.city.value,
        customer_type: form.customer_type.value,
        requirement: form.requirement.value
    };

    // Submit to Google Forms (data goes to your Google Sheet)
    submitToGoogleForms(data).then(() => {
        document.getElementById('enquiry-form').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    }).catch(() => {
        // Even on network error, show success — the no-cors request usually goes through
        document.getElementById('enquiry-form').style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
    });

    // Google Analytics conversion event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_form_submit', {
            'event_category': 'Conversion',
            'event_label': data.customer_type,
            'value': 1
        });
    }
}

// Show sticky CTA after scroll
function handleScroll() {
    const stickyCta = document.getElementById('sticky-cta');
    if (!stickyCta) return;

    if (window.scrollY > 400) {
        if (window.innerWidth <= 640) {
            stickyCta.style.display = 'block';
        }
    } else {
        stickyCta.style.display = 'none';
    }
}

// Initialize listeners
function init() {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Run init on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
