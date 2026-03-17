# Vercel Frontend Deployment Guide

## ✅ **CORS Configuration Updated**

I've updated your backend CORS to include all necessary domains:

### 🌐 **Current CORS Configuration**
```typescript
app.use(cors({
    origin: [
        // Development URLs
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:3003',
        
        // Backend URL (for self-reference)
        'https://students-portal-cxn8.onrender.com',
        
        // Vercel deployment URLs (will be updated after deployment)
        'https://student-admin.vercel.app',
        'https://student-user.vercel.app',
        
        // Custom domains (add when ready)
        // 'https://admin.yourdomain.com',
        // 'https://app.yourdomain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))
```

---

## 🚀 **Vercel Deployment Steps**

### 📋 **Environment Variables for Both Frontends**

#### **Firebase Configuration** (Same for both apps):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCSXQPTGztsdvZO9cKQGDV8Eq-7UAyfcjo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=student-portal-fab55.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=student-portal-fab55
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=student-portal-fab55.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=296098785971
NEXT_PUBLIC_FIREBASE_APP_ID=1:296098785971:web:b873788b9d14cea9dedec6
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-P5XNR1WEYF
NEXT_PUBLIC_API_URL=https://students-portal-cxn8.onrender.com
```

### 🎯 **Deploy Student-Admin Frontend**

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Repository**: `freka11/students-portal`
4. **Configure Project**:
   - **Root Directory**: `student-admin`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. **Add Environment Variables** (copy from above)
6. **Click "Deploy"**
7. **Note the URL**: `https://your-admin-app.vercel.app`

### 🎯 **Deploy Student-User Frontend**

1. **Go back to Vercel Dashboard**
2. **Click "Add New..." → "Project"**
3. **Import Repository**: `freka11/students-portal`
4. **Configure Project**:
   - **Root Directory**: `student-user`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. **Add Environment Variables** (same as admin)
6. **Click "Deploy"**
7. **Note the URL**: `https://your-user-app.vercel.app`

---

## 🔄 **Post-Deployment Updates**

### **Step 1: Update CORS with Actual Vercel URLs**

After deployment, you'll get actual URLs like:
- `https://student-admin-abc123.vercel.app`
- `https://student-user-def456.vercel.app`

Update the CORS in `backend/src/server.ts`:

```typescript
app.use(cors({
    origin: [
        // Development URLs
        'http://localhost:3000', 
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:3003',
        
        // Backend URL
        'https://students-portal-cxn8.onrender.com',
        
        // ACTUAL Vercel URLs (update after deployment)
        'https://student-admin-abc123.vercel.app',
        'https://student-user-def456.vercel.app',
        
        // Custom domains (add when ready)
        // 'https://admin.yourdomain.com',
        // 'https://app.yourdomain.com'
    ],
    // ... rest of config
}))
```

### **Step 2: Redeploy Backend**

After updating CORS, redeploy your backend:
1. Push changes to GitHub
2. Render will auto-deploy the update

---

## 📱 **Final URLs After Deployment**

You'll have:
- **Backend**: https://students-portal-cxn8.onrender.com
- **Admin Frontend**: https://your-admin-app.vercel.app
- **User Frontend**: https://your-user-app.vercel.app

---

## ✅ **Testing Checklist**

After deployment:

- [ ] **Admin App**: Loads and connects to backend
- [ ] **User App**: Loads and connects to backend
- [ ] **Login**: Both apps can authenticate users
- [ ] **Chat**: Messages send/receive correctly
- [ ] **Badges**: WhatsApp-style unread badges work
- [ ] **Real-time**: Live updates work between apps
- [ ] **No CORS errors**: Check browser console

---

## 🚨 **Troubleshooting**

### **CORS Issues**
If you see CORS errors:
1. Check if Vercel URLs are added to backend CORS
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check browser console for specific error

### **Connection Issues**
If apps can't connect to backend:
1. Verify backend is running: https://students-portal-cxn8.onrender.com
2. Check `NEXT_PUBLIC_API_URL` in frontend env vars
3. Test backend health endpoint

### **Build Issues**
If Vercel build fails:
1. Check `package.json` scripts
2. Verify all dependencies are installed
3. Check build logs for specific errors

---

## 🎉 **Ready to Deploy!**

Your CORS is configured and you're ready to deploy both frontends to Vercel. The WhatsApp-style badge system will work perfectly in production!

**Deploy both apps, then update CORS with the actual Vercel URLs for complete integration.**
