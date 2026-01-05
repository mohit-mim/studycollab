# 🔧 API Connection Debugging Guide

## 🚨 **Current Issue: API Showing Offline**

The API status indicator is showing "Offline Mode" instead of "API Online". Here's how to troubleshoot:

## 🔍 **Step-by-Step Debugging:**

### 1. **Check Browser Console**
- Open Developer Tools (F12)
- Look for any error messages
- Check if the API test function is running

### 2. **Manual API Test**
Click the **WiFi button** (📶) next to the API status to manually test the connection.

### 3. **Console Commands**
Open browser console and run these commands:

```javascript
// Test current API key
testAPI()

// Test with a different API key (if you have one)
testAPIWithKey('your-new-api-key-here')

// Check current API status
isAPIOnline()

// Check if elements exist
document.querySelector('.api-status')
document.querySelector('.status-dot')
document.querySelector('.status-text')
```

## 🐛 **Common Issues & Solutions:**

### **Issue 1: CORS Error**
- **Symptoms**: "CORS policy" error in console
- **Solution**: The API might be blocking requests from localhost

### **Issue 2: Network Error**
- **Symptoms**: "Failed to fetch" or network error
- **Solution**: Check internet connection and firewall settings

### **Issue 3: API Key Invalid**
- **Symptoms**: 401 or 403 error
- **Solution**: Verify your Judge0 API key is correct

### **Issue 4: Rate Limiting**
- **Symptoms**: 429 error
- **Solution**: Wait a few minutes and try again

## 🔑 **API Key Verification:**

1. **Visit**: https://rapidapi.com/judge0-official/api/judge0-ce
2. **Check**: Your subscription status
3. **Verify**: API key is active
4. **Test**: Try the API directly on RapidAPI

## 📱 **Testing Steps:**

1. **Open** `mohit-proj.html` in your browser
2. **Check** the API status indicator (should show "Testing..." then "API Online" or "Offline Mode")
3. **Click** the WiFi button to manually test
4. **Check** browser console for detailed error messages
5. **Try** different API keys if available

## 🆘 **If Still Offline:**

1. **Check** browser console for specific error messages
2. **Verify** your internet connection
3. **Try** a different browser
4. **Check** if your firewall/antivirus is blocking the request
5. **Verify** the API endpoint is accessible

## 📞 **Need Help?**

If you're still having issues, check the console logs and let me know:
- What error messages you see
- What the API status shows
- Whether the WiFi button works
- Any console errors

---

**Note**: The platform will work in "Offline Mode" for JavaScript execution, but won't be able to run C++, Python, Java, etc. remotely.


