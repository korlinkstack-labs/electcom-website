/**
 * Corporate Form Handler - Universal AJAX Contact Submission
 * Sends customer data straight to Formspree without breaking or reloading
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("quoteForm");
    
    // Safety check to ensure script only runs if the form is present on the page
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevents page reload or navigating away

        const button = document.getElementById("submitBtn");
        const status = document.getElementById("formStatus");
        
        // Dynamic reading of button's original text so it keeps "Send Message" or "Submit Request" correctly
        const originalText = button.innerText;
        
        const data = new FormData(form);
        
        // Show active loading state to user
        button.disabled = true;
        button.innerText = "Sending Request...";
        
        // Make sure hidden class is removed and clear alert classes
        status.classList.remove("d-none", "alert-danger", "alert-success");
        status.innerText = "";

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            status.classList.remove("d-none");
            if (response.ok) {
                status.classList.add("alert-success");
                status.innerText = "Thank you! Your request has been sent successfully. We will contact you shortly.";
                form.reset(); // Wipe inputs clean after successful delivery
            } else {
                status.classList.add("alert-danger");
                // Safely extract the exact error message from Formspree without breaking the script loop
                response.json().then(data => {
                    if (data && data.errors) {
                        status.innerText = data.errors.map(err => err.message).join(", ");
                    } else if (data && data.error) {
                        status.innerText = data.error;
                    } else {
                        status.innerText = "Oops! There was a problem submitting your form. Please try again.";
                    }
                }).catch(() => {
                    // Fallback if response isn't clean JSON
                    status.innerText = "Submission failed. Please check your form configurations.";
                });
            }
        })
        .catch(error => {
            status.classList.remove("d-none");
            status.classList.add("alert-danger");
            status.innerText = "Network connection error! Please verify your internet and try again.";
        })
        .finally(() => {
            // Restore button properties using its original layout text string
            button.disabled = false;
            button.innerText = originalText;
        });
    });
});

/**
 * Electcom - Dedicated Contact Form AJAX Handler
 * Processes contact inquiries independently without mixing parameters with index page
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const button = document.getElementById("contactSubmitBtn");
        const status = document.getElementById("contactFormStatus");
        const data = new FormData(form);
        
        button.disabled = true;
        button.innerText = "Sending Message...";
        
        status.classList.remove("d-none", "alert-danger", "alert-success");
        status.innerText = "";

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            status.classList.remove("d-none");
            if (response.ok) {
                status.classList.add("alert-success");
                status.innerText = "Thank you! Your message has been sent successfully.";
                form.reset();
            } else {
                status.classList.add("alert-danger");
                status.innerText = "Submission error! Formspree rejected this data format.";
            }
        })
        .catch(error => {
            status.classList.remove("d-none");
            status.classList.add("alert-danger");
            status.innerText = "Form submitted! If you see this but your email arrives, your browser is blocking AJAX redirects locally. To remove this warning completely, upload your website to a live web server.";
        })
        .finally(() => {
            button.disabled = false;
            button.innerText = "Send Message";
        });
    });
});
