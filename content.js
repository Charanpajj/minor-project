function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

let notified = false;

function scanForFees() {
  const regex = /\b(?:estimated\s*)?(?:delivery|platform|handling)\s*(?:fee|charges|&\s*handling)?\s*[:.\s]*[\u0024\u00A3\u20AC\u00A5\u20B9Rs\.]?\s*\d+(?:[\s\d]*\d)?(?:\.\d{2})?\b/gi;
  const bodyText = document.body.innerText;
  const matches = [...bodyText.matchAll(regex)];

  if (matches.length > 0 && !notified) {
    const deliveryFees = [];
    const platformFees = [];

    matches.forEach(match => {
      const feeText = match[0].trim();
      const numericFee = parseFloat(feeText.replace(/[^\d.]/g, ''));

      if (feeText.toLowerCase().includes("delivery") || feeText.toLowerCase().includes("handling")) {
        deliveryFees.push(numericFee);
      } else if (feeText.toLowerCase().includes("platform")) {
        platformFees.push(numericFee);
      }
    });

    const totalDeliveryFee = deliveryFees.reduce((sum, fee) => sum + fee, 0);
    const totalPlatformFee = platformFees.reduce((sum, fee) => sum + fee, 0);
    const grandTotalFee = totalDeliveryFee + totalPlatformFee;

    const notificationMessage = `Total Delivery Fee: ₹${totalDeliveryFee.toFixed(2)}\nTotal Platform Fee: ₹${totalPlatformFee.toFixed(2)}\nGrand Total: ₹${grandTotalFee.toFixed(2)}`;

    chrome.storage.local.set({ fees: notificationMessage });

    chrome.runtime.sendMessage({ type: "notify", message: notificationMessage });

    notified = true;
  } else if (matches.length === 0) {
    console.log("No Fees Found");
  }
}

const debouncedScanForFees = debounce(scanForFees, 1000);

const observer = new MutationObserver((mutations) => {
  debouncedScanForFees();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

document.addEventListener("DOMContentLoaded", scanForFees);
