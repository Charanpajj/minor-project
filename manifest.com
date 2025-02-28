{
  "manifest_version": 3,
  "name": "Add-on Price Detector",
  "version": "1.0",
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "notifications"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_icon": {
      "16": "demo.png",
      "48": "demo.png",
      "128": "demo.png"
    }
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "icons": {
    "16": "demo.png",
    "48": "demo.png",
    "128": "demo.png"
  }
}
