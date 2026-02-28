// Leshrac Electricals - Global Scripts

// Google Form submission via hidden iframe (avoids CORS issues)
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
    return new Promise((resolve) => {
        // Create a hidden iframe to capture the redirect response
        const iframe = document.createElement('iframe');
        iframe.name = 'hidden_iframe';
        iframe.id = 'hidden_iframe';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Create a temporary form targeting the hidden iframe
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = GOOGLE_FORM_ACTION;
        tempForm.target = 'hidden_iframe';

        Object.entries(ENTRY).forEach(([field, entryId]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = entryId;
            input.value = data[field] || '';
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);

        // Resolve after iframe loads (Google redirects on success)
        iframe.addEventListener('load', () => {
            document.body.removeChild(tempForm);
            document.body.removeChild(iframe);
            resolve({ ok: true });
        });

        tempForm.submit();

        // Safety timeout — resolve after 5s even if iframe load doesn't fire
        setTimeout(() => resolve({ ok: true }), 5000);
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
        if (window.innerWidth <= 640) { // Mobile check to avoid layout shifts on desktop where it's hidden
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
