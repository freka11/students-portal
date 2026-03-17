# Student Portal Deployment Guide

This guide covers deploying the Student Portal with Render (backend) and Vercel (frontend).

## Architecture Overview

- **Backend**: Express.js API server → Render
- **Frontends**: Next.js applications → Vercel
  - `student-admin` → Admin dashboard
  - `student-user` → Student interface
- **Database**: Firebase (Firestore + Authentication)

## Prerequisites

1. **Accounts**:
   - Render account (https://render.com)
   - Vercel account (https://vercel.com)
   - Firebase project (https://console.firebase.google.com)

2. **Repository**:
   - Push your code to GitHub/GitLab
   - Ensure repository is accessible by deployment platforms

## Phase 1: Backend Deployment (Render)

### 1.1 Prepare Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### 1.2 Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `student-portal-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or `Starter` for better performance)

5. Add Environment Variables in Render dashboard:
   - Add all variables from your `.env` file
   - Render automatically sets `PORT`

6. Click **Create Web Service**

### 1.3 Verify Backend Deployment

Once deployed, test these endpoints:
- `https://your-app.onrender.com/health` - Health check
- `https://your-app.onrender.com/api/questions` - Questions API

## Phase 2: Frontend Deployment (Vercel)

### 2.1 Student-Admin Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import the `student-admin` directory
4. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

6. Click **Deploy**

### 2.2 Student-User Frontend

Repeat the same process for the `student-user` directory with the same environment variables.

### 2.3 Custom Domains (Optional)

1. In Vercel project settings → **Domains**
2. Add your custom domain (e.g., `admin.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. Repeat for student app (e.g., `app.yourdomain.com`)

## Phase 3: Firebase Configuration

### 3.1 Update Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Authentication** → **Settings**
3. Add your Vercel domains to **Authorized domains**:
   - `student-admin.vercel.app`
   - `student-user.vercel.app`
   - Your custom domains (if applicable)

### 3.2 Update OAuth Configuration (if using Google Sign-In)

1. Go to **Authentication** → **Sign-in method**
2. Edit Google provider
3. Add your domains to **Authorized redirect URIs**

### 3.3 Firestore Security Rules

Review and update your Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can read questions
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && resource.data.role in ['admin', 'super_admin'];
    }
    
    // More rules as needed...
  }
}
```

## Phase 4: Testing

### 4.1 Backend Testing

```bash
# Test health endpoint
curl https://your-app.onrender.com/health

# Test API with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://your-app.onrender.com/api/questions
```

### 4.2 Frontend Testing

1. Test authentication flow
2. Verify API calls are working
3. Test real-time features (chat, notifications)
4. Check responsive design

### 4.3 CORS Testing

Ensure no CORS errors in browser console. If you see CORS errors:
1. Check backend CORS configuration
2. Verify all domains are added to allowed origins
3. Ensure credentials are properly configured

## Phase 5: Monitoring & Maintenance

### 5.1 Render Monitoring

- View logs in Render dashboard
- Set up alert notifications
- Monitor performance metrics

### 5.2 Vercel Analytics

- Enable Vercel Analytics in project settings
- Monitor performance and user metrics
- Set up error tracking

### 5.3 Firebase Monitoring

- Enable Firebase Crashlytics
- Monitor Firestore usage
- Set up budget alerts

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check backend CORS configuration
   - Verify frontend URLs are in allowed origins

2. **Authentication Issues**:
   - Verify Firebase configuration
   - Check authorized domains in Firebase Console

3. **Build Failures**:
   - Check build logs in deployment platform
   - Verify all environment variables are set

4. **API Connection Issues**:
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend is running and accessible

### Debug Commands

```bash
# Test backend directly
curl -v https://your-backend.onrender.com/health

# Check frontend environment variables
# In browser console: console.log(process.env.NEXT_PUBLIC_API_URL)

# Test Firebase connection
# Check Firebase Console for usage metrics
```

## Environment Variables Reference

### Backend (.env)
```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Cost Optimization

### Render
- **Free tier**: 750 hours/month
- **Starter**: $7/month for better performance
- Consider using background workers for scheduled tasks

### Vercel
- **Free tier**: Generous limits for hobby projects
- **Pro**: $20/month for advanced features
- Optimize images and bundle size

### Firebase
- **Spark plan**: Free tier with generous limits
- **Blaze plan**: Pay-as-you-go for scaling
- Monitor usage to optimize costs

## Security Considerations

1. **Environment Variables**: Never commit secrets to git
2. **HTTPS**: All platforms enforce HTTPS automatically
3. **CORS**: Restrict to specific domains only
4. **Firebase Rules**: Use least-privilege access patterns
5. **Rate Limiting**: Consider implementing rate limiting on API
6. **Authentication**: Use strong password policies and 2FA

## Rollback Plan

### Backend Rollback
1. Go to Render dashboard → Services → Your service
2. Click **Manual Deploy** → Select previous commit
3. Wait for redeployment

### Frontend Rollback
1. Go to Vercel dashboard → Your project
2. Go to **Deployments** tab
3. Click **...** on previous deployment → **Promote to Production**

## Support

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Firebase Documentation**: https://firebase.google.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Note**: This deployment guide assumes you're using the free tiers of Render and Vercel. Adjust based on your specific requirements and budget.
