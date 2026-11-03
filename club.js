(() => {
  const config = window.PULP_CLUB || {};
  const validStripeUrl = (value, host) => {
    try { const url = new URL(value); return url.protocol === "https:" && url.hostname === host && !url.username && !url.password ? url.href : null; } catch { return null; }
  };
  const checkout = validStripeUrl(config.checkoutUrl, "buy.stripe.com");
  if (checkout) {
    document.getElementById("prelaunch-area").hidden = true;
    document.getElementById("checkout-area").hidden = false;
    document.getElementById("checkout-link").href = checkout;
    document.getElementById("billing-note").textContent = config.billingText;
  }
  const portal = validStripeUrl(config.portalUrl, "billing.stripe.com");
  if (portal) { const link = document.getElementById("portal-link"); link.href = portal; link.hidden = false; }
  if (config.shippingText) document.getElementById("shipping-note").textContent = config.shippingText;
  const form = document.getElementById("launch-form");
  const status = document.getElementById("form-status");
  if (config.waitlistEnabled) {
    form.hidden = false;
    document.getElementById("launch-list-faq").hidden = false;
    document.getElementById("privacy").hidden = false;
  }
  if (!config.waitlistEnabled) {
    form.hidden = true;
    const note = document.createElement("p");
    note.className = "fine";
    const link = document.createElement("a"); link.href = "https://www.instagram.com/pulp.sm/"; link.textContent = "Follow @pulp.sm for the launch announcement.";
    note.append(link); document.getElementById("prelaunch-area").append(note);
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!config.waitlistEnabled || !form.reportValidity()) return;
    const button = form.querySelector("button");
    button.disabled = true; status.textContent = "Adding you to the launch list…"; status.dataset.error = "false";
    try {
      const data = new FormData(form);
      const response = await fetch("/api/join", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:data.get("email"),website:data.get("website"),consent:true})});
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "We couldn't save your email. Please try again.");
      status.textContent = "You're on the launch list. We'll email you when membership opens."; form.reset();
    } catch(error) { status.dataset.error = "true"; status.textContent = error instanceof Error ? error.message : "We couldn't save your email. Please try again."; }
    finally { button.disabled = false; }
  });
})();
