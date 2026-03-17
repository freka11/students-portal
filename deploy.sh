#!/bin/bash

# Student Portal Deployment Script
# This script helps deploy the backend to Render and frontends to Vercel

echo "🚀 Student Portal Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_status "Dependencies check passed ✓"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    cd backend
    
    if [ ! -f ".env" ]; then
        print_warning "No .env file found in backend. Please create one based on .env.example"
        exit 1
    fi
    
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Backend build successful ✓"
    else
        print_error "Backend build failed"
        exit 1
    fi
    
    cd ..
}

# Build frontends
build_frontends() {
    print_status "Building frontends..."
    
    # Build student-admin
    cd student-admin
    if [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found in student-admin. Please create one based on .env.example"
    fi
    
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Student-admin build successful ✓"
    else
        print_error "Student-admin build failed"
        exit 1
    fi
    cd ..
    
    # Build student-user
    cd student-user
    if [ ! -f ".env.local" ]; then
        print_warning "No .env.local file found in student-user. Please create one based on .env.example"
    fi
    
    npm install
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Student-user build successful ✓"
    else
        print_error "Student-user build failed"
        exit 1
    fi
    cd ..
}

# Deployment instructions
show_deployment_instructions() {
    print_status "Build completed successfully!"
    echo ""
    echo "📋 Next Steps for Deployment:"
    echo ""
    echo "1. 🎯 Deploy Backend to Render:"
    echo "   - Go to https://render.com"
    echo "   - Create new Web Service"
    echo "   - Connect your GitHub repository"
    echo "   - Set root directory: backend"
    echo "   - Build command: npm install && npm run build"
    echo "   - Start command: npm start"
    echo "   - Add environment variables from .env"
    echo ""
    echo "2. 🎯 Deploy Frontends to Vercel:"
    echo "   - Go to https://vercel.com"
    echo "   - Import student-admin directory"
    echo "   - Import student-user directory"
    echo "   - Set NEXT_PUBLIC_API_URL to your Render backend URL"
    echo "   - Add Firebase environment variables"
    echo ""
    echo "3. 🔧 Update Firebase Console:"
    echo "   - Add Vercel domains to authorized domains"
    echo "   - Update OAuth redirect URLs if needed"
    echo ""
    echo "4. ✅ Testing:"
    echo "   - Test authentication flow"
    echo "   - Verify API endpoints"
    echo "   - Check real-time features"
    echo ""
}

# Main execution
main() {
    check_dependencies
    build_backend
    build_frontends
    show_deployment_instructions
}

# Run main function
main
