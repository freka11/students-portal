# Deployment Checklist

## Pre-Deployment ✅

- [x] Backend builds successfully (`npm run build`)
- [x] Student-admin builds successfully (`npm run build`)
- [x] Student-user builds successfully (`npm run build`)
- [x] CORS configuration updated for production URLs
- [x] Environment variable templates created
- [x] Render configuration file created
- [x] Vercel configuration files created
- [x] Deployment documentation completed

## Backend Deployment (Render) 📋

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `FIREBASE_PROJECT_ID=your-firebase-project-id`
- [ ] `FIREBASE_CLIENT_EMAIL=your-service-account-email`
- [ ] `FIREBASE_PRIVATE_KEY="your-private-key"`
- [ ] `FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com`

### Render Configuration
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Health check path: `/health`
- [ ] Add all environment variables

### Post-Deployment Testing
- [ ] Test health endpoint: `https://your-app.onrender.com/health`
- [ ] Test API endpoints
- [ ] Check logs for any errors
- [ ] Verify CORS is working correctly

## Frontend Deployment (Vercel) 📋

### Student-Admin
- [ ] Import `student-admin` directory to Vercel
- [ ] Set build command: `npm install && npm run build`
- [ ] Add environment variables:
  - [ ] `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id`

### Student-User
- [ ] Import `student-user` directory to Vercel
- [ ] Set build command: `npm install && npm run build`
- [ ] Add same environment variables as admin

### Custom Domains (Optional)
- [ ] Add custom domain to student-admin
- [ ] Add custom domain to student-user
- [ ] Update DNS records
- [ ] Update CORS origins in backend
- [ ] Add domains to Firebase authorized domains

## Firebase Configuration 🔧

### Authentication
- [ ] Add Vercel domains to authorized domains:
  - [ ] `student-admin.vercel.app`
  - [ ] `student-user.vercel.app`
  - [ ] Custom domains (if applicable)
- [ ] Update OAuth redirect URIs (if using Google Sign-In)
- [ ] Review and update security rules

### Firestore
- [ ] Review security rules for production
- [ ] Set up indexes for queries
- [ ] Enable monitoring and alerts

## Integration Testing 🧪

### Authentication Flow
- [ ] Test student login
- [ ] Test admin login
- [ ] Test Google Sign-In (if configured)
- [ ] Test logout functionality

### API Integration
- [ ] Test questions loading
- [ ] Test answer submission
- [ ] test chat functionality
- [ ] Test real-time features
- [ ] Test file uploads (if applicable)

### Cross-Origin Testing
- [ ] Test admin app calling backend API
- [ ] Test student app calling backend API
- [ ] Check for CORS errors in browser console
- [ ] Verify credentials are passed correctly

## Performance & Monitoring 📊

### Backend Monitoring
- [ ] Set up Render monitoring
- [ ] Configure log alerts
- [ ] Monitor API response times
- [ ] Set up error tracking

### Frontend Monitoring
- [ ] Enable Vercel Analytics
- [ ] Monitor Core Web Vitals
- [ ] Set up error reporting
- [ ] Optimize bundle sizes

### Firebase Monitoring
- [ ] Enable Firebase Crashlytics
- [ ] Monitor Firestore usage
- [ ] Set up budget alerts
- [ ] Monitor authentication metrics

## Security Review 🔒

### Environment Security
- [ ] Verify no secrets committed to git
- [ ] Review environment variable access
- [ ] Check for exposed API keys

### CORS Security
- [ ] Verify only allowed domains can access API
- [ ] Test CORS preflight requests
- [ ] Check wildcard origins are not used

### Firebase Security
- [ ] Review Firestore security rules
- [ ] Check user permissions
- [ ] Verify data access controls

## Rollback Plan 🔄

### Backend Rollback
- [ ] Document rollback procedure
- [ ] Test rollback to previous commit
- [ ] Verify data integrity after rollback

### Frontend Rollback
- [ ] Document rollback procedure
- [ ] Test rollback to previous deployment
- [ ] Verify user experience after rollback

## Post-Deployment 📝

### Documentation
- [ ] Document production URLs
- [ ] Save environment variables securely
- [ ] Document any custom configurations
- [ ] Create troubleshooting guide

### Team Communication
- [ ] Notify team of deployment
- [ ] Share production URLs
- [ ] Document any known issues
- [ ] Schedule follow-up testing

## Cost Review 💰

### Monthly Costs
- [ ] Review Render plan costs
- [ ] Review Vercel plan costs
- [ ] Review Firebase usage costs
- [ ] Budget for custom domains (if applicable)

### Optimization Opportunities
- [ ] Identify unused resources
- [ ] Optimize API calls
- [ ] Review caching strategies
- [ ] Consider CDN optimizations

---

## Quick Deployment Commands

```bash
# Build all applications
cd backend && npm run build && cd ..
cd student-admin && npm run build && cd ..
cd student-user && npm run build && cd ..

# Test backend locally
cd backend && npm start

# Test frontends locally
cd student-admin && npm run dev
cd student-user && npm run dev
```

## Important URLs After Deployment

- **Backend**: `https://your-app.onrender.com`
- **Admin Frontend**: `https://student-admin.vercel.app`
- **Student Frontend**: `https://student-user.vercel.app`
- **Firebase Console**: `https://console.firebase.google.com`
- **Render Dashboard**: `https://dashboard.render.com`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

---

**Remember**: Update this checklist as you complete each step. Keep it for future deployments and troubleshooting.
