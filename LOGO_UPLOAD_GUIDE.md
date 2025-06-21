# 🎨 Logo Upload Guide for Debatize

## 📁 Logo Files Created

I've set up the following logo files in `client/public/`:

### **Main Logo Files:**
- `logo.svg` - Main logo for light backgrounds (footer, etc.)
- `logo-white.svg` - White version for dark backgrounds (header)
- `logo.png` - PNG version as fallback

### **Current Status:**
- ✅ Logo file structure is ready
- ✅ Components updated to use actual logo images
- ✅ Fallback system implemented (SVG → PNG → Text)
- ⏳ **Ready for your logo upload**

## 🚀 How to Upload Your Logo

### **Option 1: SVG Logo (Recommended)**
1. **Replace `logo.svg`** with your main logo
2. **Replace `logo-white.svg`** with your logo in white/light colors
3. **Optional:** Replace `logo.png` with PNG version for older browsers

### **Option 2: PNG Logo Only**
1. **Delete** the `.svg` files
2. **Upload** your `logo.png` file
3. **Create** a white version for the header if needed

### **Option 3: JPG Logo**
1. **Upload** your `logo.jpg` file
2. **Update** the component references from `.svg` to `.jpg`

## 📐 Recommended Logo Specifications

### **Dimensions:**
- **Width:** 200-300px
- **Height:** 60-80px
- **Aspect Ratio:** 3:1 to 4:1 (landscape)

### **Formats:**
- **SVG** (scalable, best quality)
- **PNG** (good quality, transparent background)
- **JPG** (smaller file size)

### **Colors:**
- **Main Logo:** Your brand colors
- **White Version:** White/light colors for dark backgrounds

## 🔧 Automatic Features

### **Smart Fallback System:**
1. **Tries SVG first** (best quality)
2. **Falls back to PNG** if SVG fails
3. **Shows text "Debatize"** if images fail

### **Responsive Design:**
- **Header:** 40px height, scales on hover
- **Footer:** 30px height, scales on hover
- **Mobile:** Automatically adjusts size

### **Multiple Locations:**
- ✅ **Header** (dark background) - uses `logo-white.svg`
- ✅ **Footer** (light background) - uses `logo.svg`
- ✅ **Favicon** - uses your logo design

## 📝 Step-by-Step Upload Instructions

### **For SVG Logo:**
1. Open your logo file in a text editor
2. Copy the SVG code (everything between `<svg>` and `</svg>`)
3. Replace the content in `logo.svg` with your SVG code
4. Create a white version and save as `logo-white.svg`

### **For PNG/JPG Logo:**
1. Delete the `.svg` files
2. Upload your logo as `logo.png` or `logo.jpg`
3. The app will automatically use your file

### **Testing Your Logo:**
1. Save your logo files
2. Refresh your browser
3. Check both header and footer
4. Test on mobile devices

## 🎯 Logo Placement

Your logo will appear in:
- **Header** (top navigation)
- **Footer** (bottom of page)
- **Browser tab** (favicon)
- **Mobile home screen** (if installed as PWA)

## 🔍 Troubleshooting

### **Logo Not Showing:**
- Check file path: `client/public/logo.svg`
- Verify file format is supported
- Check browser console for errors

### **Logo Too Big/Small:**
- Adjust the CSS in `HomePage.css`
- Modify `.logo-image` height values
- Test on different screen sizes

### **Colors Not Right:**
- Create separate versions for light/dark backgrounds
- Use `logo.svg` for light backgrounds
- Use `logo-white.svg` for dark backgrounds

## ✨ Pro Tips

1. **Use SVG format** for best quality and scalability
2. **Keep file size under 50KB** for fast loading
3. **Test on mobile devices** to ensure readability
4. **Create a white version** for the header
5. **Use transparent backgrounds** for better integration

## 🎉 Ready to Upload!

Your Debatize application is now ready for your logo! Simply replace the placeholder files with your actual logo and refresh the browser to see your branding in action.

**Need help?** The fallback system ensures your app will work even if there are issues with the logo files. 